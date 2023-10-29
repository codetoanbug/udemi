import {action, computed, observable} from 'mobx';

import {I18nApi} from '@udemy/i18n';

import {shoppingConfig} from '../shopping-client/config';
import {Discount} from '../types/shopping-types';
import {MODES} from './constants';

export class BaseCouponStore {
    @observable currentMode = MODES.OFF;
    @observable inputCode = '';
    @observable submittedCode = '';
    @observable error? = '';
    @observable currentCodes: string[] = [];
    @observable currentDiscounts = new Map();
    @observable hasAlreadyPurchased = false;

    constructor(protected readonly i18n: Pick<I18nApi, 'gettext'>) {}

    @action
    enterInputMode = () => {
        this.currentMode = MODES.INPUT;
    };

    @action
    enterLoadingMode = () => {
        this.currentMode = MODES.PENDING;
    };

    @computed
    get isValidInputCode() {
        return shoppingConfig.patterns.validDiscountCode.test(this.inputCode);
    }

    @action
    _updateBaseCouponInternalState(lastDiscountAttempt?: Discount[]) {
        this.submittedCode = this.inputCode;
        const errors = shoppingConfig.errors(this.i18n.gettext);
        this.error = errors.discountCodeInputFormat;
        this.currentMode = MODES.INPUT;
        this.inputCode = '';

        if (lastDiscountAttempt) {
            this.error = lastDiscountAttempt.length ? lastDiscountAttempt[0].details : '';
        }
    }

    @action
    setCode(code: string) {
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
