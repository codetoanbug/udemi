import {AndroidClient, WebviewMessage, WebviewMessagePayload} from '@udemy/shared-utils';

import {Buyable} from '../types/shopping-types';

class OnEnrolledMessagePayload implements WebviewMessagePayload {
    buyables: Array<Buyable>;
    purchasePrice: string;

    constructor(buyables: Array<Buyable>, purchasePrice: string) {
        this.buyables = buyables;
        this.purchasePrice = purchasePrice;
    }

    toJSON() {
        return JSON.stringify({buyables: this.buyables, purchasePrice: this.purchasePrice});
    }
}

export class OnEnrolledMessage implements WebviewMessage<OnEnrolledMessagePayload> {
    methodName = 'onEnrolled';
    payload: OnEnrolledMessagePayload;

    constructor(buyables: Array<Buyable>, purchasePrice: string) {
        this.payload = new OnEnrolledMessagePayload(buyables, purchasePrice);
    }

    /**
     * Send both the legacy onEnrolledAdditionalData message and the new OnEnrolledMessage until Android
     * adoption is significant enough to full deprecate the onEnrolledAdditionalData call
     * Note: onEnrolledAdditionalData call is not sent to iOS clients; it's only for Android backwards compatibility
     */
    sendLegacyAndroidMessage(client: AndroidClient) {
        if (typeof client.onEnrolledAdditionalData === 'function') {
            client.onEnrolledAdditionalData(this.payload.toJSON());
        } else if (typeof client.onEnrolled === 'function') {
            client.onEnrolled(JSON.stringify(this.payload.buyables));
        }
    }
}
