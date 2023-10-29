import React from 'react';

import {RootStore} from 'src/stores/root-store';

interface RootStoreContextValue {
    rootStore: RootStore;
}

const RootStoreContext = React.createContext<RootStoreContextValue | null>(null);

interface RootStoreProviderProps extends RootStoreContextValue {
    children: React.ReactNode;
}

export const RootStoreProvider = ({children, ...contextValue}: RootStoreProviderProps) => {
    return <RootStoreContext.Provider value={contextValue}>{children}</RootStoreContext.Provider>;
};

export function useRootStore() {
    const context = React.useContext(RootStoreContext);
    if (!context) {
        throw new Error('useRootStore can only be called from a child of RootStoreProvider');
    }

    return context.rootStore;
}
