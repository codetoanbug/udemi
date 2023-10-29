import {LocalizedHtml} from '@udemy/i18n';
import UdemySymbolIcon from '@udemy/icons/dist/udemy-symbol.ud-icon';
import {BlockList, Button} from '@udemy/react-core-components';
import {Radio} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    EXPIRED_TRIAL_CONTENT,
    EXTENDING_MESSAGE_PREVIEW,
    EXTENDING_MESSAGE_TRIAL,
    REASONS,
    EXTEND_REASON_PREVIEW,
    EXTEND_REASON_TRIAL,
} from 'organization-common/expired-modal/constants';
import udIntercom from 'utils/ud-intercom';

import './expired-trial-modal-content.less';

@observer
export default class TrialExtensionContent extends Component {
    static propTypes = {
        store: PropTypes.shape({
            errorMessage: PropTypes.string.isRequired,
            loading: PropTypes.bool.isRequired,
            modalTitleId: PropTypes.string.isRequired,
            setModalContent: PropTypes.func.isRequired,
            extendTeamPlan: PropTypes.func.isRequired,
            isLimitedConsumptionTrial: PropTypes.bool,
        }).isRequired,
        window: PropTypes.object,
    };

    static defaultProps = {
        window,
    };

    @observable selectedReason = {};

    @autobind
    goBackHandler() {
        this.props.store.setModalContent(EXPIRED_TRIAL_CONTENT);
    }

    @autobind
    @action
    onReasonOptionChange(event) {
        this.selectedReason = {
            id: event.target.id,
            analyticsLabel: event.target.dataset.analyticsLabel,
        };
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.store.extendTeamPlan(this.selectedReason.id);
    }

    get renderSubmitButtonText() {
        if (this.props.store.isLimitedConsumptionTrial) {
            return gettext('Extend trial');
        }
        return gettext('Extend preview');
    }

    renderContent() {
        const reasonRadioButtons = REASONS.map((reason) => (
            <BlockList.Item key={reason.id}>
                <Radio
                    id={reason.id}
                    name="reason"
                    onChange={this.onReasonOptionChange}
                    value={reason.text}
                    size="large"
                    data-analytics-label={reason.analyticsLabel}
                >
                    {reason.text}
                </Radio>
            </BlockList.Item>
        ));
        return (
            <form onSubmit={this.onSubmit} styleName="form-wrapper">
                <BlockList size="large" padding="tight">
                    {reasonRadioButtons}
                </BlockList>
                <div styleName="cta-wrapper">
                    <Button
                        udStyle="secondary"
                        data-purpose="back-button"
                        onClick={this.goBackHandler}
                    >
                        {gettext('Go back')}
                    </Button>
                    <Button
                        udStyle="primary"
                        type="submit"
                        data-purpose="submit-button"
                        disabled={!Object.entries(this.selectedReason).length}
                    >
                        {this.renderSubmitButtonText}
                    </Button>
                </div>
            </form>
        );
    }

    @autobind
    showIntercomHandler() {
        udIntercom.get({root: this.props.window}).then((intercom) => {
            intercom('showNewMessage');
        });
    }

    renderAlert() {
        const {errorMessage} = this.props.store;
        if (!errorMessage) {
            return null;
        }
        const alertBodyText = (
            <LocalizedHtml
                html={gettext('Try again or <a class="cta-button">contact support for help.</a>')}
                interpolate={{
                    'cta-button': (
                        <Button
                            data-purpose="intercom-link"
                            udStyle="link"
                            size="medium"
                            onClick={this.showIntercomHandler}
                        />
                    ),
                }}
            />
        );

        return (
            <AlertBanner
                styleName="alert-banner"
                udStyle="error"
                title={`${errorMessage}`}
                showCta={false}
                body={alertBodyText}
            />
        );
    }

    get renderTitle() {
        if (this.props.store.isLimitedConsumptionTrial) {
            return EXTEND_REASON_TRIAL;
        }
        return EXTEND_REASON_PREVIEW;
    }

    get extendMessage() {
        if (this.props.store.isLimitedConsumptionTrial) {
            return EXTENDING_MESSAGE_TRIAL;
        }
        return EXTENDING_MESSAGE_PREVIEW;
    }

    render() {
        const {loading} = this.props.store;
        if (loading) {
            return (
                <div>
                    <MainContentLoader />
                    <h3
                        className="ud-heading-xxl"
                        styleName="loader-text"
                        data-purpose="extend-message"
                    >
                        {this.extendMessage}
                    </h3>
                </div>
            );
        }
        return (
            <div>
                <UdemySymbolIcon label={false} size="xxlarge" styleName="modal-icon" />
                <h3
                    id={this.props.store.modalTitleId}
                    className="ud-heading-xxl"
                    styleName="modal-title"
                    data-purpose="modal-title"
                >
                    {this.renderTitle}
                </h3>
                {this.renderAlert()}
                {this.renderContent()}
            </div>
        );
    }
}
