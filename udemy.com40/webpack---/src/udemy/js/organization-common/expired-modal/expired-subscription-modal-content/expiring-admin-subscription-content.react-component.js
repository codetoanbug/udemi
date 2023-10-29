import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {BlockList, Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import escapeHtml from 'utils/escape/escape-html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';
import {getNumericSiteStat} from 'utils/site-stats';
import udLink from 'utils/ud-link';

import './subscription-modal-content.less';

@observer
export default class ExpiringAdminSubscriptionContent extends Component {
    static propTypes = {
        store: PropTypes.shape({
            expirationData: PropTypes.object.isRequired,
            redirectToPayment: PropTypes.func.isRequired,
            packageRemainingDays: PropTypes.number.isRequired,
            modalTitleId: PropTypes.string.isRequired,
            setShowModal: PropTypes.func.isRequired,
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
    onDismiss() {
        this.props.store.setShowModal(false);
    }

    @autobind
    renderAdminList() {
        const {expirationData, packageRemainingDays} = this.props.store;
        let message = '';
        if (packageRemainingDays === 0) {
            message = gettext('New content formats to upskill your entire team for another year');
        } else if (packageRemainingDays === 1) {
            message = gettext(
                'First-to-market content to get your team ready for whatever comes next',
            );
        } else {
            message = gettext("The tools to guide your team's learning over the next 12 months");
        }
        return (
            <BlockList styleName="admin-list" size="large" padding="tight">
                <BlockList.Item icon={<TickIcon label={false} />}>
                    <span
                        {...safelySetInnerHTML({
                            descriptionOfCaller:
                                'expiring-admin-subscription-content:ownership-of-domain',
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
                <BlockList.Item icon={<TickIcon label={false} />}>{message}</BlockList.Item>
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
                            onClick={this.onDismiss}
                            udStyle="secondary"
                            data-purpose="dismiss-button"
                        >
                            {gettext('Remind me later')}
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
                    disabled={store.loadingBillingCountry}
                    udStyle="primary"
                    data-purpose="buy-button"
                >
                    {gettext('Renew - Continue to Pricing')}
                </Button>
                <Button onClick={this.onDismiss} udStyle="secondary" data-purpose="dismiss-button">
                    {gettext('Renew later')}
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
        const udConfig = getConfigData();
        const {packageRemainingDays} = this.props.store;
        let title = '';
        if (packageRemainingDays === 1) {
            title = interpolate(
                gettext('Your %(product)s subscription will expire tomorrow.'),
                {product: udConfig.brand.product_name},
                true,
            );
        } else {
            title = ninterpolate(
                'Your %(product)s subscription will expire in %(count)s day.',
                'Your %(product)s subscription will expire in %(count)s days.',
                packageRemainingDays,
                {product: udConfig.brand.product_name, count: packageRemainingDays},
            );
        }

        return (
            <div>
                <WarningIcon label={false} color="warning" styleName="modal-icon" />
                <h3
                    id={this.props.store.modalTitleId}
                    className="ud-heading-xxl"
                    styleName="modal-title"
                    data-purpose="modal-title"
                >
                    {title}
                </h3>
                <div styleName="modal-message">
                    <p>{gettext('Renew your subscription now to keep these benefits')}</p>
                    {this.renderAdminList()}
                </div>
                {this.renderCtaSection()}
            </div>
        );
    }
}
