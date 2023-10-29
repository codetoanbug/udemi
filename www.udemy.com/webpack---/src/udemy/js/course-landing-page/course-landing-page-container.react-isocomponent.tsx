import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';

import {ClpContextProvider, useClpContext} from 'course-landing-page/clp-context';
import {CLPSubscriptionContextProvider} from 'course-landing-page/clp-subscription-context';
import {GiftCourseStore} from 'course-landing-page/components/gift-this-course/gift-course.mobx-store';
import {IncentivesData} from 'course-landing-page/components/incentives/incentives.react-component';
import {CouponStore} from 'course-landing-page/components/redeem-coupon/coupon.mobx-store';
import SidebarPositionManagerStore from 'course-landing-page/components/sidebar-container/sidebar-position-manager.mobx-store';
import WishlistStore from 'course-landing-page/components/wishlist/wishlist.mobx-store';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {CourseLandingPageStore} from 'course-landing-page/course-landing-page.mobx-store';
import {CourseLandingPage} from 'course-landing-page/course-landing-page.react-isocomponent';
import {CLPEventTrackingContext} from 'course-landing-page/event-tracking';
import {FeatureContext} from 'course-landing-page/feature-context';
import {
    AddToCartContext,
    CurriculumContext,
    DealBadgeContext,
    BasePurchaseSectionContext,
    DiscountExpirationContext,
    GiftThisCourseContext,
    PriceTextContext,
    PurchaseTabsContext,
    RedeemCouponContext,
    LifetimeAccessContext,
} from 'course-landing-page/types/clc-contexts';
import {ClpServerSideData} from 'course-landing-page/types/clp-server-side-data';
import {SubscriptionCTAExperimentProvider} from 'subscription-browse/subscription-cta-experiment-provider';
import {SubscriptionPlanProvider} from 'subscription-browse/subscription-plan-provider.react-component';
import {isomorphic} from 'utils/isomorphic-rendering';
import {withGlobalProviders} from 'utils/with-global-providers';

const CourseLandingPageContainer = () => {
    const {clcStore, clpStore} = useClpContext();

    useEffect(() => {
        const onInitialDataLoaded = () => {
            const incentivesData = clcStore.get<{
                incentives?: IncentivesData;
            }>(['incentives']).incentives;
            clpStore.setIncentivesData(incentivesData);

            const curriculum = clcStore.get<{
                curriculum_context?: {
                    data: CurriculumContext;
                };
            }>(['curriculum_context']).curriculum_context?.data;
            clpStore.setCurriculum(curriculum);

            const purchaseBodyRawComponentProps = clcStore.get<{
                add_to_cart?: AddToCartContext;
                base_purchase_section?: BasePurchaseSectionContext;
                deal_badge?: DealBadgeContext;
                discount_expiration?: DiscountExpirationContext;
                gift_this_course?: GiftThisCourseContext;
                lifetime_access_context?: LifetimeAccessContext;
                price_text?: PriceTextContext;
                purchase_tabs_context?: PurchaseTabsContext;
                redeem_coupon?: RedeemCouponContext;
            }>([
                'add_to_cart',
                'base_purchase_section',
                'deal_badge',
                'discount_expiration',
                'gift_this_course',
                'lifetime_access_context',
                'price_text',
                'purchase_tabs_context',
                'redeem_coupon',
            ]);
            clpStore.setPurchaseBodyComponentProps({
                basePurchaseSection: purchaseBodyRawComponentProps.base_purchase_section,
                dealBadge: purchaseBodyRawComponentProps.deal_badge,
                discountExpiration: purchaseBodyRawComponentProps.discount_expiration,
                giftThisCourse: purchaseBodyRawComponentProps.gift_this_course,
                lifetimeAccessContext: purchaseBodyRawComponentProps.lifetime_access_context,
                priceText: purchaseBodyRawComponentProps.price_text,
                purchaseTabsContext: purchaseBodyRawComponentProps.purchase_tabs_context,
                purchaseInfo: purchaseBodyRawComponentProps.base_purchase_section?.purchaseInfo,
                purchaseSection:
                    purchaseBodyRawComponentProps.base_purchase_section?.purchaseSection,
                redeemCoupon: purchaseBodyRawComponentProps.redeem_coupon,
                incentives: incentivesData,
            });

            const addToCartData = clcStore.get<{add_to_cart?: AddToCartContext}>(['add_to_cart'])
                .add_to_cart;
            clpStore.setAddToCartData(addToCartData);

            clpStore.setIsLoading(false);
        };

        const loadInitialData = async () => {
            const initialComponents = [
                'add_to_cart',
                'available_coupons',
                'base_purchase_section',
                'buy_button',
                'buy_for_team',
                'cacheable_buy_button',
                'cacheable_deal_badge',
                'cacheable_discount_expiration',
                'cacheable_price_text',
                'cacheable_purchase_text',
                'curated_for_ufb_notice_context',
                'curriculum_context',
                'deal_badge',
                'discount_expiration',
                'gift_this_course',
                'incentives',
                'instructor_links',
                'lifetime_access_context',
                'money_back_guarantee',
                'price_text',
                'purchase_tabs_context',
                'purchase',
                'recommendation',
                'redeem_coupon',
                'sidebar_container',
                'purchase_body_container',
            ];

            await clcStore.getOrPopulate(initialComponents);
            onInitialDataLoaded();
        };
        loadInitialData();
    }, [clpStore, clcStore]);

    return <CourseLandingPage />;
};

interface CourseLandingPageContainerWithContextProps {
    asyncFeatureContext: Promise<FeatureContext>;
    clcStore: CourseLandingComponentsStore;
    couponStore: CouponStore;
    giftCourseStore: GiftCourseStore;
    sidebarPositionManagerStore: SidebarPositionManagerStore;
    wishlistStore: WishlistStore;
    eventTrackingContext?: CLPEventTrackingContext;
    hasOrganization: boolean;
    isMobile: boolean;
    serverSideProps: ClpServerSideData;
}

export const CourseLandingPageContainerWithContext = (
    props: CourseLandingPageContainerWithContextProps,
) => {
    const [clpStore] = useState(() => {
        return new CourseLandingPageStore();
    });
    const [queryClient] = useState(new QueryClient());

    return (
        <ClpContextProvider
            asyncFeatureContext={props.asyncFeatureContext}
            clpStore={clpStore}
            clcStore={props.clcStore}
            couponStore={props.couponStore}
            giftCourseStore={props.giftCourseStore}
            wishlistStore={props.wishlistStore}
            sidebarPositionManagerStore={props.sidebarPositionManagerStore}
            eventTrackingContext={props.eventTrackingContext}
            hasOrganization={props.hasOrganization}
            isMobile={props.isMobile}
            serverSideProps={props.serverSideProps}
        >
            <QueryClientProvider client={queryClient}>
                <SubscriptionCTAExperimentProvider
                    context={{
                        showCancelAnytime: props.serverSideProps.experiments.showCancelAnytime,
                    }}
                >
                    <SubscriptionPlanProvider>
                        <CLPSubscriptionContextProvider
                            subscriptionContext={
                                props.serverSideProps.sidebarContainer.componentProps
                                    .purchaseSection.subscriptionContext
                            }
                        >
                            <CourseLandingPageContainer />
                        </CLPSubscriptionContextProvider>
                    </SubscriptionPlanProvider>
                </SubscriptionCTAExperimentProvider>
            </QueryClientProvider>
        </ClpContextProvider>
    );
};

export default withGlobalProviders(isomorphic(CourseLandingPageContainerWithContext));
