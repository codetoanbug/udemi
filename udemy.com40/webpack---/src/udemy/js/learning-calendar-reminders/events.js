import {ClientEvent} from '@udemy/event-tracking';

import {DJANGO_CONTENT_TYPE_COURSE} from './constants';

/**
This event is fired as a general-purpose click event for creating, updating, and deleting learning calendar reminders.

 !!IMPORTANT!! You should almost always trigger this event on keypress of enter/space to capture
 actions taken by keyboard users.

 e.g.
 <div onClick={this.handleAction} onKeyDown={onEnterAndSpace(this.handleAction)}>
*/
class LearningReminderActionEvent extends ClientEvent {
    constructor({
        reminderId,
        action,
        frequency,
        duration,
        until,
        title,
        linkedObjectType,
        linkedObjectId,
        calendarType,
    }) {
        super('LearningReminderActionEvent');

        let courseId = null;
        if (linkedObjectType === DJANGO_CONTENT_TYPE_COURSE && linkedObjectId) {
            courseId = linkedObjectId;
        }

        this.reminderId = reminderId;
        this.action = action;
        this.frequency = frequency;
        this.duration = duration;
        this.until = until;
        this.title = title;
        this.linkedObjectType = linkedObjectType;
        this.linkedObjectId = linkedObjectId;
        this.courseId = courseId;
        this.calendarType = calendarType;
    }
}

export default LearningReminderActionEvent;
