import getConfigData from 'utils/get-config-data';

export function isLearningPathEnabled(globalOverrides = {}) {
    const udConfig = globalOverrides.Config ?? getConfigData();
    return udConfig.features.organization.learning_path.enabled;
}

export function parsePrimaryCourseLabel(courseHasLabels) {
    const courseHasLabel = courseHasLabels.filter((label) => label.is_primary).find(Boolean);
    if (courseHasLabel) {
        return courseHasLabel.label;
    }
    return {};
}

export function shouldDisplayRetirementBadge(course) {
    return !getConfigData().brand.is_team && !!(course.retirementDate || course.retirement_date);
}
