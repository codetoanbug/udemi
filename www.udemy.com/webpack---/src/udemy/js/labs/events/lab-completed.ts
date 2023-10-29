import {ClientEvent} from '@udemy/event-tracking';

import {LabEntity} from './lab-entity';
import {LabTakingSessionEntity} from './lab-taking-session-entity';

/**
 * Fired when a user completes a Lab. In modes with individual tasks (structured, follow along),
 * there is no explicit "Complete Lab" button they select; in that case this event fires when the
 * last task is completed and the completion modal is rendered. For modes without tasks (open),
 * the user does explicitly select a "Complete Lab" button.
 * See source: https://github.com/udemy/schema-store/blob/master/events/v2/LabCompleted.avdl
 */
export class LabCompleted extends ClientEvent {
    lab: LabEntity;
    mode: 'follow_along' | 'open' | 'guided';
    labTakingSession: LabTakingSessionEntity;

    constructor({
        lab,
        mode,
        labTakingSession,
    }: {
        lab: LabEntity;
        mode: 'follow_along' | 'open' | 'guided';
        labTakingSession: LabTakingSessionEntity;
    }) {
        super('LabCompleted');
        this.lab = lab;
        this.mode = mode;
        this.labTakingSession = labTakingSession;
    }
}
