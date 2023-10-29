import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {showErrorToast, showSuccessToast} from 'course-taking/toasts';
import Raven from 'utils/ud-raven';

import CertificateStore from '../certificate.mobx-store';
import requires from '../registry/requires';
import CpeSecondaryEmailStore from './cpe-secondary-email.mobx-store';
import './cpe-secondary-email-modal.less';

@requires('certificateStore', 'cpeSecondaryEmailStore')
@observer
export default class CpeSecondaryEmailModal extends React.Component {
    static propTypes = {
        certificateStore: PropTypes.instanceOf(CertificateStore).isRequired,
        cpeSecondaryEmailStore: PropTypes.instanceOf(CpeSecondaryEmailStore).isRequired,
    };

    @autobind
    async onSubmit(e) {
        e.preventDefault();
        if (
            !this.props.cpeSecondaryEmailStore.validateEmail() ||
            this.props.cpeSecondaryEmailStore.isLoading
        ) {
            return;
        }
        try {
            await this.props.cpeSecondaryEmailStore.updateSecondaryEmail();
            this.props.cpeSecondaryEmailStore.closeModal();
            showSuccessToast(gettext('Your secondary email has beed added'));
            this._openCpeCertificate();
        } catch (error) {
            Raven.captureException(error);
            showErrorToast(gettext('Failed to add a secondary email'));
        }
    }

    @autobind
    handleChange(e) {
        this.props.cpeSecondaryEmailStore.setSecondaryEmail(e.target.value);
    }

    @autobind
    _openCpeCertificate() {
        window.open(this.props.certificateStore.cpeCertificate.url, '_blank');
    }

    render() {
        const {
            closeModal,
            isLoading,
            isSecondaryEmailModalOpen,
            secondaryEmail,
            validationState,
        } = this.props.cpeSecondaryEmailStore;
        return (
            <Modal
                isOpen={isSecondaryEmailModalOpen}
                onClose={closeModal}
                title={gettext('Get your CPE certificate')}
            >
                <form onSubmit={this.onSubmit}>
                    <p styleName="description">
                        {gettext(
                            'We will store your CPE certificate for five years. Please add an email that you know you will have access to in the future.',
                        )}
                    </p>
                    <FormGroup
                        label={gettext('Add a secondary email')}
                        validationState={validationState}
                        note={validationState ? gettext('Please enter a valid email') : null}
                    >
                        <TextInput
                            value={secondaryEmail}
                            placeholder={gettext('Enter email')}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FooterButtons>
                        <Button onClick={closeModal} udStyle="ghost">
                            {gettext('Cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {gettext('Submit')}
                        </Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}
