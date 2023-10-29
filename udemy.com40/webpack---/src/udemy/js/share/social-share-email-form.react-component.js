import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Button} from '@udemy/react-core-components';
import {FormGroup, TextArea, TextInput} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {SHARE_TYPES} from 'share/constants';
import ShareEmailStore from 'share/share-email.mobx-store';
import {noop} from 'utils/noop';
import udMe from 'utils/ud-me';

import './social-share-email-form.less';

@observer
export default class SocialShareEmailForm extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        onCancel: noop,
    };

    @observable shareEmailStore = new ShareEmailStore(
        this.props.store.shareableObject,
        this.props.store.url,
        this.props.store.sourcePage,
    );

    @autobind
    @action
    updateEmailsInput({target}) {
        this.shareEmailStore.updateEmailsInput(target);
    }

    @autobind
    @action
    updateMessageInput({target}) {
        this.shareEmailStore.updateMessageInput(target);
    }

    @autobind
    @action
    onSubmit(e) {
        e.preventDefault();
        this.shareEmailStore.onSubmit();
    }

    @autobind
    @action
    onCancel(e) {
        e.preventDefault();
        this.props.onCancel();
    }

    render() {
        if (!Object.values(SHARE_TYPES).includes(this.props.store.shareableObject.type)) {
            return null;
        }

        if (!udMe.id) {
            return null;
        }

        const {loading, sent} = this.shareEmailStore;
        const buttonContent = loading ? (
            <Loader color="inherit" />
        ) : sent ? (
            <>
                <span>{gettext('Email sent')}</span>
                <SuccessIcon color="inherit" label={false} />
            </>
        ) : (
            gettext('Send')
        );
        return (
            <>
                <FormGroup
                    label={gettext('Email addresses')}
                    note={gettext('Enter up to 5 email addresses, separated by a comma')}
                    styleName="email-addresses"
                    validationState={this.shareEmailStore.getEmailValidationState()}
                >
                    <TextInput onChange={this.updateEmailsInput} />
                </FormGroup>
                <FormGroup
                    label={gettext('Why are you recommending this?')}
                    labelProps={{tag: 'Optional'}}
                    note={gettext('Make your share more meaningful with a personal note')}
                    styleName="email-body"
                >
                    <TextArea
                        rows="3"
                        onChange={this.updateMessageInput}
                        style={{resize: 'none'}}
                    />
                </FormGroup>
                {this.shareEmailStore.error && (
                    <div styleName="email-error">
                        <AlertBanner
                            showCta={false}
                            udStyle="error"
                            title={this.shareEmailStore.error}
                        />
                    </div>
                )}
                <div styleName="email-submit-btns">
                    <div className="ud-text-xs" styleName="email-legal-text">
                        {gettext('By sending, you confirm that you know the recipients')}
                    </div>
                    <Button
                        udStyle="ghost"
                        type="button"
                        onClick={this.onCancel}
                        className="ud-link-neutral"
                        styleName="cancel-button"
                        data-purpose="email-form-cancel"
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        disabled={!this.shareEmailStore.isFormValid}
                        type="submit"
                        onClick={this.onSubmit}
                        data-purpose="email-form-submit"
                    >
                        {buttonContent}
                    </Button>
                </div>
            </>
        );
    }
}
