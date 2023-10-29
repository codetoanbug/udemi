import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    EXPIRED_ADMIN_SUBSCRIPTION_CONTENT,
    EXPIRING_ADMIN_SUBSCRIPTION_CONTENT,
    EXPIRED_SUBSCRIPTION_CONTENT,
    EXPIRED_TRIAL_CONTENT,
    EXTEND_TRIAL_CONTENT,
} from './constants';
import ExpiredModalStore from './expired-modal.mobx-store';
import ExpiredAdminSubscriptionContent from './expired-subscription-modal-content/expired-admin-subscription-content.react-component';
import ExpiredSubscriptionContent from './expired-subscription-modal-content/expired-subscription-content.react-component';
import ExpiringAdminSubscriptionContent from './expired-subscription-modal-content/expiring-admin-subscription-content.react-component';
import ExpiredTrialContent from './expired-trial-modal-content/expired-trial-content.react-component';
import TrialExtensionContent from './expired-trial-modal-content/trial-extension-content.react-component';

import './ufb-expired-modal.less';

@observer
export default class UfbExpiredModal extends Component {
    static propTypes = {
        logoutUrl: PropTypes.string.isRequired,
        organizationId: PropTypes.number.isRequired,
        expirationData: PropTypes.object.isRequired,
        window: PropTypes.object,
        packageRemainingDays: PropTypes.number,
    };

    static defaultProps = {
        window,
        packageRemainingDays: 0,
    };

    constructor(props) {
        super(props);
        const {logoutUrl, organizationId, expirationData, packageRemainingDays} = props;
        this.store = new ExpiredModalStore({
            logoutUrl,
            organizationId,
            expirationData,
            packageRemainingDays,
        });
        this.store.setShowModal(false);
    }

    componentDidMount() {
        this.store.setShowModal(true);
    }

    @autobind
    logoutHandler() {
        this.props.window.location = this.props.logoutUrl;
    }

    @autobind
    renderModalTitle() {
        return [this.store.modalTitleId, null];
    }

    renderModalContent() {
        switch (this.store.modalContent) {
            case EXPIRED_TRIAL_CONTENT: {
                return <ExpiredTrialContent store={this.store} />;
            }
            case EXTEND_TRIAL_CONTENT: {
                return <TrialExtensionContent store={this.store} />;
            }
            case EXPIRED_SUBSCRIPTION_CONTENT: {
                return <ExpiredSubscriptionContent store={this.store} />;
            }
            case EXPIRED_ADMIN_SUBSCRIPTION_CONTENT: {
                return <ExpiredAdminSubscriptionContent store={this.store} />;
            }
            case EXPIRING_ADMIN_SUBSCRIPTION_CONTENT: {
                return <ExpiringAdminSubscriptionContent store={this.store} />;
            }
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.store.showModal}
                requireExplicitAction={true}
                /* The title is inside the modal content. */
                title=""
                renderTitle={this.renderModalTitle}
                styleName="modal ufb-expired-modal"
            >
                <div styleName="logout-btn-container">
                    <Button
                        styleName="logout-btn"
                        udStyle="ghost"
                        size="medium"
                        data-purpose="logout-btn"
                        onClick={this.logoutHandler}
                    >
                        {gettext('Log out')}
                    </Button>
                </div>
                {this.renderModalContent()}
            </Modal>
        );
    }
}
