import React from 'react';

import getConfigData from 'utils/get-config-data';
import udMeGlobal from 'utils/ud-me';

export function childrenToRender(children) {
    const validChildren = [];
    React.Children.forEach(children, (child) => {
        if (child && child.type.shouldRender && child.type.shouldRender(child.props)) {
            validChildren.push(child);
        }
    });
    return validChildren;
}

export function isContextMenuAvailable(globalOverrides = {}) {
    // Helper function for performing the default availability check for the context menu.
    const udConfig = globalOverrides.Config ?? getConfigData();
    const udMe = globalOverrides.me ?? udMeGlobal;
    return !udMe.isLoading && udMe.id && udConfig.brand.has_organization;
}

export function shouldDisableMenuItem(course, globalOverrides = {}) {
    // In some places where context menu is rendered, we do not request the is_course_available_in_org
    // field so course.is_course_available_in_org and course.isCourseAvailableInOrg will both be
    // undefined. This is ok, we just don't want to disable in this scenario.
    const availabilityUndefined =
        course.is_course_available_in_org === undefined &&
        course.isCourseAvailableInOrg === undefined;

    const udConfig = globalOverrides.Config ?? getConfigData();
    if (udConfig.brand.is_team || availabilityUndefined) {
        return false;
    }
    return !(course.is_course_available_in_org || course.isCourseAvailableInOrg);
}

export {trackClickAction} from './_helpers';
