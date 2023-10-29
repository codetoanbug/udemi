import {noop} from '@udemy/shared-utils';
import React, {createContext, KeyboardEvent, MouseEvent} from 'react';
import ReactDOM from 'react-dom';

import {Keys} from '../keyboard/keys';

/** The trigger for a close, either Keyboard a Mouse Click */
export const ROOT_CLOSE_REASON = {
    CLICK: 'click',
    KEYBOARD: 'keyboard',
} as const;

// Matches return type of ReactDOM.findDOMNode
type DOMNode = Element | Text | null;
type NativeMouseEvent = MouseEvent<Document>['nativeEvent'];
type NativeKeyboardEvent = KeyboardEvent<Document>['nativeEvent'];

/** Event Handler interface for a RootCloseEvent */
export type RootCloseEventHandler = (
    event: NativeKeyboardEvent | NativeMouseEvent,
    container: DOMNode,
    closeReason: typeof ROOT_CLOSE_REASON[keyof typeof ROOT_CLOSE_REASON],
) => void;

/** React props interface the for RootCloserWrapper component. */
export interface RootCloseWrapperProps {
    /** Handle clicks or escape key presses on the document */
    onRootClose: RootCloseEventHandler;
}

//
export const RootCloseWrapperContext = createContext({ignoreRootClose: noop});

/**
 * The RootCloseWrapper component.
 *
 * @remarks
 * This component listens to escape key presses and clicks at the document level.
 * It then notifies consuming components that they may want to close (e.g., Dialogs, Modals).
 *
 * @privateRemarks
 * This must remain a class component as long as it depends on findDOMNode.
 */
export class RootCloseWrapper extends React.Component<RootCloseWrapperProps> {
    componentDidMount() {
        // eslint-disable-next-line react/no-find-dom-node
        this.dom = ReactDOM.findDOMNode(this);

        // Listen to clicks coming from within child component so they can be ignored when
        // when they bubble up to the document and fire the document-level event listener below.
        this.dom?.addEventListener('click', this.ignoreRootClose);

        // keydown is only dispatched on certain types of elements, hence the cast (I think)
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
        this.dom?.addEventListener('keydown', this.onKeyDown as unknown as EventListener);

        document.addEventListener('click', this.onDocumentClick);
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onDocumentClick);
        document.removeEventListener('keydown', this.onKeyDown);
        this.dom?.removeEventListener('click', this.ignoreRootClose);
        this.dom?.removeEventListener('keydown', this.onKeyDown as unknown as EventListener);
        this.dom = null;
    }

    dom: DOMNode = null;
    shouldRootClose = true;

    // Ignore the document-level click event that results from bubbling-up click event
    // dispatched from _within_ the child component.
    ignoreRootClose = () => {
        // If false, then component will ignore the next click or keydown event.
        this.shouldRootClose = false;

        // If a RootCloseWrapper is inside another RootCloseWrapper,
        // propagate `ignoreRootClose` up.
        this.context.ignoreRootClose();
    };

    onDocumentClick = (event: NativeMouseEvent) => {
        if (this.shouldRootClose) {
            this.props.onRootClose(event, this.dom, 'click');
        }

        // Toggle back on to listen to next document-level click.
        this.shouldRootClose = true;
    };

    onKeyDown = (event: NativeKeyboardEvent) => {
        if (event.keyCode === Keys.ESCAPE && this.shouldRootClose) {
            this.props.onRootClose(event, this.dom, 'keyboard');
        }
    };

    render() {
        const contextValue = {ignoreRootClose: this.ignoreRootClose};

        return (
            <RootCloseWrapperContext.Provider value={contextValue}>
                {React.Children.only(this.props.children)}
            </RootCloseWrapperContext.Provider>
        );
    }
}

RootCloseWrapper.contextType = RootCloseWrapperContext;
