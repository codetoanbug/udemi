import {AlertBanner} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import React from 'react';

import {UI_REGION} from 'browse/ui-regions';
import {PriceTextComponentContextProps} from 'course-landing-page/components/price-text/price-text-props';
import {PurchaseSectionComponentContextProps} from 'course-landing-page/components/purchase-section/purchase-section-container.react-component';
import WishlistStore from 'course-landing-page/components/wishlist/wishlist.mobx-store';
import Wishlist from 'course-landing-page/components/wishlist/wishlist.react-component';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {CLPEventTrackingContext} from 'course-landing-page/event-tracking';
import {
    AddToCartContext,
    BuyButtonContext,
    DealBadgeContext,
    DiscountExpirationContext,
} from 'course-landing-page/types/clc-contexts';
import getConfigData from 'utils/get-config-data';
import serverOrClient from 'utils/server-or-client';
import udMe from 'utils/ud-me';

import AddToCart from '../add-to-cart/add-to-cart.react-isocomponent';
import {CacheableBuyButton} from '../buy-button/buy-button.react-isocomponent';
import DealBadge from '../deal-badge/deal-badge.react-isocomponent';
import DiscountExpiration from '../discount-expiration/discount-expiration.react-isocomponent';
import {BaseClcPriceText} from '../price-text/base-clc-price-text.react-component';
import {PriceSkeleton} from '../purchase-section/components/purchase-section-container-skeleton.react-component';
import {PurchaseTextDisplay} from '../purchase-text/purchase-text.react-component';

import './buy-box.less';

export interface BuyBoxProps {
    componentProps: {
        addToCart?: AddToCartContext;
        buyButton?: BuyButtonContext;
        dealBadge?: DealBadgeContext;
        discountExpiration?: DiscountExpirationContext;
        priceText?: PriceTextComponentContextProps;
        purchaseInfo: {
            isValidStudent: boolean;
            purchaseDate: string | null;
        };
        purchaseSection?: PurchaseSectionComponentContextProps;
    };
    store?: CourseLandingComponentsStore;
    eventTrackingContext?: CLPEventTrackingContext;
    wishlistStore?: WishlistStore;
    showBuyNowButton?: boolean;
    udStyle?: 'brand' | 'secondary' | 'primary';
}

export const BuyBox = observer((props: BuyBoxProps) => {
    function renderPurchasedText() {
        const {purchaseInfo} = props.componentProps;
        const buyButtonProps = getBuyButtonProps();

        return (
            <div styleName="buy-box" data-purpose="purchase-text-section">
                {purchaseInfo.purchaseDate && (
                    <div styleName="buy-box-item" data-purpose="buy-box">
                        <PurchaseTextDisplay purchaseDate={purchaseInfo.purchaseDate} />
                    </div>
                )}
                {/* buy-button class is to change it in a .less file higher up (using :global) */}
                <div className="buy-button" styleName="buy-box-item buy-button">
                    {buyButtonProps?.button.is_enabled && (
                        <CacheableBuyButton
                            button={buyButtonProps.button}
                            eventTrackingContext={props.eventTrackingContext}
                        />
                    )}
                </div>
            </div>
        );
    }

    function renderCacheableBuyButton(componentContext: {
        data?: {
            is_in_subscription: boolean;
            is_organization_only: boolean;
            is_free_for_organization: boolean;
        } | null;
    }) {
        const buyButtonProps = getBuyButtonProps();
        const replaceBuyButton = buyButtonProps?.button.replace_with_add_to_cart;
        const showAlertBanner =
            getIsOrgStudent() &&
            (componentContext.data
                ? !componentContext.data.is_in_subscription &&
                  !componentContext.data.is_organization_only &&
                  !componentContext.data.is_free_for_organization
                : true);
        const showBuyNowButton =
            props.showBuyNowButton === undefined ? true : props.showBuyNowButton;
        return showAlertBanner ? (
            // ub user who are not admin or owner shouldn't be able to buy an imported course.
            <AlertBanner
                showCta={false}
                udStyle="warning"
                title={gettext(
                    'To enroll in this course, please ask an account admin to assign it to you',
                )}
            />
        ) : (
            !replaceBuyButton &&
                showBuyNowButton &&
                buyButtonProps &&
                buyButtonProps.button.is_enabled && (
                    <CacheableBuyButton
                        button={buyButtonProps.button}
                        eventTrackingContext={props.eventTrackingContext}
                    />
                )
        );
    }

    function attachCourseTrackingIdToBuyables(buyables: {frontendTrackingId?: string}[]) {
        buyables.forEach((buyable) => {
            buyable.frontendTrackingId = props.eventTrackingContext?.courseTrackingId;
        });
    }

    function getBuyButtonProps() {
        // This was implemented as a hotfix because the add coupon button on CLP was not updating with the clc store
        // a proper fix would be to have this logic at the sidebar container level and have all the containing
        // unaware of where they are getting their props from.
        if (props.store?.contexts.get('buy_button')) {
            return props.store.contexts.get('buy_button');
        }
        return props.componentProps.buyButton;
    }

    function getIsOrgStudent() {
        return (
            getConfigData().brand.has_organization &&
            !!udMe.organization &&
            !(udMe.organization.isAdmin || udMe.organization.isOwner)
        );
    }

    function renderBuyItems() {
        const {componentProps, store, wishlistStore, udStyle, ...restProps} = props;
        const {
            dealBadge,
            purchaseSection,
            priceText,
            discountExpiration,
            addToCart,
        } = componentProps;

        if (addToCart?.is_enabled && serverOrClient.isClient) {
            attachCourseTrackingIdToBuyables(addToCart.buyables);
        }

        const componentContext = {data: null};

        if (store) {
            const purchaseContext = store.contexts.get('purchase');
            if (purchaseContext?.data) {
                componentContext.data = {
                    ...restProps,
                    ...purchaseContext.data,
                };
            }
        }

        let discountTextSize = priceText?.data?.discount_text_size
            ? priceText.data.discount_text_size
            : 'xxl';
        if (purchaseSection && !purchaseSection.is_course_paid) {
            discountTextSize = 'lg';
        }

        const hasPrice = componentContext.data && priceText;
        const hasPriceAndEnabled = hasPrice && priceText.data.is_enabled;
        const hasOrganization = getConfigData().brand.has_organization;
        const addToCartProps = {...addToCart};
        const buyButtonProps = getBuyButtonProps();
        const replaceBuyButton = buyButtonProps?.button.replace_with_add_to_cart;
        if (replaceBuyButton) {
            addToCartProps.cartButtonTextAdd = gettext('Buy this course');
        }

        return (
            <div styleName="buy-box" data-purpose="buy-box">
                {!hasOrganization && (
                    <>
                        <div styleName="buy-box-item">
                            {dealBadge?.data.is_enabled && <DealBadge {...dealBadge.data} />}
                        </div>
                        <div styleName="buy-box-item">
                            {!hasPrice && <PriceSkeleton />}
                            {hasPriceAndEnabled && (
                                <BaseClcPriceText
                                    componentContext={componentContext}
                                    discount_text_size={discountTextSize}
                                />
                            )}
                        </div>

                        <div styleName="buy-box-item discount-expiration">
                            {discountExpiration?.data.is_enabled && (
                                <DiscountExpiration {...discountExpiration.data} />
                            )}
                        </div>
                        {addToCart?.is_enabled && (
                            <div styleName="buy-box-item add-to-cart-button-wrapper">
                                <AddToCart {...addToCartProps} udStyle={udStyle} />
                                {udMe.is_authenticated && (
                                    <Wishlist
                                        wishlistStore={wishlistStore}
                                        uiRegion={UI_REGION.PURCHASE_SECTION}
                                        square={true}
                                        size="large"
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
                <div className="buy-button" styleName="buy-box-item buy-button">
                    {!componentContext.data || udMe.isLoading ? (
                        <PriceSkeleton />
                    ) : (
                        renderCacheableBuyButton(componentContext)
                    )}
                </div>
            </div>
        );
    }

    if (props.componentProps.purchaseInfo.isValidStudent) {
        return renderPurchasedText();
    }

    return renderBuyItems();
});
(BuyBox as React.SFC).displayName = 'BuyBox';
