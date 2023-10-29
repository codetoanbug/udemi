import UdemySymbolIcon from '@udemy/icons/dist/udemy-symbol.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    EXPIRED_MESSAGE_TRIAL,
    EXPIRED_MESSAGE_PREVIEW,
    EXTEND_LINK_TEMPLATE_PREVIEW,
    EXTEND_LINK_TEMPLATE_TRIAL,
    EXTEND_TRIAL_CONTENT,
} from 'organization-common/expired-modal/constants';
import escapeHtml from 'utils/escape/escape-html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {getNumericSiteStat} from 'utils/site-stats';

import './expired-trial-modal-content.less';

@observer
export default class ExpiredTrialContent extends Component {
    static propTypes = {
        store: PropTypes.shape({
            modalTitleId: PropTypes.string.isRequired,
            setModalContent: PropTypes.func.isRequired,
            redirectToPayment: PropTypes.func.isRequired,
            isLimitedConsumptionTrial: PropTypes.bool,
            expirationData: PropTypes.object.isRequired,
        }).isRequired,
    };

    @autobind
    extendTrialHandler() {
        this.props.store.setModalContent(EXTEND_TRIAL_CONTENT);
    }

    @autobind
    buyHandler() {
        this.props.store.redirectToPayment();
    }

    renderAdminContent() {
        const isLimitedTrial = this.props.store.isLimitedConsumptionTrial;
        return (
            <>
                <p className="ud-text-lg" styleName="modal-message">
                    {interpolate(
                        gettext(
                            'Unlock unlimited access to over %(numCoursesSiteStat)s of Udemy’s top courses',
                        ),
                        {numCoursesSiteStat: getNumericSiteStat('num_courses_rounded')},
                        true,
                    )}
                </p>
                <div styleName="cta-wrapper-stack">
                    <Button onClick={this.buyHandler} udStyle="primary" data-purpose="buy-button">
                        {gettext('Buy Udemy Business')}
                    </Button>
                    <Button
                        udStyle="ghost"
                        onClick={this.extendTrialHandler}
                        size="medium"
                        data-purpose="extend-trial-link"
                    >
                        {isLimitedTrial ? EXTEND_LINK_TEMPLATE_TRIAL : EXTEND_LINK_TEMPLATE_PREVIEW}
                    </Button>
                </div>
            </>
        );
    }

    renderNonAdminContent() {
        return (
            <p
                className="ud-text-lg"
                styleName="modal-message"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'expired-trial-content:contact-your-administrator',
                    html: interpolate(
                        gettext(
                            'Contact your administrator, <b class="owner">%(ownerName)s</b> to unlock unlimited access to over %(numCoursesSiteStat)s of Udemy’s top courses',
                        ),
                        {
                            ownerName: escapeHtml(this.props.store.expirationData.ownerName),
                            numCoursesSiteStat: getNumericSiteStat('num_courses_rounded'),
                        },
                        true,
                    ),
                })}
            />
        );
    }

    render() {
        const modalTitle = this.props.store.isLimitedConsumptionTrial
            ? EXPIRED_MESSAGE_TRIAL
            : EXPIRED_MESSAGE_PREVIEW;
        return (
            <div>
                <UdemySymbolIcon label={false} size="xxlarge" styleName="modal-icon" />
                <h3
                    id={this.props.store.modalTitleId}
                    className="ud-heading-xxl"
                    styleName="modal-title"
                    data-purpose="modal-title"
                >
                    {modalTitle}
                </h3>
                {this.props.store.expirationData.isAdmin
                    ? this.renderAdminContent()
                    : this.renderNonAdminContent()}
            </div>
        );
    }
}
