/**
 * The two dates in a given year before the local timezone switches between standard and
 * daylight due to Daylight Saving Time (DST). The dates are precise to the minute.
 */
interface DSTBeforeSwitchDates {
    /**
     * The minute before the standard to daylight switch. Null if DST is not observed.
     * @example: 2021-03-14 01:59:00 represents a switch at 2021-03-14 02:00:00.
     */
    daylightDate: Date | null;
    /**
     * The minute before the daylight to standard switch. Null if DST is not observed.
     * @example: 2021-11-07 01:59:00 represents a switch at 2021-11-07 02:00:00.
     */
    standardDate: Date | null;
}

/**
 * Returns a VTIMEZONE calendar component for the local timezone, e.g. America/Los_Angeles.
 *
 * - IETF spec: https://datatracker.ietf.org/doc/html/rfc5545#section-3.6.5
 *
 * - iCalendar spec: https://icalendar.org/iCalendar-RFC-5545/3-6-5-time-zone-component.html
 *
 * In short, VTIMEZONE consists of STANDARD and DAYLIGHT sections which describe when
 * Daylight Saving Time (DST) occurs. This makes recurring calendar events robust against DST.
 * E.g. we want an event that occurs every day at noon to occur at noon regardless of DST.
 *
 * Unfortunately, the current implementation does not fully work.
 * It only defines STANDARD and DAYLIGHT sections for the current year, which means recurring events
 * are robust against DST only for this year and some of next year. It can easily cover more years,
 * at the cost of bloating the .ics file. It cannot cover events that recur forever. That requires a
 * more complex implementation which generates VTIMEZONE defined by RRULE.
 * See https://github.com/udemy/website-django/pull/75135 for details.
 */
export function formatVTimezone() {
    const tzId = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const {daylightDate, standardDate} = findDSTBeforeSwitchDates(new Date());
    let body = '';
    if (standardDate) {
        body += formatVTimezoneSection(standardDate, 'STANDARD');
    }
    if (daylightDate) {
        body += formatVTimezoneSection(daylightDate, 'DAYLIGHT');
    }
    return `BEGIN:VTIMEZONE\nTZID:${tzId}\n${body}END:VTIMEZONE\n`;
}

/**
 * @param date - a DSTBeforeSwitchDates date, e.g. 2021-03-14 01:59:00
 * @param dstType - VTIMEZONE section type, either 'STANDARD' or 'DAYLIGHT'
 * @returns VTIMEZONE section
 */
function formatVTimezoneSection(date: Date, dstType: string) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dtStartDate = new Date(Date.UTC(year, month, day, hours, minutes + 1));
    const dtStart = dtStartDate.toISOString().slice(0, 19).replace(/:|-/g, '');
    const dstSwitchDate = new Date(year, month, day, hours, minutes + 1);
    return `BEGIN:${dstType}
DTSTART:${dtStart}
TZOFFSETFROM:${formatVTimezoneTZOffset(date)}
TZOFFSETTO:${formatVTimezoneTZOffset(dstSwitchDate)}
TZNAME:${formatVTimezoneTZName(dstSwitchDate)}
END:${dstType}\n`;
}

/**
 * @param date - a Date, e.g. 2021-03-14 01:59:00
 * @returns timezone offset of `date`, e.g. '-0800'
 */
function formatVTimezoneTZOffset(date: Date) {
    const offset = -1 * date.getTimezoneOffset();
    const sign = offset < 0 ? '-' : '+';
    const hours = `${Math.floor(Math.abs(offset) / 60)}`.padStart(2, '0');
    const minutes = `${Math.floor(Math.abs(offset) % 60)}`.padStart(2, '0');
    return `${sign}${hours}${minutes}`;
}

/**
 * @param date - a Date, e.g. 2021-03-14 01:59:00
 * @returns timezone name of `date`, e.g. 'PST'
 */
function formatVTimezoneTZName(date: Date) {
    const dtf = new Intl.DateTimeFormat('en-US', {timeZoneName: 'short'});
    const tzNamePart = dtf.formatToParts(date).find((part) => part.type === 'timeZoneName');
    return tzNamePart ? tzNamePart.value : dtf.resolvedOptions().timeZone;
}

/**
 * @param yearDate - a Date, e.g. 2021 (only the year matters)
 * @returns DSTBeforeSwitchDates for `yearDate`
 * @example
 * timezone: 'America/Los_Angeles'
 * yearDate: 2021
 * DSTBeforeSwitchDates.daylightDate: 2021-03-14 01:59:00
 * DSTBeforeSwitchDates.standardDate: 2021-11-07 01:59:00
 * @example
 * timezone: 'America/Phoenix'
 * yearDate: 2021
 * DSTBeforeSwitchDates.daylightDate: null
 * DSTBeforeSwitchDates.standardDate: null
 */
function findDSTBeforeSwitchDates(yearDate: Date) {
    const dstBeforeSwitchDates: DSTBeforeSwitchDates = {daylightDate: null, standardDate: null};
    let prevDate;
    const currDate = new Date(yearDate.getFullYear(), 0, 1);
    for (let month = 0; month < 12; month += 1) {
        prevDate = new Date(currDate);
        currDate.setMonth(month);
        const prevTimezoneOffset = -1 * prevDate.getTimezoneOffset();
        const currTimezoneOffset = -1 * currDate.getTimezoneOffset();
        if (currTimezoneOffset > prevTimezoneOffset) {
            dstBeforeSwitchDates.daylightDate = narrowDownDSTBeforeSwitchMonthDate(prevDate);
        } else if (currTimezoneOffset < prevTimezoneOffset) {
            dstBeforeSwitchDates.standardDate = narrowDownDSTBeforeSwitchMonthDate(prevDate);
        }
    }
    return dstBeforeSwitchDates;
}

const setDay = (date: Date, day: number) => date.setDate(day);
const setHours = (date: Date, hour: number) => date.setHours(hour);
const setMinutes = (date: Date, minute: number) => date.setMinutes(minute);

/**
 * @param monthDate - a Date before a DST switch, precise to the month.
 * E.g. 2021-03-01 00:00:00 represents a switch between 2021-03-01 00:00:01 and 2021-04-01 00:00:00.
 * @returns the minute in `monthDate` before a DST switch, e.g. 2021-03-14 01:59:00
 */
function narrowDownDSTBeforeSwitchMonthDate(monthDate: Date) {
    // The second and third numbers define a range. E.g. `1, 6` means `1, 2, 3, 4, 5`.
    // The ranges cover every value in the current date, and the first value in the next date.
    // - range(1, 33): 01-31 covers every day in the month. 32 covers day 1 in the next month.
    // - range(0, 25): 00-23 covers every hour in the day. 24 covers hour 0 in the next day.
    // - range(0, 61): 00-59 covers every minute in the hour. 60 covers minute 0 in the next hour.
    const dayDate = narrowDownDSTBeforeSwitchDate(monthDate, 1, 33, setDay);
    const hourDate = narrowDownDSTBeforeSwitchDate(dayDate, 0, 25, setHours);
    return narrowDownDSTBeforeSwitchDate(hourDate, 0, 61, setMinutes);
}

function narrowDownDSTBeforeSwitchDate(
    date: Date,
    start: number,
    end: number,
    setCurrDate: (date: Date, dateValue: number) => void,
) {
    let prevDate;
    const currDate = new Date(date);
    for (let dateValue = start; dateValue < end; dateValue += 1) {
        prevDate = new Date(currDate);
        setCurrDate(currDate, dateValue);
        if (prevDate.getTimezoneOffset() !== currDate.getTimezoneOffset()) {
            return prevDate;
        }
    }
    return date;
}
