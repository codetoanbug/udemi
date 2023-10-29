import videojs from 'video.js';

import {noop} from 'utils/noop';

import {parsedUserAgent} from '../utils';

// Mobile Safari doesn't implement the Fullscreen API.
// It should always exit full-screen mode at the end of the video to show the interstitial or other content
function fixFullscreenExitiOS(player) {
    if (!player) {
        return;
    }

    if (parsedUserAgent.os.name === 'iOS') {
        // iOS fullscreen controls are called directorly on the HTMLMediaObject
        const playerElement = player.el().querySelector('video');
        player.on('ended', () => {
            if (playerElement.webkitDisplayingFullscreen) {
                playerElement.webkitExitFullscreen();
            }
        });
    }
}

function fixPlayPromise(player) {
    if (!player) {
        return;
    }

    // Catch/silence error when a pause interrupts a play request
    // on browsers which return a promise
    // See: https://github.com/videojs/video.js/pull/3518/files

    const silencePromise = (value) => {
        if (value && typeof value.then === 'function') {
            value.then(null, noop);
        }
    };

    player.play = function () {
        const PromiseClass = this.options_.Promise || window.Promise;

        if (PromiseClass) {
            return new PromiseClass((resolve) => {
                this.play_((promise) => {
                    silencePromise(promise);
                    resolve();
                });
            });
        }

        return this.play_();
    };
}

function fixCurrentTime(player) {
    if (!player || !player.currentTime) {
        return;
    }

    const originalCurrentTime = player.currentTime;

    player.currentTime = function (time) {
        if (typeof originalCurrentTime === 'function') {
            if (typeof time === 'undefined') {
                return originalCurrentTime.call(this);
            }
            originalCurrentTime.call(this, time === 0 ? 0.1 : time);
        }
    };
}

function addForcePlayMethod(player) {
    if (!player) {
        return;
    }

    let forcePlayPromise, statusListenerTimeoutId, wasMuted, wasPaused, retryCount;

    // Due to the many components accessing the videojs instance we had to make sure that
    // the video state doesn't change until all the chains of events have been triggered.
    // Otherwise some of browsers wouldn't complete the initial loading of the video.
    //
    // Note that we also have to simulate the `canplay` and `canplaythrough` events
    // because they won't be triggered in some crappy browsers like Safari.
    player.forcePlay = function () {
        if (forcePlayPromise) {
            return forcePlayPromise;
        }

        retryCount = 0;

        forcePlayPromise = new Promise((resolve) => {
            wasMuted = this.muted();
            wasPaused = this.paused();
            this.muted(true);
            this.play();

            statusListenerTimeoutId = setInterval(() => {
                try {
                    if (this.readyState() >= 4) {
                        resolve();
                        this.trigger('canplay');
                        this.trigger('canplaythrough');

                        throw new Error();
                    }

                    if (this.paused()) {
                        this.play();
                        this.currentTime(this.currentTime());
                    }

                    retryCount += 1;
                    if (retryCount >= 100) {
                        resolve();
                        throw new Error();
                    }
                } catch (e1) {
                    clearInterval(statusListenerTimeoutId);
                    try {
                        wasPaused && this.pause();
                        this.muted(wasMuted);
                    } catch (e2) {
                        // Since this code is called in setInterval, it may be reached after
                        // the player is removed from the DOM, in which case none of the player
                        // methods are expected to work.
                    }
                }
            }, 100);
        });
        return forcePlayPromise;
    };
}

const udemyPatches = function () {
    const player = this;

    fixPlayPromise(player);
    fixCurrentTime(player);
    fixFullscreenExitiOS(player);
    addForcePlayMethod(player);
};

videojs.registerPlugin('udemypatches', udemyPatches);
