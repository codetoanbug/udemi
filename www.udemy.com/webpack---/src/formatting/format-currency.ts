import currencyFormatter from 'currencyformatter.js';

const DEFAULT_CURRENCY = 'usd';
const DEFAULT_LOCALE = 'en_US';
const DEFAULT_SCALE = 2;

export interface FormatCurrencyOptions {
    currency: string;
    symbol: string;
    locale: string;
    decimal: string;
    group: string;
    pattern: string;
    scale: number;
}

/**
 * @deprecated use the formatCurrency function from @udemy/ud-data instead
 */
export function formatCurrency(
    value: string | number,
    options: Partial<FormatCurrencyOptions> = {},
) {
    const mergedOptions = Object.assign(
        {
            currency: DEFAULT_CURRENCY,
            symbol: '$',
            locale: DEFAULT_LOCALE,
            decimal: '.',
            group: ',',
            pattern: '!#,##0.00',
            scale: DEFAULT_SCALE,
        },
        options,
    );
    if (!(mergedOptions.locale in currencyFormatter.locales)) {
        mergedOptions.locale = mergedOptions.locale.substring(0, 2);
    }
    if (!(mergedOptions.locale in currencyFormatter.locales)) {
        mergedOptions.locale = 'en_US';
    }
    // Adjust the pattern's scale according to `opts.scale`.
    mergedOptions.pattern = mergedOptions.pattern.replace(
        '.00',
        `.${new Array(mergedOptions.scale + 1).join('0')}`,
    );

    // Truncate extra decimal places and round the number (Can prevent scientific notation)
    value = +(+value).toFixed(mergedOptions.scale);

    return currencyFormatter.format(value, mergedOptions);
}
