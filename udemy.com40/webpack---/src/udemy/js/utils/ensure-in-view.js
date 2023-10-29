import serverOrClient from 'utils/server-or-client';

const DEFAULT_OFFSET_TOP = 100;

/**
 * Ensures that a DOM element is in view relative to its container. Only handles vertical direction.
 * Basically, this is the native element.scrollIntoView(), but:
 * - it can calculate relative to a container other than the window.
 * - it supports an option to *not* scroll the element if it's already in view.
 * - it supports an option to have some space between the top of the container and the top of
 *   the element.
 *
 * @param element: The DOM element. Required.
 * @param container: The element's scroll container. Optional, defaults to `window`.
 * @param options.keepIfInView: Optional, defaults to false.
 * The default behavior is:
 *     1. If the element is already completely in view, this function won't do anything.
 *     2. Otherwise, the container is scrolled such that the element is `options.offsetTop` pixels
 *        from the top of the container.
 * If keepIfInView: true, then 1. still holds, but 2. only happens if the element is completely
 * out of view.
 * @param options.offsetTop: See options.keepIfInView above.
 * Optional, defaults to DEFAULT_OFFSET_TOP.
 */
export default function ensureInView(element, container, options = {}) {
    options = {keepIfInView: false, offsetTop: DEFAULT_OFFSET_TOP, forceToTop: false, ...options};
    const window = serverOrClient.global;
    const rect = element.getBoundingClientRect();
    let relTop, relBottom, containerHeight;
    if (!container) {
        container = window;
        relTop = rect.top;
        relBottom = rect.bottom;
        containerHeight = window.innerHeight;
    } else {
        const containerRect = container.getBoundingClientRect();
        relTop = rect.top - containerRect.top;
        relBottom = rect.bottom - containerRect.top;
        containerHeight = containerRect.height;
    }
    const isCompletelyInViewport = relTop >= 0 && relBottom <= containerHeight;
    if (isCompletelyInViewport && !options.forceToTop) {
        return;
    }
    const isCompletelyOutOfViewport = relTop > containerHeight || relBottom < 0;
    if (!options.keepIfInView || isCompletelyOutOfViewport) {
        container.scrollBy({top: Math.round(relTop - options.offsetTop), behavior: 'smooth'});
    }
}
