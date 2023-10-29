import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import storeEngine from 'store/src/store-engine';
import storeLocalStorage from 'store/storages/localStorage';
import storeMemoryStorage from 'store/storages/memoryStorage';

const browserStore = storeEngine.createStore([storeLocalStorage, storeMemoryStorage], []);

export function makeStorageKey(reviewId) {
    return `udemy/review/${reviewId}/helpfulness`;
}

export default class HelpfulnessStore {
    @observable.ref reviewId;
    @observable.ref viewPosition;
    @observable.ref courseId;
    @observable.ref page;
    @observable.ref filterState;
    @observable.ref store;
    @observable.ref value;

    constructor(reviewId, viewPosition, courseId, page, filterState, store = browserStore) {
        const value = store.get(makeStorageKey(reviewId), null);
        this.reviewId = reviewId;
        this.viewPosition = viewPosition;
        this.courseId = courseId;
        this.page = page;
        this.filterState = filterState;
        this.store = store;
        this.value = value;
    }

    @autobind
    @action
    onToggle(value) {
        if (value === this.value) {
            this.store.remove(makeStorageKey(this.reviewId));
            this.value = null;
        } else {
            this.store.set(makeStorageKey(this.reviewId), value);
            this.value = value;
        }
    }
}
