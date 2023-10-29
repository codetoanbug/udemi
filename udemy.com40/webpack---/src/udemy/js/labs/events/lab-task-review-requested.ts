import {ClientEvent} from '@udemy/event-tracking';

import {LabEntity} from './lab-entity';
import {LabTakingSessionEntity} from './lab-taking-session-entity';
import {LabTaskEntity} from './lab-task-entity';

/**
 * Fired when the user selects the "Get review" or "Start review" button
 * See source: https://github.com/udemy/schema-store/blob/master/events/v2/LabTaskReviewRequested.avdl
 */
export class LabTaskReviewRequested extends ClientEvent {
    lab: LabEntity;
    mode: 'follow_along' | 'guided';
    labTask: LabTaskEntity;
    labTakingSession: LabTakingSessionEntity;
    isFirstReviewRequest: boolean;

    constructor({
        lab,
        mode,
        labTask,
        labTakingSession,
        isFirstReviewRequest,
    }: {
        lab: LabEntity;
        mode: 'follow_along' | 'guided';
        labTask: LabTaskEntity;
        labTakingSession: LabTakingSessionEntity;
        isFirstReviewRequest: boolean;
    }) {
        super('LabTaskReviewRequested');
        this.lab = lab;
        this.mode = mode;
        this.labTask = labTask;
        this.labTakingSession = labTakingSession;
        this.isFirstReviewRequest = isFirstReviewRequest;
    }
}
