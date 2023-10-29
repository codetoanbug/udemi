import {ClientEvent} from '@udemy/event-tracking';

import {
    LearningReminderCalendarType,
    LearningReminderDayName,
    LearningReminderFrequency,
    LearningReminderNotificationType,
} from 'learning-calendar-reminders/constants';

/**
    This event is fired when a student creates a Learning Reminder to notify them periodically to study.
    Event schema source: https://github.com/udemy/schema-store/blob/master/events/v2/LearningReminderCreated.avdl
 */
export class LearningReminderCreated extends ClientEvent {
    /**
    The times of the day at which the Learning Reminder is scheduled.
    Each time should be formatted without leading zero and with AM/PM .g. "9:00 AM" or "12:00 PM"
    Each time should be in the user's local timezone.
    */
    scheduledTimes: Array<string>;
    /**
    If weekly, the days on which the Learning Reminder is scheduled.
    Should be empty if the frequency is not weekly and no days were selected.
    */
    scheduledDays: Array<LearningReminderDayName>;

    /**
    The frequency of the Learning Reminder.
    The current location options available are:
     - "once"
     - "daily"
     - "weekly"
     - "monthly"
    */
    frequency: LearningReminderFrequency;
    /**
    The duration of the Learning Reminder in minutes.
    Can be null if the Learning Reminder has no duration (e.g. on native iOS).
    */
    duration: number | null;
    /**
    The end date of the Learning Reminder.
    Can be null if the student does not select an end date.
    */
    endDate: string | null;
    /**
    The type of the learning object that this Learning Reminder references.
    The current linkedObjectTypes are:
     - "course"
     - "lab"
    Can be null if the user does not select an object to link to.
    */
    linkedObjectType: 'course' | 'lab' | null;
    /**
    The id of the learning object that this Learning Reminder references.
    Can be null if the user does not select an object to link to.
    */
    linkedObjectId: number | null;
    /**
    This field represents the calendar type of the learning reminder.
    The current calendar type options available are:
     - "google"
     - "apple"
     - "outlook"
     - "other"
    Can be null if the user does not select a calendar type, or if the learning reminder is created as a push notification on native mobile.
    */
    calendarType: LearningReminderCalendarType | string;
    /**
    The type of reminder created, whether calendar event or push notification.
     - "push": the learning reminder is a push notification
     - "calendar": the learning reminder is a calendar event
    */
    notificationType: LearningReminderNotificationType;
    constructor(
        scheduledTimes: Array<string>,
        scheduledDays: Array<LearningReminderDayName>,
        frequency: LearningReminderFrequency,
        duration: number | null,
        endDate: string | null,
        linkedObjectType: 'course' | 'lab' | null,
        linkedObjectId: number | null,
        calendarType: LearningReminderCalendarType | string,
        notificationType: LearningReminderNotificationType,
    ) {
        super('LearningReminderCreated');
        this.scheduledTimes = scheduledTimes;
        this.scheduledDays = scheduledDays;
        this.frequency = frequency;
        this.duration = duration;
        this.endDate = endDate;
        this.linkedObjectType = linkedObjectType;
        this.linkedObjectId = linkedObjectId;
        this.calendarType = calendarType;
        this.notificationType = notificationType;
    }
}
