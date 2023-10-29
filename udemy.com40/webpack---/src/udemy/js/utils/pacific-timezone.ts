import range from 'utils/range';

/**
 * Utils to work with Dates in Pacific Time (PT), a.k.a. America/Los_Angeles.
 * PT is either Pacific Standard Time (PST) or Pacific Daylight Time (PDT), depending on whether
 * Daylight Saving Time (DST) is active.
 */

/**
 * A Date that returns PT values when passed to `toLocalTimezoneISOString`.
 * This is the closest we can get to representing a Date in a specific timezone.
 * Dates are always UTC internally. They cannot be set to use another timezone.
 */
export interface PTDate extends Date {
    /**
     * 420 (i.e. -07:00) if PDT is active, or 480 (i.e. -08:00) if PST is active.
     */
    pacificTimezoneOffset: number;
}

/**
 * Returns the two Dates in a given year when PT switches between PST and PDT due to DST.
 * The first date is when DST starts. This occurs on the second Sunday in March at 2am PT.
 * Time jumps forward from 1:59am PST to 3:00am PDT.
 * The second date is when DST ends. This occurs on the first Sunday in November at 2am PT.
 * Time jumps backward from 1:59am PDT to 1:00am PST.
 */
export function getPacificDSTRange(year: number) {
    const isSunday = (date: Date) => date.getUTCDay() === 0;
    const dstStartDate = range(14)
        .map((i) => new Date(Date.UTC(year, 2, i + 1, 10)))
        .filter(isSunday)[1];
    const dstEndDate = range(7)
        .map((i) => new Date(Date.UTC(year, 10, i + 1, 9)))
        .filter(isSunday)[0];
    return [dstStartDate, dstEndDate];
}

/**
 * Implements `Date.prototype.getTimezoneOffset` as if the local timezone is PT.
 * Returns 420 (i.e. -07:00) if PDT is active, or 480 (i.e. -08:00) if PST is active.
 */
export function getPacificTimezoneOffset(dateValue: string | number | Date) {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    const [dstStartDate, dstEndDate] = getPacificDSTRange(date.getUTCFullYear());
    return date >= dstStartDate && date < dstEndDate ? 420 : 480;
}

/**
 * Converts a UTC date value to a PTDate.
 * The value is offset such that `toLocalTimezoneISOString` returns PT values.
 */
export function applyPacificTimezoneOffset(dateValue: string | number | Date) {
    const date = new Date(dateValue);
    const ptDate: PTDate = Object.assign(date, {
        pacificTimezoneOffset: getPacificTimezoneOffset(date),
    });
    const offset = ptDate.getTimezoneOffset() - ptDate.pacificTimezoneOffset;
    offset !== 0 && ptDate.setMinutes(ptDate.getMinutes() + offset);
    return ptDate;
}

/**
 * Implements `Date.prototype.toISOString` using local timezone values and omitting the "Z".
 * `new Date` on such a string interprets the values in the local timezone, not UTC.
 */
export function toLocalTimezoneISOString(date: Date) {
    const YYYY = `${date.getFullYear()}`;
    const MM = `${date.getMonth() + 1}`.padStart(2, '0');
    const DD = `${date.getDate()}`.padStart(2, '0');
    const HH = `${date.getHours()}`.padStart(2, '0');
    const mm = `${date.getMinutes()}`.padStart(2, '0');
    const ss = `${date.getSeconds()}`.padStart(2, '0');
    const sss = `${date.getMilliseconds()}`.padStart(3, '0');
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}.${sss}`;
}

/**
 * Converts a Date that already returns PT values to a PTDate.
 * This just attaches the `pacificTimezoneOffset` property to the Date. The value is not offset.
 *
 * @param dstEndHint determines which offset to use for the 1am hour that repeats when DST ends.
 * By default, 420 is used. This is the offset for the first 1am hour in PDT.
 * Pass a PTDate to pick the hour based on whether Date increased or decreased from PTDate.
 */
export function attachPacificTimezoneOffset(date: Date, dstEndHint?: PTDate) {
    const ymdhString = toLocalTimezoneISOString(date).slice(0, 13);
    const [dstStartDate, dstEndDate] = getPacificDSTRange(date.getFullYear());
    const dstStartYMDString = dstStartDate.toISOString().slice(0, 10);
    const dstEndYMDString = dstEndDate.toISOString().slice(0, 10);
    let pacificTimezoneOffset;
    if (ymdhString === `${dstEndYMDString}T01`) {
        if (dstEndHint) {
            const dstEndHintYMDHString = toLocalTimezoneISOString(dstEndHint).slice(0, 13);
            if (dstEndHintYMDHString > ymdhString) {
                pacificTimezoneOffset = 480;
            } else if (dstEndHintYMDHString < ymdhString) {
                pacificTimezoneOffset = 420;
            } else {
                pacificTimezoneOffset = dstEndHint.pacificTimezoneOffset;
            }
        } else {
            pacificTimezoneOffset = 420;
        }
    } else if (ymdhString >= `${dstStartYMDString}T02` && ymdhString < `${dstEndYMDString}T02`) {
        pacificTimezoneOffset = 420;
    } else {
        pacificTimezoneOffset = 480;
    }
    return Object.assign(date, {pacificTimezoneOffset}) as PTDate;
}

/**
 * Implements `Date.prototype.toISOString` for a PTDate.
 */
export function ptToISOString(ptDate: PTDate) {
    const Z = ptDate.pacificTimezoneOffset === 420 ? '-07:00' : '-08:00';
    return new Date(toLocalTimezoneISOString(ptDate) + Z).toISOString();
}
