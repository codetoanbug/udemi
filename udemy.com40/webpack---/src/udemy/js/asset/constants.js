export const ASSET_TYPE = Object.freeze({
    ARTICLE: 'Article',
    AUDIO: 'Audio',
    EBOOK: 'E-Book',
    EXTERNAL_LINK: 'ExternalLink',
    FILE: 'File',
    IFRAME: 'IFrame',
    IMPORT_CONTENT: 'ImportContent',
    PRESENTATION: 'Presentation',
    SOURCE_CODE: 'SourceCode',
    UPCOMING: 'Upcoming',
    VIDEO: 'Video',
    VIDEO_MASHUP: 'VideoMashup',
});

export const ASSET_STATUS = Object.freeze({
    SUCCESS: 1,
    UNPROCESSED: 0,
    FAILED: -1,
    DELAYED: -2,
});

export const ASSET_URL_TTL = 4 * 60 * 60 * 1000; // 4 hours in ms
export const ASSET_LICENSE_TOKEN_TTL = 5 * 60 * 1000; // 5 minutes in ms
