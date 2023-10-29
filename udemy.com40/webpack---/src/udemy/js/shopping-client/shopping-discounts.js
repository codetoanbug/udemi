import {action, computed, observable} from 'mobx';

class ShoppingDiscounts {
    constructor(initialDiscounts) {
        this.state = observable({
            attempts: initialDiscounts || [],
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

    getCodesByStatus(status) {
        return this.state.attempts
            .filter((attempt) => attempt.status == status)
            .map((attempt) => attempt.code);
    }
}

export default function shoppingDiscounts(initialDiscounts) {
    return new ShoppingDiscounts(initialDiscounts);
}
