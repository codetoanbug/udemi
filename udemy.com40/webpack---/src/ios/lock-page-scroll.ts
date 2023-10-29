/**
 * Adapted from https://github.com/willmcpo/body-scroll-lock.
 * This module prevents page scroll while retaining scroll within a set of exception elements.
 * On non-iOS devices, this is easy- just add `overflow: hidden` to the body.
 * On iOS, we need to disable touchmove on the document, as well as on the exception elements
 * when attempting to scroll above the top or below the bottom of their scroll.
 *
 */
import {serverOrClient} from '@udemy/shared-utils';

let documentTouchmoveDisabled = false;
let prevDocumentOverflow: string | undefined;

export const exceptionElements = new Set<HTMLElement>();

export const isIOS = !!(
    typeof window !== 'undefined' &&
    window.navigator &&
    window.navigator.platform &&
    /iP(ad|hone|od)/.test(window.navigator.platform)
);

/**
 * Disables page scroll, retains scroll within `exceptionElement`
 *
 * @remarks
 * Adapted from https://github.com/willmcpo/body-scroll-lock.
 *
 * @param exceptionElement - the object to retain scrolling in when lock is turned on
 * @param options - by default contains the `isIOS` boolean
 * */
export function lockPageScroll(exceptionElement: HTMLElement, options = {isIOS}) {
    const document = serverOrClient.global.document;
    const seen = exceptionElements.has(exceptionElement);

    if (!seen) {
        exceptionElements.add(exceptionElement);
    }

    if (!options.isIOS) {
        if (prevDocumentOverflow === undefined) {
            prevDocumentOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        }
    } else {
        if (exceptionElement && !seen) {
            let initialClientY = -1;

            exceptionElement.ontouchstart = (event) => {
                if (event.targetTouches.length === 1) {
                    initialClientY = event.targetTouches[0].clientY;
                }
            };

            exceptionElement.ontouchmove = (event) => {
                if (event.targetTouches.length === 1) {
                    handleTouchScroll(event, exceptionElement, initialClientY);
                }
            };
        }

        if (!documentTouchmoveDisabled) {
            document.addEventListener('touchmove', preventDefault, {passive: false});
            documentTouchmoveDisabled = true;
        }
    }
}

/**
 * Reverts lockPageScroll for the same `exceptionElement`
 *
 * @remarks
 * Adapted from https://github.com/willmcpo/body-scroll-lock.
 *
 * @param exceptionElement - the object to revert lockPageScroll on
 * @param options - by default contains the `isOS` boolean
 **/
export function unlockPageScroll(exceptionElement: HTMLElement, options = {isIOS}) {
    const document = serverOrClient.global.document;
    exceptionElements.delete(exceptionElement);
    if (!options.isIOS) {
        if (prevDocumentOverflow !== undefined && exceptionElements.size === 0) {
            document.body.style.overflow = prevDocumentOverflow;
            prevDocumentOverflow = undefined;
        }
    } else {
        if (exceptionElement) {
            exceptionElement.ontouchstart = undefined;
            exceptionElement.ontouchmove = undefined;
        }

        if (documentTouchmoveDisabled && exceptionElements.size === 0) {
            document.removeEventListener('touchmove', preventDefault);
            documentTouchmoveDisabled = false;
        }
    }
}

function handleTouchScroll(event: TouchEvent, target: HTMLElement, initialClientY: number) {
    const deltaY = event.targetTouches[0].clientY - initialClientY;

    if (target && target.scrollTop === 0 && deltaY > 0) {
        // Target is at the top of its scroll, and user moved finger down,
        // hence scrolling the target content up.
        return preventDefault(event);
    }

    if (target && target.scrollHeight - target.scrollTop <= target.clientHeight && deltaY < 0) {
        // Target is at the bottom of its scroll, and user moved finger up,
        // hence scrolling the target content down.
        return preventDefault(event);
    }

    event.stopPropagation();
    return true;
}

function preventDefault(event: TouchEvent) {
    if (event.touches.length > 1) {
        return true;
    }
    event.preventDefault();
    return false;
}
