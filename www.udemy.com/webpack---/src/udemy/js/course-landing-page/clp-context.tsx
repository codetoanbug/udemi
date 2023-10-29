import React, {useState, useContext, createContext} from 'react';

import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {CourseLandingPageStore} from 'course-landing-page/course-landing-page.mobx-store';
import {CLPEventTrackingContext} from 'course-landing-page/event-tracking';
import {FeatureContext} from 'course-landing-page/feature-context';
import {ClpServerSideData} from 'course-landing-page/types/clp-server-side-data';

import {GiftCourseStore} from './components/gift-this-course/gift-course.mobx-store';
import {CouponStore} from './components/redeem-coupon/coupon.mobx-store';
import SidebarPositionManagerStore from './components/sidebar-container/sidebar-position-manager.mobx-store';
import WishlistStore from './components/wishlist/wishlist.mobx-store';

interface ClpContextValue {
    asyncFeatureContext: Promise<FeatureContext>;
    clpStore: CourseLandingPageStore;
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

const ClpContext = createContext<ClpContextValue | null>(null);

interface ClpContextProviderProps {
    asyncFeatureContext: Promise<FeatureContext>;
    clpStore: CourseLandingPageStore;
    clcStore: CourseLandingComponentsStore;
    couponStore: CouponStore;
    giftCourseStore: GiftCourseStore;
    sidebarPositionManagerStore: SidebarPositionManagerStore;
    wishlistStore: WishlistStore;
    eventTrackingContext?: CLPEventTrackingContext;
    hasOrganization: boolean;
    isMobile: boolean;
    serverSideProps: ClpServerSideData;
    children: React.ReactNode;
}

export const ClpContextProvider = ({
    asyncFeatureContext,
    clpStore,
    clcStore,
    couponStore,
    giftCourseStore,
    sidebarPositionManagerStore,
    wishlistStore,
    eventTrackingContext,
    hasOrganization,
    isMobile,
    serverSideProps,
    children,
}: ClpContextProviderProps) => {
    const [contextValue] = useState(() => {
        return {
            asyncFeatureContext,
            clpStore,
            clcStore,
            couponStore,
            giftCourseStore,
            sidebarPositionManagerStore,
            wishlistStore,
            eventTrackingContext,
            hasOrganization,
            isMobile,
            serverSideProps,
        };
    });

    return <ClpContext.Provider value={contextValue}>{children}</ClpContext.Provider>;
};

export function useClpContext() {
    const context = useContext(ClpContext);
    if (!context) {
        throw new Error('useClpContext must be wrapped in ClpContextProvider');
    }

    return context;
}
