import {roundNumber} from '@udemy/i18n';

import {parseDateString} from 'utils/date';
import {formatNumber} from 'utils/numeral';
import qs from 'utils/query-params';

export {roundNumber};

export function updateCourseFilter(location, history, courseId) {
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    if (!queryParams.course_id && !courseId) {
        return;
    }
    if (queryParams.course_id !== courseId) {
        queryParams.course_id = courseId;
        history.push({
            pathname: location.pathname,
            search: qs.stringify(queryParams),
        });
    }
}

export function pacificTimeDate(date) {
    // Returns a Date that converts given date to Pacific time.
    // Hours, minutes, seconds, millis are set to 0.
    return parseDateString(
        date.toLocaleDateString('en-US', {timeZone: 'America/Los_Angeles'}),
        'en-US',
    );
}

export function utcDateFromLocalTime(date) {
    // Returns a Date that converts given date's local time year-month-day to UTC.
    // Hours, minutes, seconds, millis are set to 0.
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function utcDateFromUTC(date) {
    // Returns a Date that converts given date's UTC year-month-day to UTC.
    // Hours, minutes, seconds, millis are set to 0.
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatRoundNumber(number, precision = 0) {
    return formatNumber(roundNumber(number, precision).toFixed(precision));
}

export function formatPercent(percent, precision = 0) {
    return interpolate(
        gettext('%(percent)s%'),
        {percent: formatRoundNumber(percent, precision)},
        true,
    );
}
