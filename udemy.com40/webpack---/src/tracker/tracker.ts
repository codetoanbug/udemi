import Cookies from 'js-cookie';

import {defaultWebAppKey, DOMAIN_CONFIG, EventStatus, visitorUuidCookieKey} from './constants';
import {Dimensions, TrackingEvent} from './event-common';
import {createDeferred, generateTrackingId, getTimezoneOffset, setPrintLogs} from './helpers';
import {
    addCloseListener,
    initializeSender,
    initializeSenderPublishHook,
    queueEvent,
} from './sender';
import {EventTrackingSession} from './session';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

const externalContextParameterDefaults = {
    appKey: defaultWebAppKey,
    appLanguage: '',
    appVersion: '',
    clientRetries: true,
    domainConfig: DOMAIN_CONFIG.USE_DEFAULT,
    isD2CSubscriber: false,
    isMobile: false,
    isTrackingEnabled: true,
    organizationId: null,
    pageKey: null,
    pageTrackingId: null,
    printLogs: false,
    userId: null,
    visitorUuid: null,
};

export interface TrackingContext {
    appKey: string;
    appLanguage: string;
    appVersion: string;
    captureException?: (ex: unknown) => void;
    clientId: string;
    clientKey?: string;
    clientRetries: boolean;
    collectorURLOverride?: string;
    disablePageVisibilityTracking?: boolean;
    domainConfig: number;
    env?: string;
    isD2CSubscriber: boolean;
    isMobile: boolean;
    isTrackingEnabled?: boolean;
    organizationId: number | null;
    pageKey: string | null;
    pageTrackingId: string;
    pathname?: string;
    printLogs?: boolean;
    referrer: string | null;
    screen: Dimensions;
    sessionId: string;
    source?: string;
    sourceServiceName?: string;
    timezoneOffset: number;
    url: string;
    userId: number | null;
    viewport: Dimensions;
    visitorUuid: string;
}

// TODO move this interface to helper.js when it is migrated to TS
interface Deferred {
    promise: Promise<void>;
    resolve: () => void;
    reject: () => void;
}

// TODO move this interface to sender.js when it is migrated to TS
type CloseListener = () => void;
type PublishHook = (event: TrackingEvent, status: EventStatus, failureReason?: string) => void;

class TrackerClass {
    context = {} as TrackingContext;
    ready = false;
    firstPageKey: string | null = null;
    initDeferred: Deferred = createDeferred();
    publishHook: PublishHook = noop;

    /**
     * This method initializes the tracker context and the sender. After invocation of this method
     * the sender starts to send the events buffered by the publishEvent method.
     *
     * Warning: Do not call publishEvent method before calling this function.
     *
     * @param publishHook: Each time tracker sends an event, and each time the response arrives,
     * publishHook function is called with event and status and failureReason arguments.
     * @param externalContextParameters: By this object default context parameters of the tracker
     * context may be changed.
     * @param clientKey: Client key to use when submitting events to collector
     */
    initialize(externalContextParameters: Partial<TrackingContext>, publishHook?: PublishHook) {
        if (publishHook) {
            this.setPublishHook(publishHook);
        }
        this.initializeContext(externalContextParameters);
        initializeSender(
            publishHook,
            this.context.appVersion,
            externalContextParameters.domainConfig ?? externalContextParameterDefaults.domainConfig,
            externalContextParameters.clientRetries,
            externalContextParameters.collectorURLOverride,
            externalContextParameters.clientKey,
            externalContextParameters.disablePageVisibilityTracking,
            externalContextParameters.captureException,
        );
        this.initDeferred.resolve();
        this.ready = true;
    }

    setPublishHook(publishHook: PublishHook) {
        this.publishHook = publishHook;
        initializeSenderPublishHook(publishHook);
    }

    /**
     * The tracker stores some parameters in the object called 'context'. Some of these parameters
     * are determined internally and cannot be changed externally. Other parameters can be
     * determined externally when provided by the parameter named 'externalContextParameters'. If a
     * parameters is not provided, this function sets the default for this parameter.
     *
     * See the constant named 'externalParameterNames' for the list of possible external parameters.
     */
    private initializeContext(externalContextParameters: Partial<TrackingContext>) {
        // const window = serverOrClient.global as Window;
        const initial = {
            sessionId: EventTrackingSession.getEventTrackingSessionId(),
            clientId: generateTrackingId(),
            url: window.location.href,
            referrer: document.referrer || null,
            timezoneOffset: getTimezoneOffset(),
            screen: new Dimensions(window.screen.width, window.screen.height),
            viewport: new Dimensions(window.innerWidth, window.innerHeight),
            printLogs: this.context.env === 'DEV',
        };

        this.firstPageKey = externalContextParameters.pageKey as string;

        this.context = {
            ...externalContextParameterDefaults,
            ...initial,
            ...externalContextParameters,
            pageTrackingId: generateTrackingId(),
            visitorUuid:
                externalContextParameters.visitorUuid ||
                (Cookies.get(visitorUuidCookieKey) as string),
        };

        // Activate/deactivate printing to the console
        setPrintLogs(!!this.context.printLogs);
    }

    /**
     * Some parts of the context becomes stale by time. This function refreshes those parts when the
     * context would be used for a new event.
     */
    private refreshContext() {
        // todo should we throttle this call like we do in mobile?
        if (this.context) {
            this.context.sessionId = EventTrackingSession.getEventTrackingSessionId();
            this.context.viewport.width = window.innerWidth;
            this.context.viewport.height = window.innerHeight;
        }
    }

    /**
     * This function sets the page related info in the event tracking context.
     *
     * @param {null, string} pageKey: Identifier of the page: featured, category, subcategory,
     * search etc. (https://github.com/udemy/schema-store/blob/master/fields/CommonFields.avdl)
     *
     * @param {null, string} pageTrackingId: Tracking UUID for page instance. On web, it's refreshed
     * with route change. All frontend events fired on the same page, can be related using the 'id'
     * field inside this record.
     */
    setPageContext(pageKey: string, pageTrackingId: string) {
        if (!this.firstPageKey) {
            this.firstPageKey = pageKey;
        }
        this.context.pageKey = pageKey;
        this.context.pageTrackingId = pageTrackingId;
        this.context.url = window.location.href;
        this.context.pathname = window.location.pathname;
    }

    /**
     * This method is used by each event source for publishing the event.
     *
     * Waits for tracker initialization before starting to publish the events
     */
    publishEvent(event: TrackingEvent) {
        if (this.ready) {
            this._publishEvent(event);
        } else {
            this.initDeferred.promise.then(() => this._publishEvent(event));
        }
    }

    /**
     * Register a listener with this method if you want to be notified
     * **just before** sender is closed.
     *
     * This function is useful when you want to send an event on `pagehide`.
     * Since sender also performs its last send with beacon API on `pagehide`, and
     * you cannot guarantee browsers will always execute your listener before
     * tracker's, you will need to register your listener here instead of `pagehide`,
     * so that you can be sure your listener is executed before sender is closed,
     * guaranteeing that your event will be put to buffer before sender performs its
     * last send and closes.
     *
     * Discussion:
     * https://github.com/udemy/website-django/pull/49905#discussion_r565399679
     *
     * If you're trying to collect events that happen after `pagehide` event
     * eg. visibilitychange, beforeunload, unload, tracker currently does not
     * support that.
     * @param {function} listener
     */
    addCloseListener(listener: CloseListener, onlyOnce = false) {
        addCloseListener(listener, onlyOnce);
    }

    private _publishEvent(event: TrackingEvent) {
        if (!this.context.isTrackingEnabled) {
            return;
        }

        this.publishHook(event, EventStatus.WAITING);
        this.refreshContext();
        event.processContext(this.context);
        queueEvent({eventType: event._type, eventData: event});
    }
}
export const EventTracker = new TrackerClass();
export const Tracker = EventTracker;
