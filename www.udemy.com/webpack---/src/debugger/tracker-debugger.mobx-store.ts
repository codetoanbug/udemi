import autobind from 'autobind-decorator';
import {observable, computed, action} from 'mobx';

import {udExpiringLocalStorage} from '@udemy/shared-utils';

const debugCookieTimeoutMs = 30 * 60 * 1000;
const debugQueryParamKey = 'debug_events';

// The interface for untyped utils/ud-expiring-local-storage
interface ExpiringLocalStorage {
    get: (key: string) => string;
    set: (key: string, value: string | boolean) => void;
    delete: (key: string) => void;
    clear: () => void;
    updateExpiration: (newExpirationDate: Date) => void;
}

export class TrackerDebuggerStore {
    @observable focusedItemId: string | null = null;
    _state: ExpiringLocalStorage;
    _expiration: Date;

    constructor() {
        this._expiration = new Date(Date.now() + debugCookieTimeoutMs);

        this._state = udExpiringLocalStorage(
            'eventDebuggerStorage',
            'storage-1.0',
            this._expiration,
        );

        if (typeof window !== 'undefined') {
            const queryParam = new URLSearchParams(window.location.search).get(debugQueryParamKey);

            // if query param exists, we should override the existing values on the local storage
            if (queryParam !== null) {
                // Even empty string should be evaluated as true, ?debug_events
                const shouldEnableDebugger = queryParam !== 'false' && queryParam !== '0';
                this._state.set('isEnabled', shouldEnableDebugger);
            }

            if (this.isEnabled) {
                // udExpiringLocalStorage doesn't update the existing expiration
                // Updating the expiration if the tracker is enabled
                this._state.updateExpiration(this._expiration);
            }
        }
    }

    @autobind
    invertPosition() {
        this._state.set('isInvertedPosition', !this.isInvertedPosition);
    }

    @autobind
    disable() {
        this._state.set('isEnabled', false);
    }

    @computed get isEnabled() {
        return this._state.get('isEnabled') || false;
    }

    @computed get isInvertedPosition() {
        return this._state.get('isInvertedPosition') || false;
    }

    @autobind
    @action
    setFocusedItemId(id: string | null) {
        this.focusedItemId = id;
    }
}
