export const MAX_BODY_LENGTH = 140;

export const MAX_BODY_LENGTH_V2 = 1000;

// The max body length used for validation at the backend
export const MAX_BODY_LENGTH_V2_BE = 1200;

export const PAGE_SIZE_BOOKMARKS = 100;

export const PAGE_SIZE = 12;

export const API_DEBOUNCE_INTERVAL = 300;

export const TRACKING_ACTIONS = Object.freeze({
    CREATE: 'create',
    OPEN: 'view',
    DELETE: 'delete',
    UPDATE: 'update',
    SORT_BY_RECENCY: 'recency',
    SORT_BY_OLDEST: 'oldest',
    FILTER_ALL_LECTURES: 'all_lectures',
    FILTER_CURRENT_LECTURE: 'current_lecture',
});

export const TRACKING_LOCATIONS = Object.freeze({
    DASHBOARD: 'dashboard_note_tab',
});

export const SORT_BY = Object.freeze({
    OLDEST: 'oldest',
    RECENCY: 'recency',
});

export const SORT_LABELS = Object.freeze({
    [SORT_BY.RECENCY]: gettext('Sort by most recent'),
    [SORT_BY.OLDEST]: gettext('Sort by oldest'),
});

export const LECTURE_FILTER = Object.freeze({
    ALL: 'all_lectures',
    CURRENT: 'current_lecture',
});

export const LECTURE_FILTER_LABELS = Object.freeze({
    [LECTURE_FILTER.ALL]: gettext('All lectures'),
    [LECTURE_FILTER.CURRENT]: gettext('Current lecture'),
});
