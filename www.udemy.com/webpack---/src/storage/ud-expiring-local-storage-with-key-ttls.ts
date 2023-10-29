import {runInAction} from 'mobx';

import {udExpiringLocalStorage} from './ud-expiring-local-storage';

/**
 * An extension to udExpiringLocalStorage that keeps ttl per key in the storage.
 * @param namespace combined with name for unique id of the storage, used in storage name and
 * keeping the track of storage expiration.
 * @param name combined with namespace for unique id of the storage, used in storage name and
 * keeping the track of storage expiration.
 * @param TTL Time to live in msecs. This parameter will both affect ttl's of individual items
 * and the storage itself.
 * @returns {{set(*=, *): void, get(*=): (*|null), clear(): void, delete(*=): void}|*}
 */
export function expiringLocalStorageWithKeyTTLs(namespace: string, name: string, TTL: number) {
    const maximumStorageSize = 1000;
    const expirationDate = getExpirationDate();
    const baseStorage = udExpiringLocalStorage(namespace, name, expirationDate);

    setTimeout(retireExpiredItems, 5000);

    return {
        /**
         * Sets the given key,value pair into the expiring datastore.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set(key: string, value: any) {
            if (baseStorage.size() < maximumStorageSize) {
                const currentDate = getExpirationDate();
                const item = {value, valid_until: currentDate.getTime()};
                baseStorage.set(key, item);

                // udExpiringLocalStorage only refreshes its expiration date when it is created from scratch
                // We are forcing it to update the expiration of the storage on all accesses
                baseStorage.updateExpiration(currentDate);
            } else {
                throw new Error(`${namespace}:${name} is full to hold new items`);
            }
        },

        /**
         * Retrieves the given value from the expiring datastore.
         * If the value does not exist, returns null.
         */
        get(key: string) {
            const nowUnixTime = new Date().getTime();
            const item = baseStorage.get(key);
            if (item) {
                if (item.valid_until >= nowUnixTime) {
                    return item.value;
                }
                this.delete(key);
            }
            return null;
        },

        /**
         * Removes the value stored at key from the datastore, if it exists.
         */
        delete(key: string) {
            baseStorage.delete(key);
        },

        /**
         * Removes the datastore and all stored values.
         */
        clear() {
            baseStorage.clear();
        },
    };

    function getExpirationDate() {
        return new Date(Date.now() + TTL);
    }

    function retireExpiredItems() {
        const nowUnixTime = new Date().getTime();
        runInAction(() => {
            for (const key of baseStorage.keys()) {
                if (baseStorage.get(key).valid_until < nowUnixTime) {
                    baseStorage.delete(key);
                }
            }
        });
    }
}
