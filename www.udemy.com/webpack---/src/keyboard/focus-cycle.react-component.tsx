import React from 'react';
import ReactDOM from 'react-dom';

import {findFocusables} from './find-focusables';
import {Keys} from './keys';

/** React props interface for the FocusCycle component */
export interface FocusCycleProps {
    /**
     * Function that will return all focusable elements to cycle through.
     *
     * @defaultValue `findFocusables` in `FocusCycle`.
     */
    getCycle: (container: HTMLElement) => HTMLElement[];
    /**
     * Optional prop if part of what FocusCycle is wrapping rendered elsewhere
     * in the DOM.  THis is useful for when `detachedFromTarget` is set in Popper.
     */
    detachedContent?: React.RefObject<HTMLDivElement>;
}

/**
 * ### FocusCycle
 *
 * @remarks
 * Cycles through all the focusable descendants of this component.
 * ArrowDown cycles forward; ArrowUp cycles backward.
 */
export class FocusCycle extends React.Component<FocusCycleProps> {
    static defaultProps = {
        getCycle: findFocusables,
    };

    componentDidMount() {
        // eslint-disable-next-line react/no-find-dom-node
        this.element = ReactDOM.findDOMNode(this);
        this.element?.addEventListener('keydown', this.onKeyDown as EventListener);
        if (this.props.detachedContent) {
            // eslint-disable-next-line react/no-find-dom-node
            this.detachedContent = this.props.detachedContent.current;
            this.detachedContent?.addEventListener('keydown', this.onKeyDown as EventListener);
        }
    }

    componentWillUnmount() {
        this.element?.removeEventListener('keydown', this.onKeyDown as EventListener);
        this.element = null;
        if (this.props.detachedContent) {
            this.detachedContent?.removeEventListener('keydown', this.onKeyDown as EventListener);
            this.detachedContent = null;
        }
    }

    // This is set to the possible return types of React.findDOMNode
    element: Element | Text | null = null;
    detachedContent: Element | Text | null = null;

    onKeyDown = (event: KeyboardEvent) => {
        const code = event.which || event.keyCode;
        if (code === Keys.UP || code === Keys.DOWN) {
            const focusables = this.props.getCycle(this.element as HTMLElement);
            const activeIndex = focusables.findIndex(
                (element) => element === document.activeElement,
            );
            let targetIndex = null;
            if (activeIndex >= 0 && code === Keys.DOWN) {
                targetIndex = (activeIndex + 1) % focusables.length;
            } else if (activeIndex >= 0 && code === Keys.UP) {
                targetIndex = (activeIndex - 1 + focusables.length) % focusables.length;
            }
            if (targetIndex !== null && focusables[targetIndex]) {
                event.preventDefault(); // Prevent vertical scrolling.
                focusables[targetIndex].focus();
            }
        }
    };

    render() {
        return React.Children.only(this.props.children);
    }
}
