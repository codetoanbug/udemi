import {useI18n, I18nApi} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';
import React from 'react';

type I18nFunctions = Pick<I18nApi, 'gettext' | 'ninterpolate'>;
interface RequestTimeStamps {
    clientTimestamp: string;
    serverTimestamp: string;
}

const secondsPerMinute = 60;
const secondsPerHour = 60 * 60;
const secondsPerDay = 60 * 60 * 24;
const secondsPerMonth = 60 * 60 * 24 * 30;
const monthsPerYear = 12;

/** The TimeFormatter interface is used for creating an object of string formatters based on
 *  length of time we are attempting to format (seconds, minutes, hours, etc.) */
interface TimeFormatter {
    seconds: (i18n: I18nFunctions) => string;
    minutes: (delta: number, i18n: I18nFunctions) => string;
    hours: (delta: number, i18n: I18nFunctions) => string;
    days: (delta: number, i18n: I18nFunctions) => string;
    months: (delta: number, i18n: I18nFunctions) => string;
    years: (delta: number, i18n: I18nFunctions) => string;
}

/** An object implementing the `TimeFormatter` interface.
 *  This is used for past date formats.
 *  @internal
 *
 *  @privateRemarks
 *  This depends on `ninterpolate` being available in the global scope. Yuck.
 */
const pastFormats: TimeFormatter = {
    seconds: ({gettext}) => gettext('A few seconds ago'),
    minutes: (delta: number, {ninterpolate}) =>
        ninterpolate('%s minute ago', '%s minutes ago', delta),
    hours: (delta: number, {ninterpolate}) => ninterpolate('%s hour ago', '%s hours ago', delta),
    days: (delta: number, {ninterpolate}) => ninterpolate('%s day ago', '%s days ago', delta),
    months: (delta: number, {ninterpolate}) => ninterpolate('%s month ago', '%s months ago', delta),
    years: (delta: number, {ninterpolate}) => ninterpolate('%s year ago', '%s years ago', delta),
};

/** An object implementing the `TimeFormatter` interface.
 *  This is used for future date formats.
 *  @internal
 *
 *  @privateRemarks
 *  This depends on `ninterpolate` being available in the global scope. Yuck.
 */
const futureFormats: TimeFormatter = {
    seconds: ({gettext}) => gettext('In a few seconds'),
    minutes: (delta: number, {ninterpolate}) =>
        ninterpolate('In %s minute', 'In %s minutes', delta),
    hours: (delta: number, {ninterpolate}) => ninterpolate('In %s hour', 'In %s hours', delta),
    days: (delta: number, {ninterpolate}) => ninterpolate('In %s day', 'In %s days', delta),
    months: (delta: number, {ninterpolate}) => ninterpolate('In %s month', 'In %s months', delta),
    years: (delta: number, {ninterpolate}) => ninterpolate('In %s year', 'In %s years', delta),
};

interface RelativeDurationProps {
    /** The date & time time to format in a `RelativeDuration` component.
     *  This can be one of two formats:
     *  - string - Date.parse() will be used to extract a date/time value
     *  - JavaScript Date object.
     *
     */
    datetime: string | Date;
    /** The source of where this formate is coming from: client or server.
     *  If `client`, then some calculation is done to measure the client offset.
     */
    source?: 'server' | 'client';
}

/** The RelativeDuration component.  Returns a relative format string by calling the
 *  {@link formatRelativeDuration} method.
 */
export const RelativeDuration = ({datetime, source = 'server'}: RelativeDurationProps) => {
    const {gettext, ninterpolate} = useI18n(),
        {request} = useUDData(),
        timeStamps: RequestTimeStamps = {
            clientTimestamp: request.clientTimestamp,
            serverTimestamp: request.serverTimestamp,
        };

    return <>{formatRelativeDuration({datetime, source}, {gettext, ninterpolate}, timeStamps)}</>;
};

/** Formate a relative duration string
 *  @param datetime - `RelativeDurationProps.datetime` value
 *  @param source - `RelativeDurationProps.source` value
 *
 *  @returns a string with the formatted relative duration
 */
function formatRelativeDuration(
    {datetime, source}: RelativeDurationProps,
    i18n: I18nFunctions,
    timeStamps: RequestTimeStamps,
) {
    // In case the client's clock is off, measure how far off it is.
    const clientOffset = timeStamps.clientTimestamp
        ? Date.parse(timeStamps.clientTimestamp) - Date.parse(timeStamps.serverTimestamp)
        : 0;

    const nowMillis = Date.now() - clientOffset;
    let givenMillis = typeof datetime === 'string' ? Date.parse(datetime) : datetime.getTime();
    if (source === 'client') {
        givenMillis = givenMillis - clientOffset;
    }

    // You might prefer this function over the React component if you need to interpolate
    // the duration as part of a sentence, e.g. "Created a few seconds ago".
    const deltaMillis = givenMillis - nowMillis;
    const deltaSeconds = Math.floor(deltaMillis / 1000);
    if (deltaSeconds <= 0) {
        return formatTimedelta(-deltaSeconds, pastFormats, i18n);
    }
    return formatTimedelta(deltaSeconds, futureFormats, i18n);
}

/** This function returns the appropriate relative duration formatter
 *  based on the amount of time between the original `datetime` value and now.
 *  @see {@link TimeFormatter} interface
 *  @internal
 *
 *  @privateRemarks
 *  This function can appear like a confusing cluster of "if this, then return" values but
 *  if you look closer it's basically returning the appropriate `seconds()`, `minutes()`,
 *  `hours()` formatter based on the length of `deltaSeconds`.
 *
 *  @param deltaSeconds - the number of seconds between the original `datetime` and now
 *  @param formats - the appropriate object implementing a `TimeFormatter` interface.
 *  If the `deltaSeconds`is negative, a the {@link pastFormats} object is used, otherwise
 *  the {@link futureFormats} object is passed in.
 */
function formatTimedelta(deltaSeconds: number, formats: TimeFormatter, i18n: I18nFunctions) {
    if (deltaSeconds < secondsPerMinute) {
        return formats.seconds(i18n);
    }
    if (deltaSeconds < secondsPerHour) {
        return formats.minutes(Math.floor(deltaSeconds / secondsPerMinute), i18n);
    }
    if (deltaSeconds < secondsPerDay) {
        return formats.hours(Math.floor(deltaSeconds / secondsPerHour), i18n);
    }
    if (deltaSeconds < secondsPerMonth) {
        return formats.days(Math.floor(deltaSeconds / secondsPerDay), i18n);
    }
    const deltaMonths = Math.floor(deltaSeconds / secondsPerMonth);
    if (deltaMonths < monthsPerYear) {
        return formats.months(deltaMonths, i18n);
    }
    return formats.years(Math.floor(deltaMonths / monthsPerYear), i18n);
}
