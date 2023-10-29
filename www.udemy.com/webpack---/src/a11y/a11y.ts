interface KeyEvent {
    type: string;
    key: string;
}

/**
 * Reusable key event filter function
 *
 * @example As implemented by `onEnterAndSpace`:
 *
 * ```ts
 * class SomeComponent extends Component {
 *
 *    handler = (event) => {
 *     // Do something with event.
 *    }
 *
 *    onKeyDown = (event) => {
 *        onEnterAndSpace(this.handler)(event);
 *    }
 *
 *    render() {
 *       return (
 *           <div onKeydown={ onKeyDown }
 *                onClick={ this.handler }
 *                role="button"
 *                tabIndex="0">
 *               Click me!
 *           </div>
 *       );
 *    }
 * }
 * ```
 *
 * @internal
 */
const onKeys =
    (...keys: string[]) =>
    (fn: (event: KeyEvent) => void) =>
    (event: KeyEvent) => {
        if (['keydown', 'keypress'].includes(event.type) && keys.includes(event.key)) {
            fn(event);
        }
    };

/**
 * Event filter for Enter and Space keys
 *
 * @param fn - Key event handler function to call if the key event matches `Enter` or `Space`
 * @returns a function to call with the key event to filter by
 *
 * @example
 * * ```
 * function handleKeyDown(event) {
 *     onEnterAndSpace(handleEnterOrSpace)(event);
 * }
 * ```
 */
export const onEnterAndSpace = onKeys('Enter', ' ');

/**
 * Event filter for Enter key
 *
 * @param fn - Key event handler function to call if the key event matches `Enter`
 * @returns a function to call with the key event to filter by
 *
 * @example
 * ```
 * function handleKeyDown(event) {
 *     onEnter(handleEnter)(event);
 * }
 * ```
 */
export const onEnter = onKeys('Enter');

/**
 * Event filter for Escape key
 *
 * @param fn - Key event handler function to call if the key event matches `Escape`
 * @returns a function to call with the key event to filter by
 *
 * @example
 * ```
 * function handleKeyDown(event) {
 *     onEscape(handleEscape)(event);
 * }
 * ```
 */
export const onEscape = onKeys('Escape');

/**
 * Event filter for up arrow and right arrow keys
 *
 * @param fn - Key event handler function to call if the key event matches `ArrowUp` or `ArrowRight`
 * @returns a function to call with the key event to filter by
 *
 * @remarks
 *
 * Useful for sliders:
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_slider_role
 *
 * @see `onDecrement`
 *
 * @example
 * ```
 * function handleKeyDown(event) {
 *     onIncrement(handleIncrementKey)(event);
 * }
 * ```
 */
export const onIncrement = onKeys('ArrowUp', 'ArrowRight');

/**
 * Event filter for down arrow and left arrow keys
 *
 * @param fn - Key event handler function to call if the key event matches `ArrowDown` or `ArrowLeft`
 * @returns a function to call with the key event to filter by
 *
 * @remarks
 *
 * Useful for sliders:
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_slider_role
 *
 * @see `onIncrement`
 *
 * @example
 * ```
 * function handleKeyDown(event) {
 *     onDecrement(handleDecrementKey)(event);
 * }
 * ```
 */
export const onDecrement = onKeys('ArrowDown', 'ArrowLeft');

/**
 * Create unique ID functions that share the same ID scope
 *
 * @returns - `getUniqueId` and `setUniqueIdNamespace` functions bound to the same ID and namespace scope
 */
export const uniqueIdNamespace = () => {
    let lastId = 0;
    let namespace = '';

    /**
     * Generate an ID suitable for DOM elements and increment the ID iterator.
     *
     * @param prefix - optional string to insert between namespace and iterating ID number (default: empty string)
     * @returns ID with prefix (optional) and namespace if set via `setUniqueIdNamespace`
     */
    const getUniqueId = (prefix = '') => {
        lastId++;
        return `${namespace}${prefix}--${lastId}`;
    };

    /**
     * Reset the iterating id number.
     *
     * @param value - optional namespace to prefix generated id values (default: null)
     */
    const setUniqueIdNamespace = (value: string | null = null) => {
        // Ensure the ID doesn't start with a number. IDs are often used in the
        // 'id' attribute of HTML elements, which causes problems with query selectors.
        // See https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
        namespace = value ? `u${value}-` : '';
        lastId = 0;
    };

    return {getUniqueId, setUniqueIdNamespace};
};

export const {getUniqueId, setUniqueIdNamespace} = uniqueIdNamespace();
