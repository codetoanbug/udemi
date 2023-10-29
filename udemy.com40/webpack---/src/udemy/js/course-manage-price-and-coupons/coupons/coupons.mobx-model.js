import autobind from 'autobind-decorator';
import {action, computed, extendObservable, observable} from 'mobx';

import {showErrorToast, showReloadPageErrorToast} from 'instructor/toasts';
import {getPacificTimezoneOffset, applyPacificTimezoneOffset} from 'utils/pacific-timezone';
import udApi from 'utils/ud-api';

import {formatLocalTimezoneDate, formatPacificTimezoneDate} from './date';

const MAXIMUM_UNLIMITED_COUPON = 40000;

export default class CourseCoupon {
    @observable isUpdating = false;

    constructor(courseId, data) {
        this.courseId = courseId;
        extendObservable(this, data);
    }

    @computed
    get canBeEnabled() {
        return this.is_active && this.can_enable_coupon;
    }

    @computed
    get isEnabled() {
        return this.canBeEnabled && !this.is_disabled;
    }

    @computed
    get remainingRedemptionsText() {
        const maximumUses =
            this.maximum_uses && this.maximum_uses !== MAXIMUM_UNLIMITED_COUPON
                ? this.maximum_uses
                : gettext('Unlimited');
        return `${this.number_of_uses} / ${maximumUses}`;
    }

    @computed
    get discountPercentageText() {
        return this.discount_percentage !== 100 ? `${this.discount_percentage}%` : gettext('Free');
    }

    @computed
    get createdText() {
        return formatLocalTimezoneDate(this.created);
    }

    @computed
    get endTimeText() {
        if (!this.end_time) {
            return gettext('Indefinite');
        }
        return formatLocalTimezoneDate(this.end_time);
    }

    @computed
    get remainingDaysText() {
        if (!this.end_time) {
            return '';
        }

        const now = new Date();
        let startTime = this.start_time ? new Date(this.start_time) : now;
        if (now > startTime) {
            startTime = now;
        }

        const endTime = new Date(this.end_time);

        // This accounts for DST switch between startTime and endTime.
        const dstMins = getPacificTimezoneOffset(endTime) - getPacificTimezoneOffset(startTime);
        const dstMillis = dstMins * 60 * 1000;

        const diffDays = (endTime - startTime - dstMillis) / (24 * 3600 * 1000);
        const floorDiffDays = Math.floor(Math.abs(diffDays)); // Round towards 0.
        const sign = diffDays < 0 ? -1 : 1;
        return interpolate(ngettext('%s day', '%s days', floorDiffDays), [sign * floorDiffDays]);
    }

    createdTextInPst(options) {
        return formatPacificTimezoneDate(applyPacificTimezoneOffset(this.created), options);
    }

    startTimeTextInPst(options) {
        if (!this.start_time) {
            return this.createdTextInPst(options);
        }
        return formatPacificTimezoneDate(applyPacificTimezoneOffset(this.start_time), options);
    }

    endTimeTextInPst(options) {
        if (!this.end_time) {
            return gettext('Indefinite');
        }
        return formatPacificTimezoneDate(applyPacificTimezoneOffset(this.end_time), options);
    }

    static exists(courseId) {
        const url = `/courses/${courseId}/coupons-v2/`;
        return udApi
            .get(url, {
                params: {
                    'fields[coupon]': 'id',
                    page_size: 1,
                    show_inactive: true,
                },
            })
            .then((response) => response.data.count > 0);
    }

    static list(courseId, requestConfig) {
        const url = `/courses/${courseId}/coupons-v2/`;
        return udApi.get(url, requestConfig).then((response) => {
            response.data.results = response.data.results.map(
                (coupon) => new CourseCoupon(courseId, coupon),
            );
            return response;
        });
    }

    static create(courseId, data) {
        const url = `/courses/${courseId}/coupons-v2/`;
        return udApi.post(url, data);
    }

    @autobind
    @action
    updateIsEnabledByInstructor(value) {
        if (this.isUpdating) {
            return Promise.resolve(this);
        }
        const prevIsDisabled = this.is_disabled;
        this.is_disabled = !value;
        this.isUpdating = true;
        const url = `/courses/${this.courseId}/coupons-v2/`;

        return udApi
            .request(`${url}${this.id}/`, {
                data: {
                    is_disabled: this.is_disabled,
                },
                method: 'PATCH',
                params: {
                    show_inactive: true, // This is needed to update from is_disabled false to true.
                },
            })
            .then(
                action(() => {
                    this.isUpdating = false;
                    return this;
                }),
            )
            .catch(
                action((error) => {
                    this.is_disabled = prevIsDisabled;
                    this.isUpdating = false;
                    if (error.response && error.response.data.detail) {
                        showErrorToast(error.response.data.detail);
                    } else if (error.message) {
                        showReloadPageErrorToast(error.message);
                    }
                    return this;
                }),
            );
    }
}
