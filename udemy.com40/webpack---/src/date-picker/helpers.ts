/**
 * Checks if two date objects refer to the same date, by reference or
 * by year, month, and day
 *
 * @param a - date for comparison
 * @param b - date for comparison
 * @returns true if `a` and `b` are the same date
 *
 * @internal
 */
export function isSameDate(a: Date | null | undefined, b: Date | null | undefined) {
    if (a === b) {
        return true;
    }
    if ((a && !b) || (b && !a)) {
        return false;
    }
    // Assert: a and b are non-null. In the case that one is null and the other is undefined,
    // the following expression will return true, since `(null)?.foo() => undefined` and
    // `(undefined)?.foo() => undefined`
    return (
        a?.getFullYear() === b?.getFullYear() &&
        a?.getMonth() === b?.getMonth() &&
        a?.getDate() === b?.getDate()
    );
}

/**
 *
 * @param date - date to round
 * @param precision - day or month
 * @returns `date` rounded to the nearest month (first day of month) or day (midnight)
 *
 * @internal
 */
export function roundDate(date: Date, precision: 'DAY' | 'MONTH') {
    const day = precision === 'MONTH' ? 1 : date.getDate();
    return new Date(date.getFullYear(), date.getMonth(), day);
}
