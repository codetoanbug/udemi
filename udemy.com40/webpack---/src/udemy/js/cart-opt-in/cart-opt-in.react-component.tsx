import {CoursePriceStore} from '@udemy/browse-course';
import {TrackImpression} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {
    getConfigData,
    getRequestData,
    udMe,
    udUserAgnosticTrackingParams,
} from '@udemy/shared-utils';
import {getSmartBarStore, BasicBarContent, SMART_BAR_NOTICE_TYPE} from '@udemy/smart-bar';
import {WithStoresProps, withStores} from '@udemy/store-provider';
import {
    UDDataConfig,
    UDDataMe,
    UDDataRequest,
    UDDataUserAgnosticTrackingParams,
} from '@udemy/ud-data';
import autobind from 'autobind-decorator';
import {action, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CouponStore from 'cart/components/redeem-coupon/coupon.mobx-store';
import ShoppingClient from 'shopping-client/shopping-client.mobx-store';
import './cart-opt-in.less';

export interface OptInProps extends WithStoresProps {
    couponStore: CouponStore;
}

@observer
export class CartOptInInternal extends Component<OptInProps> {
    static propTypes = {
        couponStore: PropTypes.object.isRequired,
    };

    constructor(props: OptInProps) {
        super(props);
        this.couponStore = props.couponStore;
        this.smartBarStore = getSmartBarStore({
            params:
                typeof window !== 'undefined'
                    ? Object.fromEntries(new URLSearchParams(window.location?.search).entries())
                    : {},
            forceNoticeType: SMART_BAR_NOTICE_TYPE,
            udConfig: getConfigData() as UDDataConfig,
            udRequest: getRequestData() as UDDataRequest,
            udMe: udMe() as UDDataMe,
            userAgnosticTrackingParams: udUserAgnosticTrackingParams() as UDDataUserAgnosticTrackingParams,
        });
        this.coursePriceStore = this.props.stores[0] as CoursePriceStore;
    }

    private coursePriceStore: CoursePriceStore;
    private couponStore: CouponStore;
    private smartBarStore;

    get optInApplied() {
        return this.smartBarStore?.optInJustApplied();
    }

    get optInApplying() {
        return this.smartBarStore?.optInApplying();
    }

    @autobind
    @action
    optInOnClick() {
        if (this.smartBarStore?.optInNotApplied()) {
            this.smartBarStore?.optIn().then(() => {
                runInAction(() => {
                    ShoppingClient.fetch().then(() => {
                        this.couponStore._updateState();
                        this.smartBarStore?.optedIn();
                        this.smartBarStore?.sendDealOptInEvent();
                    });
                    this.coursePriceStore.reloadCourses();
                });
            });
        }
    }

    render() {
        if (!this.smartBarStore?.state.loaded) {
            return null;
        }

        const smartBarCtaText = this.smartBarStore.data.get('cta_text');
        const smartBarCtaAppliedText = this.smartBarStore.data.get('cta_applied_text');
        const ctaButtonText = interpolate(
            gettext('%(ctaText)s'),
            {
                ctaText: smartBarCtaText,
            },
            true,
        );
        const ctaAppliedButtonText = interpolate(
            gettext('%(ctaAppliedText)s'),
            {
                ctaAppliedText: smartBarCtaAppliedText,
            },
            true,
        );

        const sideBar = (
            <div styleName="cart-opt-in" className="udlite-in-udheavy" data-purpose="cart-opt-in">
                <BasicBarContent
                    className="cart-opt-in__content"
                    smartBarStore={this.smartBarStore}
                    membership={this.smartBarStore.membership}
                />
                <div>
                    <Button
                        udStyle="ghost"
                        size="medium"
                        styleName="opt-in-cta-button"
                        className={
                            (this.smartBarStore.optInNotApplied() && 'ud-link-underline') as string
                        }
                        onClick={this.optInOnClick}
                        data-purpose="cart-opt-in-cta"
                    >
                        {this.optInApplied ? (
                            ctaAppliedButtonText
                        ) : this.optInApplying ? (
                            <Loader color="inherit" overlay={true} styleName="loader" />
                        ) : (
                            ctaButtonText
                        )}
                    </Button>
                </div>
            </div>
        );

        return (
            <>
                {this.smartBarStore.noticeType?.showOptIn &&
                    !this.smartBarStore.membership.get('opt_in') && (
                        <TrackImpression trackFunc={this.smartBarStore.sendImpressionsEvent}>
                            <div data-purpose="cart-opt-in-container">{sideBar}</div>
                        </TrackImpression>
                    )}
            </>
        );
    }
}

export const CartOptIn = withStores([CoursePriceStore], CartOptInInternal);
