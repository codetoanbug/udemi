import {ClientEvent} from '@udemy/event-tracking';

const ACTION_SEEN = 'seen';
const ACTION_ENTERED = 'entered';
const ACTION_SELECTED = 'selected';
const ACTION_TYPED = 'typed';
const ACTION_SENT = 'sent';

class FastFeedbackActionEvent extends ClientEvent {
    constructor(context) {
        super('FastFeedbackActionEvent');
        this.action = context.action;
        this.selection = context.selection;
        this.hasText = context.hasText;
        this.courseTitle = context.courseTitle;
        this.lectureTitle = context.lectureTitle;
        this.sectionTitle = context.sectionTitle;
        this.entityId = context.entityId;
        this.entityType = context.entityType;
    }
}

export {
    FastFeedbackActionEvent,
    ACTION_ENTERED,
    ACTION_SEEN,
    ACTION_SELECTED,
    ACTION_SENT,
    ACTION_TYPED,
};
