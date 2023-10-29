import axios, {AxiosError, AxiosResponse} from 'axios';

// TODO: make sure we capture log error from `triggerCloseListeners()`
// import Raven from 'utils/ud-raven';

import {PageVisibilityChangeEvent} from '../lib/events';
import {collectorPath, DOMAIN_CONFIG, defaultDomain, EventStatus} from './constants';
import {TrackingEvent} from './event-common';
import {logError, makeRetryingFunction, preventOverlappingCall} from './helpers';
import {Tracker} from './tracker';

export interface QueuedEvent {
    eventType: string;
    eventData: TrackingEvent;
}

export type CloseListener = () => void;
export type PublishHook = (
    event: TrackingEvent,
    status: EventStatus,
    failureReason?: string,
) => void;

export const constants = {
    clientKeyUrlParam: 'client_key',
    clientKey: 'js',
    clientVersionUrlParam: 'client_version',
    queueFlushPeriod: 3000,
    queueInitialFlushDelay: 250,
    requestTimeout: 20000,
    retryGap: 3000,
    maxTimeoutRetry: 3,
};
export const queue: Array<QueuedEvent> = [];

const externalPublishHooks: PublishHook[] = [];

export function addPublishHook(hook: PublishHook) {
    externalPublishHooks.push(hook);
}

export function resetPublishHooks() {
    externalPublishHooks.splice(0, externalPublishHooks.length);
}

function callExternalPublishHooks(
    event: TrackingEvent,
    status: EventStatus,
    failureReason?: string,
) {
    externalPublishHooks.forEach((hook: PublishHook) => {
        hook(event, status, failureReason);
    });
}

// todo make these go away
let send: (data: string) => Promise<Promise<AxiosResponse<CollectorResponse>>>;
let queueFlusher: () => Promise<Promise<void> | undefined>;

export async function forceFlushSenderBuffer() {
    if (queueFlusher) {
        await queueFlusher();
    }
}

let collectorUrl: string;
let publishHook: PublishHook;

// Store the events being currently sent because they may need to be retried by the beacon API
let eventsInFlight: Array<QueuedEvent>;

const closeListeners: Array<CloseListener> = [];
let senderClosed = false;

// Initialized by `initializeSender` and cancelled by `closeSender()` during `pagehide` event
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let queueFlusherInterval: any;

let _clientKey = constants.clientKey;

let captureExceptionFunc = (ex: unknown) => {
    logError(ex);
};

export function initializeSender(
    publishHook: PublishHook | undefined,
    appVersion: string,
    domainConfig: number,
    clientRetries = true,
    collectorURLOverride?: string,
    clientKey?: string,
    disablePageVisibilityTracking?: boolean,
    captureException?: (ex: unknown) => void,
) {
    if (captureException) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        captureExceptionFunc = captureException;
    }
    if (clientKey) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _clientKey = clientKey;
    }

    collectorUrl = _getCollectorUrl(appVersion, domainConfig, collectorURLOverride);

    if (publishHook) {
        initializeSenderPublishHook(publishHook);
    }
    const udTrackApi = axios.create({
        timeout: constants.requestTimeout,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: {'Content-Type': 'text/plain'},
    });

    // todo change back to send
    send = makeRetryingFunction(
        (data: string) => {
            return udTrackApi.post<CollectorResponse>(collectorUrl, data);
        },
        constants.maxTimeoutRetry,
        constants.retryGap,
        _shouldRetryRequest(clientRetries),
    );
    queueFlusher = preventOverlappingCall(_flush);
    _setupBeacon(disablePageVisibilityTracking);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queueFlusherInterval = setInterval(() => {
        if (!senderClosed) {
            queueFlusher();
        }
    }, constants.queueFlushPeriod);

    // For being able to flush the initial events waiting for the promise to resolve
    // we manually send them without waiting the first `queueFlushPeriod`.
    // We wait for `queueInitialFlushDelay` before sending this first batch to
    // allow initial events to proceed on their resolved promises.
    // For Varnished pages, we could instantly call queueFlusher after all tasks
    // waiting this promise is done since in such cases, we already wait for response of
    // context/me, which is received in a later stages of JS execution compared to
    // non varnished pages.
    setTimeout(queueFlusher, constants.queueInitialFlushDelay);
}

export function initializeSenderPublishHook(hook: PublishHook) {
    publishHook = (...args) => {
        hook(...args);
        callExternalPublishHooks(...args);
    };
}

export function queueEvent(event: QueuedEvent) {
    queue.push(event);
}

export function addCloseListener(listener: CloseListener, onlyOnce = false) {
    let hasExecuted = false;
    closeListeners.push((...args) => {
        if (!onlyOnce || !hasExecuted) {
            listener(...args);
        }
        hasExecuted = true;
    });
}

function _popEventsFromQueue() {
    const events = [...queue];
    queue.length = 0;
    _setEventSendTimes(events);
    return events;
}

async function _flush() {
    eventsInFlight = _popEventsFromQueue();
    if (!eventsInFlight.length) {
        return;
    }
    let response = null;
    try {
        response = await send(JSON.stringify(eventsInFlight));
    } catch (exception) {
        _handleFullError(exception as Error, eventsInFlight);
    }
    if (response && response.status === 200) {
        _handleFullSuccess(eventsInFlight);
    }

    if (response && response.status === 207) {
        _handlePartialSuccess(eventsInFlight, response);
    }
    eventsInFlight.length = 0;
}

function _shouldRetryRequest(clientRetries: boolean) {
    return function (exception: AxiosError) {
        // Should retry on network errors(no status) and when we got a 5xx
        return (
            (!exception.request.status ||
                (exception.request.status >= 500 && exception.request.status <= 599)) &&
            clientRetries
        );
    };
}

export function _handleFullSuccess(events: Array<QueuedEvent>) {
    events.forEach((event) => {
        publishHook(event.eventData, EventStatus.SUCCESS);
    });
}

interface CollectorResponse {
    failedEvents: {
        event: TrackingEvent;
        idx: number;
        reason: string;
    }[];
}

/**
 * This method warns the developer about the specific failed events in a request.
 * @param events The events sent to the server
 * @param response The response of the event collector that is used to detect the failed events
 */
function _handlePartialSuccess(
    events: Array<QueuedEvent>,
    response: AxiosResponse<CollectorResponse>,
) {
    const failedEventsSet = new Set();
    response.data.failedEvents.forEach((responseElem) => {
        const failedEvent = events[responseElem.idx].eventData;

        // notify publish status for failures
        publishHook(failedEvent, EventStatus.FAILURE, responseElem.reason);

        // decorate response so error message shows the event
        // todo check
        responseElem.event = failedEvent;

        failedEventsSet.add(failedEvent);
    });

    // notify publish status for successes
    const successfulEvents = events.filter((event) => !failedEventsSet.has(event.eventData));
    successfulEvents.forEach((event) => {
        publishHook(event.eventData, EventStatus.SUCCESS);
    });

    logError('Following events have failed to be persisted', response.data.failedEvents);
}

function _handleFullError(exception: Error, events: Array<QueuedEvent>) {
    events.forEach((event) => {
        publishHook(event.eventData, EventStatus.FAILURE);
    });
    logError('Event tracking send error', exception);
}

function _handleBeaconOutcome(beaconOutcome: boolean, events: Array<QueuedEvent>) {
    const status = beaconOutcome ? EventStatus.BEACON_SENT : EventStatus.FAILURE;
    const errorMessage = beaconOutcome ? undefined : 'Beacon API failed';

    events.forEach((event) => {
        publishHook(event.eventData, status, errorMessage);
    });
}

function _setEventSendTimes(events: Array<QueuedEvent>) {
    const time = Date.now();
    events.forEach((event) => {
        event.eventData.setSendTime(time);
    });
}

export const sendWithBeacon = () => {
    const events = [];

    // Send the in flight events again if the page has been unloaded during a send operation.
    // The reason we do this is because ajax requests are cancelled by the browser when the page
    // is unloaded, but beacon requests are not. So beacon requests are the only way for not
    // losing any events. This may mean duplicate events but we can de-duplicate them if needed.
    // We only fallback to beacon as a last resort because beacon API don't notify back
    // success/failures
    if (eventsInFlight?.length) {
        events.push(...eventsInFlight);
    }

    // Put the residual events on the queue that may have been added after send started
    events.push(..._popEventsFromQueue());

    if (events.length > 0) {
        const status = navigator.sendBeacon(collectorUrl, JSON.stringify(events));
        _handleBeaconOutcome(status, events);
    }
};

function triggerCloseListeners() {
    closeListeners.forEach((listener) => {
        try {
            listener();
        } catch (error) {
            captureExceptionFunc(error);
        }
    });
}

function closeSender() {
    // prevents further calls to  `queueFlusherInterval` to prevent additional events from being queued
    senderClosed = true;

    // we first trigger dependent listeners
    triggerCloseListeners();

    // then send with beacon API
    sendWithBeacon();
}

function reopenSender() {
    senderClosed = false;
}

function _setupBeacon(disablePageVisibilityTracking?: boolean) {
    if (!navigator.sendBeacon) {
        return;
    }
    window.addEventListener('pagehide', closeSender);
    window.addEventListener('pageshow', (event: PageTransitionEvent) => {
        if (event.persisted) {
            // page restored from bfcache, resume sending events
            reopenSender();
        }
    });

    if (!disablePageVisibilityTracking) {
        document.addEventListener('visibilitychange', () => {
            Tracker.publishEvent(new PageVisibilityChangeEvent(!document.hidden));
            if (document.hidden) {
                sendWithBeacon();
            }
        });
    }
}

export function _getCollectorUrl(
    appVersion: string,
    domainConfig: number,
    collectorURLOverride?: string,
) {
    const urlParams = new URLSearchParams();
    urlParams.set(constants.clientKeyUrlParam, constants.clientKey);
    urlParams.set(constants.clientVersionUrlParam, appVersion);

    const baseUrl = ((domainConfig) => {
        switch (domainConfig) {
            case DOMAIN_CONFIG.USE_DEFAULT:
                return defaultDomain + collectorPath;
            case DOMAIN_CONFIG.USE_CURRENT:
                return collectorPath;
            case DOMAIN_CONFIG.USE_PROVIDED:
                return collectorURLOverride ?? defaultDomain + collectorPath;
        }
    })(domainConfig);
    return `${baseUrl}?${urlParams.toString()}`;
}
