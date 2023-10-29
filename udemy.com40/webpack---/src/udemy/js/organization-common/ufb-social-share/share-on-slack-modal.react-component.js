import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {safelySetInnerHTML} from '@udemy/shared-utils';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import {DEFAULT_SHARE_MESSAGE} from 'organization-common/resource-preview/constants';
import ResourcePreview from 'organization-common/resource-preview/resource-preview.react-component';

import {SLACK} from './constants';
import ShareAutoComplete from './share-autocomplete/share-autocomplete.react-component';
import styles from './share-on-slack-modal.less';
import ShareModalStore from './share-on-slack-modal.mobx-store';
import SlackAutoCompleteStore from './slack-autocomplete.mobx-store';

@observer
class InternalShareOnSlackModal extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,
        checkSlackAuthentication: PropTypes.func.isRequired,
        resourceId: PropTypes.number.isRequired,
        resourceType: PropTypes.oneOf(Object.values(RESOURCE_TYPES)).isRequired,
        context: PropTypes.oneOf(Object.values(CONTEXT_TYPES)).isRequired,
        shareData: PropTypes.object.isRequired,
        teamName: PropTypes.string.isRequired,
        window: PropTypes.object,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
    };

    static defaultProps = {
        window,
    };

    constructor(props) {
        super(props);
        this.store = new ShareModalStore({gettext: props.gettext, interpolate: props.interpolate});
        this.autocompleteStore = new SlackAutoCompleteStore({gettext: props.gettext});

        this.resourcePreviewWrapperRef = React.createRef(null);
    }

    componentDidMount() {
        this.store.setUpperMessage(this.defaultShareOnSlackMessage);
    }

    get modalTitle() {
        const {teamName, gettext} = this.props;

        if (!teamName) {
            return gettext('Share to Slack');
        }

        return (
            <div data-purpose="slack-modal-title">
                {interpolate(gettext('Share to %s Slack'), [teamName])}
                <Button
                    udStyle="link"
                    onClick={this.onChangeWorkspaceClick}
                    className={styles['slack-modal--header--change-workspace__text']}
                >
                    {gettext('Change')}
                </Button>
            </div>
        );
    }

    get successNotification() {
        return this.props.gettext('Message sent');
    }

    @computed
    get errorMessage() {
        return this.store.responseErrorMessage;
    }

    @computed
    get isSubmitDisabled() {
        return this.store.isSubmitDisabled || !this.isFormValid;
    }

    @computed
    get isFormValid() {
        return this.store.destination.length > 0;
    }

    get defaultShareOnSlackMessage() {
        return DEFAULT_SHARE_MESSAGE[this.props.resourceType];
    }

    onHide = () => {
        this.store.clean();
        this.autocompleteStore.reset();
        this.props.onHide();
    };

    onSubmit = (event) => {
        event.preventDefault();

        if (!this.isFormValid) {
            return;
        }

        const shareParams = {
            resourceId: this.props.resourceId,
            resourceType: this.props.resourceType,
            context: this.props.context,
        };

        this.store
            .share(shareParams)
            .then(() => {
                this.store.clean();
                this.autocompleteStore.reset();
                this.store.showNotification(this.successNotification);

                this.props.onSubmit();
            })
            .catch(() => {
                return false;
            });
    };

    onDestinationInputChange = (value) => {
        this.store.setDestination(value);

        if (!value.length) {
            this.store.clearResponseErrorMessage();
            this.autocompleteStore.reset();
        }
    };

    onDestinationSuggestionSelected = (suggestion) => {
        this.store.setDestination(suggestion.key);
        this.store.setConversationType(suggestion);
        this.store.clearResponseErrorMessage();

        // focus in the text-area from the ResourcePreview component after selecting an user/channel
        this.resourcePreviewWrapperRef.current.querySelector('textarea').focus();
    };

    onDestinationCleanup = () => {
        this.store.clearDestination();
        this.store.clearResponseErrorMessage();
    };

    onUpperMessageChange = ({target}) => {
        this.store.setUpperMessage(target.value);
    };

    onChangeWorkspaceClick = () => {
        this.autocompleteStore.deleteUserIntegrationToken().then(() => {
            this.props.checkSlackAuthentication().then((response) => {
                if (response.data.url) {
                    this.props.window.location.href = response.data.url;
                } else {
                    this.onHide();
                }
            });
        });
    };

    render() {
        const {
            onSubmit,
            resourceId,
            resourceType,
            window,
            context,
            onHide,
            shareData,
            checkSlackAuthentication,
            teamName,
            show,
            gettext,
            ...modalProps
        } = this.props;

        const validationProps = {};
        if (this.errorMessage) {
            validationProps.validationState = 'error';
            validationProps.note = (
                <span
                    className="ud-text-with-links"
                    {...safelySetInnerHTML({
                        html: this.errorMessage,
                        domPurifyConfig: {ADD_ATTR: ['target']},
                    })}
                />
            );
        }

        return (
            <Modal title={this.modalTitle} isOpen={show} onClose={this.onHide} {...modalProps}>
                <form onSubmit={this.onSubmit}>
                    <FormGroup label={gettext('Channel or User')} {...validationProps}>
                        <ShareAutoComplete
                            onInputChange={this.onDestinationInputChange}
                            onSuggestionSelected={this.onDestinationSuggestionSelected}
                            onCleanup={this.onDestinationCleanup}
                            store={this.autocompleteStore}
                        />
                    </FormGroup>
                    {this.autocompleteStore.autoCompleteErrorMessage ? (
                        <AlertBanner
                            udStyle="warning"
                            className={styles['warning-message']}
                            title={gettext('Oops')}
                            showCta={false}
                            body={this.autocompleteStore.autoCompleteErrorMessage}
                        />
                    ) : null}
                    <div ref={this.resourcePreviewWrapperRef}>
                        <ResourcePreview
                            resourceId={resourceId}
                            resourceType={resourceType}
                            shareData={shareData}
                            onChangeMessageCallback={this.onUpperMessageChange}
                            defaultMessage={this.defaultShareOnSlackMessage}
                            context={SLACK}
                        />
                    </div>
                    <FooterButtons>
                        <Button onClick={this.onHide} udStyle="ghost">
                            {gettext('Cancel')}
                        </Button>
                        <Button udStyle="primary" type="submit" disabled={this.isSubmitDisabled}>
                            {gettext('Share to Slack')}
                        </Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}

const ShareOnSlackModal = withI18n(InternalShareOnSlackModal);
export default ShareOnSlackModal;
