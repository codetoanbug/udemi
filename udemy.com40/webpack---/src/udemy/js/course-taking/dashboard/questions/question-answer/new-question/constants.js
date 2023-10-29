import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

const udConfig = getConfigData();

export const NEW_QUESTION = 'new_question';
export const SUPPORT_REQUEST = 'support_request';

// tracking constants
export const NEW_QUESTION_RELATED_VIEW = 'new-question-related-to-view';
export const TRACKING_ACTIONS = Object.freeze({
    CATEGORY_SELECT: `${NEW_QUESTION_RELATED_VIEW}.category_select`,
    COURSE_CONTENT: `${NEW_QUESTION_RELATED_VIEW}.course-content`,
    SOMETHING_ELSE: `${NEW_QUESTION_RELATED_VIEW}.something-else`,
});

// Support form
export const CERTIFICATE_CATEGORY = 'certificates';
export const AUDIO_VIDEO_CATEGORY = 'audio_video';
export const DOWNLOADING_RESOURCE_CATEGORY = 'downloading_resources';
export const OTHER_CATEGORY = 'other';

// support links
export const CERTIFICATION = udLink.toSupportLink(
    'certificate_of_completion',
    udConfig.brand.has_organization,
);
export const VIDEO = udLink.toSupportLink(
    'video_audio_issues_troubleshooting',
    udConfig.brand.has_organization,
);
export const DOWNLOADING = udLink.toSupportLink(
    'downloading_supplemental_resources',
    udConfig.brand.has_organization,
);
export const OTHER = udLink.toSupportLink('default', udConfig.brand.has_organization);
