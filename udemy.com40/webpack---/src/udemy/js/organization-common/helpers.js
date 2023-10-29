import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

export function hasAllowedPlans(allowedPlans, globalOverrides = {}) {
    const udConfig = globalOverrides.Config ?? getConfigData();
    return (
        udConfig.brand.has_organization &&
        allowedPlans.includes(udConfig.brand.organization.package_plan)
    );
}

export function hasAllowedRoles(allowedRoles, globalOverrides = {}) {
    const me = globalOverrides.me ?? udMe;
    return me.organization && allowedRoles.includes(me.organization.role);
}

// This method is deprecated. Use hasAllowedPlans instead.
export function hasAllowedPlan(...allowedPlans) {
    const udConfig = getConfigData();
    return (
        udConfig.brand.has_organization &&
        allowedPlans.includes(udConfig.brand.organization.package_plan)
    );
}

// This method is deprecated. Use hasAllowedRoles instead.
export function hasAllowedRole(...allowedRoles) {
    return udMe.organization && allowedRoles.includes(udMe.organization.role);
}

export function isCoursePublished(course) {
    // Not all contexts have access to a course instance with camelCased properties, so we check
    // snake_case as well.
    return course.isPublished || course.is_published;
}

export function isPotentialAllUsersQuery(query, globalOverrides = {gettext}) {
    // Returns `true` if it's likely that user is trying to select 'All users' in a user/group autosuggest field
    const translatedAllUsers = globalOverrides.gettext('All users').toLocaleLowerCase();
    const allUsersMatches = translatedAllUsers.split('').reduce(
        (acc, currentChar) => {
            // add the current character to the last generated sub-word, and push to the list of search terms
            acc.push((acc[acc.length - 1] || '') + currentChar);
            return acc;
        },
        [''],
    );
    return allUsersMatches.includes(query.toLocaleLowerCase().trim());
}

export function filterOutSelectedUsersAndGroups(suggestions, selectedUsersAndGroups) {
    if (selectedUsersAndGroups.length === 0) {
        return suggestions;
    }

    const selectedUserAndGroupIds = selectedUsersAndGroups.map((userOrGroup) => userOrGroup.id);

    return suggestions.filter((suggestion) => {
        return !selectedUserAndGroupIds.includes(suggestion.id);
    });
}
