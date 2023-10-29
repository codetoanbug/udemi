import {ClientEvent} from '@udemy/event-tracking';

export const TRACKING_ACTIONS = {
    SHOW: 'show',
    CLOSE: 'close',
    DISMISS: 'dismiss',
    NAVIGATE_AWAY: 'navigate_away',
    EXPLORE_LABS: 'explore_labs',
} as const;

type Keys = keyof typeof TRACKING_ACTIONS;

type LabInCoursePromptAction = typeof TRACKING_ACTIONS[Keys];

export class LabInCoursePromptActionEvent extends ClientEvent {
    private courseId: number;
    private action: LabInCoursePromptAction;
    constructor({courseId, action}: {courseId: number; action: LabInCoursePromptAction}) {
        super('LabInCoursePromptActionEvent');
        this.courseId = courseId;
        this.action = action;
    }
}
