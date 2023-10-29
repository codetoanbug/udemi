import {FormatCurrencyOptions, useFormatCurrency} from '@udemy/ud-data';
import React from 'react';

/** React props interface for `FormattedCurrency` component. */
export interface FormattedCurrencyComponentProps extends Partial<FormatCurrencyOptions> {
    value: number;
}

/**
 * ### FormattedCurrency
 *
 * @remarks
 * Returns result of `@udemy/ud-data`'s `formatCurrency` function, wrapped in a `<span>` element.
 */
export const FormattedCurrency = ({value, ...opts}: FormattedCurrencyComponentProps) => {
    const {formatCurrency} = useFormatCurrency();
    return <span>{formatCurrency(value, opts)}</span>;
};
