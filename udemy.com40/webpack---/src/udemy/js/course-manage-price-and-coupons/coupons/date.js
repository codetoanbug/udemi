import getRequestData from 'utils/get-request-data';

const getLocale = () => getRequestData().locale.replace('_', '-') || 'en-US';

export function formatMonth(dateValue) {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString(getLocale(), {month: 'long'});
}

export function formatLocalTimezoneDate(dateValue) {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return date.toLocaleDateString(getLocale(), options);
}

export function formatPacificTimezoneDate(ptDate, givenOptions) {
    const options = {
        tzOffset: true,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        ...givenOptions,
    };
    const {tzOffset, year, month, day, hour, minute} = options;
    const dateString = ptDate.toLocaleDateString(getLocale(), {year, month, day});
    const timeString = ptDate.toLocaleTimeString(getLocale(), {hour, minute});

    const tsOffsetHours = ptDate.pacificTimezoneOffset / 60;
    const tzName = tsOffsetHours === 7 ? 'PDT' : 'PST';
    const tzOffsetGMTString = tzOffset ? `(GMT -${tsOffsetHours})` : '';
    return `${dateString} ${timeString} ${tzName} ${tzOffsetGMTString}`.trim();
}

export function formatDateInCouponCreationModal(ptDate) {
    return formatPacificTimezoneDate(ptDate, {month: 'long', day: 'numeric', tzOffset: false});
}
