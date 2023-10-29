import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';

import {COURSE_CONTENT_TYPE, COURSE_PORTION_CONTENT_TYPE} from './learning-path-page/constants';

export default function handleError(error, message = '') {
    if (error.response) {
        // API Error
        throw new Error(message);
    } else {
        // js error
        Raven.captureException(error);
    }
}

export function getFirstItemInViewport(infoPanel) {
    // there isn't a floating panel in mobile devices
    const heightFloatingPanel = infoPanel !== null ? infoPanel.offsetHeight : 0;
    const sectionItems = document.querySelectorAll('ul[id^=section] > li');

    if (sectionItems.length) {
        return Array.from(sectionItems).find(
            (item) => item.getBoundingClientRect().top > heightFloatingPanel,
        );
    }
}

export function updateScrollWithOffset(infoPanel, itemId, prevOffset) {
    const item = document.getElementById(itemId);

    // when the infoPanel is not stick to the top, window.scrollTop works better then
    // document.scrollingElement and it is not necessary to do item.scrollIntoView()
    if (infoPanel && infoPanel.getBoundingClientRect().top > 0) {
        window.scrollTop = window.scrollTop - infoPanel.getBoundingClientRect().top;
    } else if (item) {
        item.scrollIntoView();
        document.scrollingElement.scrollTop = document.scrollingElement.scrollTop - prevOffset;
    }
}

export function isUserOrganizationAdminOrOwner() {
    return udMe.organization.isAdmin || udMe.organization.isOwner;
}

export function isPathItemGoingToBeRetired(item) {
    return (
        [COURSE_CONTENT_TYPE, COURSE_PORTION_CONTENT_TYPE].includes(item.type) &&
        Boolean(item.content.retirementDate) &&
        Boolean(item.content.isCourseAvailableInOrg)
    );
}
