import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {BlockList, Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import escapeHtml from 'utils/escape/escape-html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {getNumericSiteStat} from 'utils/site-stats';
import udLink from 'utils/ud-link';

import './subscription-modal-content.less';

@observer
export default class ExpiredAdminSubscriptionContent extends Component {
    static propTypes = {
        store: PropTypes.shape({
            expirationData: PropTypes.object.isRequired,
            modalTitleId: PropTypes.string.isRequired,
            redirectToPayment: PropTypes.func.isRequired,
            fetchBillingCountry: PropTypes.func.isRequired,
            loadingBillingCountry: PropTypes.bool.isRequired,
            isRegionRestricted: PropTypes.bool.isRequired,
            redirectToDemoRequest: PropTypes.func.isRequired,
        }).isRequired,
        window: PropTypes.object,
    };

    static defaultProps = {
        window,
    };

    componentDidMount() {
        this.props.store.fetchBillingCountry();
    }

    @autobind
    buyHandler() {
        this.props.store.redirectToPayment();
    }

    @autobind
    renderAlert() {
        const {expirationData} = this.props.store;
        if (!expirationData.expiredAlert) {
            return null;
        }
        const title = gettext('Your subscription expired before we charged your card');
        const message = gettext('You can add more seats when renewing your subscription');
        return (
            <AlertBanner
                styleName="alert-banner"
                udStyle="information"
                title={title}
                showCta={false}
                body={message}
            />
        );
    }

    @autobind
    renderAdminList() {
        const {expirationData} = this.props.store;
        return (
            <BlockList styleName="admin-list" size="large" padding="tight">
                <BlockList.Item icon={<TickIcon label={false} />}>
                    <span
                        {...safelySetInnerHTML({
                            descriptionOfCaller:
                                'expired-admin-subscription-content:ownership-of-domain',
                            html: interpolate(
                                gettext(
                                    'Your ownership of the domain <b class="domain">%(domainName)s</b>',
                                ),
                                {
                                    domainName: escapeHtml(expirationData.accountUrl),
                                },
                                true,
                            ),
                        })}
                    />
                </BlockList.Item>
                <BlockList.Item icon={<TickIcon label={false} />}>
                    {interpolate(
                        gettext(
                            'Unlimited, anytime access to over %(numCoursesSiteStat)s highly-rated courses',
                        ),
                        {numCoursesSiteStat: getNumericSiteStat('num_courses_rounded')},
                        true,
                    )}
                </BlockList.Item>
                <BlockList.Item icon={<TickIcon label={false} />}>
                    {gettext('The tools to guide your team’s learning over the next 12 months')}
                </BlockList.Item>
            </BlockList>
        );
    }

    @autobind
    renderCtaSection() {
        const {store} = this.props;
        if (store.isRegionRestricted) {
            return (
                <>
                    <h4 styleName="region-restricted-text" className="ud-text-sm">
                        {gettext(
                            'This subscription is not available for online renewal in your region. ' +
                                'Request a demo and a sales representative will reach out to assist.',
                        )}
                    </h4>
                    <div styleName="cta-wrapper-stack">
                        <Button
                            onClick={store.redirectToDemoRequest}
                            disabled={store.loadingBillingCountry}
                            udStyle="primary"
                            data-purpose="buy-button"
                        >
                            {gettext('Request a demo')}
                        </Button>
                        <Button
                            udStyle="ghost"
                            size="medium"
                            componentClass="a"
                            href={udLink.toSupportContact(undefined, 'admin')}
                            target="_blank"
                            data-purpose="chat-with-us"
                        >
                            {gettext('Got questions? Chat with us')}
                        </Button>
                    </div>
                </>
            );
        }
        return (
            <div styleName="cta-wrapper-stack">
                <Button
                    onClick={this.buyHandler}
                    udStyle="primary"
                    data-purpose="buy-button"
                    disabled={store.loadingBillingCountry}
                >
                    {gettext('Renew - Continue to Pricing')}
                </Button>
                <Button
                    udStyle="ghost"
                    size="medium"
                    componentClass="a"
                    href={udLink.toSupportContact(undefined, 'admin')}
                    target="_blank"
                    data-purpose="chat-with-us"
                >
                    {gettext('Got questions? Chat with us')}
                </Button>
            </div>
        );
    }

    render() {
        return (
            <div>
                <WarningIcon label={false} color="warning" styleName="modal-icon" />
                <h3
                    id={this.props.store.modalTitleId}
                    className="ud-heading-xxl"
                    styleName="modal-title"
                    data-purpose="modal-title"
                >
                    {gettext('Your subscription has expired')}
                </h3>
                <div styleName="modal-message">
                    <p>{gettext('Renew your subscription now to keep these benefits')}</p>
                    {this.renderAdminList()}
                </div>
                {this.renderAlert()}
                {this.renderCtaSection()}
            </div>
        );
    }
}
