import deepmerge from 'deepmerge';
import React, {useEffect} from 'react';

import {UDData} from './types';
import {UDDataProviderBridge} from './ud-data-bridge';

export type DataMergeMode = 'passthru' | 'merge';

export type UDDataContextType = {
    data: UDData;
    mode: DataMergeMode;
    setUDData: (updatedData: UDData) => void;
    suppressNestedDataWarning?: boolean;
} | null;

export const UDDataContext = React.createContext<UDDataContextType>(null);

export interface UDDataProviderProps {
    children: React.ReactNode;
    data?: UDData;
    mode?: DataMergeMode;
    useBridge?: boolean;
    suppressNestedDataWarning?: boolean;
}

/**
 * UDDataProvider
 * ReactJS context provider that wraps applications to provide context access to hooks
 * @param {UDData} UDData - Global UD application data
 * @returns {UDDataContext.Provider} - Returns context provider
 */
export const UDDataProvider = ({
    data,
    children,
    mode,
    useBridge,
    suppressNestedDataWarning,
}: UDDataProviderProps) => {
    // If parent context exists, use it to support nested provider
    const parentContext = React.useContext(UDDataContext);
    let providerContext: UDDataContextType;

    // Determine how we want to handle merging nested data providers
    // Prefer mode defined at current context provider, then parent defined provdier, then fallback to sane default
    const dataMergeMode = mode || parentContext?.mode || 'passthru';

    // Require `data` argument if this is the root UDDataProvider
    if (!parentContext && !data) {
        throw new Error('No data was provided to root <UDDataProvider />');
    }

    // Calculate data set:
    // if mode=merge, data will be parent + child
    // else if mode=passthru, data will be used if this root, otherwise ignored
    const udDataInit =
        parentContext && dataMergeMode === 'merge'
            ? deepmerge(parentContext.data as UDData, data as UDData)
            : data;

    // Set react state
    const [udData, setUDData] = React.useState(udDataInit);

    // Handler for updates to data
    const setUDDataHandler = React.useCallback(
        (updatedData: UDData) => {
            const nextData = deepmerge({...udData} as UDData, updatedData);
            setUDData(nextData);
        },
        [udData],
    );

    // useEffect() to update local react state `udData`
    useEffect(() => {
        // Sanity check this was a change in data
        if (JSON.stringify(udDataInit) !== JSON.stringify(udData)) {
            setUDData(udDataInit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(udDataInit)]);

    // Set `providerContext` object
    if (!parentContext || dataMergeMode === 'merge') {
        // Create new provider context
        providerContext = {
            data: udData as UDData,
            setUDData: setUDDataHandler,
            mode: mode as DataMergeMode,
            suppressNestedDataWarning,
        };
    } else {
        // Optionally emit warning for nested provider context value
        if (data && !parentContext.suppressNestedDataWarning) {
            // eslint-disable-next-line no-console
            console.warn('Data argument provided to a nested <UDDataProvider /> will be ignored');
        }
        // Use parent provider context
        providerContext = parentContext;
    }

    return (
        <UDDataContext.Provider value={providerContext}>
            {useBridge ? <UDDataProviderBridge /> : null}
            {children}
        </UDDataContext.Provider>
    );
};
