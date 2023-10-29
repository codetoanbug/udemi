export const CAPTION_TYPES = Object.freeze({
    PUBLISHED: 'caption',
    DRAFT: 'draft-caption',
    CROWDSOURCED: 'crowdsourced-caption',
});

export const CAPTION_STATUS_CHOICES = Object.freeze({
    PROCESSING: -3,
    FAILED: -1,
    UNPROCESSED: 0,
    SUCCESS: 1,
    TRANSCODED: 2,
    // this status doesn't have equivalent in django side.
    DELETING: 42,
});

export const BASE_PROCESS_PERCENTAGES = Object.freeze({
    INITIAL: 20,
    UPLOADING: 70,
    FINAL: 10,
});

export const CAPTION_ERROR_TYPES = Object.freeze({
    VALIDATION: 'VALIDATION',
    UPLOAD: 'UPLOAD',
    NAME_COLLISION: 'NAME_COLLISION',
});

export const CAPTION_EXTENSIONS = Object.freeze(['vtt']);

export const CAPTION_EXTENSIONS_FORMATTED = Object.freeze(CAPTION_EXTENSIONS.map((ex) => `.${ex}`));

export const ERROR_TYPES = Object.freeze({
    LOADING: 'loading',
    PARSING: 'parsing',
    RETRY: 'retry',
});

export const MONITORING_EVENTS = Object.freeze({
    ERROR: 'caption_model.error',
    LOADED: 'caption_model.loaded',
});

export const CAPTION_RETRY_LIMIT = 4;
export const NETWORK_ERROR_MESSAGE = 'Network Error';
export const RETRYABLE_ERROR_STATUSES = [503, 504];
