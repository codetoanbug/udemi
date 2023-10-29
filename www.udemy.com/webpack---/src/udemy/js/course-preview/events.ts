import {ClientEvent} from '@udemy/event-tracking';

export class PreviewVideoPlayEvent extends ClientEvent {
    constructor(
        public courseId: number,
        public buyableTrackingId: string | undefined,
        public previewId: number,
        public offset: number = 0,
        public nonInteraction = false,
    ) {
        super('PreviewVideoPlayEvent');
    }
}

export class PreviewVideoViewEvent extends ClientEvent {
    constructor(
        public courseId: number,
        public buyableTrackingId: string | undefined,
        public previewId: number,
    ) {
        super('PreviewVideoViewEvent');
    }
}
