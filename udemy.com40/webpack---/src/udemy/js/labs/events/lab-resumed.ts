import {ClientEvent} from '@udemy/event-tracking';

import {LabEntity} from './lab-entity';
import {LabTakingSessionEntity} from './lab-taking-session-entity';

/**
 * Fired when the user resumes their lab taking experience
 * See source: https://github.com/udemy/schema-store/blob/master/events/v2/LabResumed.avdl
 */
export class LabResumed extends ClientEvent {
    lab: LabEntity;
    mode: 'follow_along' | 'open' | 'guided';
    uiRegion: string;
    isLabInstanceResumed: boolean;
    labTakingSession: LabTakingSessionEntity;

    constructor({
        lab,
        mode,
        uiRegion,
        isLabInstanceResumed,
        labTakingSession,
    }: {
        lab: LabEntity;
        mode: 'follow_along' | 'open' | 'guided';
        uiRegion: string;
        isLabInstanceResumed: boolean;
        labTakingSession: LabTakingSessionEntity;
    }) {
        super('LabResumed');
        this.lab = lab;
        this.mode = mode;
        this.uiRegion = uiRegion;
        this.isLabInstanceResumed = isLabInstanceResumed;
        this.labTakingSession = labTakingSession;
    }
}
