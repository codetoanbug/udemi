export const TABS = Object.freeze({
    SEARCH: 'search',
    CONTENT: 'content',
    OVERVIEW: 'overview',
    QUESTIONS: 'questions',
    ANNOUNCEMENTS: 'announcements',
    NOTES: 'notes',
    LABS: 'labs',
    REVIEWS: 'reviews',
    LEARNING_TOOLS: 'learning-tools',
});

export const TAB_TITLES = Object.freeze({
    [TABS.SEARCH]: gettext('Search'),
    [TABS.CONTENT]: gettext('Course content'),
    [TABS.OVERVIEW]: gettext('Overview'),
    [TABS.QUESTIONS]: gettext('Q&A'),
    [TABS.ANNOUNCEMENTS]: gettext('Announcements'),
    [TABS.NOTES]: gettext('Notes'),
    [TABS.LABS]: gettext('Workspaces'),
    [TABS.REVIEWS]: gettext('Reviews'),
    [TABS.LEARNING_TOOLS]: gettext('Learning tools'),
});
