/*
BSD 3-Clause License

Copyright (c) 2019, Sentry
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import getConfigData from 'utils/get-config-data';

// Create and return a global Sentry loader, if Sentry is enabled.
// The loader listens for unhandled errors, then loads the real Sentry SDK
// We save a bunch of space in our JS bundle by not having to include the full SDK all the time
// More information available from Sentry: https://docs.sentry.io/platforms/javascript/#lazy-loading-sentry

// Note that we are including the Sentry loader here, rather than loading it from their CDN
// in order to cut down on the number of third party CDNs we need to rely on.
export default function initializeSentryLoader() {
    const udConfig = getConfigData();
    // Some UFB clients forbid loading third party code. In that case, they don't get Sentry.
    if (!udConfig.brand.is_external_sources_enabled || !udConfig.third_party.raven_dsn) {
        return;
    }
    let forceLoad = false;
    let injected = false;
    const onLoadCallbacks = [];

    // Create a namespace and attach function that will store captured exception
    // Because functions are also objects, we can attach the queue itself straight to it and save some bytes
    const queue = function (content) {
        // content.e = error
        // content.p = promise rejection
        // content.f = function call the Sentry
        if (
            'e' in content ||
            'p' in content ||
            (content.f && content.f.indexOf('capture') > -1) ||
            (content.f && content.f.indexOf('showReportDialog') > -1)
        ) {
            // We only want to lazy inject/load the sdk bundle if
            // an error or promise rejection occured
            // OR someone called `capture...` on the SDK
            injectSdk(onLoadCallbacks);
        }
        queue.data.push(content);
    };
    queue.data = [];

    // Store reference to the old `onerror` handler and override it with our own function
    // that will just push exceptions to the queue and call through old handler if we found one
    const _oldOnerror = window.onerror;
    window.onerror = function (...args) {
        // Use keys as "data type" to save some characters"
        queue({
            e: [].slice.call(args),
        });

        if (_oldOnerror) {
            _oldOnerror.apply(window, args);
        }
    };

    // Do the same store/queue/call operations for `onunhandledrejection` event
    const _oldOnunhandledrejection = window.onunhandledrejection;
    window.onunhandledrejection = function (e) {
        queue({
            p:
                'reason' in e
                    ? e.reason
                    : 'detail' in e && typeof e.detail === 'object' && e.detail !== null
                    ? e.detail.reason
                    : e,
        });
        if (_oldOnunhandledrejection) {
            _oldOnunhandledrejection.call(window, e);
        }
    };

    function injectSdk(callbacks) {
        if (injected) {
            return;
        }
        injected = true;

        // Create a `script` tag with provided SDK `url` and attach it just before the first, already existing `script` tag
        // Scripts that are dynamically created and added to the document are async by default,
        // they don't block rendering and execute as soon as they download, meaning they could
        // come out in the wrong order. Because of that we don't need async=1 as GA does.
        // it was probably(?) a legacy behavior that they left to not modify few years old snippet
        // https://www.html5rocks.com/en/tutorials/speed/script-loading/
        const _currentScriptTag = document.getElementsByTagName('script')[0];
        const _newScriptTag = document.createElement('script');
        _newScriptTag.src = 'https://browser.sentry-cdn.com/6.11.0/bundle.min.js';
        _newScriptTag.setAttribute('crossorigin', 'anonymous');

        // Once our SDK is loaded
        _newScriptTag.addEventListener('load', () => {
            try {
                // Restore onerror/onunhandledrejection handlers
                window.onerror = _oldOnerror;
                window.onunhandledrejection = _oldOnunhandledrejection;

                const SDK = window.Sentry;

                const oldInit = SDK.init;

                // Configure it using provided DSN and config object
                SDK.init = function (options) {
                    const target = {
                        dsn: udConfig.third_party.raven_dsn,
                        autoSessionTracking: false,
                    };
                    for (const key in options) {
                        if (Object.prototype.hasOwnProperty.call(options, key)) {
                            target[key] = options[key];
                        }
                    }
                    oldInit(target);
                };

                sdkLoaded(callbacks, SDK);
            } catch (e) {
                /* eslint-disable-next-line no-console */
                console.error(e);
            }
        });

        _currentScriptTag.parentNode.insertBefore(_newScriptTag, _currentScriptTag);
    }

    function sdkLoaded(callbacks, SDK) {
        try {
            const data = queue.data;

            // We have to make sure to call all callbacks first
            for (let i = 0; i < callbacks.length; i++) {
                if (typeof callbacks[i] === 'function') {
                    callbacks[i](SDK);
                }
            }

            let initAlreadyCalled = false;
            const __sentry = window.__SENTRY__;
            // If there is a global __SENTRY__ that means that in any of the callbacks init() was already invoked
            if (!(typeof __sentry === 'undefined') && __sentry.hub && __sentry.hub.getClient()) {
                initAlreadyCalled = true;
            }

            // We want to replay all calls to Sentry and also make sure that `init` is called if it wasn't already
            // We replay all calls to `Sentry.*` now
            let calledSentry = false;
            for (let i = 0; i < data.length; i++) {
                if (data[i].f) {
                    calledSentry = true;
                    const call = data[i];
                    if (initAlreadyCalled === false && call.f !== 'init') {
                        // First call always has to be init, this is a conveniece for the user so call to init is optional
                        SDK.init();
                    }
                    initAlreadyCalled = true;
                    SDK[call.f](...call.a);
                }
            }
            if (initAlreadyCalled === false && calledSentry === false) {
                // Sentry has never been called but we need Sentry.init() so call it
                SDK.init();
            }

            // Because we installed the SDK, at this point we have an access to TraceKit's handler,
            // which can take care of browser differences (eg. missing exception argument in onerror)
            const tracekitErrorHandler = window.onerror;
            const tracekitUnhandledRejectionHandler = window.onunhandledrejection;

            // And now capture all previously caught exceptions
            for (let i = 0; i < data.length; i++) {
                if ('e' in data[i] && tracekitErrorHandler) {
                    tracekitErrorHandler.apply(window, data[i].e);
                } else if ('p' in data[i] && tracekitUnhandledRejectionHandler) {
                    tracekitUnhandledRejectionHandler.apply(window, [data[i].p]);
                }
            }
        } catch (e) {
            /* eslint-disable-next-line no-console */
            console.error(e);
        }
    }

    // We make sure we do not overwrite window.Sentry since there could be already integrations in there
    window.Sentry = window.Sentry || {};

    window.Sentry.onLoad = function (callback) {
        onLoadCallbacks.push(callback);
        if (!forceLoad) {
            return;
        }
        injectSdk(onLoadCallbacks);
    };

    window.Sentry.forceLoad = function () {
        forceLoad = true;
        setTimeout(() => {
            injectSdk(onLoadCallbacks);
        });
    };

    [
        'init',
        'addBreadcrumb',
        'captureMessage',
        'captureException',
        'captureEvent',
        'configureScope',
        'withScope',
        'showReportDialog',
    ].forEach((f) => {
        window.Sentry[f] = function (...args) {
            queue({f, a: args});
        };
    });

    return window.Sentry;
}
