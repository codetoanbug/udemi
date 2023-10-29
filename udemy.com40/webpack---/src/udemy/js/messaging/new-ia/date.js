import getRequestData from 'utils/get-request-data';

// eslint-disable-next-line import/prefer-default-export
export function localizeRecentDate(datetime) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const date = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());

    const oneDayAgo = new Date(today.getTime());
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    if (oneDayAgo < date && date <= today) {
        return gettext('today');
    }

    const twoDaysAgo = new Date(oneDayAgo.getTime());
    twoDaysAgo.setDate(oneDayAgo.getDate() - 1);
    if (twoDaysAgo < date && date <= oneDayAgo) {
        return gettext('yesterday');
    }

    return date.toLocaleDateString(getRequestData().locale.replace('_', '-') || 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
