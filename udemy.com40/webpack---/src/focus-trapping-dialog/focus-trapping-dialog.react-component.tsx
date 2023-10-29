import {
    findFocusables,
    forceTabOrder,
    lockPageScroll,
    unlockPageScroll,
} from '@udemy/design-system-utils';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import React from 'react';

import {toggleDialogForScreenReaders} from '../toggle-dialog-for-screen-readers/toggle-dialog-for-screen-readers';

export interface FocusTrappingDialogInjectedProps {
    findTriggerNode: () => HTMLElement;
}

/** Interface for a low level component used in the implementation of other modal components. */
export interface FocusTrappingDialogProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Id of the element that provides the dialog title. */
    labelledById: string;
    /**
     * Given this dialog's DOM node, return the first focusable DOM node inside it.
     * The default logic works in most cases, but you may need to override it if
     * e.g. you have focusables that are hidden by CSS.
     */
    findFirstFocusable?: (refCurrent: HTMLElement) => HTMLElement;
    /** Same as findFirstFocusable, but returns the last focusable DOM node. */
    findLastFocusable?: (refCurrent: HTMLElement) => HTMLElement;
    /**
     * Given this dialog's DOM node, return the DOM node to focus on when the dialog is opened.
     * This function is optional. By default the last focusable is focused. For most use-cases,
     * the last focusable is a button that closes the dialog.
     */
    findNodeToFocusOn?: (refCurrent: HTMLElement) => HTMLElement;
    focusTrappingDialogProps?: FocusTrappingDialogInjectedProps;
}

/**
 * The FocusTrappingDialog component.
 *
 * @remarks
 * This is a low level component used in the implementation of other modal components.
 * It traps the keyboard focus within the dialog, and locks the page scroll so that the
 * dialog is always in view. It does not prevent the user from using the mouse or touch input
 * to interact with elements behind the dialog; this is handled by the FullPageOverlay component.
 *
 * This component implements the w3.org best practices for handling keyboard input within modals:
 * https://www.w3.org/TR/wai-aria-practices/#dialog_modal
 * - When the dialog is opened, focus on the first focusable in the dialog.
 *   If you prefer to focus on another element, use the `findNodeToFocusOn` prop.
 * - When the dialog is opened, trap the tab order within the dialog, i.e.
 *   tab on the last focusable goes to the first focusable.
 * - When the dialog is opened, keep screen readers within the dialog, i.e.
 *   prevent them from reading the underlying page content.
 * - When the dialog is closed, return the focus to the element that opened the dialog.
 *
 * We assume that a {@link CheckedStateCheckbox} controls whether this component is shown.
 * To use this component, you must attach a ref to it and call `FocusTrappingDialog.onToggle` in
 * the `CheckedStateCheckbox`'s `onChange` handler.
 */
@inject(({focusTrappingDialogProps}: FocusTrappingDialogProps) => ({
    focusTrappingDialogProps,
}))
export class FocusTrappingDialog extends React.Component<FocusTrappingDialogProps> {
    static defaultProps = {
        findFirstFocusable: undefined,
        findLastFocusable: undefined,
        findNodeToFocusOn: undefined,
        focusTrappingDialogProps: {},
    };

    constructor(props: FocusTrappingDialogProps) {
        super(props);
        this.ref = React.createRef();
        this.scrollableContainer = null;
        this.disposeForceTabOrder = noop;
        this.triggerNode = null;
    }

    componentDidMount() {
        this.disposeForceTabOrder = forceTabOrder([
            [this.findDialogFocusable as () => HTMLElement, this.findNodeToFocusOn],
            [this.findLastFocusable, this.findDialogFocusable as () => HTMLElement],
            [this.findLastFocusable, this.findFirstFocusable],
        ]);
    }

    componentWillUnmount() {
        if (this.scrollableContainer) {
            unlockPageScroll(this.scrollableContainer);
        }
        this.scrollableContainer = null;
        this.disposeForceTabOrder?.();
        this.triggerNode = null;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    static Title: typeof DialogTitle;

    ref?: React.RefObject<HTMLDivElement>;
    scrollableContainer: HTMLElement | null | undefined;
    disposeForceTabOrder: () => void;
    triggerNode: Element | null;

    defaultFindFocusableAtIndex(container: HTMLDivElement, index: number) {
        const focusables = findFocusables(container);
        if (index < 0) {
            index = focusables.length + index;
        }
        return focusables[index] || null;
    }

    findElement(findFnPropKey: string, defaultFindIndex: number) {
        const findFn = this.props[findFnPropKey as keyof FocusTrappingDialogProps];
        if (findFn && typeof findFn === 'function') {
            return findFn(this.ref?.current as HTMLElement);
        }
        return this.defaultFindFocusableAtIndex(
            this.ref?.current as HTMLDivElement,
            defaultFindIndex,
        );
    }

    findDialogFocusable = () => {
        return this.ref?.current;
    };

    findFirstFocusable = () => {
        return this.findElement('findFirstFocusable', 0);
    };

    findLastFocusable = () => {
        return this.findElement('findLastFocusable', -1);
    };

    findNodeToFocusOn = () => {
        return this.findElement('findNodeToFocusOn', -1);
    };

    /**
     * Updates internal state to reflect CheckedState associated with this dialog.
     *
     * @param isOpen - set to true if the dialog is open
     * @param scrollableContainer - dialog container element that will maintain scrolling while
     * the rest of the page scrolling is locked
     *
     * @see {@link @udemy/react-checked-state-components#isChecked} for converting a checked
     * state event to the `isOpen` parameter.
     *
     * @remarks
     *
     * For the iOS-specific patch in `lockPageScroll` to work properly, `scrollableContainer`
     * must be the element in the dialog that is scrollable. It cannot merely be one of the
     * container elements. Specifically, when dialog content is larger than the dialog, the
     * scrollable element will have a `scrollHeight` larger than `clientHeight`, and its
     * `scrollTop` will change as the user scrolls within the dialog.
     *
     * If the dialog is used to contain layouts that have their own scrollable sections, those
     * scrollable elements must be passed to `lockPageScroll` individually, in addition to the
     * call made by this dialog component.
     */
    onToggle = (isOpen: boolean, scrollableContainer: HTMLElement | null = null) => {
        if (isOpen) {
            this.scrollableContainer = scrollableContainer ?? this.ref?.current;

            if (this.scrollableContainer) {
                lockPageScroll(this.scrollableContainer);
            }

            const findTriggerNode = this.props.focusTrappingDialogProps?.findTriggerNode;
            this.triggerNode = findTriggerNode ? findTriggerNode() : document.activeElement;

            this.ref?.current?.focus();

            setTimeout(() => {
                if (this.ref?.current) {
                    const node = this.ref.current.querySelector('[data-dialog-auto-focus]');
                    (node as HTMLElement)?.focus();
                }
            }, 0);
        } else {
            if (this.scrollableContainer) {
                unlockPageScroll(this.scrollableContainer);
            }
            (this.triggerNode as HTMLElement)?.focus();
        }
        toggleDialogForScreenReaders(this.ref?.current as Element, isOpen);
    };

    render() {
        const {
            children,
            findFirstFocusable,
            findLastFocusable,
            findNodeToFocusOn,
            focusTrappingDialogProps,
            labelledById,
            ...htmlProps
        } = this.props;
        return (
            <div
                {...htmlProps}
                ref={this.ref}
                role="dialog"
                tabIndex={-1}
                aria-labelledby={labelledById}
            >
                {children}
            </div>
        );
    }
}

/** React prop interface for the DialogTitle component. */
interface DialogTitleProps extends React.ComponentPropsWithoutRef<'h2'> {
    show: boolean;
}

/**
 * The DialogTitle component
 *
 * @privateRemarks
 * Exposed to consumers via `FocusTrappingDialog.Title`
 */
const DialogTitle = ({children, className, show, ...props}: DialogTitleProps) => (
    <h2
        {...props}
        className={classNames(className, 'ud-heading-lg', {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'ud-sr-only': !show,
        })}
    >
        {children}
    </h2>
);

FocusTrappingDialog.Title = DialogTitle;
