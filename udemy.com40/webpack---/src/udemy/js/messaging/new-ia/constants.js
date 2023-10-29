export const SHOW_AUTOMATED_MESSAGES_SETTING = 'show-automated-messages';

export const FILTER_UNREAD = 'unread';
export const FILTER_UNRESPONDED = 'unresponded';
export const FILTER_STARRED = 'starred';
export const FILTER_AUTOMATED = 'automated';
export const VALID_FILTERS = [FILTER_UNREAD, FILTER_UNRESPONDED, FILTER_STARRED, FILTER_AUTOMATED];

export const SORT_LABELS = Object.freeze({
    '-modified': gettext('Newest first'),
    modified: gettext('Oldest first'),
});

const fetchParams = {
    'fields[message_thread]': 'other_user,is_read,is_starred,created,last_message,can_respond',
    'fields[user]': 'title,display_name,image_50x50,initials,url',
};
export const API_SETTINGS = Object.freeze({
    VALID_FILTERS,
    apiUrl: 'message-threads/',
    fetchUrl: (thread) => `message-threads/${thread.id}/`,
    apiDetailUrl: (thread) => `message-threads/${thread.id}/messages/`,
    detailParams: {
        'fields[message]': 'content,created,is_outgoing',
    },
    fetchParams,
    listParams: {
        ...fetchParams,
        limit: 12,
    },
});
