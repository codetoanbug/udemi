import {Options, Hub} from '@sentry/types';

type SentryContextFunctions = Pick<Hub, 'captureException' | 'setUser' | 'setTags'>;

export const DEFAULT_IGNORE_ERRORS = [
    // Blocked a frame with origin "https://www.udemy.com" from accessing a frame with origin "https://dsp.fout.jp".
    // The frame being accessed set "document.domain" to "fout.jp", but the frame requesting access did not. Both must
    // set "document.domain" to the same value to allow access.
    // See for instance: https://sentry.io/udemycom/frontend/issues/288366608/
    //
    // Blocked a frame with origin "https://www.udemy.com" from accessing a frame with origin "https://bid.g.doubleclick.net".
    // Protocols, domains, and ports must match.
    // See for instance: https://sentry.io/udemycom/frontend/issues/288366608/
    //
    // Blocked a frame with origin "https://www.udemy.com" from accessing a frame with origin "https://accounts.google.com".
    // Protocols, domains, and ports must match.
    // See for instance: https://sentry.io/udemycom/frontend/issues/288366608/
    //
    // Blocked a frame with origin "https://www.udemy.com" from accessing a cross-origin frame.
    // Protocols, domains, and ports must match.
    // See for instance: https://sentry.io/udemycom/frontend/issues/500157646/
    //
    // These could be the third-party libraries misbehaving, or these could be because of this Chrome bug:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=709132
    /^Blocked a frame with origin.*Protocols, domains, and ports must match/,

    // undefined is not an object (evaluating '__gCrWeb.autofill.extractForms')
    // See for instance: https://sentry.io/udemycom/frontend/issues/211832597/
    // This is a bug in WebKit which is used by OS X, iOS, and Chrome on iOS:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=590375
    '__gCrWeb.autofill.extractForms',

    // ResizeObserver loop limit exceeded
    // Apparently this is a harmless error. Please see the Stack Overflow comment below
    // by the author of the ResizeObserver spec.
    // https://sentry.io/udemycom/frontend/issues/305288820/
    // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded#comment86691361_49384120
    'ResizeObserver loop limit exceeded',

    // window.setupAdForm is not a function
    // There are a few variations such as:
    // https://sentry.io/udemycom/frontend/issues/405968924/
    // https://sentry.io/udemycom/frontend/issues/405975845/
    // https://sentry.io/udemycom/frontend/?query=setupAdForm
    // This is definitely not in our code. I'm guessing it's caused by an ad blocker.
    /window\.setupAdForm/,

    // Cannot read property '_avast_submit' of undefined
    // undefined is not an object (evaluating 'f._avast_submit')
    // https://sentry.io/udemycom/frontend/?query=is%3Aunresolved+_avast_submit&sort=priority
    // This is definitely not in our code. I'm guessing it's caused by an ad blocker.
    /_avast_submit/,

    // vid_mate_check is not defined
    // https://sentry.io/udemycom/frontend/issues/131837431/
    // This is definitely not in our code. This looks related to VidMate. I've notified Alan Cima.
    /vid_mate_check/,

    // __show__deepen is not defined
    // https://sentry.io/udemycom/frontend/issues/159395294/
    // This looks like this may be a browser bug in UC Browser:
    // https://github.com/bugsnag/bugsnag-js/issues/186
    /__show__deepen is not defined/,

    // NS_ERROR_NOT_INITIALIZED
    // https://sentry.io/udemycom/frontend/issues/395789288/
    // This *only* happens with branch-metrics, unknown browser, and unknown device.
    // We suspect it may be some sort of ad blocker.
    /NS_ERROR_NOT_INITIALIZED/,

    // Loading chunk <chunkname> failed
    // https://sentry.io/udemycom/frontend/issues/414407443/
    // These are handled and then re-thrown in ./handle-import-error.js.
    /Loading chunk [^ ]* failed/,

    // If it says we've already handled it, then we can ignore it at this point.
    /Previously handled exception: /,

    // Raised by Video.js DOM selector when there is no element.
    // e.g. Cannot read property 'vdata1460397839841' of null
    /['"]vdata\d+['"]/,

    // This most likely happened because PerimeterX flagged the user as a bot. This will lead to
    // HTTP status 403 or -1. We've never seen this impact real users, so we're ignoring it for
    // now.
    // Failed to load template: /808912/preview/?startPreviewId=&display_type=popup (HTTP status: -1 )
    // https://trello.com/c/8cyDx0JF/1897-failed-to-load-template-error-in-sentry
    /\$compile:tpload.*Failed to load template:.*display_type=popup.*HTTP status: (-1|403)/,

    // We think that these are caused by bots.
    // https://sentry.io/udemycom/frontend/issues/249091432/
    'can\'t redefine non-configurable property "userAgent"',

    // ReferenceError
    // _isMatchingDomain is not defined
    // https://sentry.io/udemycom/frontend/issues/680383036/
    //
    // This error seems to be caused by Facebook bots. All of the IPs in the issue seems to be Facebook IPs.
    // See: https://stackoverflow.com/q/52313444
    '_isMatchingDomain is not defined',

    // DataCloneError
    // Failed to execute 'postMessage' on 'Window': function (){
    // var n,r,i=2,o=arguments,a=o[0],s="["+(e?e+":":"")+a+"] ",u=o[1];
    // for(s+=u.replace(/\{\d+\}/g,functio...<omitted>...)}
    // could not be cloned.
    // https://sentry.io/udemycom/frontend/issues/700026580/
    //
    // This error is also caused by Facebook bots.
    /^Failed to execute 'postMessage' on 'Window'.*could not be cloned/,

    // Unexpected token else
    // We believe that this is coming from a user extension or from GTM.
    // https://udemyjira.atlassian.net/browse/TF-322
    /Unexpected token else/,

    // The following are taken from: https://docs.sentry.io/clients/javascript/tips/#decluttering-sentry
    // Random plugins/extensions:
    'top.GLOBALS',
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error:
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    "Can't find variable: ZiteReader",
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'http://loading.retry.widdit.com/',
    'atomicFindClose',
    // Facebook borked:
    'fb_xd_fragment',
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
    // reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // See: http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    'conduitPage',

    // Error axios/lib/core/createError in createError
    // We decided to ignore certain network related errors in AJAX calls to remove the noise in Sentry
    // There are also variations of this error which doesn't specify a response code.
    // https://sentry.io/udemycom/frontend/issues/490856364
    // https://sentry.io/udemycom/frontend/issues/490317282
    // https://sentry.io/udemycom/frontend/issues/600605920
    'Request aborted',
    /^Network Error$/,
    new RegExp('.*timeout of .* exceeded.*'),

    //  Errors added with no documentation
    //  Presumably, these errors are being ignored because of some known issue in the video player.
    "Cannot read property 'currentTime' of null",
    "Cannot read property 'play' of null",
    'null has no properties',
    'videojs',
];

export interface SentryInstance extends SentryContextFunctions {
    init(options?: Options): void;
}

export interface SentryOptions extends Options {
    // dsn used to connect to Sentry and identify the project
    dsn: string;
    // Current environment of your application
    environment: string;
    ignoreErrors?: (string | RegExp)[];
}

export interface SentryContext {
    app_name: string;
    brand?: string;
    js_bundle?: string;
    page_key: string;
    user_id?: string;
    version?: string;
}

class UDSentry {
    sentryInstance!: SentryInstance;

    setSentryInstance(sentry: SentryInstance) {
        this.sentryInstance = sentry;
    }

    initializeSentry(Sentry: SentryInstance, options: SentryOptions) {
        if (!options.ignoreErrors) {
            options.ignoreErrors = DEFAULT_IGNORE_ERRORS;
        }
        try {
            Sentry.init(options);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
        this.setSentryInstance(Sentry);
    }

    initializeSentryContext(context: SentryContext) {
        const {user_id, ...tags} = context;

        if (context.user_id) {
            this.sentryInstance.setUser({id: user_id});
        }

        this.sentryInstance.setTags({...tags});
    }

    captureException(e: unknown) {
        if (this.sentryInstance) {
            // eslint-disable-next-line no-console
            console.error('Sentry.captureException called with:', e);
            this.sentryInstance.captureException(e);
        }
    }
}

export const udSentry = new UDSentry();

export const captureException = udSentry.captureException.bind(udSentry);
