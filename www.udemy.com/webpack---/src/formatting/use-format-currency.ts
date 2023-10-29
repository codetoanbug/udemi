import React from 'react';

import {getConfigData} from '@udemy/shared-utils';

import {FormatCurrencyOptions, formatCurrency as internalFormatCurrency} from './format-currency';

/**
 * @deprecated use the useFormatCurrency hook from @udemy/ud-data instead
 */
export function useFormatCurrency() {
    const formatCurrency = React.useCallback(
        (value: string | number, options: Partial<FormatCurrencyOptions> = {}) => {
            const Config = getConfigData();
            const formatter = Config.price_country?.currency_formatter ?? {};
            return internalFormatCurrency(value, {...formatter, ...options});
        },
        [],
    );

    return {formatCurrency};
}
