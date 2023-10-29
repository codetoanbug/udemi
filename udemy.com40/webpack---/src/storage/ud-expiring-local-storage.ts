import {action, observable, toJS} from 'mobx';
import storeEngine from 'store/src/store-engine';
import storeLocalStorage from 'store/storages/localStorage';
import storeMemoryStorage from 'store/storages/memoryStorage';

const store = storeEngine.createStore([storeLocalStorage, storeMemoryStorage], []);

/**
 * Main API for the expiring Local Storage Factory on a namespace
 *
 * Returns a new datastore whose data will expire on the given date.
 * Tracks expiration times for each datastore object
 * and removes expired datastores on startup. The expirationsCacheKey
 * shouldn't have a namespace so that if one particular app is not accessed
 * again, then that cache will expire.
 *
 * In the current implementation of ud-expiring-local-storage, concurrent access
 * from multiple browser tabs are not fully handled. The writes are somehow
 * handled by merging the content of the local storage before altering it
 * but reads does not check if the local storage content is changed from another
 * browser tab because of the performance concerns.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function udExpiringLocalStorage(namespace: string, name: string, date?: any) {
    /*
     * Note that state.expirations is actually a hash of ALL instances of this factory.
     * It is **not** specific to this store.
     */
    const state = observable({
        cacheKey: `${namespace}:${name}`,
        expirations: observable.map(),
        expirationsCacheKey: 'expiringLocalStorageFactory.expirations',
        storedValues: observable.map(),
    });

    state.expirations.observe(() => {
        const expirations = store.get(state.expirationsCacheKey) || {};
        const updatedExpirations = Object.assign(expirations, toJS(state.expirations));
        store.set(state.expirationsCacheKey, updatedExpirations);
    });

    action(() => {
        try {
            state.storedValues.merge(store.get(state.cacheKey) || {});
            state.expirations.merge(store.get(state.expirationsCacheKey) || {});
        } catch (e) {
            // TODO: add fallback
        }

        /*
         * Clean expired data
         */
        const now = new Date();
        state.expirations.forEach((dateString, key) => {
            if (new Date(dateString) < now) {
                store.remove(key);
                const expirations = store.get('expiringLocalStorageFactory.expirations');
                delete expirations[key];
                store.set(state.expirationsCacheKey, expirations);
                state.expirations.delete(key);
                state.storedValues.clear();
            }
        });
    })();

    state.storedValues.observe(() => {
        store.set(state.cacheKey, state.storedValues);
        /*
         * Sets expiration date for the key; will NOT override existing expiration dates.
         */
        if (!date || state.expirations.get(state.cacheKey)) {
            return;
        }
        state.expirations.set(state.cacheKey, date);
    });

    return {
        /**
         * Sets the given key,value pair into the expiring datastore.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set: action((key: string, value: any) => {
            /**
             * state.storedValues is an observable and altering it will trigger the
             * method above that writes the content of storedValues to localStorage.
             * state.storedValues is distinct between tabs while localStorage is not,
             * so we merge the localStorage with storedValues to make sure that its
             * content is synced with the changes happened in other browser tabs.
             */
            const storageVersion = store.get(state.cacheKey) || {};
            state.storedValues.merge(storageVersion);

            state.storedValues.set(key, value);
        }),

        /**
         * Retrieves the given value from the expiring datastore.
         * If the value does not exist, returns undefined.
         */
        get(key: string) {
            return state.storedValues.get(key);
        },

        /**
         * Removes the value stored at key from the datastore, if it exists.
         */
        delete: action((key: string) => {
            state.storedValues.delete(key);
        }),

        /**
         * Get all keys present in the value store
         */
        keys() {
            return state.storedValues.keys();
        },

        /**
         * Returns the number of elements in the storage
         */
        size() {
            return state.storedValues.size;
        },

        /**
         * Removes the datastore and all stored values.
         */
        clear: action(() => {
            state.storedValues.clear();
            store.remove(state.cacheKey);
            store.remove(state.expirationsCacheKey);
            removeExpiration(state.cacheKey);
        }),

        /**
         * Updates expiration date of current cache
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateExpiration: action((newExpirationDate: any) => {
            state.expirations.set(state.cacheKey, newExpirationDate);
        }),
    };

    /*
     * Internal functions
     */

    /*
     * Removes the expiration date for a given store
     */
    function removeExpiration(key: string) {
        state.expirations.delete(key);
    }
}
