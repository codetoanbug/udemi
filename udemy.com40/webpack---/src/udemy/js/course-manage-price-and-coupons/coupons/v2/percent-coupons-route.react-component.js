import {FormGroup, TextInput} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import TextInputWithAddons from 'base-components/ungraduated/form/text-input/text-input-with-addons.react-component';
import Loader from 'course-manage-v2/loader.react-component';
import instructorTokens from 'instructor/variables';

import CopyButton from './components/copy-button.react-component';
import CouponCreationModal from './components/coupon-creation.react-component';
import CouponsTable from './components/coupons-table/coupons-table.react-component';
import './percent-coupons-route.less';

@withMatchMedia({
    isMobileMax: `(max-width: ${instructorTokens['breakpoint-instructor-mobile-max']})`,
})
@inject('couponsStore')
@observer
export default class PercentCouponsRoute extends Component {
    static propTypes = {
        couponsStore: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        isMobileMax: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(null)]),
    };

    static defaultProps = {
        isMobileMax: null,
    };

    componentDidMount() {
        this.props.couponsStore.course.load().then(() => {
            this.props.couponsStore.initialize();
        });
    }

    renderReferralLink() {
        const {couponsStore, isMobileMax} = this.props;
        const input = <TextInput readOnly={true} value={couponsStore.referralUrl} />;
        const copyButtonProps = {
            udStyle: 'secondary',
            'data-clipboard-text': couponsStore.referralUrl,
            children: isMobileMax ? gettext('Copy link') : gettext('Copy'),
        };

        return (
            <div styleName="referral-link-panel">
                <h2 className="ud-heading-lg" styleName="heading">
                    {gettext('Refer students')}
                </h2>
                <p>
                    {gettext(
                        'Any time a student uses this link, we will credit you with the sale.',
                    )}{' '}
                    <a
                        className="ud-link-underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/support/229603968/"
                    >
                        {gettext('Learn more')}
                    </a>
                </p>
                <FormGroup
                    label={gettext('Referral Link')}
                    labelProps={{className: 'ud-sr-only'}}
                    styleName="referral-link"
                >
                    {isMobileMax && input}
                    {!isMobileMax && (
                        <TextInputWithAddons>
                            {input}
                            <TextInputWithAddons.Addon
                                componentClass={CopyButton}
                                {...copyButtonProps}
                            />
                        </TextInputWithAddons>
                    )}
                </FormGroup>
                {isMobileMax && <CopyButton {...copyButtonProps} styleName="mobile-copy-button" />}
            </div>
        );
    }

    renderCouponsHeader() {
        return (
            <h2 className="ud-heading-lg" styleName="heading" data-purpose="coupons-header">
                {gettext('Coupons')}
            </h2>
        );
    }

    renderCouponsPriceAlert() {
        return (
            <AlertBanner
                data-purpose="coupons-price-alert"
                showCta={false}
                styleName="alert-banner"
                title={
                    <>
                        {gettext(
                            'We have updated the coupon system, and there is more to come. ' +
                                'Announcing new free coupon limits and bulk coupon creation.',
                        )}{' '}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://teach.udemy.com/october-2021-coupon-updates"
                            className="ud-link-underline"
                        >
                            {gettext('Learn more')}
                        </a>
                    </>
                }
            />
        );
    }

    render() {
        if (this.props.couponsStore.isLoading) {
            return <Loader />;
        }
        return (
            <div data-purpose="coupons-route">
                {this.renderCouponsPriceAlert()}
                {this.renderReferralLink()}
                {this.renderCouponsHeader()}
                <CouponCreationModal />
                <CouponsTable isMobileMax={this.props.isMobileMax} />
            </div>
        );
    }
}
