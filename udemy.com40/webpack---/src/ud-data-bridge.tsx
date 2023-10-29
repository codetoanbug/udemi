import React from 'react';

import {UDData} from './types';
import {UDDataContext} from './ud-data-context';
import {ERROR_MESSAGE} from './use-ud-data';

// Note: This is duplicated in get-config-data.ts in @udemy/shared-utils.
export const CUSTOM_EVENT_NAME_PROVIDER_BRIDGE = 'update-uddata-provider';

/**
 * Hook used to update UDData from within a React component
 *
 * @returns {(udData: UDData) => void}
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const updateUDData = useUpdateUDData();
 *
 *   useEffect(() => {
 *      updateUDData(...);
 *   }, []);
 *
 *   return <></>
 * };
 * ```
 */
export function useUpdateUDData() {
    const udData = React.useContext(UDDataContext);
    if (!udData) {
        throw new Error(ERROR_MESSAGE);
    }

    return udData.setUDData;
}

/**
 * Hook that enables updating UD data from outside reactJS context
 *
 * @returns {void}
 *
 * @example
 * ```tsx
 * import {UDDataProvider, UDDataProviderBridge, CUSTOM_EVENT_NAME_PROVIDER_BRIDGE} from '@udemy/ud-data';
 *
 * export const AppWrapper = () => {
 *    return <UDDataProvider data={...} useBridge={true}>
 *      {...}
 *    </UDDataProvider>
 * }
 *
 * async function outsideReactJS() {
 *  const updatedUDData = await fetch(...);
 *    if (window) {
 *      window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME_PROVIDER_BRIDGE, {detail: updatedUDData}));
 *    }
 * }
 * ```
 */
export function UDDataProviderBridge() {
    const updateUDData = useUpdateUDData();
    React.useEffect(() => {
        const customEventListener = (evt: CustomEvent<UDData>) => {
            const udData = evt.detail;
            updateUDData(udData);
        };
        window.addEventListener(
            CUSTOM_EVENT_NAME_PROVIDER_BRIDGE,
            customEventListener as EventListener,
        );
        return () => {
            window.removeEventListener(
                CUSTOM_EVENT_NAME_PROVIDER_BRIDGE,
                customEventListener as EventListener,
            );
        };
    }, [updateUDData]);
    return <span data-testid="UDDataProviderBridge"></span>;
}
