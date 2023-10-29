import {ClientEvent} from '@udemy/event-tracking';

import {LabEntity} from './lab-entity';
import {LabTakingSessionEntity} from './lab-taking-session-entity';

/**
 * Fired when the user exits their lab taking experience
 * See source: https://github.com/udemy/schema-store/blob/master/events/v2/LabExited.avdl
 */
export class LabExited extends ClientEvent {
    lab: LabEntity;
    mode: 'follow_along' | 'open' | 'guided';
    uiRegion: string;
    isLabInstancePaused: boolean;
    labTakingSession: LabTakingSessionEntity;

    constructor({
        lab,
        mode,
        uiRegion,
        isLabInstancePaused,
        labTakingSession,
    }: {
        lab: LabEntity;
        mode: 'follow_along' | 'open' | 'guided';
        uiRegion: string;
        isLabInstancePaused: boolean;
        labTakingSession: LabTakingSessionEntity;
    }) {
        super('LabExited');
        this.lab = lab;
        this.mode = mode;
        this.uiRegion = uiRegion;
        this.isLabInstancePaused = isLabInstancePaused;
        this.labTakingSession = labTakingSession;
    }
}
