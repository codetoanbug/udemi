import React from 'react';

import {useI18n} from '../use-i18n';
import {
    parseDateString as internalParseDateString,
    toLocaleDateString as internalToLocaleDateString,
    toLocalDateStamp as internalToLocalDateStamp,
    compare as internalCompare,
    setDay as internalSetDay,
    increment as internalIncrement,
    CompareUnit,
    COMPARE_UNIT,
    IncrementUnit,
} from './format-date';

export function useFormatDate() {
    const i18n = useI18n();

    /*
    Attempt to turn a string representing a date into a Date object.

    We can't turn an arbitrary string into a date, but can handle some common formats. We look for
    strings with a format matching the output of `toLocaleString()` with default options, for a
    given locale.

    We also support a default 'ISO' format, YYYY-MM-DD, by passing the value 'ISO' as the locale.

    If `locale` is not given, we extract a value from the current request context.
 */
    const parseDateString = React.useCallback(
        (dateString: string, locale: string) => {
            if (!locale) {
                locale = i18n.locale.replace('_', '-') || 'en-US';
            }
            return internalParseDateString(dateString, locale);
        },
        [i18n.locale],
    );

    /*
    Shortcut for using `Date.prototype.toLocaleDateString()`
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    with the locale extracted from the current request context.
 */
    const toLocaleDateString = React.useCallback(
        (date: Date, format?: Intl.DateTimeFormatOptions) => {
            const locale = i18n.locale.replace('_', '-') || 'en-US';
            return internalToLocaleDateString(date, locale, format);
        },
        [i18n.locale],
    );

    /*
    Given a `date`, return its 'datestamp' (i.e. a string representation of the date in the format
    YYYY-MM-DD), in the local timezone.
 */
    const toLocalDateStamp = React.useCallback((date: Date) => {
        return internalToLocalDateStamp(date);
    }, []);

    /*
    Given two Date objects, return -1, 0 or 1 if `date1` is before, the same or after `date2`
    (respectively). This function may therefore be used for `.sort()` operations on arrays of Dates.

    If `date1` and `date2` represent the same timestamp but are different Date objects,
    `date1 == date2` and `date1 === date2` will both return false, whereas this function can be
    used reliably. Though note, `date1.getTime() === date2.getTime()` does return true.
 */
    const compare = React.useCallback(
        (date1: Date, date2: Date, unit: CompareUnit = COMPARE_UNIT.DAY) => {
            return internalCompare(date1, date2, unit);
        },
        [],
    );

    /*
    Returns a new Date object representing the nearest previous date to `date` corresponding to the
    given `dayOfWeek` (0 to 6 for Sunday to Saturday).

    For example, if `date` represents Weds 14th July, `setDay(date, 1)` will return a new Date
    representing Mon 12th July. `setDay(date, 3)` will return an Date representing Weds 14th July
    (i.e. unchanged).
 */
    const setDay = React.useCallback((date: Date, dayOfWeek: number) => {
        return internalSetDay(date, dayOfWeek);
    }, []);

    const increment = React.useCallback((date: Date, amount: number, unit: IncrementUnit) => {
        return internalIncrement(date, amount, unit);
    }, []);

    return {
        parseDateString,
        toLocaleDateString,
        toLocalDateStamp,
        compare,
        setDay,
        increment,
    };
}
