import {findFocusables} from '@udemy/design-system-utils';

/**
 * Milliseconds to wait for CSS transitions to conclude.
 *
 * @remarks
 * This must be greater than the slowest left|right transition-duration in the CSS.
 * onTransitionEnd might be more correct, but it's also way more complicated. If the user clicks
 * on an item in level 0 to open level 1, then we need to wait for level 1 to finish sliding in.
 * If the user clicks "Back" from level 2 to level 1, then we need to wait for level 2 to
 * finish sliding out. It's hard to distinguish these two cases as we only know that level 1
 *  is open, not how it was opened.
 */
export const WAIT_FOR_CSS_TRANSITIONS = 255;

/** A utility function to find the first focuasable element within the open dialog. */
export function findFirstFocusable(dialog: HTMLElement) {
    const activeSubDrawerSelector = '.js-drawer-radio[data-checked="checked"] ~ .js-drawer';
    const activeSubDrawer = dialog.querySelector(activeSubDrawerSelector) as HTMLElement;
    return findFocusables(activeSubDrawer || dialog)[0];
}
