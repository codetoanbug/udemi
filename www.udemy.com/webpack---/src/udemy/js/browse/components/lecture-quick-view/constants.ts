export const LECTURE_QUICKVIEW_CONTENT_PAGE_TYPES = {
    PREVIOUS: 'previous',
    NEXT: 'next',
};

export const DEFAULT_LECTURE_QUICKVIEW_CONTENT_PAGE = 1;

export const LECTURE_DRAWER_ID = 'lecture-drawer';
export const MENU_TABS = {
    LECTURE_DETAILS: 'lecture-details',
    SECTION_PLAYLIST: 'section-playlist',
};

export const LECTURE_SEGMENTS = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get NO_SEGMENTS_MESSAGE() {
        return gettext('Segments aren’t available for this lecture video.');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get SEGMENT_DESCRIPTION() {
        return gettext(
            'Segments are important sections within a lecture video. They help you easily find specific content that you need and allows you to rewatch specific parts within a lecture quicker. Currently our segments are generated automatically.',
        );
    },
};
