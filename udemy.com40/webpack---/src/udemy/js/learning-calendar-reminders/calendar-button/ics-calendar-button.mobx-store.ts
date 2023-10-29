import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable, runInAction} from 'mobx';

import {toLabTaking} from 'labs/utils';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import udLink from 'utils/ud-link';

import {DJANGO_CONTENT_TYPE_COURSE, DJANGO_CONTENT_TYPE_LAB} from '../constants';
import LearningReminderActionEvent from '../events';
import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {CalendarReminderType, UserLearningCalendarReminderType} from '../types';
import {formatVTimezone} from './vtimezone';

export class IcsCalendarButtonStore {
    @observable errorMessage = null;
    @observable isLoading = false;
    @observable downloadSucceeded = false;
    @observable downloadFailed = false;
    constructor(
        action: string,
        formStore: LearningReminderFormStore,
        learningToolsStore: LearningToolsStore,
        onComplete: () => void,
        calendarType?: string | null,
    ) {
        this.action = action;
        this.calendarType = calendarType;
        this.formStore = formStore;
        this.learningToolsStore = learningToolsStore;
        this.onComplete = onComplete;
    }

    action: string;
    private formStore: LearningReminderFormStore;
    calendarType: string | null | undefined;
    private learningToolsStore: LearningToolsStore;
    private onComplete: () => void;
    calendarReminder: CalendarReminderType | undefined;

    getButtonText() {
        switch (this.action) {
            case 'update':
                return gettext('Download and update');
            case 'delete':
                return gettext('Download and delete');
            case 'redownload':
                return gettext('Download');
            default:
                return this._getAddButtonText();
        }
    }

    _getAddButtonText() {
        if (!this.calendarType) {
            return gettext('Add to calendar');
        }

        switch (this.calendarType.toLowerCase()) {
            case 'apple':
                return gettext('Apple');
            case 'outlook':
                return gettext('Outlook');
            case 'other':
                return gettext('Download event');
            default:
                return gettext('Add to calendar');
        }
    }

    @action
    handleCalendarEvents() {
        this.downloadFailed = false;
        this.downloadSucceeded = false;
        this.isLoading = true;
        this.calendarReminder = this.formStore.getCalendarReminder();
        this.sendTrackingEvent();

        if (this.action === 'create') {
            this._createEvent();
        } else if (this.action === 'update' || this.action === 'redownload') {
            this._updateEvent();
        } else if (this.action === 'delete') {
            this._deleteEvent();
        }
    }

    @autobind
    async _createEvent() {
        try {
            const response = await udApi.post('/users/me/learning-calendar-reminders/', {
                title: this.calendarReminder?.title,
                start_time: this.calendarReminder?.startTime,
                end_time: this.calendarReminder?.endTime,
                frequency: this.calendarReminder?.frequency,
                by_day: this.calendarReminder?.byDay,
                by_month_day: this.calendarReminder?.byMonthDay,
                by_week_num: this.calendarReminder?.byWeekNum,
                until: this.calendarReminder?.until,
                content_type: this.calendarReminder?.contentType,
                object_id: this.calendarReminder?.objectId,
                notification_method: this.calendarReminder?.notificationMethod,
                notification_time_before: this.calendarReminder?.notificationTimeBefore,
                calendar_type: this.calendarType,
                sequence: 0,
            });
            this._downloadIcs(response.data, true);
            this.formStore.setDownloaded(true);
            this.formStore.setCalendarType(this.calendarType);
            runInAction(() => {
                this.downloadSucceeded = true;
                this.downloadFailed = false;
            });

            this.resetValidation();
            this.onComplete();
            this.reloadLearningTools();
        } catch (error) {
            this.handleError(error.response?.data?.detail || defaultErrorMessage);
        }

        runInAction(() => {
            this.isLoading = false;
        });
    }

    async _updateEvent() {
        try {
            const response = await udApi.put(
                `/users/me/learning-calendar-reminders/${this.formStore.reminderId}/`,
                {
                    title: this.calendarReminder?.title,
                    start_time: this.calendarReminder?.startTime,
                    end_time: this.calendarReminder?.endTime,
                    frequency: this.calendarReminder?.frequency,
                    by_day: this.calendarReminder?.byDay ?? null,
                    by_month_day: this.calendarReminder?.byMonthDay,
                    by_week_num: this.calendarReminder?.byWeekNum,
                    until: this.calendarReminder?.until,
                    content_type: this.calendarReminder?.contentType,
                    object_id: this.calendarReminder?.objectId,
                    notification_method: this.calendarReminder?.notificationMethod,
                    notification_time_before: this.calendarReminder?.notificationTimeBefore,
                    calendar_type: this.calendarReminder?.calendarType ?? this.calendarType,
                },
            );

            this._downloadIcs(response.data, false);
            runInAction(() => {
                this.downloadSucceeded = true;
                this.downloadFailed = false;
            });

            this.onComplete();
            this.reloadLearningTools();
        } catch (error) {
            this.handleError(error.response?.data?.detail || defaultErrorMessage);
        }

        runInAction(() => {
            this.isLoading = false;
        });
    }

    async _deleteEvent() {
        try {
            const response = await udApi.patch(
                `/users/me/learning-calendar-reminders/${this.formStore.reminderId}/`,
                {
                    is_deleted: true,
                    calendar_type: this.calendarType,
                },
            );

            this._downloadIcs(response.data, false);
            this.onComplete();
            this.reloadLearningTools();
        } catch (error) {
            this.handleError(error.response?.data?.detail || defaultErrorMessage);
        }

        runInAction(() => {
            this.isLoading = false;
        });
    }

    _downloadIcs(data: UserLearningCalendarReminderType, isCreating: boolean) {
        const icsData = this._generateIcs(data, isCreating);

        let filename = data.title.replace(/[^a-zA-Z ]+/g, '');
        filename = filename.replace(/\s+/g, '-').toLowerCase();

        const element = document.createElement('a');
        element.setAttribute(
            'href',
            `data:text/calendar;charset=utf-8,${encodeURIComponent(icsData)}`,
        );
        element.setAttribute('download', `${filename}.ics`);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    _getCalendarInfo(data: UserLearningCalendarReminderType) {
        return `BEGIN:VEVENT
ORGANIZER;CN="Udemy":mailto:no-reply@udemy.com
SUMMARY:${data.title}
SEQUENCE:${data.sequence}
DTSTAMP:${this._getModifiedTime()}
DTSTART${this._getTimezone()}:${this._reformatTime(data.start_time)}
DTEND${this._getTimezone()}:${this._reformatTime(data.end_time)}
UID:${data.id}
${this._getRrule(data)}
DESCRIPTION:${this._getDescription(data.content_type, data.object_title, data.object_url)}
${this._getCancelledStatus(data.is_deleted)}
${this._getNotification(data.notification_time_before, data.title)}
END:VEVENT`;
    }

    /* iCalendar Object defination: https://datatracker.ietf.org/doc/html/rfc5545#section-3.4
       .ics file validator: https://icalendar.org/validator.html
     */
    _generateIcs(data: UserLearningCalendarReminderType, isCreating: boolean) {
        const calendarHeader = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//udemy.com//Udemy
METHOD:${isCreating ? 'PUBLISH' : 'REQUEST'}`;
        const calendarFooter = 'END:VCALENDAR';
        const timezoneInfo = formatVTimezone();
        const calendarInfo = this._getCalendarInfo(data);
        return `${calendarHeader}\n${timezoneInfo}${calendarInfo}\n${calendarFooter}`;
    }

    _getTimezone() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timezone ? `;TZID=${timezone}` : '';
    }

    _getRrule(data: UserLearningCalendarReminderType) {
        if (data.frequency.toUpperCase() === 'ONCE') {
            return '';
        }

        return `RRULE:FREQ=${data.frequency.toUpperCase()};${this._getByDay(
            data.by_day,
        )}${this._getByMonthDay(data.by_month_day)}${this._getByWeekNum(
            data.by_week_num,
        )}${this._getUntil(this._reformatTime(data.until))}`;
    }

    _getDescription(
        contentType: string | null,
        objectTitle: string | null,
        objectUrl: string | null,
    ) {
        if (contentType === DJANGO_CONTENT_TYPE_COURSE) {
            const courseTakingUrl = udLink.toCourseTaking(objectUrl, '', {});
            return `${objectTitle} (${courseTakingUrl})`;
        }
        if (contentType === DJANGO_CONTENT_TYPE_LAB) {
            const labTakingUrl = toLabTaking(objectUrl, '', {});
            return `${objectTitle} (${labTakingUrl})`;
        }
        return '';
    }

    _getByDay(byDay: string | null) {
        return byDay ? `BYDAY=${byDay};` : '';
    }

    _getByMonthDay(byMonthDay: number | null) {
        return byMonthDay ? `BYMONTHDAY=${byMonthDay};` : '';
    }

    _getByWeekNum(byWeekNum: number | null) {
        return byWeekNum ? `BYSETPOS=${byWeekNum};` : '';
    }

    _getUntil(until: string | null) {
        return until ? `UNTIL=${until.substring(0, 15)}Z` : '';
    }

    _reformatTime(time: string | null) {
        return time ? time.replace(/[^a-z0-9]/gi, '') : null;
    }

    _getCancelledStatus(isDeleted: boolean) {
        return isDeleted ? 'STATUS:CANCELLED' : '';
    }

    _getNotification(timeBefore: number, title: string) {
        if (timeBefore) {
            return `BEGIN:VALARM
TRIGGER:-PT${timeBefore}M
ACTION:DISPLAY
DESCRIPTION:${title}
END:VALARM`;
        }

        return '';
    }

    _getModifiedTime() {
        let dateString = new Date().toISOString();
        dateString = `${dateString.substr(0, 19).replace(/[^a-z0-9]/gi, '')}Z`;
        return dateString;
    }

    @action
    handleError(note: string | null) {
        this.formStore.downloadErrorNote = note;
        this.formStore.downloadValidationState = 'error';

        runInAction(() => {
            this.downloadSucceeded = false;
            this.downloadFailed = true;
        });
    }

    @action
    resetValidation() {
        this.formStore.downloadValidationState = 'neutral';
        this.formStore.downloadErrorNote = null;
    }

    reloadLearningTools() {
        this.learningToolsStore?.loadLearningCalendarReminders();
    }

    sendTrackingEvent() {
        Tracker.publishEvent(
            new LearningReminderActionEvent({
                reminderId: this.calendarReminder?.id,
                action: this.action === 'redownload' ? 'update' : this.action,
                frequency: this.calendarReminder?.frequency,
                duration: this.calendarReminder?.duration,
                until: this.calendarReminder?.until,
                title: this.calendarReminder?.title,
                linkedObjectType: this.calendarReminder?.contentType,
                linkedObjectId: this.calendarReminder?.objectId,
                calendarType: this.calendarType === 'other' ? 'not_specified' : this.calendarType,
            }),
        );
    }
}
