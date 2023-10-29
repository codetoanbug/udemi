import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import formatCurrency from 'utils/currency-formatter';
import {
    getPacificDSTRange,
    applyPacificTimezoneOffset,
    attachPacificTimezoneOffset,
    ptToISOString,
} from 'utils/pacific-timezone';
import udApi from 'utils/ud-api';
import udLink from 'utils/ud-link';

import {
    couponsApiDefaultParams,
    couponCodeCreationModalValidStates,
    couponCreationTypes,
    couponValidationErrors,
} from '../../constants';
import CourseCoupon from '../coupons.mobx-model';
import {formatMonth} from '../date';

export default class PercentCouponsStore {
    @observable validCouponsLoading = true;
    @observable invalidCouponsLoading = true;
    @observable metadataCouponsLoading = true;

    @observable validOrdering = 'end_time';
    @observable invalidOrdering = couponsApiDefaultParams.ordering;
    @observable page = couponsApiDefaultParams.page;
    pageSize = couponsApiDefaultParams.page_size;
    @observable searchQuery = couponsApiDefaultParams.search;

    @observable numTotalFilteredInvalidCoupons = 0;
    @observable filteredInvalidCoupons = [];
    @observable validCoupons = [];
    @observable couponMetadata = {};
    @observable invalidCouponsExpanded = false;

    @observable isCouponCreationModalOpen = false;
    @observable disableCouponCreation = false;
    @observable disablePaidCoupons = false;
    @observable couponCreationModalCurrentState = couponCodeCreationModalValidStates.coupon_type;
    @observable couponTypeSelection = null;
    @observable remainingCouponCount = 0;
    @observable courseCurrency = 'USD';
    @observable courseCurrencySymbol = '$';
    @observable couponCode = null;
    @observable couponPrice = 0;

    @observable couponDiscountLongPlaceholderPrice = 0;
    @observable couponDiscountLongMaxPrice = 0;
    @observable couponDiscountLongDuration = 0;
    @observable couponDiscountLongMaximumUses = null;
    @observable formattedCouponDiscountLongPlaceholderPrice = '';
    @observable formattedCouponDiscountLongMaxPrice = '';

    @observable couponDiscountUrgencyMinPrice = 0;
    @observable couponDiscountUrgencyDuration = 0;
    @observable couponDiscountUrgencyMaximumUses = null;

    @observable couponFreeUrgencyMinPrice = 0;
    @observable couponFreeUrgencyDuration = 0;
    @observable couponFreeUrgencyMaximumUses = null;

    @observable couponFreeScarcityMinPrice = 0;
    @observable couponFreeScarcityDuration = 0;
    @observable couponFreeScarcityMaximumUses = null;

    @observable.ref couponStartDate;
    @observable couponDuration = 0;
    @observable invalidPrice = -1;
    @observable invalidCode = null;
    @observable finalCoupon = null;
    @observable errorStatusCode = null;
    @observable paidCouponTypes = {};
    @observable freeCouponTypes = {};
    @observable currencyFormat = {};
    @observable hasInvalidChars = false;
    @observable invalidCouponStartDate = false;

    constructor(props) {
        this.course = props.course;
        this.couponStartDate = this.now;
    }

    @computed
    get numPages() {
        return Math.ceil(this.numTotalFilteredInvalidCoupons / this.pageSize);
    }

    get validSortBy() {
        return this._sortBy(true);
    }

    get invalidSortBy() {
        return this._sortBy(false);
    }

    _sortBy(isValid) {
        const ordering = isValid ? this.validOrdering : this.invalidOrdering;
        if (ordering.startsWith('-')) {
            return {fieldName: ordering.substring(1), ascending: false};
        }
        return {fieldName: ordering, ascending: true};
    }

    @observable urlQueryParams = {};

    @computed get isLoading() {
        return (
            this.validCouponsLoading && this.invalidCouponsLoading && this.metadataCouponsLoading
        );
    }

    @computed get couponUrl() {
        const url = new URL(udLink.to(this.course.url));
        url.searchParams.set('couponCode', this.finalCoupon || '');
        return url.toString();
    }

    @computed get now() {
        let now = new Date();
        now = new Date(now.getTime() - now.getSeconds() * 1000 - now.getMilliseconds());
        return applyPacificTimezoneOffset(now);
    }

    @computed get today() {
        const date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
        return attachPacificTimezoneOffset(date, this.now);
    }

    @computed get currentMonthEndDate() {
        const date = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0);
        return attachPacificTimezoneOffset(date, this.now);
    }

    @computed get currentMonth() {
        return formatMonth(this.now);
    }

    @computed get couponStartTime() {
        const hours = `${this.couponStartDate.getHours()}`.padStart(2, '0');
        const minutes = `${this.couponStartDate.getMinutes()}`.padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    @computed get couponEndDate() {
        const date = new Date(this.couponStartDate);
        date.setDate(date.getDate() + this.couponDuration);
        return attachPacificTimezoneOffset(date, this.couponStartDate);
    }

    @computed get couponCodeValidationState() {
        return this.couponCodeErrorMessage === undefined ? undefined : 'error';
    }

    @computed get couponCodeErrorMessage() {
        if (this.hasInvalidChars) {
            return couponValidationErrors[3];
        }

        if (this.invalidCode !== null && this.invalidCode === this.couponCode) {
            if (!this.errorStatusCode) {
                return gettext('Please enter valid characters');
            }
            return couponValidationErrors[this.errorStatusCode] || '';
        }
        return undefined;
    }

    @computed get couponPriceValidationState() {
        return this.couponPriceErrorMessage === undefined ? undefined : 'error';
    }

    @computed get couponPriceErrorMessage() {
        if (this.invalidPrice !== -1 && this.invalidPrice === this.couponPrice) {
            return gettext('Please enter a valid price');
        }
        if (this.couponPrice > this.couponDiscountLongMaxPrice) {
            return interpolate(gettext('Please enter a price below %s'), [
                this.couponDiscountLongMaxPrice,
            ]);
        }
        if (this.couponPrice < this.couponDiscountLongPlaceholderPrice) {
            return interpolate(gettext('Please enter a price above %s'), [
                this.couponDiscountLongPlaceholderPrice,
            ]);
        }

        return undefined;
    }

    @computed get couponStartDateValidationState() {
        return this.couponStartDateErrorMessage === undefined ? undefined : 'error';
    }

    @computed get couponStartDateErrorMessage() {
        if (this.invalidCouponStartDate) {
            return couponValidationErrors[this.errorStatusCode] || '';
        }
        return undefined;
    }

    initialize() {
        this._getValidCoupons();
        this._getInvalidCoupons();
        this._getCouponMetadata();
    }

    @autobind
    @action
    checkInvalidChars() {
        this.hasInvalidChars = this.couponCode && !this.couponCode.match('^[A-Z0-9-_.]+$');
    }

    @autobind
    @action
    toggleOpenForInvalidCoupons(expanded) {
        this.invalidCouponsExpanded = expanded;
    }

    @autobind
    @action
    openCouponCreationModal() {
        this.couponTypeSelection = null;
        this.couponCode = this.couponMetadata.random_coupon_code;
        this.couponCreationModalCurrentState = couponCodeCreationModalValidStates.coupon_type;
        this.isCouponCreationModalOpen = true;
    }

    @autobind
    @action
    closeCouponCreationModal() {
        this.isCouponCreationModalOpen = false;
    }

    @autobind
    @action
    setCouponCode(code) {
        this.couponCode = code;
    }

    @autobind
    @action
    setCouponPrice(price) {
        this.couponPrice = price;
    }

    @autobind
    @action
    setCouponStartDate(startDate) {
        if (startDate) {
            this.couponStartDate = attachPacificTimezoneOffset(
                new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate(),
                    this.couponStartDate.getHours(),
                    this.couponStartDate.getMinutes(),
                ),
                this.couponStartDate,
            );
            this.invalidCouponStartDate = false;
        }
    }

    @autobind
    @action
    setCouponStartTime(startTime) {
        let [hours, minutes] = startTime.split(':');
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        if (isNaN(hours) || isNaN(minutes)) {
            return;
        }

        // The 2am hour does not exist when DST starts.
        // 1:59am should increase to 3am, and 3am should decrease to 1:59am.
        if (hours === 2) {
            const ymdString = ptToISOString(this.couponStartDate).slice(0, 10);
            const dstStartDate = getPacificDSTRange(this.couponStartDate.getFullYear())[0];
            const dstStartYMDString = dstStartDate.toISOString().slice(0, 10);
            if (ymdString === dstStartYMDString) {
                hours = this.couponStartDate.getHours() < hours ? 3 : 1;
            }
        }

        this.couponStartDate = attachPacificTimezoneOffset(
            new Date(
                this.couponStartDate.getFullYear(),
                this.couponStartDate.getMonth(),
                this.couponStartDate.getDate(),
                hours,
                minutes,
            ),
            this.couponStartDate,
        );
        this.invalidCouponStartDate = false;
    }

    @autobind
    @action
    setCouponDuration(duration) {
        this.couponDuration = duration;
    }

    @autobind
    @action
    initializeCouponInfo(type) {
        this.couponTypeSelection = type;
        this.couponCreationModalCurrentState = couponCodeCreationModalValidStates.coupon_details;

        const currentType = couponCreationTypes[type];
        if (couponCreationTypes[type].type === 'paid') {
            this.setCouponPrice(this.paidCouponTypes[currentType.version].min_value);
            this.setCouponDuration(this.paidCouponTypes[currentType.version].duration);
        } else {
            this.setCouponPrice(0);
            this.setCouponDuration(this.freeCouponTypes[currentType.version].duration);
        }

        this.couponStartDate = this.now;
        this.invalidCouponStartDate = false;
    }

    @autobind
    @action
    submitCouponForReview() {
        if (
            (this.couponTypeSelection === 'long_discount' && this.couponPriceValidationState) ||
            this.couponCodeValidationState
        ) {
            return;
        }
        this._validateCoupon();
    }

    @autobind
    @action
    editCoupon() {
        this.couponCreationModalCurrentState = couponCodeCreationModalValidStates.coupon_details;
    }

    @autobind
    @action
    createCoupon() {
        this.couponCreationModalCurrentState = couponCodeCreationModalValidStates.loading;
        this._createNewCoupon();
    }

    @autobind
    @action
    searchCoupons() {
        this.page = couponsApiDefaultParams.page;
        this.invalidCouponsExpanded = true;
        this._getInvalidCoupons();
    }

    @autobind
    @action
    setSearch(value) {
        this.searchQuery = value;
    }

    @autobind
    @action
    setValidOrdering(col) {
        this._setOrdering(true, this.validSortBy, col);
        this._getValidCoupons();
    }

    @autobind
    @action
    setInvalidOrdering(col) {
        this._setOrdering(false, this.invalidSortBy, col);
        this.invalidCouponsExpanded = true;
        this._getInvalidCoupons();
    }

    _setOrdering(isValid, sortBy, col) {
        const isActive = col.fieldName === sortBy.fieldName;
        const isAscending = isActive ? !sortBy.ascending : col.initialSortOrder === 'ascending';
        if (isValid) {
            this.validOrdering = `${isAscending ? '' : '-'}${col.fieldName}`;
        } else {
            this.invalidOrdering = `${isAscending ? '' : '-'}${col.fieldName}`;
        }
    }

    @autobind
    @action
    setPage(value) {
        this.page = value;
        this.invalidCouponsExpanded = true;
        this._getInvalidCoupons();
    }

    @computed get referralUrl() {
        const url = new URL(udLink.to(this.course.url));
        url.searchParams.set('referralCode', this.couponMetadata.referral_code || '');
        return url.toString();
    }

    @action
    _updateCouponTypeInfo() {
        if (this.couponMetadata.coupon_types.discount) {
            this.couponDiscountLongMaximumUses = this.couponMetadata.coupon_types.discount.long.maximum_uses;
            this.couponDiscountLongDuration = this.couponMetadata.coupon_types.discount.long.duration;
            this.couponDiscountLongPlaceholderPrice = this.couponMetadata.coupon_types.discount.long.min_value;
            this.couponDiscountLongMaxPrice = this.couponMetadata.coupon_types.discount.long.max_value;
            this.formattedCouponDiscountLongPlaceholderPrice = formatCurrency(
                this.couponMetadata.coupon_types.discount.long.min_value,
                this.currencyFormat,
            );
            this.formattedCouponDiscountLongMaxPrice = formatCurrency(
                this.couponMetadata.coupon_types.discount.long.max_value,
                this.currencyFormat,
            );

            this.couponDiscountUrgencyMinPrice = this.couponMetadata.coupon_types.discount.urgency.min_value;
            this.couponDiscountUrgencyMaximumUses = this.couponMetadata.coupon_types.discount.urgency.maximum_uses;
            this.couponDiscountUrgencyDuration = this.couponMetadata.coupon_types.discount.urgency.duration;
        }
        if (this.couponMetadata.coupon_types.free) {
            this.couponFreeScarcityMinPrice = this.couponMetadata.coupon_types.free.scarcity.min_value;
            this.couponFreeScarcityMaximumUses = this.couponMetadata.coupon_types.free.scarcity.maximum_uses;
            this.couponFreeScarcityDuration = this.couponMetadata.coupon_types.free.scarcity.duration;

            this.couponFreeUrgencyMinPrice = this.couponMetadata.coupon_types.free.urgency.min_value;
            this.couponFreeUrgencyMaximumUses = this.couponMetadata.coupon_types.free.urgency.maximum_uses;
            this.couponFreeUrgencyDuration = this.couponMetadata.coupon_types.free.urgency.duration;
        }
    }

    @action
    _checkListPrice() {
        if (this.course.base_price_detail.amount < this.couponDiscountUrgencyMinPrice) {
            this.disablePaidCoupons = true;
        }
    }

    @action
    _getCoupons(isValid, urlAndApiParams) {
        const ordering = isValid ? this.validOrdering : this.invalidOrdering;

        // These params are sent to the API, but not updated by the router.
        const apiParams = {
            page_size: this.pageSize,
        };
        if (this._sortBy(isValid).fieldName === 'end_time') {
            apiParams.ordering = `${ordering},-created`; // Performance improvement.
        }

        this.urlQueryParams = urlAndApiParams;
        return CourseCoupon.list(this.course.id, {
            params: Object.assign({}, urlAndApiParams, apiParams),
        });
    }

    @action
    _getValidCoupons() {
        this.validCouponsLoading = true;
        const valid = true;

        // These params are sent to the API, and updated by the router.
        const urlAndApiParams = {
            ordering: this.validOrdering,
            page: 1,
            invalid: !valid,
        };

        return this._getCoupons(valid, urlAndApiParams)
            .then(
                action((response) => {
                    this.validCoupons = response.data.results;
                    this.validCouponsLoading = false;
                }),
            )
            .catch(
                action(() => {
                    this.validCoupons = [];
                    this.validCouponsLoading = false;
                }),
            );
    }

    @action
    _getInvalidCoupons() {
        this.invalidCouponsLoading = true;
        const valid = false;

        // These params are sent to the API, and updated by the router.
        const urlAndApiParams = {
            ordering: this.invalidOrdering,
            page: this.page,
            search: this.searchQuery,
            invalid: !valid,
        };

        return this._getCoupons(valid, urlAndApiParams)
            .then(
                action((response) => {
                    this.filteredInvalidCoupons = response.data.results;
                    this.numTotalFilteredInvalidCoupons = response.data.count;
                    this.invalidCouponsLoading = false;
                }),
            )
            .catch(
                action(() => {
                    this.filteredInvalidCoupons = [];
                    this.numTotalFilteredInvalidCoupons = 0;
                    this.invalidCouponsLoading = false;
                }),
            );
    }

    @action
    _getCouponMetadata() {
        this.metadataCouponsLoading = true;
        udApi.get(`/courses/${this.course.id}/coupons-v2/meta/`).then(
            action((response) => {
                this.metadataCouponsLoading = false;
                this.couponMetadata = response.data;
                this.couponCode = this.couponMetadata.random_coupon_code;
                this.remainingCouponCount = this.couponMetadata.remaining_coupon_count;
                if (!this.course.is_paid) {
                    this.disableCouponCreation = true;
                    return;
                }
                this.paidCouponTypes = this.couponMetadata.coupon_types.discount;
                this.freeCouponTypes = this.couponMetadata.coupon_types.free;
                this.currencyFormat = this.couponMetadata.currency_format;
                this._updateCouponTypeInfo();
                this._checkListPrice();
            }),
        );
    }

    _createNewCoupon() {
        this.couponCreationModalCurrentState = couponCodeCreationModalValidStates.loading;
        udApi
            .post(`/courses/${this.course.id}/coupons-v2/`, {
                code: this.couponCode,
                discount_value: this.couponPrice,
                discount_strategy: this.couponTypeSelection,
                start_time: ptToISOString(this.couponStartDate),
            })
            .then(
                action((response) => {
                    this.initialize();
                    this.finalCoupon = response.data.code;
                    this.couponCreationModalCurrentState =
                        couponCodeCreationModalValidStates.creation_success;
                }),
            )
            .catch(
                action((error) => {
                    if (error.response.data.code) {
                        this.invalidCode = this.couponCode;
                    }
                    if (error.response.data.discount_value) {
                        this.invalidPrice = this.couponPrice;
                    }
                    this.couponCreationModalCurrentState =
                        couponCodeCreationModalValidStates.coupon_details;
                }),
            );
    }

    _validateCoupon() {
        this.couponCreationModalCurrentState = couponCodeCreationModalValidStates.loading;
        udApi
            .post('/discounts/validate-coupon/', {
                course_id: this.course.id,
                coupon_code: this.couponCode,
                value: this.couponPrice,
                discount_strategy: this.couponTypeSelection,
                start_time: ptToISOString(this.couponStartDate),
            })
            .then(
                action(() => {
                    this.couponCreationModalCurrentState =
                        couponCodeCreationModalValidStates.review_coupon;
                }),
            )
            .catch(
                action((error) => {
                    this.errorStatusCode = error.response.data.status_code;
                    if (
                        this.errorStatusCode === 3 ||
                        this.errorStatusCode === 4 ||
                        this.errorStatusCode === 8
                    ) {
                        this.invalidCode = this.couponCode;
                    }
                    if (this.errorStatusCode === 5 || this.errorStatusCode === 7) {
                        this.invalidPrice = this.couponPrice;
                    }
                    if (
                        this.errorStatusCode === 9 ||
                        this.errorStatusCode === 10 ||
                        this.errorStatusCode === 11
                    ) {
                        this.invalidCouponStartDate = true;
                    }

                    this.couponCreationModalCurrentState =
                        couponCodeCreationModalValidStates.coupon_details;
                }),
            );
    }
}
