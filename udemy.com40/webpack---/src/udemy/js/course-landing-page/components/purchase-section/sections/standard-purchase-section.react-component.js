import {MarketplaceOnly} from '@udemy/react-brand-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {getDeviceType, DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import {AvailableCouponWithCouponStore} from 'cart/components/redeem-coupon/available-coupon.react-component';
import {BuyBox} from 'course-landing-page/components/buy-box/buy-box.react-component';
import {GiftCourseStore} from 'course-landing-page/components/gift-this-course/gift-course.mobx-store';
import {IncentivesPlacement} from 'course-landing-page/components/incentives/constants';
import {Incentives} from 'course-landing-page/components/incentives/incentives.react-component';
import {FullLifetimeAccess} from 'course-landing-page/components/lifetime-access/full-lifetime-access.react-component';
import {MoneyBackGuarantee} from 'course-landing-page/components/money-back-guarantee/money-back-guarantee.react-component';
import {SecondaryCallToActionSection} from 'course-landing-page/components/purchase-section/sections/secondary-call-to-action-section.react-component';
import WishlistStore from 'course-landing-page/components/wishlist/wishlist.mobx-store';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';

import {PURCHASE_SECTION_VARIATION} from '../constants';

import './generic-purchase-section.less';

@observer
export default class StandardPurchaseSection extends React.Component {
    static propTypes = {
        componentProps: PropTypes.shape({
            addToCart: PropTypes.object,
            buyButton: PropTypes.object,
            dealBadge: PropTypes.object,
            discountExpiration: PropTypes.object,
            priceText: PropTypes.object,
            redeemCoupon: PropTypes.object,
            incentives: PropTypes.object,
            moneyBackGuarantee: PropTypes.object,
            giftThisCourse: PropTypes.object,
        }).isRequired,
        store: PropTypes.instanceOf(CourseLandingComponentsStore),
        couponStore: PropTypes.object.isRequired,
        wishlistStore: PropTypes.instanceOf(WishlistStore),
        giftCourseStore: PropTypes.instanceOf(GiftCourseStore),
        isPaid: PropTypes.bool.isRequired,
        variation: PropTypes.oneOf(Object.values(PURCHASE_SECTION_VARIATION)).isRequired,
        course: PropTypes.object,
        isConsumerSubsAware: PropTypes.bool,
        showApplyCouponOnCLP: PropTypes.bool,
        styleFullLifetimeAccess: PropTypes.string,
        styleMoneyBackGuarantee: PropTypes.string,
        uiRegion: PropTypes.string,
        showBuyNowButton: PropTypes.bool,
        udStyle: PropTypes.string,
    };

    static defaultProps = {
        wishlistStore: null,
        course: null,
        // CLCStore as passed props,
        store: null,
        eventTrackingContext: null,
        isConsumerSubsAware: false,
        showApplyCouponOnCLP: true,
        giftCourseStore: null,
        styleFullLifetimeAccess: null,
        styleMoneyBackGuarantee: null,
        uiRegion: undefined,
        showBuyNowButton: true,
        udStyle: null,
    };

    state = {
        personalPlanDynamicCTAEnabled: false,
    };

    componentDidMount() {
        this.isMounted = true;
        if (this.props.udStyle) {
            this.updateAddToCartProps();
        }
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    @observable isMounted = false;

    @autobind
    @action
    updateAddToCartProps() {
        if (this.props.componentProps?.addToCart) {
            this.props.componentProps.addToCart.udStyle = this.props.udStyle;
        }
    }

    get isIncentivesOnSidebar() {
        if (!this.props.store) {
            return false;
        }

        const incentivesContext = this.props.componentProps.incentives;
        return incentivesContext && incentivesContext.placement === IncentivesPlacement.SIDEBAR;
    }

    get displayApplicableCoupons() {
        return this.props.couponStore && this.props?.store?.contexts.get('available_coupons');
    }

    render() {
        const {
            couponStore,
            wishlistStore,
            giftCourseStore,
            isPaid,
            variation,
            course,
            isConsumerSubsAware,
            showApplyCouponOnCLP,
            styleFullLifetimeAccess,
            styleMoneyBackGuarantee,
            udStyle,
            ...passthroughProps
        } = this.props;

        return (
            <div styleName="main-cta-container" data-purpose="purchase-section">
                <div styleName="buy-box-main">
                    <BuyBox
                        {...passthroughProps}
                        udStyle={udStyle}
                        wishlistStore={wishlistStore}
                        variation={variation}
                    />
                </div>
                <div styleName="local-incentive">
                    <MoneyBackGuarantee
                        {...passthroughProps.componentProps}
                        style={styleMoneyBackGuarantee}
                    />
                </div>
                <div styleName="available-coupons">
                    <MarketplaceOnly>
                        {this.displayApplicableCoupons && (
                            <AvailableCouponWithCouponStore
                                couponStore={couponStore}
                                coupons={passthroughProps.store.contexts
                                    .get('available_coupons')
                                    .coupons.slice()}
                            />
                        )}
                    </MarketplaceOnly>
                </div>
                {((!this.isIncentivesOnSidebar && getDeviceType() !== DEVICE_TYPE_MOBILE) ||
                    passthroughProps.componentProps.incentives
                        ?.move_lifetime_access_to_purchase_section) &&
                    Boolean(passthroughProps.componentProps.lifetimeAccessContext) && (
                        <div styleName="local-incentive">
                            <FullLifetimeAccess
                                lifetimeAccessContext={
                                    passthroughProps.componentProps.lifetimeAccessContext
                                }
                                style={styleFullLifetimeAccess}
                            />
                        </div>
                    )}
                <div styleName="local-incentive">
                    {this.isIncentivesOnSidebar &&
                        Boolean(passthroughProps.componentProps.incentives) && (
                            <Provider store={passthroughProps.store}>
                                <Incentives
                                    incentivesData={passthroughProps.componentProps.incentives}
                                    isConsumerSubsAware={isConsumerSubsAware}
                                    placement={IncentivesPlacement.SIDEBAR}
                                    courseTrackingId={
                                        passthroughProps.eventTrackingContext?.courseTrackingId
                                    }
                                    courseId={course?.id}
                                />
                            </Provider>
                        )}
                </div>
                <div styleName="ctas">
                    <SecondaryCallToActionSection
                        couponStore={couponStore}
                        isPaid={isPaid}
                        giftCourseStore={giftCourseStore}
                        giftThisCourse={passthroughProps.componentProps.giftThisCourse}
                        uiRegion={this.props.uiRegion}
                        variation={variation}
                        course={course}
                    />
                </div>
            </div>
        );
    }
}
