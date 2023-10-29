import autobind from 'autobind-decorator';
import pako from 'pako';
import Pusher from 'pusher-js';

import getConfigData from 'utils/get-config-data';

const udConfig = getConfigData();

export function createPusher(appKey, options) {
    return new Pusher(appKey, options);
}

export function pusherResultHandlerWrapper(resultHandler) {
    return (rawData) => {
        let evaluatorResult;
        if (rawData instanceof Array || rawData instanceof Uint8Array) {
            evaluatorResult = JSON.parse(pako.ungzip(rawData, {to: 'string'}));
        } else {
            evaluatorResult = rawData;
        }
        resultHandler(evaluatorResult);
    };
}

export function compress(evaluationResult) {
    return pako.gzip(JSON.stringify(evaluationResult));
}

/**
 * @class Implements the Pusher communication logic.
 *
 * @param responseHandler (callback) called when there is a response message from Pusher.
 * @param timeoutHandler (callback) called if there is no response from Pusher within 12s.
 * @param onSubscriptionSucceeded (callback) called when the Pusher connection is established.
 * @param onSubscriptionError (callback) called if the Pusher connection cannot be established.
 * @param pusherEvent (string) app-specific Pusher event name.
 *
 * @property pusherChannel (string) channel for the server to send messages back to the client.
 *
 * @method destroy() cleans up the Pusher client and any other dangling artifacts (timeouts, events).
 */
export default class PusherEventHandler {
    constructor(
        responseHandler,
        timeoutHandler,
        onSubscriptionSucceeded,
        onSubscriptionError,
        pusherEvent,
    ) {
        this.responseHandler = responseHandler;

        this.pusherClient = createPusher(udConfig.third_party.pusher.key, {});
        this.pusherChannel = `v2${Math.floor(Math.random() * Math.pow(10, 12) + Date.now())}`;

        const channel = this.pusherClient.subscribe(this.pusherChannel);

        // bind() is a Pusher API method, not the native JS method.
        channel.bind('pusher:subscription_succeeded', onSubscriptionSucceeded);
        channel.bind(pusherEvent, this.pusherEventHandler);
        this.pusherClient.connection.bind('unavailable', () => {
            timeoutHandler();
            this.destroy();
        });
        this.pusherClient.connection.bind('failed', () => {
            onSubscriptionError();
            this.destroy();
        });

        const maxIdleTime = 45 * 1000;

        this.idleTimeout = setTimeout(() => {
            this.destroy();
            timeoutHandler();
        }, maxIdleTime);

        // If you want to mock a response from the evaluator, uncomment the code below.
        // You might also want to comment out the above `.bind()` calls so that your mock response
        // isn't overridden by a real one.
        /*
        setTimeout(() => {
            this.pusherEventHandler({
                success: true,
                output: {
                    user_logs: 'user logs',
                    compile_logs: 'compile logs',
                    evaluator_logs: 'evaluator logs',
                },
            });
        }, 2 * 1000);
        */
    }

    @autobind
    pusherEventHandler(evaluatorResult) {
        this.destroy();
        this.responseHandler(evaluatorResult);
    }

    destroy() {
        if (this.pusherClient) {
            this.pusherClient.disconnect();
        }
        clearTimeout(this.idleTimeout);
    }
}
