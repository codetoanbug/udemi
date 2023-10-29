import currencyFormatter from 'currencyformatter.js';

import {getConfigData} from '../data/get-config-data';

/**
 * Formats a given `value` to a string that can be presented to the end user.
 *
 * @param value The price value that needs to be formatted.
 * @param opts: {
 *  currency: An {ISO 4217} Currency Code (e.g. USD), defaults to formatter to sync with backend price_country + locale combo.
 *  symbol: The currency symbol (e.g. $) of a currnecy. defaults to formatter to sync with backend price_country + locale combo.
 *  locale: A {ISO 639}_{ISO 3166} Locale Code (e.g. en_US), defaults to formatter to sync with backend price_country + locale combo.
 *  decimal: The decimal seperator value (e.g. .), defaults to formatter to sync with backend price_country + locale combo.
 *  group: The grouping seperator value (e.g. ,), defaults to formatter to sync with backend price_country + locale combo.
 *  pattern: The number pattern defined by the unicode standards (LDML), defaults to formatter to sync with backend price_country + locale combo.
 *  scale: The number of decimals that should be printed, defaults to `udConfig.price_country.currency_decimal_places`.
 * }
 * @returns string Formatted price string.
 */

export const DEFAULT_CURRENCY = 'usd';
export const DEFAULT_LOCALE = 'en_US';
export const DEFAULT_SCALE = 2;

export function formatCurrency(value, opts = {}) {
    const udConfig = getConfigData();
    opts = Object.assign(
        {
            currency: DEFAULT_CURRENCY,
            symbol: '$',
            locale: DEFAULT_LOCALE,
            decimal: '.',
            group: ',',
            pattern: '!#,##0.00',
            scale: DEFAULT_SCALE,
        },
        udConfig.price_country.currency_formatter,
        opts,
    );
    if (!(opts.locale in currencyFormatter.locales)) {
        opts.locale = opts.locale.substring(0, 2);
    }
    if (!(opts.locale in currencyFormatter.locales)) {
        opts.locale = 'en_US';
    }
    // Adjust the pattern's scale according to `opts.scale`.
    opts.pattern = opts.pattern.replace('.00', `.${new Array(opts.scale + 1).join('0')}`);

    // Truncate extra decimal places and round the number (Can prevent scientific notation)
    value = +(+value).toFixed(opts.scale);

    return currencyFormatter.format(value, opts);
}
