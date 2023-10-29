import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

import {AVAILABLE, NOT_AVAILABLE, UNSPECIFIED, AVAILABILITY_OPTIONS} from './constants';

export default class AvailabilityStore {
    @observable availableDate;
    @observable availableDatePickerValue;
    @observable statusLoaded = false;
    @observable applyToAllCourses = false;
    @observable optionSelected = 3;
    @observable respondTimeFrame;
    @observable currStatusId;
    statusUpdateMessage = gettext('Your changes have been successfully saved');

    constructor(courseId = null) {
        this.courseId = courseId;
        this.setAvailableDate(new Date());
    }

    @computed
    get saveEnabled() {
        return (
            (this.optionSelected === AVAILABILITY_OPTIONS[AVAILABLE] &&
                Boolean(this.respondTimeFrame)) ||
            this.optionSelected === AVAILABILITY_OPTIONS[NOT_AVAILABLE] ||
            this.optionSelected === AVAILABILITY_OPTIONS[UNSPECIFIED]
        );
    }

    @action
    setAvailableDate(date) {
        // `availableDatePickerValue` is null if instructor enters an invalid date.
        // `availableDate` is only updated for valid dates. It cannot be null.
        this.availableDatePickerValue = date;
        if (date) {
            this.availableDate = date;
        }
    }

    @autobind
    @action
    onDateChange(date) {
        this.optionSelected = 2;
        this.setAvailableDate(date);
    }

    @autobind
    @action
    onRespondSelect(value) {
        this.optionSelected = AVAILABILITY_OPTIONS[value];
    }

    @autobind
    @action
    onDropdownSelect(value) {
        this.optionSelected = 1;
        this.respondTimeFrame = value;
    }

    @autobind
    @action
    onApplyToAllChange(checked) {
        this.applyToAllCourses = checked;
    }

    submitStatusForm() {
        if (this.currStatusId && !this.applyToAllCourses) {
            return this.updateStatus();
        }
        return this.createStatus();
    }

    createStatus() {
        const {data, params, url} = this.getRequestValues();
        return udApi
            .post(url, data, params)
            .then(
                action((response) => {
                    this.currStatusId = response.data.id;
                    showSuccessToast(this.statusUpdateMessage);
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    updateStatus() {
        const {data, params, url} = this.getRequestValues('PUT');
        return udApi
            .put(url, data, params)
            .then(
                action((response) => {
                    this.currStatusId = response.data.id;
                    showSuccessToast(this.statusUpdateMessage);
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @autobind
    fetchCourseStatus() {
        const params = {
            'fields[instructor_course_status]': 'status,respond_time_frame,available_date',
        };
        const url = `users/me/courses/${this.courseId}/instructor-course-statuses/`;
        return udApi
            .get(url, params)
            .then(
                action((response) => {
                    const result = response.data.results[0];
                    if (result) {
                        this.currStatusId = result.id;
                        this.optionSelected = result.status;
                        this.respondTimeFrame = result.respond_time_frame;
                        if (result.available_date) {
                            this.setAvailableDate(fromLocalDateStamp(result.available_date));
                        }
                    }
                    this.statusLoaded = true;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @autobind
    getRequestValues(action = 'POST') {
        const data = {status: this.optionSelected};
        const baseUrl = `users/me/courses/${this.courseId}/instructor-course-statuses/`;
        const params = {
            'fields[instructor_course_status]': 'status,respond_time_frame,available_date',
        };
        if (this.applyToAllCourses) {
            data.apply_to_all_courses = true;
        }
        if (this.optionSelected === AVAILABILITY_OPTIONS[AVAILABLE]) {
            data.respond_time_frame = this.respondTimeFrame;
            data.available_date = null;
        }
        if (this.optionSelected === AVAILABILITY_OPTIONS[NOT_AVAILABLE]) {
            data.available_date = utcDate(this.availableDate).toISOString();
            data.respond_time_frame = null;
        }
        if (this.optionSelected === AVAILABILITY_OPTIONS[UNSPECIFIED]) {
            data.available_date = null;
            data.respond_time_frame = null;
        }
        const url = action === 'PUT' ? baseUrl.concat(`${this.currStatusId}/`) : baseUrl;
        return {data, params, url};
    }
}

export function fromLocalDateStamp(dateString) {
    // Parse "2022-01-19" in local time zone.
    const [year, month, day] = dateString.slice(0, 10).split('-');
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

export function utcDate(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}
