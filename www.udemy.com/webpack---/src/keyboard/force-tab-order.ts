import {KeyStrings, Keys} from './keys';

// While consumers may more easily pass Element objects, Element includes
// neither #tabIndex nor #focus. Not all elements have those properties.
// Cast as HTMLElements.
type FindElementFunction = () => HTMLElement | null | undefined;
export type ForcedTabOrder = [FindElementFunction, FindElementFunction];

/**
 * This function receives an array of pairs of functions that return DOM nodes.
 * Tab order is forced between the pairs.
 * Example:
 * orders = [
 *     [() => A, () => B],
 *     [() => C, () => D],
 * ]
 * If you tab on A, we focus on B. If you shift-tab on B, we focus on A.
 *
 * Note that in general you should let tab order follow the natural order of the elements
 * in the DOM. You can use tabindex="-1" or display:none to remove elements from the tab order.
 * However, there are certain cases these aren't sufficient. For example, when a full page overlay
 * is active, we don't want the tab order to go behind the overlay, but we also do not want to
 * hide everything behind the overlay, so in such cases we need this function to force the
 * tab order to stay within the items in front of the overlay.
 */
export function forceTabOrder(orders: ForcedTabOrder[]) {
    function onTab(event: globalThis.KeyboardEvent) {
        const code = event.which || event.keyCode;
        if (code === Keys.TAB || event.key === KeyStrings.TAB) {
            for (const order of orders) {
                const currentTarget = event.shiftKey ? order[1]() : order[0]();
                if (currentTarget && currentTarget === event.target) {
                    const tabTarget = event.shiftKey ? order[0]() : order[1]();
                    if (tabTarget && tabTarget.tabIndex !== -1) {
                        event.preventDefault();
                        tabTarget.focus();
                        return;
                    }
                }
            }
        }
    }

    function dispose() {
        document.removeEventListener('keydown', onTab);
    }

    document.addEventListener('keydown', onTab);
    return dispose;
}
