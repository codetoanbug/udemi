import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './confirmation-modal.less';

export default class ConfirmationModal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        onConfirm: PropTypes.func.isRequired,
        onBack: PropTypes.func,
        showInfoIcon: PropTypes.bool,
        title: PropTypes.string,
        cancelText: PropTypes.string,
        acceptText: PropTypes.string,
        backText: PropTypes.string,
        isOpen: PropTypes.bool,
        hideCancel: PropTypes.bool,
        hideAccept: PropTypes.bool,
        className: PropTypes.string,
    };

    static defaultProps = {
        onBack: null,
        showInfoIcon: false,
        title: '',
        cancelText: 'Cancel',
        acceptText: 'Accept',
        backText: 'Back',
        isOpen: false,
        hideCancel: false,
        hideAccept: false,
        className: '',
    };

    render() {
        const {
            onClose,
            onConfirm,
            onBack,
            showInfoIcon,
            children,
            title,
            cancelText,
            acceptText,
            backText,
            isOpen,
            hideCancel,
            hideAccept,
            className,
        } = this.props;
        return (
            <Modal
                onClose={onClose}
                onConfirm={onConfirm}
                data-purpose="confirmation-modal"
                isOpen={isOpen}
                title={title}
                className={className}
            >
                <div styleName="confirmation-modal-body">
                    {showInfoIcon && <InfoIcon label={false} color="info" size="large" />}
                    <div styleName="flex">
                        {typeof children === 'function' ? children() : children}
                    </div>
                </div>
                <FooterButtons>
                    {onBack && (
                        <Button
                            udStyle="ghost"
                            styleName="back-button"
                            onClick={onBack}
                            data-purpose="back-confirmation-modal-button"
                        >
                            {backText}
                        </Button>
                    )}
                    {!hideCancel && (
                        <Button
                            udStyle="ghost"
                            onClick={onClose}
                            data-purpose="cancel-confirmation-modal-button"
                        >
                            {cancelText}
                        </Button>
                    )}
                    {!hideAccept && (
                        <Button
                            onClick={onConfirm}
                            data-purpose="confirm-confirmation-modal-button"
                        >
                            {acceptText}
                        </Button>
                    )}
                </FooterButtons>
            </Modal>
        );
    }
}
