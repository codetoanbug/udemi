import SystemMessage from 'utils/ud-system-message';

// TODO: Find a better place for this and fetch it from backend
export const AUTO_TRANSCRIPTION_LANGUAGES = ['en', 'es', 'pt', 'fr', 'it'];

// We currently support UFB translation languages, and additionally Polish marketplace.
export const AUTO_TRANSLATION_LANGUAGES = ['fr', 'de', 'pl', 'it', 'es', 'pt'];

export const ALERT_CODES = {
    DISABLED: 'disabled',
    DISABLED_LANGUAGE_CATEGORY: 'disabledLanguageCategory',
    LOW_QUALITY: 'lowQuality',
    MANUAL_COVERAGE: 'manualCoverage',
    AUTO_COVERAGE: 'autoCoverage',
    AUTO_TRANSLATED_CAPTIONS: 'auto_translated_captions',
    INCOMPLETE_AUTO_TRANSLATED_CAPTIONS: 'incomplete_auto_translated_captions',
    AUTO_GENERATED_CAPTION_INSTRUCTIONS: 'auto_generated_caption_instructions',
    REACH_MORE_STUDENT_WITH_CAPTIONS: 'reach_more_student_with_captions',
    REACH_MORE_STUDENT_WITH_TRANSLATED_CAPTIONS: 'reach_more_student_with_translated_captions',
};

export const ALERTS = {
    [ALERT_CODES.REACH_MORE_STUDENT_WITH_TRANSLATED_CAPTIONS]: {
        title: gettext('Reach more students with translated captions'),
        body: gettext(
            'Translated captions can help your content to be more accessible to more students. You can upload translated captions for your course at any time.',
        ),
    },

    [ALERT_CODES.REACH_MORE_STUDENT_WITH_CAPTIONS]: {
        title: gettext('Reach more students with captions'),
        body: gettext(
            'Captions can help your content to be accessible to more students. You can upload captions for your course at any time.',
        ),
    },

    [ALERT_CODES.AUTO_GENERATED_CAPTION_INSTRUCTIONS]: {
        title: gettext('Reach more students with captions'),
        body: gettext(
            'Udemy will add auto-generated captions to your course to make course content more accessible. Captions will be available within 48 hours of publishing your course. You can review and edit your captions on this page once they have been generated.',
        ),
        footerLink: {
            title: gettext('Find out more about captions here.'),
            href: '/udemy-teach-hub/course_creation/',
        },
    },

    [ALERT_CODES.AUTO_TRANSLATED_CAPTIONS]: {
        title: gettext('Reach international students with captions'),
        body: gettext(
            'Your course captions have been automatically translated into %(locale)s. If you want do not want these captions available on your course, you can disable them.',
        ),
        systemMessageId: SystemMessage.ids.autoTranslatedCaptions,
    },

    [ALERT_CODES.INCOMPLETE_AUTO_TRANSLATED_CAPTIONS]: {
        level: 'warning',
        title: gettext(
            'Some lectures are missing captions because auto-translation failed due to missing punctuation.',
        ),
        body: gettext(
            'To have these lectures retranslated, please review all source captions in English and add punctuation where relevant.',
        ),
    },
    [ALERT_CODES.LOW_QUALITY]: {
        level: 'warning',
        title: gettext(
            'Captions have been automatically generated for this course in %(locale)s, but have been disabled since they are low ' +
                'quality',
        ),
        body: gettext(
            'We recommend reviewing these captions for errors. You can easily edit and improve captions by clicking Edit to launch ' +
                "Udemy's Caption Editing Tool.",
        ),
        systemMessageId: SystemMessage.ids.courseTranslationLowConfidence,
    },
    [ALERT_CODES.DISABLED_LANGUAGE_CATEGORY]: {
        level: 'warning',
        title: gettext(
            'Closed Captions have been automatically generated for this course in %(locale)s, but have been disabled since this is a ' +
                'Language course',
        ),
        body: gettext(
            'If the course contains other languages the resulting captions may be low quality. You can enable captions for this course but ' +
                'we recommend that you first review the captions and fix any errors.',
        ),
        systemMessageId: SystemMessage.ids.courseTranslationDisabledLanguageCat,
    },
    [ALERT_CODES.DISABLED]: {
        level: 'warning',
        title: gettext('Captions have been disabled for %(locale)s.'),
    },
    [ALERT_CODES.MANUAL_COVERAGE]: {
        level: 'success',
        title: gettext('All published lectures have been captioned.'),
        body: gettext(
            'Students will now see the ‘CC’ icon for %(locale)s on your course landing page.',
        ),
        systemMessageId: SystemMessage.ids.courseTranslationManualCoverage,
    },
    [ALERT_CODES.AUTO_COVERAGE]: {
        level: 'success',
        title: gettext('Captions have been automatically generated for this course in %(locale)s'),
        body: gettext(
            'We recommend reviewing these captions for errors. You can easily edit and improve captions by clicking Edit to launch ' +
                "Udemy's Caption Editing Tool.",
        ),
        systemMessageId: SystemMessage.ids.courseTranslationAutoCoverage,
    },
};

export const AVAILABILITY = {
    PUBLIC: 'public',
    RESTRICTED: 'restricted',
};

export const ALLOWED_CURRICULUM_TYPES = ['chapter', 'lecture'];

export const ALLOWED_ASSET_TYPES = ['Video', 'VideoMashup'];

export const EMPTY_GROUP = {id: -1, title: gettext('Ungrouped lectures')};

export const PROMO_VIDEO_EMPTY_GROUP = {id: -2, title: gettext('Promotional video')};

export const CAPTION_ERROR_TITLES = {
    VALIDATION: gettext('The caption file could not be uploaded due to the following error:'),
    UPLOAD: gettext('An error occurred uploading your file. Please try again later.'),
    NAME_COLLISION: gettext('An error occurred uploading your file. Please try again later.'),
};

export const CAPTION_TABS = {
    ALL: 'ALL',
    UNCAPTIONED: 'UNCAPTIONED',
    AUTOCAPTIONED: 'AUTOCAPTIONED',
    LOW_QUALITY: 'LOW_QUALITY',
};

export const CAPTION_REQUEST_FIELDS = {
    'fields[caption]':
        'asset_id,locale_id,title,url,source,status,confidence_threshold,modified,is_edit,is_edit_of_autocaption',
};

export const DRAFT_CAPTION_REQUEST_FIELDS = {
    'fields[draft_caption]': 'asset_id,locale_id,source,status,published_caption_id,modified',
};

export const BASE_CURRICULUM_REQUEST_PARAMS = {
    'fields[asset]': 'asset_type,id',
    captions_status: '__all__',
};

export const BASE_LOCALE_REQUEST_PARAMS = {
    page_size: 200,
};

export const DEFAULT_TIMEOUT_FOR_INTERACTION = 1000;

export const COURSE_TRANSLATION_TYPE_NAME = 'course_translation';

// Used in the caption editor URL as ID for the lecture (a promo video isn't a lecture)
export const PROMO_VIDEO_ID = 'promo-video';

// A mapping between possible caption sources and their priority
export const CAPTION_SOURCES = {
    managed: 1,
    manual: 2,
    auto: 3,
};
