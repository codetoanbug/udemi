export function formatNumber(
    value: number | string,
    fullLocale: string,
    options: Intl.NumberFormatOptions = {},
) {
    const localeTokens = fullLocale.split('_');
    const locale = localeTokens.length > 0 ? localeTokens[0] : 'en';
    return Number(value).toLocaleString(locale, options);
}

export function roundNumber(number: number, precision = 0) {
    const power = Math.pow(10, precision);
    return Math.round(number * power) / power;
}

export function formatRoundNumber(
    value: number | string,
    precision = 0,
    fullLocale: string,
    options: Intl.NumberFormatOptions = {},
) {
    return formatNumber(
        roundNumber(Number(value), precision).toFixed(precision),
        fullLocale,
        options,
    );
}
