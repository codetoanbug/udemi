import {Modal} from '@udemy/react-dialog-components';
import React from 'react';

import {AwsModalProps} from 'labs/lab-launcher/types';

import {AwsCredentials} from './aws-credentials.react-component';

export const AwsCredentialsModal = (props: AwsModalProps) => {
    const {labInstance, isShown, onClose} = props;
    return (
        <Modal
            isOpen={isShown}
            onClose={onClose}
            title={gettext('AWS CLI Credentials')}
            data-purpose="modal-show-aws-credentials"
        >
            <AwsCredentials labInstance={labInstance} />
        </Modal>
    );
};
