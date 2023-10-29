import {ClientEvent} from '@udemy/event-tracking';

class DirectMessageActionEvent extends ClientEvent {
    constructor(action, filterCriteria, queryText) {
        super('DirectMessageActionEvent');
        this.action = action;
        this.filterCriteria = filterCriteria;
        this.queryText = queryText;
    }
}

class DirectMessageComposeActionEvent extends ClientEvent {
    constructor(action) {
        super('DirectMessageComposeActionEvent');
        this.action = action;
    }
}

class DirectMessageNewThreadActionEvent extends ClientEvent {
    constructor(action, recipientId, messageText, isRecipientOptIn) {
        super('DirectMessageNewThreadActionEvent');
        this.action = action;
        this.recipientId = recipientId;
        this.messageText = messageText;
        this.isRecipientOptIn = isRecipientOptIn;
    }
}

class DirectMessageThreadActionEvent extends ClientEvent {
    constructor(action, threadId, recipientId, messageText, isRecipientOptIn) {
        super('DirectMessageThreadActionEvent');
        this.action = action;
        this.threadId = threadId;
        this.recipientId = recipientId;
        this.messageText = messageText;
        this.isRecipientOptIn = isRecipientOptIn;
    }
}

class DirectMessageQAModalActionEvent extends ClientEvent {
    constructor(action, courseId) {
        super('DirectMessageQAModalActionEvent');
        this.action = action;
        this.courseId = courseId;
    }
}

class DirectMessageSettingActionEvent extends ClientEvent {
    constructor(action, name, value) {
        super('DirectMessageSettingActionEvent');
        this.action = action;
        this.name = name;
        this.value = value;
    }
}

class InstructorBannerActionEvent extends ClientEvent {
    constructor(action, messageType, page) {
        super('InstructorBannerActionEvent');
        this.action = action;
        this.messageType = messageType;
        this.page = page;
    }
}

class InstructorBannerViewEvent extends ClientEvent {
    constructor(messageType, page) {
        super('InstructorBannerViewEvent');
        this.messageType = messageType;
        this.page = page;
    }
}

export class DirectMessageSent extends ClientEvent {
    constructor(userMode, recipientId, threadId) {
        super('DirectMessageSent');
        this.userMode = userMode;
        this.recipientId = recipientId;
        this.threadId = threadId;
    }
}

export const DIRECT_MESSAGING_EVENTS = Object.freeze({
    DirectMessageActionEvent: 'DirectMessageActionEvent',
    DirectMessageComposeActionEvent: 'DirectMessageComposeActionEvent',
    DirectMessageQAModalActionEvent: 'DirectMessageQAModalActionEvent',
    DirectMessageNewThreadActionEvent: 'DirectMessageNewThreadActionEvent',
    DirectMessageThreadActionEvent: 'DirectMessageThreadActionEvent',
    DirectMessageSettingActionEvent: 'DirectMessageSettingActionEvent',
    InstructorBannerViewEvent: 'InstructorBannerViewEvent',
    InstructorBannerActionEvent: 'InstructorBannerActionEvent',
});

export {
    DirectMessageActionEvent,
    DirectMessageComposeActionEvent,
    DirectMessageNewThreadActionEvent,
    DirectMessageThreadActionEvent,
    DirectMessageQAModalActionEvent,
    DirectMessageSettingActionEvent,
    InstructorBannerActionEvent,
    InstructorBannerViewEvent,
};
