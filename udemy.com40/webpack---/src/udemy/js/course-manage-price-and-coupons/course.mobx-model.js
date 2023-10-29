import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {extendRecognizedObservable} from 'utils/mobx';
import udApi from 'utils/ud-api';

import {
    courseFields,
    courseFieldFilters,
    coursePriceUpdateFieldFilters,
    defaultCurrency,
    loadingState,
} from './constants';

export default class Course {
    @observable loadingState = loadingState.initial;

    constructor(courseId) {
        extendRecognizedObservable(this, {id: courseId}, courseFields);
    }

    @computed
    get basePriceAmount() {
        if (this.base_price_detail) {
            return parseFloat(this.base_price_detail.amount);
        }
        return 0;
    }

    get basePriceCurrencyCode() {
        if (this.base_price_detail) {
            return this.base_price_detail.currency.toLowerCase();
        }
        return defaultCurrency;
    }

    @autobind
    @action
    load() {
        if (this.loadingState !== loadingState.initial) {
            return this._loadCoursePromise;
        }
        this.loadingState = loadingState.loading;
        this._loadCoursePromise = udApi
            .get(`/courses/${this.id}/`, {
                params: courseFieldFilters,
            })
            .then(
                action((response) => {
                    extendRecognizedObservable(this, response.data, courseFields);
                    this.loadingState = loadingState.loaded;
                }),
            )
            .catch(
                action(() => {
                    this.loadingState = loadingState.initial;
                }),
            );
        return this._loadCoursePromise;
    }

    @autobind
    updatePrice({amount, currency}) {
        return udApi
            .request(`/courses/${this.id}/`, {
                method: 'patch',
                params: coursePriceUpdateFieldFilters,
                data: {
                    price_money: {
                        amount,
                        currency,
                    },
                },
            })
            .then(
                action((response) => {
                    extendRecognizedObservable(this, response.data, courseFields);
                }),
            );
    }
}
