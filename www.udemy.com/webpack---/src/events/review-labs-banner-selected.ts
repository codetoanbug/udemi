import {ClientEvent} from '@udemy/event-tracking';

export class ReviewLabsBannerSelected extends ClientEvent {
    constructor() {
        super('ReviewLabsBannerSelected');
    }
}
