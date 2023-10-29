import {ClientEvent} from '@udemy/event-tracking';

import {LabEntity} from './lab-entity';
import {LabTakingSessionEntity} from './lab-taking-session-entity';
import {LabTaskEntity} from './lab-task-entity';

/**
 * Fired when the user completes a lab task
 * See source: https://github.com/udemy/schema-store/blob/master/events/v2/LabTaskCompleted.avdl
 */
export class LabTaskCompleted extends ClientEvent {
    lab: LabEntity;
    mode: 'follow_along' | 'guided';
    labTask: LabTaskEntity;
    labTakingSession: LabTakingSessionEntity;

    constructor({
        lab,
        mode,
        labTask,
        labTakingSession,
    }: {
        lab: LabEntity;
        mode: 'follow_along' | 'guided';
        labTask: LabTaskEntity;
        labTakingSession: LabTakingSessionEntity;
    }) {
        super('LabTaskCompleted');
        this.lab = lab;
        this.mode = mode;
        this.labTask = labTask;
        this.labTakingSession = labTakingSession;
    }
}
