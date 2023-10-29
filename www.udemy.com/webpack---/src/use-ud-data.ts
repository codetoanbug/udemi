import React from 'react';

import {serverOrClient} from '@udemy/shared-utils';

import {UDData} from './types';
import {UDDataContext} from './ud-data-context';

export const ERROR_MESSAGE =
    'No UD data context was provided. Make sure you wrapped your app in the UDDataProvider';

export const WARNING_MESSAGE =
    'Unable to resolve UD data context; falling back to global scope. This warning is shown because the environment variable UD_FRONTENDS_LOG_WARNINGS is set to "true".';

export function getServerOrClientUDData(): UDData {
    const globalUD = serverOrClient.global.UD;
    return globalUD as unknown as UDData;
}

/**
 * Hook used to access UDData from within a React component
 *
 * @returns {UDData}
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const {Config} = useUDData();
 *
 *   return (
 *     <div>
 *       <p>App version: {Config.version}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export function useUDData(): UDData {
    const udData = React.useContext(UDDataContext);
    if (udData) {
        return udData.data;
    }

    const globalUD = getServerOrClientUDData();
    if (globalUD) {
        if (
            process.env.NODE_ENV !== 'production' &&
            process.env.UD_FRONTENDS_LOG_WARNINGS === 'true'
        ) {
            // eslint-disable-next-line no-console
            console.warn(WARNING_MESSAGE);
        }
        return globalUD as unknown as UDData;
    }

    throw new Error(ERROR_MESSAGE);
}
