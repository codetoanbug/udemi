import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import udApi from 'utils/ud-api';
import SystemMessage from 'utils/ud-system-message';

import {loadingState} from '../constants';
import PriceForm from './price-form.mobx-model';

export class PriceTier {
    /**
     * @param {Number} amount
     * @param {String} currency
     * @param {Number} id must be integer
     * @param {String} price_money
     * @param {Number} price_tier_level
     * @param {String} _class
     */
    // eslint-disable-next-line camelcase
    constructor(amount, currency, id, price_money, price_tier_level, _class) {
        this.amount = amount;
        this.currency = currency;
        this.id = id;
        // eslint-disable-next-line camelcase
        this.price_money = price_money;
        // eslint-disable-next-line camelcase
        this.price_tier_level = price_tier_level;
        this._class = _class;
    }
}

export class PriceStore {
    @observable priceTiersLoadingState = loadingState.initial;
    @observable priceRangeLoadingState = loadingState.initial;
    @observable pricePageVersionLoadingState = loadingState.initial;

    // This maps a currency (e.g. 'usd') to an array of tiers for that currency.
    // The arrays are ordered from smallest to largest amount.
    // Tiers with the same array index are equivalent after currency exchange.
    // Example:
    // If priceTiers = { 'usd': [ < $20 >, < $25 > ], 'jpy': [ < ¥40 >, < ¥50 > ] },
    // then we can assume that $1 exchanges to ¥2.
    /** @type {Object.<String, Array.<PriceTier>>} */
    @observable priceTiers = {};
    @observable hasSeenFreePaidWarning = true;
    /** @type {PriceForm} */
    @observable form;
    @observable instructorPageVersion = 'v1';

    constructor(props) {
        this.course = props.course;
        SystemMessage.hasSeen(SystemMessage.ids.courseFreePaid, this.systemMessageData).then(
            action((response) => {
                this.hasSeenFreePaidWarning = response.data;
            }),
        );
        this.isOwnerOptedIntoDeals = props.pageStore.course.isOwnerOptedIntoDeals; // true only for premium and opted-into deals instructor
        this.form = new PriceForm(this.course, props.pageStore);
    }

    get systemMessageData() {
        return {obj_id: this.course.id, obj_type: 'course'};
    }

    @computed
    get currencies() {
        return Object.keys(this.priceTiers).sort();
    }

    @computed
    get showFreePaidWarning() {
        return !!(
            this.course.published_time &&
            (!this.course.is_paid || this.course.num_paid_switches) &&
            !this.hasSeenFreePaidWarning
        );
    }

    @autobind
    @action
    loadPriceTiers() {
        if (this.priceTiersLoadingState !== loadingState.initial) {
            return this._loadPriceTiersPromise;
        }
        this.priceTiersLoadingState = loadingState.loading;
        // This request returns 37 tiers for 12 currencies = 444 objects.
        // If it becomes a performance issue, we can fetch tiers one currency at a time.
        // The previous implementation also fetched all the tiers at once
        // (via `PriceTier.objects.tier_matrix(as_list=True)`).
        this._loadPriceTiersPromise = udApi
            .get('/price-tiers/')
            .then(
                action((response) => {
                    // Assumes response results are ordered by amount.
                    const priceTiers = {};
                    response.data.results.forEach((tier) => {
                        priceTiers[tier.currency] = priceTiers[tier.currency] || [];
                        priceTiers[tier.currency].push(tier);
                    });
                    this.priceTiers = priceTiers;
                    this.priceTiersLoadingState = loadingState.loaded;
                }),
            )
            .catch(
                action(() => {
                    this.priceTiersLoadingState = loadingState.initial;
                }),
            );
        return this._loadPriceTiersPromise;
    }

    @autobind
    @action
    loadPriceRange() {
        // api call will be performed only for premium opted-into deals instructors
        if (this.isOwnerOptedIntoDeals) {
            if (this.priceRangeLoadingState !== loadingState.initial) {
                return this._loadPriceRangePromise;
            }
            this.priceRangeLoadingState = loadingState.loading;
            this._loadPriceRangePromise = udApi
                .get(`/pricing/${this.course.id}/course-price-range/get/`)
                .then(
                    action((response) => {
                        this.form.priceRange.isPriceRangeCallSuccess = true;
                        this.form.priceRange.minListPrice = response.data.min_list_price;
                        this.form.priceRange.maxListPrice = response.data.max_list_price;
                        this.priceRangeLoadingState = loadingState.loaded;
                    }),
                )
                .catch(
                    action(() => {
                        this.form.priceRange.isPriceRangeCallSuccess = false;
                        this.form.priceRange.minListPrice = undefined;
                        this.form.priceRange.maxListPrice = undefined;
                        this.priceRangeLoadingState = loadingState.loaded;
                    }),
                );
        } else {
            this.priceRangeLoadingState = loadingState.loaded;
        }
        return this._loadPriceRangePromise;
    }

    @autobind
    @action
    loadPricePageVersion() {
        if (this.pricePageVersionLoadingState !== loadingState.initial) {
            return this._loadPricePageVersionPromise;
        }
        this.pricePageVersionLoadingState = loadingState.loading;
        this._loadPricePageVersionPromise = udApi
            .get(`/pricing/experiment-info/`)
            .then(
                action((response) => {
                    this.instructorPageVersion = response.data.version;
                    this.pricePageVersionLoadingState = loadingState.loaded;
                }),
            )
            .catch(
                action(() => {
                    this.instructorPageVersion = 'v1';
                    this.pricePageVersionLoadingState = loadingState.loaded;
                }),
            );
        return this._loadPricePageVersionPromise;
    }

    @autobind
    @action
    markFreePaidWarningSeen() {
        SystemMessage.seen(SystemMessage.ids.courseFreePaid, this.systemMessageData);
        this.hasSeenFreePaidWarning = true;
    }

    @autobind
    getPriceTiersForCurrency(currency) {
        this.loadPriceTiers();
        if (Object.prototype.hasOwnProperty.call(this.priceTiers, currency)) {
            return this.priceTiers[currency];
        }
        return []; /** @type {Array.<PriceTier>} */
    }

    @autobind
    exchangePriceTierAmount(amount, fromCurrency, toCurrency) {
        if (amount === 0) {
            return 0;
        }
        const fromPriceTierIndex = this.getPriceTiersForCurrency(fromCurrency).findIndex(
            (tier) => tier.amount === amount,
        );
        const toPriceTier = this.getPriceTiersForCurrency(toCurrency)[fromPriceTierIndex];
        return toPriceTier ? toPriceTier.amount : null;
    }
}
