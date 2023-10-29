import {ClientEvent} from '@udemy/event-tracking';

// eslint-disable-next-line import/prefer-default-export
export class AdaptiveStreamingQualityChangeEvent extends ClientEvent {
    previousResolution: any;
    videoPlayerData: any;
    constructor({previousResolution, videoPlayerData}: any) {
        super('AdaptiveStreamingQualityChangeEvent');
        this.previousResolution = previousResolution;
        this.videoPlayerData = videoPlayerData;
    }
}
