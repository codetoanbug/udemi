import autobind from 'autobind-decorator';
import {action, computed, observable, set} from 'mobx';

import {
    FREE_COURSE_CONTENT_LENGTH_LIMIT,
    FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
} from 'course-manage-v2/constants';
import {HTTP_429_TOO_MANY_REQUESTS} from 'organization-common/constants';

import {emptyInputValue} from '../constants';

export class PriceRange {
    @observable isPriceRangeCallSuccess;
    @observable minListPrice;
    @observable maxListPrice;

    /**
     * @param {Boolean} isPriceRangeCallSuccess
     * @param {Money|undefined} minListPrice
     * @param {Money|undefined} maxListPrice
     */
    // eslint-disable-next-line camelcase
    constructor(isPriceRangeCallSuccess, minListPrice = undefined, maxListPrice = undefined) {
        this.isPriceRangeCallSuccess = isPriceRangeCallSuccess;
        this.minListPrice = minListPrice;
        this.maxListPrice = maxListPrice;
    }
}

export default class PriceForm {
    @observable data;
    @observable initial;
    @observable errors;
    @observable isSubmitting;
    /** @type PriceRange */
    @observable priceRange;

    constructor(course, pageStore) {
        this.course = course;
        this.pageStore = pageStore;
        this.priceRange = new PriceRange(false);
        this.reset();
    }

    @autobind
    @action
    reset() {
        const initial = {
            amount: this.course.basePriceAmount,
            currency: this.course.basePriceCurrencyCode,
        };
        // If price has never been set, the default amount should be empty, not zero.
        if (!this.course.price_updated_date) {
            initial.amount = emptyInputValue;
        }
        set(this, {
            data: {...initial},
            initial,
            errors: null,
            isSubmitting: false,
        });
    }

    @computed
    get canSubmit() {
        // All fields are required.
        let fieldsValid = typeof this.data.amount === 'number' && !!this.data.currency;
        // If cannot set price, then only allow "Free".
        if (!this.course.owner_is_premium_instructor) {
            fieldsValid = fieldsValid && this.data.amount === 0;
        }
        return fieldsValid;
    }

    @autobind
    hasFieldChanged(fieldName) {
        return this.data[fieldName] !== this.initial[fieldName];
    }

    @computed
    get hasSomeFieldChanged() {
        return Object.keys(this.data).some(this.hasFieldChanged);
    }

    @autobind
    @action
    setData(data) {
        this.errors = null;
        Object.assign(this.data, data);
        Object.entries(this.data).forEach(([fieldName, value]) => {
            if (value === undefined || value === null) {
                this.data[fieldName] = emptyInputValue;
            }
        });
    }

    @computed
    get isFreePriceTierHidden() {
        return this.pageStore.course.contentLengthVideo > FREE_COURSE_CONTENT_LENGTH_LIMIT;
    }

    @autobind
    @action
    submit() {
        this.isSubmitting = true;
        this.errors = null;
        // Show free course error message when the content of the video exceeds 2 hours
        if (this.data.amount === 0 && this.isFreePriceTierHidden) {
            return Promise.reject({
                response: {
                    data: {
                        price_money: {
                            non_field_errors: [
                                interpolate(
                                    gettext('Free courses cannot exceed %s hours of video content'),
                                    [FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS],
                                ),
                            ],
                        },
                    },
                },
            }).catch(this._handleSubmitError);
        }
        if (!this.hasSomeFieldChanged) {
            return Promise.reject({
                response: {
                    data: {
                        price_money: {
                            non_field_errors: [gettext('You have not changed your price')],
                        },
                    },
                },
            }).catch(this._handleSubmitError);
        }
        return this.course
            .updatePrice(this.data)
            .then(
                action(() => {
                    this.reset();
                    this.isSubmitting = false;
                }),
            )
            .catch(this._handleSubmitError);
    }

    @autobind
    @action
    _handleSubmitError(error) {
        this.isSubmitting = false;
        if (error.response && error.response.data.price_money) {
            this.errors = error.response.data.price_money;
        }
        if (error.response && error.response.status === HTTP_429_TOO_MANY_REQUESTS) {
            this.errors = {
                non_field_errors: [
                    gettext('You are not allowed to do this action twice in 1 sec.'),
                ],
            };
        }
        throw error;
    }
}
