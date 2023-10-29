import {ClientEvent} from '@udemy/event-tracking';

import {LabEntity} from './lab-entity';

/**
 * Fired when the user selects the "Start Lab" button after selecting a mode on the lab overview page
 * See source: https://github.com/udemy/schema-store/blob/master/events/v2/LabStarted.avdl
 */
export class LabStarted extends ClientEvent {
    lab: LabEntity;
    uiRegion: 'mode_selection_panel_right';
    mode: 'follow_along' | 'open' | 'guided';

    constructor({
        lab,
        uiRegion,
        mode,
    }: {
        lab: LabEntity;
        uiRegion: 'mode_selection_panel_right';
        mode: 'follow_along' | 'open' | 'guided';
    }) {
        super('LabStarted');
        this.lab = lab;
        this.uiRegion = uiRegion;
        this.mode = mode;
    }
}
