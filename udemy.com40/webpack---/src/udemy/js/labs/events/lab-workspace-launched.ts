import {ClientEvent} from '@udemy/event-tracking';

import {LabEntity} from './lab-entity';
import {LabTakingSessionEntity} from './lab-taking-session-entity';
import {LabWorkspaceEntity} from './lab-workspace-entity';

/**
 * Fired when the user launches a modular lab workspace
 * See source: https://github.com/udemy/schema-store/blob/master/events/v2/LabResumed.avdl
 */
export class LabWorkspaceLaunched extends ClientEvent {
    lab: LabEntity;
    workspace: LabWorkspaceEntity;
    mode: 'follow_along' | 'open' | 'guided';
    uiRegion: string;
    labTakingSession: LabTakingSessionEntity;

    constructor({
        lab,
        workspace,
        mode,
        uiRegion,
        labTakingSession,
    }: {
        lab: LabEntity;
        workspace: LabWorkspaceEntity;
        mode: 'follow_along' | 'open' | 'guided';
        uiRegion: string;
        labTakingSession: LabTakingSessionEntity;
    }) {
        super('LabWorkspaceLaunched');
        this.lab = lab;
        this.workspace = workspace;
        this.mode = mode;
        this.uiRegion = uiRegion;
        this.labTakingSession = labTakingSession;
    }
}
