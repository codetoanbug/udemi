import {Tracker} from '@udemy/event-tracking';

import {
    DirectMessageComposeActionEvent,
    DirectMessageQAModalActionEvent,
    DirectMessageNewThreadActionEvent,
    DirectMessageActionEvent,
    DirectMessageThreadActionEvent,
    DirectMessageSettingActionEvent,
    DIRECT_MESSAGING_EVENTS,
    InstructorBannerViewEvent,
    InstructorBannerActionEvent,
} from './events';

class DirectMessageEventTracker {
    track(eventName, action, extra = {}) {
        switch (eventName) {
            case DIRECT_MESSAGING_EVENTS.DirectMessageActionEvent:
                Tracker.publishEvent(
                    new DirectMessageActionEvent(action, extra.filterCriteria, extra.queryText),
                );
                break;
            case DIRECT_MESSAGING_EVENTS.DirectMessageComposeActionEvent:
                Tracker.publishEvent(new DirectMessageComposeActionEvent(action));
                break;
            case DIRECT_MESSAGING_EVENTS.DirectMessageQAModalActionEvent:
                Tracker.publishEvent(new DirectMessageQAModalActionEvent(action, extra.courseId));
                break;
            case DIRECT_MESSAGING_EVENTS.DirectMessageNewThreadActionEvent:
                Tracker.publishEvent(
                    new DirectMessageNewThreadActionEvent(
                        action,
                        extra.recipientId,
                        extra.messageText,
                        extra.isRecipientOptIn,
                    ),
                );
                break;
            case DIRECT_MESSAGING_EVENTS.DirectMessageThreadActionEvent:
                Tracker.publishEvent(
                    new DirectMessageThreadActionEvent(
                        action,
                        extra.threadId,
                        extra.recipientId,
                        extra.messageText,
                        extra.isRecipientOptIn,
                    ),
                );
                break;
            case DIRECT_MESSAGING_EVENTS.DirectMessageSettingActionEvent:
                Tracker.publishEvent(
                    new DirectMessageSettingActionEvent(action, extra.name, extra.value),
                );
                break;
            case DIRECT_MESSAGING_EVENTS.InstructorBannerViewEvent:
                Tracker.publishEvent(new InstructorBannerViewEvent(extra.messageType, extra.page));
                break;
            case DIRECT_MESSAGING_EVENTS.InstructorBannerActionEvent:
                Tracker.publishEvent(
                    new InstructorBannerActionEvent(action, extra.messageType, extra.page),
                );
                break;
            default:
                break;
        }
    }
}

export default new DirectMessageEventTracker();
