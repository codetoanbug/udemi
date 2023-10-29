/**
 * This file contains the base classes for the events.
 * Specific events should be defined in the events.js file.
 */

import {generateTrackingId} from './helpers';
import {TrackingContext} from './tracker';

export abstract class TrackingEvent {
    createTime: number;
    sendTime: number | null;
    eventId: string;

    constructor(public _type: string) {
        this.createTime = Date.now();
        this.sendTime = null;
        this.eventId = generateTrackingId();
    }

    setSendTime(time: number) {
        this.sendTime = time;
    }

    getType() {
        return this._type;
    }

    abstract processContext(context: TrackingContext): void;
}

export class Dimensions {
    constructor(public width: number, public height: number) {}
}

export class Page {
    constructor(public trackingId: string, public key: string | null) {}
}

export class ClientHeader {
    constructor(
        public appKey: string,
        public sourceServiceName: string | null,
        public organizationId: number | null,
        public userId: number | null,
        public visitorUuid: string,
        public sessionId: string,
        public clientId: string,
        public page: Page,
        public isMobile: boolean,
        public isD2CSubscriber: boolean | null,
    ) {}
}

/**
 * Client event will be the base class of all events generated in the front-end.
 */
export class ClientEvent extends TrackingEvent {
    clientHeader?: ClientHeader;

    processContext(context: TrackingContext) {
        this.clientHeader = new ClientHeader(
            context.appKey,
            context.sourceServiceName as string,
            context.organizationId,
            context.userId,
            context.visitorUuid,
            context.sessionId,
            context.clientId,
            new Page(context.pageTrackingId, context.pageKey),
            context.isMobile,
            context.isD2CSubscriber,
        );
    }
}
