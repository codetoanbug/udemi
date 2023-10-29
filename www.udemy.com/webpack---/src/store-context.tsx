import React, {createContext} from 'react';

export const USER_DEFINED_STORE_ID_KEY = 'STORE_ID';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctor = new (...args: any[]) => any;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StoreType extends Ctor {
    STORE_ID: string;
}

interface StoreContextValue {
    // Map of store class name to store instance
    stores: StoreType[];
}

export const StoreContext = createContext<StoreContextValue>({
    stores: [],
});

export interface StoreProviderProps {
    // Store instances to pass to the context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stores: InstanceType<StoreType>[];
    children: React.ReactNode;
}

/**
 * resolveStoreKey()
 * Given a store of a class or object type, returns name of class
 * @param storeObj
 * @returns
 */
function resolveStoreKey(storeObj: InstanceType<StoreType>): string {
    const storeId = storeObj.constructor[USER_DEFINED_STORE_ID_KEY];

    if (!storeId) {
        throw new Error(
            `"${USER_DEFINED_STORE_ID_KEY}" property needs to be defined on store "${
                storeObj.constructor.name
            }" passed to <StoreProvider />: ${JSON.stringify(storeObj).slice(0, 30)}...`,
        );
    }

    return storeId;
}

export const StoreProvider = ({stores, children}: StoreProviderProps) => {
    // Define context value
    const providerContext: StoreContextValue = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stores: stores.reduce((map: Record<string, any>, store) => {
            const storeKey = resolveStoreKey(store);
            map[storeKey] = store;
            return map;
        }, {}) as StoreType[],
    };

    // If there are any stores found in our context, merge them
    const parentContext = React.useContext(StoreContext);

    if (Object.keys(parentContext.stores).length > 0) {
        // Look at intersection of stores
        const mobxStoreKeys = stores.map(resolveStoreKey);
        const parentMobxStoreKeys = Object.keys(parentContext.stores);
        const dupes = parentMobxStoreKeys.filter((n) => mobxStoreKeys.indexOf(n) > -1);

        if (dupes.length > 0) {
            // eslint-disable-next-line no-console
            console.warn(
                `The following stores are defined in multiple <StoreProvider />: ${dupes}`,
            );
        }

        // Prefer parent stores
        providerContext.stores = {
            ...parentContext.stores,
            ...providerContext.stores,
        };
    }

    // Return provider
    return <StoreContext.Provider value={providerContext}>{children}</StoreContext.Provider>;
};
