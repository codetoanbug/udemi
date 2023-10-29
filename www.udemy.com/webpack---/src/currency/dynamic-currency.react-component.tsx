import React from 'react';

import {FormattedCurrency} from './formatted-currency.react-component';

/** React props interface for `DynamicCurrency` component. */
export interface DynamicCurrencyProps {
    /** The price value to be formatted. */
    value: string | number;
}

/**
 * ### DynamicCurrency
 *
 * Returns a span with formatted text via `currencyformatter.js`.
 */
export const DynamicCurrency = ({value}: DynamicCurrencyProps) =>
    typeof value === 'string' ? <span>{value}</span> : <FormattedCurrency value={value} />;
