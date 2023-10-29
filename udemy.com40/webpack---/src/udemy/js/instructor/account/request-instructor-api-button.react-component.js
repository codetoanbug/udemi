import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Checkbox, FormGroup, TextInput} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './request-instructor-api-button.less';

@observer
export default class RequestInstructorAPIButton extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @observable showModal = false;
    @observable agreedToTerms = false;

    @autobind
    @action
    closeModal() {
        this.showModal = false;
    }

    @autobind
    @action
    openModal() {
        this.showModal = true;
    }

    @autobind
    @action
    agreeToTerms(event) {
        this.agreedToTerms = event.target.checked;
        this.props.store.markSeenEula();
    }

    @autobind
    async refreshToken() {
        await this.props.store.createInstructorToken();
        runInAction(() => {
            this.showModal = true;
        });
    }

    handleTokenFocus(event) {
        event.target.select();
    }

    render() {
        const {store} = this.props;
        if (!store.isPremiumInstructor || !store.isLoaded) {
            return null;
        }

        let headerText = gettext('Create API secret token');
        let body = null;
        let footer = null;

        if (typeof store.instructorToken === 'string') {
            headerText = gettext('Instructor API token');
            body = (
                <FormGroup
                    label={gettext('Your secret token:')}
                    note={gettext(
                        'Save this secret token and keep it safe. Udemy cannot recover it for you, and ' +
                            'it grants anyone with the token access to the Instructor APIs, ACTING AS YOU',
                    )}
                >
                    <TextInput
                        onFocus={this.handleTokenFocus}
                        autoFocus={true}
                        readOnly={true}
                        value={store.instructorToken}
                    />
                </FormGroup>
            );
            footer = (
                <FooterButtons>
                    <Button onClick={this.closeModal}>{gettext('OK')}</Button>
                </FooterButtons>
            );
        } else {
            body = (
                <div>
                    <p styleName="terms">
                        <a
                            className="ud-link-underline"
                            target="blank"
                            rel="noopener noreferrer"
                            href="/terms/api"
                        >
                            {gettext('Terms of use for this API')}
                        </a>
                    </p>
                    <Checkbox value={this.agreedToTerms} onChange={this.agreeToTerms}>
                        {gettext('I agree to terms')}
                    </Checkbox>
                </div>
            );
            footer = (
                <FooterButtons>
                    <Button disabled={!this.agreedToTerms} onClick={this.refreshToken}>
                        {gettext('Generate token')}
                    </Button>
                </FooterButtons>
            );
        }
        return (
            <>
                <Button
                    udStyle="secondary"
                    onClick={store.instructorToken ? this.refreshToken : this.openModal}
                >
                    {store.instructorToken
                        ? gettext('Regenerate Instructor API Token')
                        : gettext('Create Instructor API Client')}
                </Button>
                <Modal isOpen={this.showModal} onClose={this.closeModal} title={headerText}>
                    {body}
                    {footer}
                </Modal>
            </>
        );
    }
}
