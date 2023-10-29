import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable, runInAction} from 'mobx';

import udApi, {defaultErrorMessage} from 'utils/ud-api';

import LearningReminderActionEvent from '../events';
import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {CalendarReminderType} from '../types';
import {GoogleCalendarAuthStore} from './google-calendar-auth.mobx-store';

export class GoogleCalendarButtonStore {
    @observable isAuthenticating = false;
    @observable isLoading = false;
    @observable downloadSucceeded = false;
    @observable downloadFailed = false;

    isAddedToCalendar = false;
    readonly calendarType = 'google';
    authenticationError = gettext('Authentication failed. Please try again.');
    updateErrorMessage = gettext(
        'There was a problem editing your event. Try again later or try using a different Google account.',
    );

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    readonly scopes = 'https://www.googleapis.com/auth/calendar.events';

    constructor(
        action: string,
        googleAuthStore: GoogleCalendarAuthStore,
        formStore: LearningReminderFormStore,
        learningToolsStore: LearningToolsStore,
        onComplete: () => void,
    ) {
        this.action = action;
        this.googleAuthStore = googleAuthStore;
        this.formStore = formStore;
        this.learningToolsStore = learningToolsStore;
        this.onComplete = onComplete;
    }

    action: string;
    googleAuthStore: GoogleCalendarAuthStore;
    private formStore: LearningReminderFormStore;
    private learningToolsStore: LearningToolsStore;
    private readonly onComplete: () => void;
    calendarReminder: CalendarReminderType | undefined;

    getButtonText() {
        switch (this.action) {
            case 'delete':
                return gettext('Delete');
            case 'redownload':
                return gettext('Sync again');
            default:
                return this.googleAuthStore.accessToken
                    ? gettext('Google')
                    : gettext('Sign in with Google');
        }
    }

    @action
    handleClick() {
        this.isLoading = true;
        this.isAuthenticating = true;

        this.calendarReminder = this.formStore.getCalendarReminder();

        if (!this.googleAuthStore.accessToken) {
            this.validateToken().then(() => {
                this.handleCalendarEvents();
            });
        } else {
            this.handleCalendarEvents();
        }
    }

    async validateToken() {
        await new Promise((resolve, reject) => {
            try {
                // Settle this promise in the response callback for requestAccessToken()
                this.googleAuthStore.tokenClient.callback = (resp: any) => {
                    if (resp.error !== undefined) {
                        if (resp.error === 'access_denied') {
                            this.handleError(gettext('Access denied. Please try again.'));
                        } else {
                            this.handleError(this.authenticationError);
                        }
                        reject(resp);
                    }
                    this.googleAuthStore.updateAccessToken(resp);
                    resolve(resp);
                };
                this.googleAuthStore.tokenClient.error_callback = (err: any) => {
                    if (err.type == 'popup_failed_to_open') {
                        this.handleError(gettext('Access denied. Please try again.'));
                    } else if (err.type == 'popup_closed') {
                        this.handleError(gettext('Google sign-in popup closed. Please try again.'));
                    }
                    reject(err);
                };
                this.googleAuthStore.tokenClient.requestAccessToken();
            } catch (err) {
                this.handleError(gettext('Access denied. Please try again.'));
            }
        });
    }

    @autobind
    @action
    handleCalendarEvents() {
        this.sendTrackingEvent();
        this.isAuthenticating = false;

        if (
            this.googleAuthStore.accessToken?.access_token &&
            this.googleAuthStore.accessToken?.expires_in &&
            this.googleAuthStore.accessToken?.scope?.includes('calendar.events')
        ) {
            if (this.action === 'create') {
                if (!this.isAddedToCalendar) {
                    this._createEvent({
                        access_token: this.googleAuthStore.accessToken.access_token,
                        expires_in: this.googleAuthStore.accessToken.expires_in,
                    });
                }
            } else if (this.action === 'update' || this.action === 'redownload') {
                this._updateEvent({
                    access_token: this.googleAuthStore.accessToken.access_token,
                    expires_in: this.googleAuthStore.accessToken.expires_in,
                });
            } else if (this.action === 'delete') {
                this._deleteEvent({
                    access_token: this.googleAuthStore.accessToken.access_token,
                    expires_in: this.googleAuthStore.accessToken.expires_in,
                });
            }
        } else {
            this.handleError(this.authenticationError);
        }
    }

    @autobind
    async _createEvent(tokenResponse: {access_token: string; expires_in: number}) {
        try {
            await udApi.post('/users/me/learning-calendar-reminders/', {
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
                access_token: tokenResponse.access_token,
                expires_at: tokenResponse.expires_in,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
            this.isAddedToCalendar = true;
            this.formStore.setDownloaded(true);
            this.formStore.setCalendarType(this.calendarType);
            runInAction(() => {
                this.downloadSucceeded = true;
                this.downloadFailed = false;
            });

            this.resetValidation();
            this.reloadLearningTools();
        } catch (error) {
            this.handleError(error.response?.data?.detail || defaultErrorMessage);
        }

        runInAction(() => {
            this.isLoading = false;
        });
    }

    @autobind
    async _updateEvent(tokenResponse: {access_token: string; expires_in: number}) {
        try {
            await udApi.put(`/users/me/learning-calendar-reminders/${this.formStore.reminderId}/`, {
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
                calendar_type: this.calendarType,
                access_token: tokenResponse.access_token,
                expires_at: tokenResponse.expires_in,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
            this.handleUpdate();
            this.onComplete();
            this.reloadLearningTools();
        } catch (error) {
            const errorDetail = error.response?.data?.detail;
            const errorMessage =
                errorDetail === 'Internal server error.' ? this.updateErrorMessage : errorDetail;
            this.handleError(errorMessage);
        }

        runInAction(() => {
            this.isLoading = false;
        });
    }

    @autobind
    async _deleteEvent(tokenResponse: {access_token: string; expires_in: number}) {
        try {
            await udApi.patch(
                `/users/me/learning-calendar-reminders/${this.formStore.reminderId}/`,
                {
                    is_deleted: true,
                    calendar_type: this.calendarType,
                    access_token: tokenResponse.access_token,
                    expires_at: tokenResponse.expires_in,
                },
            );
            this.reloadLearningTools();
        } catch (error) {
            const errorDetail = error.response?.data?.detail;
            const errorMessage =
                errorDetail === 'Internal server error.' ? this.updateErrorMessage : errorDetail;
            this.handleError(errorMessage);
        }

        runInAction(() => {
            this.isLoading = false;
        });
    }

    @action
    handleError(note: string | null) {
        this.formStore.downloadErrorNote = note;
        this.formStore.downloadValidationState = 'error';
        this.reloadLearningTools();

        this.downloadSucceeded = false;
        this.downloadFailed = true;
    }

    @action
    handleUpdate() {
        this.formStore.downloadErrorNote = gettext('Updated event in Google Calendar.');
        this.formStore.downloadValidationState = 'neutral';

        this.downloadSucceeded = true;
        this.downloadFailed = false;
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
                calendarType: 'google',
            }),
        );
    }
}
