import {action, computed, observable, IObservableArray} from 'mobx';

import {Discount} from '../types/shopping-types';

export class ShoppingDiscounts {
    private readonly state;

    constructor(initialDiscounts?: IObservableArray<Discount>) {
        this.state = observable({
            attempts: initialDiscounts ?? observable.array(),
        });
    }

    @computed
    get attempts() {
        return this.state.attempts;
    }

    @computed
    get latest() {
        return this.state.attempts[0];
    }

    @computed
    get codes() {
        return this.state.attempts.map((attempt) => attempt.code);
    }

    @computed
    get invalidCodes() {
        return this.getCodesByStatus('invalid');
    }

    @computed
    get expiredCodes() {
        return this.getCodesByStatus('expired');
    }

    @computed
    get soldOutCodes() {
        return this.getCodesByStatus('sold_out');
    }

    @action
    clear() {
        this.state.attempts.clear();
    }

    getCodesByStatus(status: string) {
        return this.state.attempts
            .filter((attempt) => attempt.status == status)
            .map((attempt) => attempt.code);
    }
}
