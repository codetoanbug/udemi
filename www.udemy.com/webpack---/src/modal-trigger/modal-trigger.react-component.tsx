import {observer} from 'mobx-react';
import React, {useState} from 'react';

/**
 * Props passed through in {@link ModalTriggerProps.renderModal}
 */
export interface ModalTriggerRenderModalProps {
    /** True if the modal is to be visible */
    isOpen: boolean;
    /** An event handler to pass to the modal which it will call when it closes */
    onClose: () => void;
}

/**
 * Props for `ModalTrigger`
 */
export interface ModalTriggerProps {
    /**
     * React element that, when clicked, will cause the modal rendered in
     * `renderModal` to appear.
     */
    trigger: React.ReactElement;
    /**
     * Function that returns a ReactNode that includes the modal to show.
     */
    renderModal: (props: ModalTriggerRenderModalProps) => React.ReactNode;
    /**
     * Callback fired when the `onClose` callback passed to `renderModal` is fired (e.g., by the modal)
     */
    onClose?: () => void;
}

/**
 * ModalTrigger convenience component for managing the open/close
 * state of a modal.
 *
 * @remarks
 *
 * This component will intercept the click handler of the React element
 * passed with the `trigger` prop.
 */
export const ModalTrigger = Object.assign(
    observer(({trigger, renderModal, ...props}: ModalTriggerProps) => {
        const [isOpen, setIsOpen] = useState(false);

        const onOpen = (event: React.MouseEvent) => {
            setIsOpen(true);

            trigger.props.onClick?.(event);
        };

        const onClose = () => {
            setIsOpen(false);

            props.onClose?.();
        };

        return (
            <>
                {React.cloneElement(trigger, {onClick: onOpen})}
                {renderModal({isOpen, onClose})}
            </>
        );
    }),
    {displayName: 'ModalTrigger'},
);
