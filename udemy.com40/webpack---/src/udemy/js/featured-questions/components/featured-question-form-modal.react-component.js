import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import FeaturedQuestionFormModalStore from './featured-question-form-modal.mobx-store';

@inject('featuredQuestionFormStore')
@observer
export default class FeaturedQuestionFormModal extends React.Component {
    static propTypes = {
        featuredQuestionFormStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new FeaturedQuestionFormModalStore(this.props.featuredQuestionFormStore);
    }

    get modalTitle() {
        if (this.store.modalStatus === 'confirmation') {
            return gettext('Please confirm');
        } else if (this.store.modalStatus === 'success') {
            return gettext('New featured question added successfully!');
        }
        return gettext('Unexpected error');
    }

    get modalBody() {
        if (this.store.modalStatus === 'confirmation') {
            return gettext('Are you sure you want to publish this Featured Question?');
        } else if (this.store.modalStatus === 'success') {
            return gettext(
                'This Featured Question is now part of your course and visible to students.',
            );
        }
        return gettext(
            'An unexpected error occurred and your Featured Question was not published. Please try again.',
        );
    }

    get confirmText() {
        if (this.store.modalStatus === 'confirmation') {
            return gettext('Publish now');
        }
        return gettext('OK');
    }

    get cancelText() {
        if (this.store.modalStatus === 'confirmation') {
            return gettext('Cancel');
        }
        return gettext('See it now');
    }

    render() {
        return (
            <Modal
                isOpen={this.store.showModal}
                requireExplicitAction={true}
                title={this.modalTitle}
            >
                <p>{this.modalBody}</p>
                <FooterButtons>
                    {this.store.modalStatus !== 'failure' && (
                        <Button
                            udStyle="ghost"
                            onClick={this.store.cancelModal}
                            disabled={this.store.isSubmitting}
                        >
                            {this.cancelText}
                        </Button>
                    )}
                    <Button
                        data-purpose="confirm-modal"
                        onClick={this.store.confirmModal}
                        disabled={this.store.isSubmitting}
                    >
                        {this.confirmText}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
