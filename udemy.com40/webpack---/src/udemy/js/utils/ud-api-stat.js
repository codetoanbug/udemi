import udApi from 'utils/ud-api';

// FOLLOWING CONSTANTS ARE DEPRECATED, PLEASE DON'T USE THEM
export const PAGES = Object.freeze({
    COURSE_MANAGE: 'coursemanage',
    COURSE_TAKING: 'coursetaking',
    QUIZ_TAKING: 'quiz_taking',
    COURSE_LABEL: 'courselabel',
});

// FOLLOWING CONSTANTS ARE DEPRECATED, PLEASE DON'T USE THEM
export const CATEGORIES = Object.freeze({
    DASHBOARD: 'dashboard', // Course taking dashboard
    NAVIGATION: 'navigation',
    COURSE_CONTENT: 'course_content',
    TRANSCRIPT: 'transcript',
    TRANSCRIPT_EDITOR: 'transcript_editor',
    INTERSTITIAL: 'interstitial',
    CAPTION_EDITOR: 'caption_editor',
    BOOKMARK: 'bookmark',
    CURRICULUM: 'Curriculum',
    PLAYER_SETTINGS: 'player_settings',
});

export default {
    increment(key, tags, callback, errorCallback) {
        // Don't forget to add the namespace of the metric
        // to "udemy.visit.api.v2.constants.ALLOWED_DATADOG_KEY_NAMESPACES"
        udApi
            .post('/visits/me/datadog-increment-logs/', {
                key,
                tags: JSON.stringify(tags),
            })
            .then(callback)
            .catch(errorCallback);
    },
};
