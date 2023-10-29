import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {FooterButtons} from '@udemy/react-structure-components';
import React from 'react';

import {Modal, ModalProps} from '../modal/modal.react-component';

/**
 * Component props for `ConfirmModal`
 */
export interface ConfirmModalProps extends Omit<ModalProps, 'title'> {
    /** Event handler for clicking the Cancel button */
    onCancel: () => void;
    /** Event handler for clicking the Confirm button */
    onConfirm: () => void;
    /**
     * The text to display within the Confirmation button
     *
     * @defaultValue 'OK' in `ConfirmModal`
     */
    confirmText?: string;
    /**
     * The text to display within the Cancel button
     *
     * @defaultValue 'Cancel' in `ConfirmModal`
     */
    cancelText?: string;
    /** Child content of the `ConfirmModal`. */
    children?: React.ReactNode;
    /**
     * The title of the Modal, required for accessibility.
     *
     * @remarks
     * This is set as optional as there is a defaultValue to fall back on:
     *
     * @defaultValue 'Please Confirm' in `ConfirmModal`
     */
    title?: React.ReactNode;
}

/**
 * Modal dialog component with built-in confirmation and cancellation buttons.
 */
export const ConfirmModal = ({children, onCancel, onConfirm, ...props}: ConfirmModalProps) => {
    const {gettext} = useI18n();

    const {
        confirmText = gettext('OK'),
        cancelText = gettext('Cancel'),
        title = gettext('Please confirm'),
        ...modalProps
    } = props;

    return (
        <Modal title={title} onClose={onCancel} {...modalProps}>
            {children}
            <FooterButtons>
                <Button data-purpose="cancel-confirm-modal" udStyle="ghost" onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button data-purpose="submit-confirm-modal" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </FooterButtons>
        </Modal>
    );
};

ConfirmModal.displayName = 'ConfirmModal';
