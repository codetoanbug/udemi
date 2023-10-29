import {Tracker} from '@udemy/event-tracking';
import {ValidationState} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import loadCommonAppContext from 'common/load-common-app-context';
import serverOrClient from 'utils/server-or-client';
import udApi from 'utils/ud-api';

import {GoogleCalendarAuthStore} from '../calendar-button/google-calendar-auth.mobx-store';
import {
    BY_DAYS,
    COURSE_OPTION_PAGE_SIZE,
    custom,
    DJANGO_CONTENT_TYPE_COURSE,
    ERROR,
    FULL_DAY_NAME,
    HOURS,
    LearningReminderDayName,
    MINUTES,
    missingRequiredText,
    MONTH_OPTION,
    NEUTRAL,
    never,
    REMINDER_DETAILS_STEP,
    REMINDER_DOWNLOAD_STEP,
    REMINDER_NAME_STEP,
    until,
} from '../constants';
import {LearningReminderCreated} from '../events-v2';
import {CourseType, Params, UserLearningCalendarReminderType} from '../types';
import {uppercaseFirstChar} from '../utils';

export class LearningReminderFormStore {
    @observable currentStep = 0;

    @observable calendarType: string | null = null;
    @observable downloadErrorNote: string | null = null;
    @observable downloadValidationState: ValidationState = null;
    @observable isDownloaded = false;
    @observable clickedUpdateGoogle = false;
    @observable isConsumerSubsSubscriber: boolean | null = null;

    @observable courseOptions: CourseType[] | null = null;

    defaultFormFields = {
        title: {value: gettext('Time to learn!')},
        selectedContentObject: {
            value: {
                id: null,
                title: null,
                url: null,
            },
            contentType: null,
            validationState: NEUTRAL,
            note: null,
        },
        frequency: {value: null, validationState: NEUTRAL, note: null},
        onceDate: {value: null, validationState: NEUTRAL, note: null},
        selectedDays: {value: new Array(7).fill(false), validationState: NEUTRAL, note: null},
        monthDate: {value: null, validationState: NEUTRAL, note: null},
        selectedMonthOption: {value: null, validationState: NEUTRAL, note: null},
        selectedMonthOptionText: {value: null},
        monthDay: {value: null, validationState: NEUTRAL, note: null},
        weekNum: {value: null, validationState: NEUTRAL, note: null},
        duration: {value: null, validationState: NEUTRAL, note: null},
        customDuration: {value: '', validationState: NEUTRAL, note: null},
        customDurationUnit: {value: MINUTES},
        startTime: {value: '12:00', validationState: NEUTRAL, note: null},
        startDatetime: {value: null},
        endTime: {value: null},
        untilDate: {value: null, validationState: NEUTRAL, note: null},
        untilSelected: {value: never(), validationState: NEUTRAL, note: null},
        reminderType: {value: 'popup'},
        reminderTime: {value: 30, validationState: NEUTRAL, note: null},
        reminderTimeUnit: {value: 'minutes'},
    };

    @observable formFields = JSON.parse(JSON.stringify(this.defaultFormFields));

    @observable showOnceOption = false;
    @observable showWeeklyOptions = false;
    @observable showMonthlyOptions = false;
    @observable showMonthDayOrWeekOptions = false;
    @observable showCustomDuration = false;

    showCustomTimezone = false;

    currentDate = new Date();

    @observable showModal = false;

    googleAuthStore: GoogleCalendarAuthStore;
    readonly formSteps: string[];
    shouldRedirect: boolean;
    private readonly isUpdating: boolean;
    reminderId: number | null;
    disableReminderFields: boolean;
    reminderNote: string | null;

    constructor(
        googleAuthStore: GoogleCalendarAuthStore,
        shouldRedirect: boolean,
        isUpdating: boolean,
        reminderId: number | null,
        contentType?: string,
        objectId?: number,
        objectTitle?: string,
        objectUrl?: string,
        title?: string,
    ) {
        this.googleAuthStore = googleAuthStore;
        this.formSteps = [REMINDER_NAME_STEP, REMINDER_DETAILS_STEP, REMINDER_DOWNLOAD_STEP];
        this.shouldRedirect = shouldRedirect;
        this.isUpdating = isUpdating;
        this.isDownloaded = !!this.isUpdating;
        this.formFields.selectedContentObject.contentType =
            contentType ?? this.defaultFormFields.selectedContentObject.contentType;
        this.formFields.selectedContentObject.value.id =
            objectId ?? this.defaultFormFields.selectedContentObject.value.id;
        this.formFields.selectedContentObject.value.title =
            objectTitle ?? this.defaultFormFields.selectedContentObject.value.title;
        this.formFields.selectedContentObject.value.url =
            objectUrl ?? this.defaultFormFields.selectedContentObject.value.url;
        this.formFields.title.value = title ?? this.defaultFormFields.title.value;
        this.defaultFormFields.selectedContentObject.contentType = this.formFields.selectedContentObject.contentType;
        this.defaultFormFields.selectedContentObject.value.id = this.formFields.selectedContentObject.value.id;
        this.defaultFormFields.selectedContentObject.value.url = this.formFields.selectedContentObject.value.url;
        this.defaultFormFields.selectedContentObject.value.title = this.formFields.selectedContentObject.value.title;
        this.defaultFormFields.title.value = this.formFields.title.value;
        this.reminderId = reminderId;
        this.disableReminderFields = false;
        this.reminderNote = gettext('Email notifications only work with Google Calendar.');
    }

    @computed
    get showCourseSelect() {
        const {contentType} = this.formFields?.selectedContentObject;
        return !contentType || contentType === 'course';
    }

    /**
     * Sets form fields from existing learning reminder.
     *
     * @param learningReminder Existing learning reminder
     */
    @action
    setFormFields(learningReminder: UserLearningCalendarReminderType) {
        const startDatetime = new Date(learningReminder.start_time);
        const hour = startDatetime.getHours();
        const startTime = `${this.toDoubleDigits(hour)}:${this.toDoubleDigits(
            startDatetime.getMinutes(),
        )}`;

        const durationInMS =
            new Date(learningReminder.end_time).getTime() -
            new Date(learningReminder.start_time).getTime();
        const durationInMin = Math.floor(durationInMS / 1000 / 60);
        let duration;
        let customDuration = null;
        let customDurationUnit = MINUTES;

        const durations = [5, 10, 20, 30, 60];
        if (durations.includes(durationInMin)) {
            duration = durationInMin.toString();
        } else {
            duration = custom();
            this.showCustomDuration = true;
            if (durationInMin % 60 === 0) {
                customDurationUnit = HOURS;
                customDuration = durationInMin / 60;
            } else {
                customDuration = durationInMin;
            }
        }

        this.showOnceOption = learningReminder.frequency.toUpperCase() === 'ONCE';
        this.showWeeklyOptions = learningReminder.frequency.toUpperCase() === 'WEEKLY';
        this.showMonthlyOptions = learningReminder.frequency.toUpperCase() === 'MONTHLY';

        this.formFields = {
            title: {value: learningReminder.title ?? gettext('Time to learn!')},
            selectedContentObject: {
                value: {
                    id: learningReminder.object_id,
                    title: learningReminder.object_title,
                    url: learningReminder.object_url,
                },
                contentType: learningReminder.content_type,
                validationState: NEUTRAL,
                note: null,
            },
            frequency: {
                value: learningReminder.frequency.toUpperCase(),
                validationState: NEUTRAL,
                note: null,
            },
            onceDate: {
                value: learningReminder.start_time ? new Date(learningReminder.start_time) : null,
                validationState: NEUTRAL,
                note: null,
            },
            selectedDays: {value: new Array(7).fill(false), validationState: NEUTRAL, note: null},
            monthDate: {value: null, validationState: NEUTRAL, note: null},
            selectedMonthOption: {value: null, validationState: NEUTRAL, note: null},
            selectedMonthOptionText: {value: null},
            monthDay: {value: learningReminder.by_month_day, validationState: NEUTRAL, note: null},
            weekNum: {value: learningReminder.by_week_num, validationState: NEUTRAL, note: null},
            duration: {value: duration, validationState: NEUTRAL, note: null},
            customDuration: {value: customDuration, validationState: NEUTRAL, note: null},
            customDurationUnit: {value: customDurationUnit},
            startTime: {value: startTime, validationState: NEUTRAL, note: null},
            startDatetime: {value: new Date(learningReminder.start_time)},
            endTime: {value: null},
            untilDate: {
                value: learningReminder.until ? new Date(learningReminder.until) : null,
                validationState: NEUTRAL,
                note: null,
            },
            untilSelected: {
                value: learningReminder.until ? until() : never(),
                validationState: NEUTRAL,
                note: null,
            },
            reminderType: {value: 'popup'},
            reminderTime: {
                value: 30,
                validationState: NEUTRAL,
                note: null,
            },
            reminderTimeUnit: {value: 'minutes'},
        };

        this.calendarType = learningReminder.calendar_type;
        this.disableReminderFields = !!(this.calendarType && this.calendarType !== 'google');
        this.reminderNote = this.disableReminderFields
            ? interpolate(
                  gettext(
                      'To update your reminder, open this event in the %(calendarType)s Calendar app.',
                  ),
                  {calendarType: uppercaseFirstChar(this.calendarType)},
                  true,
              )
            : null;

        if (learningReminder.frequency.toLowerCase() === 'once') {
            this.formFields.onceDate.value = new Date(learningReminder.start_time);
        }

        if (learningReminder.frequency.toLowerCase() === 'weekly' && learningReminder.by_day) {
            this.setSelectedDays(learningReminder.by_day);
        }

        if (learningReminder.notification_method && learningReminder.notification_time_before) {
            this.setNotification(
                learningReminder.notification_method,
                learningReminder.notification_time_before,
            );
        }
    }

    /**
     * Sets the selected days from an existing byDay entry.
     *
     * @param byDay Days in format 'SU,MO,TU,WE,TH,FR,SA'
     */
    setSelectedDays(byDay: string) {
        const days = byDay.split(',');
        this.formFields.selectedDays.value.fill(false);
        days.forEach((day) => {
            switch (day) {
                case 'SU':
                    this.formFields.selectedDays.value[0] = true;
                    break;
                case 'MO':
                    this.formFields.selectedDays.value[1] = true;
                    break;
                case 'TU':
                    this.formFields.selectedDays.value[2] = true;
                    break;
                case 'WE':
                    this.formFields.selectedDays.value[3] = true;
                    break;
                case 'TH':
                    this.formFields.selectedDays.value[4] = true;
                    break;
                case 'FR':
                    this.formFields.selectedDays.value[5] = true;
                    break;
                case 'SA':
                    this.formFields.selectedDays.value[6] = true;
                    break;
            }
        });
    }

    /**
     * Resets page to 0 and sets form fields back to default values.
     */
    @autobind
    @action
    resetForm() {
        this.currentStep = 0;
        this.formFields = JSON.parse(JSON.stringify(this.defaultFormFields));
        this.setDownloaded(false);
        this.setCalendarType(null);
    }

    /**
     * Opens learning reminder form.
     */
    @autobind
    @action
    openModal() {
        this.currentStep = 0;
        this.showModal = true;
    }

    /**
     * Closes learning reminder form.
     */
    @autobind
    @action
    closeModal() {
        this.showModal = false;
    }

    /**
     * This method is triggered when the user clicks Done at the end of the reminder form.
     * If the reminder wasn't downloaded yet, it will prompt the user to choose a calendar type.
     * Otherwise it will reset and close the modal, and redirect as needed.
     */
    @action
    onComplete() {
        if (!this.isDownloaded) {
            this.downloadValidationState = ERROR;
            this.downloadErrorNote = gettext('Choose your calendar to save your event.');
        } else {
            /**
             *  Fire created event. The reminder is only considered created
             *  once the reminder has been created, downloaded, and the modal is being closed
             *  from "Done"
             */
            const learningEvent = new LearningReminderCreated(
                [this.convertTimeStringTo12Hour(this.formFields.startTime.value)],
                this.getDayNames(this.formFields.selectedDays.value), // convert from array of true false
                this.formFields.frequency?.value?.toLowerCase(),
                Number(this.formFields?.duration?.value),
                this.formFields?.endTime?.value,
                this.formFields?.selectedContentObject?.contentType,
                this.formFields?.selectedContentObject?.value?.id,
                this.calendarType ? this.calendarType : 'other',
                this.formFields.reminderType.value === 'popup'
                    ? 'push'
                    : this.formFields.reminderType.value, // popup is push in event
            );
            Tracker.publishEvent(learningEvent);
            if (this.isUpdating) {
                this.currentStep = 0;
                this.closeModal();
                return;
            }

            if (!this.shouldRedirect) {
                this.closeModal();
                this.resetForm();
                return;
            }
            if ('location' in serverOrClient.global) {
                serverOrClient.global.location.href = '/home/my-courses/learning-tools';
            }
        }
    }

    /**
     * Sets downloaded status to true and resets validation state.
     *
     * @param downloaded
     */
    @action
    setDownloaded(downloaded: boolean) {
        this.isDownloaded = downloaded;
        this.downloadValidationState = 'neutral';
        this.downloadErrorNote = null;
    }

    @action
    setCalendarType(type: string | null | undefined) {
        this.calendarType = type ?? null;
    }

    /**
     * Sets value of specified field.
     *
     * @param fieldName Field to update
     * @param value Value
     */
    @action
    setFormFieldValue(fieldName: string, value: string) {
        this.formFields[fieldName].value = value;
    }

    @action
    setClickUpdateGoogle(clicked: boolean) {
        this.clickedUpdateGoogle = clicked;
    }

    /**
     * Sets current step to previous step unless at the beginning.
     */
    @autobind
    @action
    goBack() {
        if (this.clickedUpdateGoogle) {
            this.setClickUpdateGoogle(false);
        } else {
            this.currentStep = Math.max(this.currentStep - 1, 0);
        }
    }

    /**
     * Sets current step to next step. If the current step is the details page,
     * it will validate the form fields first.
     *
     * @returns {boolean} false if form fields are invalid
     */
    @autobind
    @action
    goForward() {
        if (this.formSteps[this.currentStep] === REMINDER_DETAILS_STEP) {
            if (!this.validateReminderDetails()) {
                return false;
            }
        }
        this.currentStep = Math.min(this.currentStep + 1, 2);
    }

    @autobind
    @action
    canGoBack() {
        return this.currentStep > 0;
    }

    @autobind
    canGoForward() {
        return this.currentStep < 2 && !this.clickedUpdateGoogle;
    }

    /**
     * Sets validation state of field to 'error'.
     * @param fieldName
     */
    @action
    setFormFieldError(fieldName: string) {
        this.formFields[fieldName].validationState = ERROR;
        this.formFields[fieldName].note = missingRequiredText();
    }

    /**
     * Resets validation state of field.
     * @param fieldName
     */
    @action
    resetFormField(fieldName: string) {
        this.formFields[fieldName].validationState = NEUTRAL;
        this.formFields[fieldName].note = null;
    }

    /**
     * Updates course information for radio selected course.
     *
     * @param id Course ID
     */
    @action
    updateCourse(id: number | string) {
        if (id !== 'none' && this.courseOptions !== null) {
            this.formFields.selectedContentObject.value.id = id;
            this.formFields.selectedContentObject.value.title = this.courseOptions.find(
                (course: CourseType) => course.id === id,
            )?.title;
            this.formFields.selectedContentObject.contentType = DJANGO_CONTENT_TYPE_COURSE;
        } else {
            this.formFields.selectedContentObject.value.id = null;
            this.formFields.selectedContentObject.value.title = null;
            this.formFields.selectedContentObject.contentType = null;
        }
    }

    /**
     * Updates course information for selected course in search.
     *
     * @param id Course ID
     * @param title Course title
     */
    @autobind
    @action
    updateCourseFromSearch(id: number, title: string) {
        this.formFields.selectedContentObject.value.id = id;
        this.formFields.selectedContentObject.value.title = title;
        this.formFields.selectedContentObject.contentType = DJANGO_CONTENT_TYPE_COURSE;
    }

    /**
     * Determines if weekly options or monthly options should be displayed, depending on the
     * frequency chosen.
     *
     * Also clears selected weekly/monthly options if a different frequency is selected.
     *
     * @param frequency
     */
    @action
    updateFrequency(frequency: string) {
        this.formFields.frequency.value = frequency;
        this.showOnceOption = frequency === 'ONCE';
        this.showWeeklyOptions = frequency === 'WEEKLY';
        this.showMonthlyOptions = frequency === 'MONTHLY';

        // Reset once date and start time
        this.formFields.onceDate.value = null;
        this.updateStartDatetime();
        this.resetFormField('onceDate');

        // Reset weekly selected days
        this.formFields.selectedDays.value = new Array(7).fill(false);
        this.resetFormField('selectedDays');

        // Reset monthly options
        this.formFields.monthDate.value = null;
        this.formFields.monthDay.value = null;
        this.formFields.weekNum.value = null;
        this.formFields.selectedMonthOption.value = null;
        this.formFields.selectedMonthOptionText.value = null;
        this.showMonthDayOrWeekOptions = false;
        this.resetFormField('selectedMonthOption');
    }

    /**
     * Updates date of reminder.
     *
     * @param selectedDate
     */
    @autobind
    @action
    updateOnceDate(selectedDate: Date | null) {
        this.formFields.onceDate.value = selectedDate;
        this.updateStartDatetime();
    }

    /**
     * Updates month date and clears selected monthly option.
     *
     * @param selectedDate
     */
    @autobind
    @action
    updateMonthDate(selectedDate: Date | null) {
        this.formFields.monthDate.value = selectedDate;
        this.formFields.selectedMonthOption.value = null;
        if (selectedDate) {
            this.showMonthDayOrWeekOptions = true;
        }
        this.updateStartDatetime();
    }

    /**
     * Updates month day or monthly week option.
     *
     * @param selectedValue
     */
    @action
    updateMonthDayOrWeekChange(selectedValue: string) {
        this.formFields.selectedMonthOption.value = selectedValue;
        this.formFields.monthDay.value = null;
        this.formFields.weekNum.value = null;

        if (selectedValue === MONTH_OPTION.monthDay) {
            this.formFields.monthDay.value = this.getMonthDay();
            this.formFields.selectedMonthOptionText.value = this.getMonthDayOption();
        }
        if (selectedValue === MONTH_OPTION.weekNum) {
            this.formFields.weekNum.value = this.getWeekNum();
            this.formFields.selectedDays.value = new Array(7).fill(false);
            this.formFields.selectedDays.value[this.formFields.monthDate.value?.getDay()] = true;
            this.formFields.selectedMonthOptionText.value = this.getWeekOption();
        }
    }

    /**
     * Gets start datetime from current date (or selected once date) and selected time.
     *
     * @param hours Selected hour
     * @param minutes Selected minute
     * @returns {Date} Date with selected time
     */
    @autobind
    getStartDatetime(hours: number, minutes: number) {
        if (this.formFields.frequency.value === 'WEEKLY') {
            let closestStartDayDiff = 7;
            const today = new Date();
            for (const [dayIndex, selectedDay] of this.formFields.selectedDays.value.entries()) {
                if (selectedDay) {
                    let diff = dayIndex - today.getDay();
                    if (diff < 0 || (diff === 0 && hours < today.getHours())) diff = diff + 7;
                    if (closestStartDayDiff > diff) closestStartDayDiff = diff;
                }
            }
            this.currentDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + closestStartDayDiff,
            );
        } else if (this.formFields.frequency.value === 'MONTHLY') {
            this.currentDate = this.formFields.monthDate.value || new Date();
        } else {
            this.currentDate = this.formFields.onceDate.value || new Date();
        }
        return new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            this.currentDate.getDate(),
            hours,
            minutes,
            0,
        );
    }

    /**
     * Updates startTime and start datetime from selected time.
     *
     * @param value
     */
    @autobind
    @action
    updateStartTime(value: string) {
        this.formFields.startTime.value = value;
        this.updateStartDatetime();
    }

    /**
     * Updates start datetime from selected time.
     */
    @action
    updateStartDatetime() {
        const time = this.formFields.startTime.value.split(':');
        const hour = Number(time[0]);
        const minute = Number(time[1]);
        this.formFields.startDatetime.value = this.getStartDatetime(hour, minute);
    }

    /**
     * Update until option: NEVER or UNTIL.
     *
     * @param value NEVER or UNTIL
     */
    @action
    updateUntilSelected(value: string) {
        this.formFields.untilSelected.value = value;
        if (this.formFields.untilSelected.value === never()) {
            this.formFields.untilDate.value = null;
        }
    }

    /**
     * Update until date.
     *
     * @param value Until date
     */
    @autobind
    @action
    updateUntil(value: Date | null) {
        this.formFields.untilSelected.value = until();
        this.formFields.untilDate.value = value;
    }

    /**
     * If duration is custom, show custom duration fields. Otherwise update duration value.
     *
     * @param value Duration: CUSTOM or duration value
     */
    @action
    updateDuration(value: string) {
        if (value === custom()) {
            this.showCustomDuration = true;
            this.formFields.duration.value = custom();
        } else {
            this.showCustomDuration = false;
            this.formFields.duration.value = value;
        }
    }

    /**
     * Validates custom duration. If it is a number and is in minutes less than a day,
     * or if it is a number and less than 24 hours, it is valid.
     *
     * @param str Custom duration input
     * @returns {boolean} True if minutes and hours are less than a day
     */
    isValidCustomDuration(str: string) {
        const value = Number(str);
        if (
            this.formFields.customDurationUnit.value === MINUTES &&
            Number.isInteger(value) &&
            value >= 0 &&
            value <= 60 * 24
        ) {
            return true;
        } else if (
            this.formFields.customDurationUnit.value === HOURS &&
            Number.isInteger(value) &&
            value >= 0 &&
            value <= 24
        ) {
            return true;
        }

        return false;
    }

    validateOnceFrequency(valid: boolean) {
        if (this.formFields.frequency.value === 'ONCE') {
            if (!this.formFields.onceDate.value) {
                this.setFormFieldError('onceDate');
                valid = false;
            } else {
                this.resetFormField('onceDate');
            }
        }
        return valid;
    }

    validateWeeklyFrequency(valid: boolean) {
        if (this.formFields.frequency.value === 'WEEKLY') {
            let hasSelectedDay = false;
            this.formFields.selectedDays.value.forEach((selectedDay: boolean) => {
                if (selectedDay) {
                    hasSelectedDay = true;
                }
            });
            if (!hasSelectedDay) {
                this.setFormFieldError('selectedDays');
                valid = false;
            } else {
                this.resetFormField('selectedDays');
            }
        }
        return valid;
    }

    validateMonthlyFrequency(valid: boolean) {
        if (this.formFields.frequency.value === 'MONTHLY') {
            if (!this.formFields.monthDate.value) {
                this.setFormFieldError('monthDate');
                valid = false;
            } else {
                this.resetFormField('monthDate');
            }

            if (!this.formFields.selectedMonthOption.value) {
                this.setFormFieldError('selectedMonthOption');
                valid = false;
            } else {
                this.resetFormField('selectedMonthOption');
            }
        }
        return valid;
    }

    /**
     * Validates reminder details:
     * - Requires frequency to be selected
     *   - If frequency is 'WEEKLY', requires days to be selected.
     *   - If frequency is 'MONTHLY', requires month day or week number to be selected.
     * - Requires valid duration
     * - Requires start time
     * - Requires until option to be selected
     *   - Requires until date to be selected if option is UNTIL
     * - Requires reminder time input to be a valid number.
     *
     * @returns {boolean} True if valid; otherwise false
     */
    @autobind
    validateReminderDetails() {
        let valid = true;
        if (!this.formFields.frequency.value) {
            this.setFormFieldError('frequency');
            valid = false;
        } else {
            this.resetFormField('frequency');
        }

        valid = this.validateOnceFrequency(valid);
        valid = this.validateWeeklyFrequency(valid);
        valid = this.validateMonthlyFrequency(valid);
        valid = this.validateDuration(valid);

        if (!this.formFields.startTime.value) {
            this.setFormFieldError('startTime');
            valid = false;
        } else {
            this.resetFormField('startTime');
        }

        if (!this.formFields.untilSelected.value) {
            this.setFormFieldError('untilSelected');
            valid = false;
        } else {
            this.resetFormField('untilSelected');
        }

        if (
            this.formFields.untilSelected.value === until() &&
            this.formFields.untilDate.value === null
        ) {
            this.setFormFieldError('untilDate');
            valid = false;
        } else {
            this.resetFormField('untilDate');
        }

        if (!Number.isInteger(parseInt(this.formFields.reminderTime.value, 10))) {
            this.formFields.reminderTime.validationState = ERROR;
            this.formFields.reminderTime.note = gettext('Invalid number');
            valid = false;
        } else {
            this.resetFormField('reminderTime');
        }

        return valid;
    }

    /**
     * Validates duration.
     * - Requires duration to be selected
     * - If custom duration is selected, requires custom duration input
     * - If custom duration input is invalid, sets validation state to 'error' and updates
     *   note to 'Invalid number'
     *
     * @param valid Current validation state
     * @returns {boolean} True if current validation state is true and duration is true;
     * otherwise false
     */
    validateDuration(valid: boolean) {
        if (!this.formFields.duration.value) {
            this.setFormFieldError('duration');
            valid = false;
        } else if (
            this.formFields.duration.value === custom() &&
            this.formFields.customDuration.value === ''
        ) {
            this.setFormFieldError('customDuration');
            valid = false;
        } else {
            if (
                this.formFields.duration.value === custom() &&
                !this.isValidCustomDuration(this.formFields.customDuration.value)
            ) {
                runInAction(() => {
                    this.formFields.customDuration.validationState = ERROR;
                    this.formFields.customDuration.note = gettext('Invalid number');
                });
                valid = false;
            } else {
                this.resetFormField('customDuration');
            }
            this.resetFormField('duration');
        }
        return valid;
    }

    /**
     * Loads user's recent courses and sets course radio options.
     *
     * @returns {Promise<void>}
     */
    async loadRecentCourses() {
        let courses: CourseType[] = [];
        if (this.isConsumerSubsSubscriber === null) {
            const commonAppContext = await loadCommonAppContext();
            runInAction(() => {
                const {user} = commonAppContext.data.header;
                if ('id' in user) {
                    this.isConsumerSubsSubscriber = user.consumer_subscription_active;
                } else {
                    this.isConsumerSubsSubscriber = false;
                }
            });
        }
        const params: Params = {
            page_size: COURSE_OPTION_PAGE_SIZE,
            ordering: '-last_accessed',
            'fields[course]': 'title,last_accessed_time',
            is_archived: false,
        };
        const response = await udApi.get('/users/me/subscribed-courses/', {
            params,
        });
        if (response.data) courses = courses.concat(response.data.results);
        if (this.isConsumerSubsSubscriber) {
            delete params.is_archived;
            const response = await udApi.get('/users/me/subscription-course-enrollments/', {
                params,
            });
            if (response.data) courses = courses.concat(response.data.results);
            // remove duplicate courses if user has interacted with same course in subs as well as purchased it
            courses = [...new Map(courses.map((course) => [course.id, course])).values()];
            // sort courses by last accessed time
            courses.sort((a, b) => {
                if (a.last_accessed_time && b.last_accessed_time)
                    return new Date(a.last_accessed_time) > new Date(b.last_accessed_time) ? -1 : 1;
                return 0;
            });
            // get the 3 most recent courses
            courses = courses.slice(0, COURSE_OPTION_PAGE_SIZE);
        }
        this._setCourses(courses);
    }

    /**
     * Sets course radio options.
     *
     * @param response
     * @private
     */
    @action
    _setCourses(courses: CourseType[]) {
        this.courseOptions = courses;
    }

    /**
     * Gets day number from selected month date value.
     *
     * @returns {*|number} Day number
     */
    getMonthDay() {
        return this.formFields.monthDate.value?.getDate();
    }

    /**
     * Gets text for month day option.
     *
     * @returns {*} Day {day number}
     */
    @autobind
    getMonthDayOption() {
        return interpolate(
            gettext('Day %(day)s'),
            {
                day: this.getMonthDay(),
            },
            true,
        );
    }

    /* getFullDayName() {
        return [
            gettext('Sunday'),
            gettext('Monday'),
            gettext('Tuesday'),
            gettext('Wednesday'),
            gettext('Thursday'),
            gettext('Friday'),
            gettext('Saturday'),
        ];
    }*/

    getDayNames(selectedDays: boolean[]): Array<LearningReminderDayName> {
        const dayNames: Array<LearningReminderDayName> = [
            LearningReminderDayName.SUNDAY,
            LearningReminderDayName.MONDAY,
            LearningReminderDayName.TUESDAY,
            LearningReminderDayName.WEDNESDAY,
            LearningReminderDayName.THURSDAY,
            LearningReminderDayName.FRIDAY,
            LearningReminderDayName.SATURDAY,
        ];

        const results: Array<LearningReminderDayName> = [];
        for (let i = 0; i < selectedDays.length; i++) {
            if (selectedDays[i]) {
                results.push(dayNames[i]);
            }
        }

        return results;
    }

    convertTimeStringTo12Hour(timeString: string): string {
        const [hours, minutes] = timeString.split(':');

        // Create a new Date object with the provided time
        const time = new Date();
        time.setHours(Number(hours));
        time.setMinutes(Number(minutes));

        // Get the hours and minutes in 12-hour format
        const formattedHours = time.getHours() % 12 || 12;
        const formattedMinutes = time.getMinutes().toString().padStart(2, '0');
        const period = time.getHours() < 12 ? 'AM' : 'PM';
        return `${formattedHours}:${formattedMinutes} ${period}`;
    }

    /**
     * Gets week day from month date.
     *
     * @returns {*} Weekday
     */
    getWeekDayFromMonthDate() {
        return FULL_DAY_NAME[this.formFields.monthDate.value?.getDay()]();
    }

    /**
     * Gets number of week in the month
     *
     * @returns {number|undefined} If month date selected, returns number of week
     */
    getWeekNum() {
        const monthDate = this.formFields.monthDate.value;
        if (monthDate) {
            const weekNum = Math.floor((monthDate.getDate() - 1) / 7) + 1;
            return this.formFields.frequency.value === 'MONTHLY' ? weekNum : undefined;
        }
        return undefined;
    }

    /**
     * Gets text for week number option.
     *
     * @returns {*} Week {week number} on {week day}
     */
    @autobind
    getWeekOption() {
        return interpolate(
            gettext('Week %(weekNum)s on %(weekDay)s'),
            {
                weekNum: this.getWeekNum(),
                weekDay: this.getWeekDayFromMonthDate(),
            },
            true,
        );
    }

    /**
     * Gets text for selected weekdays.
     *
     * @returns {string|undefined} Gets selected days in format 'SU,MO,TU,WE,TH,FR,SA'
     */
    getByDay() {
        let byDay = '';
        this.formFields.selectedDays.value.forEach((selectedDay: boolean, ndx: number) => {
            if (selectedDay) {
                if (byDay === '') {
                    byDay += BY_DAYS[ndx];
                } else {
                    byDay += `,${BY_DAYS[ndx]}`;
                }
            }
        });
        return byDay !== '' ? byDay : undefined;
    }

    /**
     * Gets custom duration time in minutes.
     *
     * @returns {number|string} Custom duration time in minutes
     */
    @autobind
    getCustomDurationTime() {
        return this.formFields.customDurationUnit.value === HOURS
            ? this.formFields.customDuration.value * 60
            : this.formFields.customDuration.value;
    }

    /**
     * Gets duration value in minutes.
     *
     * @returns {number} Duration in minutes
     */
    getDuration() {
        const durationTime =
            this.formFields.duration.value === custom()
                ? this.getCustomDurationTime()
                : this.formFields.duration.value;
        return Number(durationTime);
    }

    /**
     * Adds duration to start datetime.
     *
     * @returns {string} End datetime
     */
    @autobind
    getEndDatetime() {
        const endTime = new Date(this.formFields.startDatetime.value);
        endTime.setMinutes(this.formFields.startDatetime.value.getMinutes() + this.getDuration());
        return this.parseDateString(endTime);
    }

    /**
     * Gets double digits of number.
     *
     * @param num Number
     * @returns {string} Number in double digits
     */
    toDoubleDigits(num: number) {
        return `${`0${num}`.slice(-2)}`;
    }

    /**
     * Creates date string in format needed for database.
     *
     * @param date Date object
     * @returns {string|undefined} Date in ISO format (e.g. '20210203T063000')
     */
    parseDateString(date: Date) {
        return `${date.getFullYear()}-${this.toDoubleDigits(
            date.getMonth() + 1,
        )}-${this.toDoubleDigits(date.getDate())}T${this.toDoubleDigits(
            date.getHours(),
        )}:${this.toDoubleDigits(date.getMinutes())}:00`;
    }

    /**
     * Sets reminder notification.
     * If minutes are exactly divisible by days, display as days.
     * If minutes are exactly divisible as hours, display as hours.
     * Otherwise display as minutes.
     *
     * @param method Reminder notification method: 'popup' or 'email'
     * @param minutes Reminder notification time before in minutes
     */
    setNotification(method: string, minutes: number) {
        this.formFields.reminderType.value = method;

        // If minutes are divisible as days, set reminder time as days
        if (minutes % (60 * 24) === 0) {
            this.formFields.reminderTime.value = minutes / 60 / 24;
            this.formFields.reminderTimeUnit.value = 'days';
            return;
        }

        // If minutes are divisible as hours, set reminder time as hours
        if (minutes % 60 === 0) {
            this.formFields.reminderTime.value = minutes / 60;
            this.formFields.reminderTimeUnit.value = 'hours';
            return;
        }

        this.formFields.reminderTime.value = minutes;
        this.formFields.reminderTimeUnit.value = 'minutes';
    }

    /**
     * Gets notification time before in minutes
     *
     * @returns {null|number} Notification time before in minutes
     */
    convertNotificationTimeBefore() {
        if (!this.formFields.reminderType.value) {
            return null;
        }

        switch (this.formFields.reminderTimeUnit.value) {
            case 'minutes':
                return this.formFields.reminderTime.value;
            case 'hours':
                return this.formFields.reminderTime.value * 60;
            case 'days':
                return this.formFields.reminderTime.value * 24 * 60;
        }
    }

    /**
     * Gets calendar reminder in format needed for database.
     *
     * @returns {
     *   {
     *     duration: number,
     *     byWeekNum: (number|undefined),
     *     byDay: (string|undefined),
     *     notificationTimeBefore: (null|number),
     *     contentType: (*|undefined),
     *     objectId: (*|undefined),
     *     startTime: (string|undefined),
     *     until: string,
     *     endTime: string,
     *     notificationMethod: string,
     *     title: *,
     *     frequency: (*|string),
     *     byMonthDay: (*|number|undefined)
     *   }
     * }
     */
    @autobind
    getCalendarReminder() {
        return {
            title: this.formFields.title.value,
            startTime: this.parseDateString(this.formFields.startDatetime.value),
            endTime: this.getEndDatetime(),
            duration: this.getDuration(),
            frequency: this.formFields.frequency.value.toLowerCase(),
            byDay: this.getByDay(),
            byMonthDay:
                this.formFields.selectedMonthOption.value === MONTH_OPTION.monthDay
                    ? this.getMonthDay()
                    : null,
            byWeekNum:
                this.formFields.selectedMonthOption.value === MONTH_OPTION.weekNum
                    ? this.getWeekNum()
                    : null,
            until: this.formFields.untilDate.value?.toISOString().substr(0, 19) || null,
            notificationMethod: this.formFields.reminderType.value,
            notificationTimeBefore: this.convertNotificationTimeBefore(),
            contentType: this.formFields.selectedContentObject.contentType || undefined,
            objectId: this.formFields.selectedContentObject.value.id || undefined,
            objectTitle: this.formFields.selectedContentObject.value.title || undefined,
            objectUrl: this.formFields.selectedContentObject.value.url || undefined,
        };
    }
}
