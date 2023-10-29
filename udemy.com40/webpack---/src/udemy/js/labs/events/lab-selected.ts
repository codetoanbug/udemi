import {ClientEvent} from '@udemy/event-tracking';

import {LabEntity} from './lab-entity';

/**
 * Fired when the user selects the "Start Lab" button after selecting a mode on the lab overview page
 * See source: https://github.com/udemy/schema-store/blob/master/events/v2/LabStarted.avdl
 */
export class LabSelected extends ClientEvent {
    lab: LabEntity;
    uiRegion: string;
    trackingId?: string;
    sourcePageType?: string;
    sourcePageId?: number;

    constructor({
        lab,
        uiRegion,
        sourcePageType,
        sourcePageId,
        trackingId,
    }: {
        lab: LabEntity;
        uiRegion: string;
        sourcePageType?: string;
        sourcePageId?: number;
        trackingId?: string;
    }) {
        super('LabSelected');
        this.lab = lab;
        this.uiRegion = uiRegion;
        this.trackingId = trackingId;
        this.sourcePageType = sourcePageType;
        this.sourcePageId = sourcePageId;
    }
}
