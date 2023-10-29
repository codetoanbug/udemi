import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import config from 'shopping-client/config';

import {MODES} from './constants';

export default class BaseCouponStore {
    @observable currentMode = MODES.OFF;
    @observable inputCode = '';
    @observable submittedCode = '';
    @observable error = '';
    @observable currentCodes = [];
    @observable currentDiscounts = new Map();
    @observable hasAlreadyPurchased = false;

    @autobind
    @action
    enterInputMode() {
        this.currentMode = MODES.INPUT;
    }

    @autobind
    @action
    enterLoadingMode() {
        this.currentMode = MODES.PENDING;
    }

    @computed
    get isValidInputCode() {
        return config.patterns.validDiscountCode.test(this.inputCode);
    }

    @action
    _updateBaseCouponInternalState(lastDiscountAttempt) {
        this.submittedCode = this.inputCode;
        this.error = config.errors.discountCodeInputFormat;
        this.currentMode = MODES.INPUT;
        this.inputCode = '';

        if (lastDiscountAttempt) {
            this.error = lastDiscountAttempt.length ? lastDiscountAttempt[0].details : '';
        }
    }

    @action
    setCode(code) {
        this.inputCode = code.trim().toUpperCase();
        if (this.error) {
            this.error = '';
        }
        if (this.submittedCode) {
            this.submittedCode = '';
        }
    }

    @computed
    get allowSubmit() {
        return this.currentMode === MODES.INPUT && !this.currentCodes.includes(this.inputCode);
    }
}
