import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

/**
 * CSS classes with "js-" prefix are only used as selectors by sortablejs
 * (see the "draggable" and "handle" options for example).
 * CSS classes without the prefix are only used for styling
 * (see the "dragClass" and "ghostClass" options for example).
 */

export const draggableSectionItemCSSClass = 'js-curriculum-item-draggable';

export const sectionItemHandleCSSClass = 'js-curriculum-item-handle';

export const sectionItemScrollBuffer = 150;

export const draggableAssessmentCSSClass = 'js-assessment-draggable';

export const assessmentHandleCSSClass = 'js-assessment-handle';

export const assessmentScrollBuffer = 150;

/**
 * We use forceFallback for more consistent scrolling behavior across browsers.
 * It also helps with unsurfacing bugs that would happen on mobile devices, which rely on
 * the fallback even when it's not forced.
 */
export function createOptionsForSortableSectionItems(options) {
    return {
        chosenClass: 'curriculum-item-chosen',
        delay: isMobileBrowser ? 200 : 0,
        dragClass: 'curriculum-item-drag',
        fallbackClass: 'curriculum-item-fallback',
        draggable: `.${draggableSectionItemCSSClass}`,
        filter: 'button,a',
        preventOnFilter: false, // event.preventDefault() breaks buttons on mobile devices.
        forceFallback: true,
        ghostClass: 'curriculum-item-ghost',
        group: 'curriculum-section',
        handle: `.${sectionItemHandleCSSClass}`,
        scrollSpeed: 25,
        ...options,
    };
}

export function createOptionsForSortableAssessments(options) {
    return {
        draggable: `.${draggableAssessmentCSSClass}`,
        forceFallback: true,
        handle: `.${assessmentHandleCSSClass}`,
        scrollSpeed: 20,
        ...options,
    };
}
