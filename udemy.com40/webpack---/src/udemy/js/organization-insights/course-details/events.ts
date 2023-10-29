import {ClientEvent} from '@udemy/event-tracking';

/**
 This event is fired when an admin clicks 'Email user' from the users table in course details
 (context="individual") or via the assignment widget  (context="group")
 */
export class UBAssignSummaryEmailUsersModalOpenEvent extends ClientEvent {
    courseId: number;
    nudgeGroup: string | null;
    context: string;
    constructor({
        courseId,
        nudgeGroup,
        context,
    }: {
        courseId: number;
        nudgeGroup: string | null;
        context: string;
    }) {
        super('UBAssignSummaryEmailUsersModalOpenEvent');
        this.courseId = courseId;
        this.nudgeGroup = nudgeGroup;
        this.context = context;
    }
}

/**
 This event is fired when an admin submits the Email Users modal
 */
export class UBAssignSummaryEmailUsersModalSubmitEvent extends ClientEvent {
    courseId: number;
    nudgeGroup: string | null;
    numUsersAdded: number;
    numUsersRemoved: number;
    numGroupsAdded: number;
    isAllUsersSelected: boolean;
    defaultMessageChanged: boolean;
    constructor({
        courseId,
        nudgeGroup,
        numUsersAdded,
        numUsersRemoved,
        numGroupsAdded,
        isAllUsersSelected,
        defaultMessageChanged,
    }: {
        courseId: number;
        nudgeGroup: string | null;
        numUsersAdded: number;
        numUsersRemoved: number;
        numGroupsAdded: number;
        isAllUsersSelected: boolean;
        defaultMessageChanged: boolean;
    }) {
        super('UBAssignSummaryEmailUsersModalSubmitEvent');
        this.courseId = courseId;
        this.nudgeGroup = nudgeGroup;
        this.numUsersAdded = numUsersAdded;
        this.numUsersRemoved = numUsersRemoved;
        this.numGroupsAdded = numGroupsAdded;
        this.isAllUsersSelected = isAllUsersSelected;
        this.defaultMessageChanged = defaultMessageChanged;
    }
}
