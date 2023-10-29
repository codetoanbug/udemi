import udLink from 'utils/ud-link';

export function absolute(path) {
    return udLink.to(`organization-manage/insights${path}`);
}

export function absoluteTapen(path, organizationId) {
    return udLink.to(`tapen/organization/${organizationId}/insights${path}`);
}

export function toCourseInsights() {
    return '/courses/';
}
toCourseInsights.regex = '/courses/';

export function toSkillInsights() {
    return '/skill-insights';
}
toSkillInsights.regex = '/skill-insights';

export function toSkillMastery() {
    return '/skill-mastery/';
}
toSkillMastery.regex = '/skill-mastery/';

export function toUserActivity() {
    return '/user-activity/';
}
toUserActivity.regex = '/user-activity/';

export function toUserAdoption() {
    return '/user-adoption/';
}
toUserAdoption.regex = '/user-adoption/';

export function toCourseDetails(courseId) {
    return `/course/${courseId}`;
}
toCourseDetails.regex = '/course/:courseId(\\d+)';

export function toRatingsAndReviews() {
    return `/ratings-reviews`;
}
toRatingsAndReviews.regex = '/ratings-reviews';

export function toLearnerFeedback() {
    return '/learner-feedback';
}
toLearnerFeedback.regex = '/learner-feedback';

export function toProInsights() {
    return '/pro';
}
toProInsights.regex = '/pro';

export function toPathInsights() {
    return '/paths/';
}
toPathInsights.regex = '/paths/';

export function toPathDetails(pathId) {
    return `/paths/${pathId}`;
}
toPathDetails.regex = '/paths/:pathId(\\d+)';
