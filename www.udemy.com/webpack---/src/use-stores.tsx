import {useContext} from 'react';

import {StoreContext, StoreType, USER_DEFINED_STORE_ID_KEY} from './store-context';

/**
 * useStores()
 * Hook for accessing stores on context
 * @param storeClassNames
 * @returns
 */
export const useStores = <TStore extends ReadonlyArray<StoreType>>(storeClasses: [...TStore]) => {
    const {stores} = useContext(StoreContext);

    const foundStores = storeClasses.map((storeClass) => {
        const storeClassName = storeClass[USER_DEFINED_STORE_ID_KEY];
        if (!storeClassName) {
            throw new Error(
                `class "${storeClass.name}" is missing static "${USER_DEFINED_STORE_ID_KEY}" property`,
            );
        }
        const store = stores[storeClassName as keyof typeof stores];
        if (!store) {
            // Attempt global fallback
            // This is an interop step that helps us migrate from Django website
            if (typeof globalThis['_STORES' as keyof typeof globalThis] === 'object') {
                const globalStore =
                    globalThis['_STORES' as keyof typeof globalThis][storeClassName];
                if (globalStore) {
                    return globalStore;
                }
            }
            // Unable to locate store (or found in global scope)
            throw new Error(
                `Store "${storeClassName}" has not been registered with the StoreProvider`,
            );
        }
        return store;
    });

    return foundStores as unknown as {
        [K in keyof TStore]: InstanceType<Extract<TStore[K], StoreType>>;
    };
};
