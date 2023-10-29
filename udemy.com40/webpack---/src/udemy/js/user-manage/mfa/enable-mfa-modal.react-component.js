import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {MFAFlowEnableEvent, MFAModalLaunchEvent} from 'browse/events';
import serverOrClient from 'utils/server-or-client';
import userSettings, {SETTINGS} from 'utils/user-settings';

export default class EnableMFAModal extends Component {
    static propTypes = {
        postSignInURL: PropTypes.string,
        mfaModalText: PropTypes.string,
    };

    static defaultProps = {
        postSignInURL: '/',
        mfaModalText: gettext(
            'Enabling multi-factor authentication will log you out of Udemy from every device you`re currently logged in on.',
        ),
    };

    @autobind
    async enableMFA(onClose) {
        onClose();
        Tracker.publishEvent(new MFAFlowEnableEvent());
        await userSettings.set(SETTINGS.mfaEnabled, true);
        serverOrClient.global.location.href = this.props.postSignInURL;
    }

    @autobind
    trackMFAModalLaunch() {
        Tracker.publishEvent(new MFAModalLaunchEvent());
    }

    render = () => {
        return (
            <ModalTrigger
                trigger={
                    <Button udStyle="primary" onClick={this.trackMFAModalLaunch}>
                        {gettext('Enable')}
                    </Button>
                }
                renderModal={({isOpen, onClose}) => (
                    <ConfirmModal
                        title={gettext('Enable multi-factor authentication')}
                        isOpen={isOpen}
                        onCancel={onClose}
                        onConfirm={() => this.enableMFA(onClose)}
                        confirmText={gettext('Confirm')}
                    >
                        <p>{this.props.mfaModalText}</p>
                    </ConfirmModal>
                )}
            />
        );
    };
}
