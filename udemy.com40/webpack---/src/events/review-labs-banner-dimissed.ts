import {ClientEvent} from '@udemy/event-tracking';

export class ReviewLabsBannerDismissed extends ClientEvent {
    private isMultipleLabsBanner: boolean;

    constructor({isMultipleLabsBanner}: {isMultipleLabsBanner: boolean}) {
        super('ReviewLabsBannerDismissed');
        this.isMultipleLabsBanner = isMultipleLabsBanner;
    }
}
