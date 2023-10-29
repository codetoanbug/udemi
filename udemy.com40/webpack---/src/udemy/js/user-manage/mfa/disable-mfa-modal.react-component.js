import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import React, {Component} from 'react';

import {MFAFlowDisableEvent} from 'browse/events';
import serverOrClient from 'utils/server-or-client';
import userSettings, {SETTINGS} from 'utils/user-settings';

export default class DisableMFAModal extends Component {
    @autobind
    async disableMFA(onClose) {
        onClose();
        Tracker.publishEvent(new MFAFlowDisableEvent());
        await userSettings.set(SETTINGS.mfaEnabled, false);
        serverOrClient.global.location.href = '/';
    }

    render = () => {
        return (
            <ModalTrigger
                trigger={<Button udStyle="primary">{gettext('Disable')}</Button>}
                renderModal={({isOpen, onClose}) => (
                    <ConfirmModal
                        title={gettext('Disable multi-factor authentication')}
                        isOpen={isOpen}
                        onCancel={onClose}
                        onConfirm={() => this.disableMFA(onClose)}
                        confirmText={gettext('Confirm')}
                    >
                        <AlertBanner
                            showCta={false}
                            title={gettext(
                                'Turning off multi-factor authentication may reduce account security',
                            )}
                            body={gettext(
                                'You will be logged out of all devices and will no longer receive a verification code to log in.',
                            )}
                        />
                    </ConfirmModal>
                )}
            />
        );
    };
}
