// Keep these languages in sync with PUBLIC_LANGUAGES in the Django settings!
// https://github.com/udemy/website-django/blob/master/udemy/settings/i18n.py#L25
//
// [0] is the regex that parses the date string.
// [1], [2], [3] are the zero-based positions of the year, month, and day.
// [4] is the year offset from the Gregorian calendar.
const _DATE_PARSER: Record<string, [RegExp, number, number, number, number]> = {
    'en-US': [/^(\d+)\/(\d+)\/(\d+)$/, 2, 0, 1, 0],
    'de-DE': [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
    'es-ES': [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
    'fr-FR': [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
    'id-ID': [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
    'it-IT': [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
    'ja-JP': [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
    'ko-KR': [/^(\d+)\. ?(\d+)\. ?(\d+)\.?$/, 0, 1, 2, 0],
    'nl-NL': [/^(\d+)-(\d+)-(\d+)$/, 2, 1, 0, 0],
    'pl-PL': [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
    'pt-BR': [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
    'ro-RO': [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
    'ru-RU': [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
    'th-TH': [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 543],
    'tr-TR': [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
    'zh-CN': [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
    'zh-TW': [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
    ISO: [/^(\d+)-(\d+)-(\d+)$/, 0, 1, 2, 0],
};

export const COMPARE_UNIT = Object.freeze({
    DAY: 'day',
    MONTH: 'month',
});
export type CompareUnit = (typeof COMPARE_UNIT)[keyof typeof COMPARE_UNIT];

export const INCREMENT_UNIT = Object.freeze({
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year',
});
export type IncrementUnit = (typeof INCREMENT_UNIT)[keyof typeof INCREMENT_UNIT];

/*
    Attempt to turn a string representing a date into a Date object.

    We can't turn an arbitrary string into a date, but can handle some common formats. We look for
    strings with a format matching the output of `toLocaleString()` with default options, for a
    given locale.

    We also support a default 'ISO' format, YYYY-MM-DD, by passing the value 'ISO' as the locale.

    If `locale` is not given, we extract a value from the current request context.
 */
export function parseDateString(dateString: string, locale: string) {
    const parser = _DATE_PARSER[locale];
    if (!parser) {
        throw new Error(`Unknown locale ${locale} for parsing date string.`);
    }
    const [regex, yearPos, monthPos, dayPos, yearOffset] = parser;
    const match = dateString.match(regex) || [];
    const year = parseInt(match[yearPos + 1], 10) || 0;
    const month = parseInt(match[monthPos + 1], 10) || 0;
    const day = parseInt(match[dayPos + 1], 10) || 0;
    if (match.length !== 4 || month < 1 || month > 12 || day < 1 || day > 31 || year < 100) {
        throw new Error('Invalid date');
    }
    return new Date(year - yearOffset, month - 1, day);
}

/*
    Shortcut for using `Date.prototype.toLocaleDateString()`
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    with the locale extracted from the current request context.
 */
export function toLocaleDateString(
    date: Date,
    locale: string,
    format?: Intl.DateTimeFormatOptions,
) {
    return date.toLocaleDateString(locale, format);
}

/*
    Given a `date`, return its 'datestamp' (i.e. a string representation of the date in the format
    YYYY-MM-DD), in the local timezone.
 */
export function toLocalDateStamp(date: Date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}`;
}

/*
    Given two Date objects, return -1, 0 or 1 if `date1` is before, the same or after `date2`
    (respectively). This function may therefore be used for `.sort()` operations on arrays of Dates.

    If `date1` and `date2` represent the same timestamp but are different Date objects,
    `date1 == date2` and `date1 === date2` will both return false, whereas this function can be
    used reliably. Though note, `date1.getTime() === date2.getTime()` does return true.
 */
export function compare(date1: Date, date2: Date, unit: CompareUnit = COMPARE_UNIT.DAY) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    if (unit === COMPARE_UNIT.MONTH) {
        date1.setDate(1);
        date2.setDate(1);
    }
    if (date1 > date2) {
        return 1;
    } else if (date1 < date2) {
        return -1;
    }
    return 0;
}

/*
    Returns a new Date object representing the nearest previous date to `date` corresponding to the
    given `dayOfWeek` (0 to 6 for Sunday to Saturday).

    For example, if `date` represents Weds 14th July, `setDay(date, 1)` will return a new Date
    representing Mon 12th July. `setDay(date, 3)` will return an Date representing Weds 14th July
    (i.e. unchanged).
 */
export function setDay(date: Date, dayOfWeek: number) {
    const newDate = new Date(date);
    const currentDay = newDate.getDay();
    const offset = dayOfWeek - currentDay;
    newDate.setDate(newDate.getDate() + offset);
    return newDate;
}

export function increment(date: Date, amount: number, unit: IncrementUnit) {
    const newDate = new Date(date);
    if (unit === INCREMENT_UNIT.DAY) {
        newDate.setDate(newDate.getDate() + amount);
    } else if (unit === INCREMENT_UNIT.MONTH) {
        newDate.setMonth(newDate.getMonth() + amount);
    } else if (unit === INCREMENT_UNIT.YEAR) {
        newDate.setFullYear(newDate.getFullYear() + amount);
    }
    return newDate;
}
