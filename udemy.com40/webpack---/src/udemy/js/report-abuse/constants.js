export const FORM_STATES = {
    FRESH: 'fresh', // User just opened the form, show no errors
    ERROR: 'error', // One of the fields isn't valid
    SUBMITTING: 'submitting', // Request is being made to the backend
    SUBMITTED: 'submitted', // Show success message
};

export const CATEGORY = {
    POLICY: 'Policy',
    TECHNICAL: 'Technical',
};

export const REASON_CATEGORY = {
    [CATEGORY.POLICY]: 'Policy Issue',
    [CATEGORY.TECHNICAL]: 'Technical Issue',
};

export const POLICY_REASON = {
    INAPPROPRIATE_COURSE: 'Inappropriate Course Content',
    INAPPROPRIATE_BEHAVIOR: 'Inappropriate Behavior',
    POLICY: 'Udemy Policy Violation',
    SPAM: 'Spammy Content',
    OTHER: 'Other',
};

export const TECHNICAL_REASON = {
    AUDIO: 'Audio',
    VIDEO: 'Video',
    CAPTIONS: 'Captions',
    DOWNLOAD: 'Download',
};

export const AUDIO_REASON = {
    NONE: 'I cannot hear audio at all',
    LOW: 'I can hear audio, but the volume is very low',
    NONSENSE: 'I can hear audio clearly, but I cannot understand the instructor',
    BACKGROUND: 'Background music/sound is distracting',
};

export const VIDEO_REASON = {
    NONE: 'Video does not play at all',
    STOPS: 'Video plays but stops suddenly and will not continue',
    QUALITY: 'Video quality is poor',
    STUTTER: 'Video stutters (plays and stops)',
    RESTART: 'Video restarts after a few minutes',
};

export const CAPTION_REASON = {
    ENABLE: 'Captions are available but I cannot enable them',
    WRONG: "Captions are available but they're not accurate",
    BLOCKING: 'Captions are in the way of what’s shown on the video',
};

export const DOWNLOAD_REASON = {
    ENABLE: 'Lecture is available for download but I cannot download',
    RESOURCE: 'I cannot download/access the files listed in the resources section',
    CERTIFICATE: 'I cannot download/access the certificate of completion',
};
