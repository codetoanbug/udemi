import './app.global.less';
import './base-components';

import {Tracker} from '@udemy/event-tracking';

import {CLPViewEvent} from 'course-landing-page/events';
import {ClpServerSideData} from 'course-landing-page/types/clp-server-side-data';
import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udRenderReactComponents from 'utils/ud-render-react-components';

import {GiftCourseStore} from './components/gift-this-course/gift-course.mobx-store';
import LimitedAccessContainer from './components/limited-access-container/limited-access-container.react-isocomponent';
import {CouponStore} from './components/redeem-coupon/coupon.mobx-store';
import SidebarPositionManagerStore from './components/sidebar-container/sidebar-position-manager.mobx-store';
import WishlistStore from './components/wishlist/wishlist.mobx-store';
import CourseLandingComponentsStore from './course-landing-components.mobx-store';
import CourseLandingPageContainerWithContext from './course-landing-page-container.react-isocomponent';
import {CLPEventTrackingContext, getCLPEventTrackingContext} from './event-tracking';
import {getAsyncFeatureContext} from './feature-context';
import {userTracker} from './page-events';

export interface ModuleArgs {
    eventTrackingContext?: CLPEventTrackingContext;
    grouped_components: string[];
    initial_components: string[];
    serverSideProps: {
        limitedAccess: unknown;
    } & ClpServerSideData;
    view_restriction?: boolean;
}

export default function bootstrap(container: HTMLElement, moduleArgs: ModuleArgs) {
    userTracker(container);

    if (moduleArgs.view_restriction) {
        udRenderReactComponents(
            container,
            '.ud-component--course-landing-page--limited-access-container',
            LimitedAccessContainer,
            // @ts-expect-error props param inferred as {} | undefined
            moduleArgs.serverSideProps.limitedAccess,
        );
        return;
    }

    const {course} = moduleArgs.serverSideProps;
    const clcStore = new CourseLandingComponentsStore({
        courseId: course.id,
    });
    const asyncFeatureContext = getAsyncFeatureContext(clcStore);
    const eventTrackingContext = getCLPEventTrackingContext(course.id);

    // Used for testing
    moduleArgs.eventTrackingContext = eventTrackingContext;

    /**
     * This is a legacy object, please migrate to
     * moduleArgs.serverSideProps.course where possible
     */
    const courseData = {
        id: course.id,
        type: 'course',
        title: course.title,
        url: course.url,
        is_paid: course.isPaid,
        is_private: course.isPrivate,
        is_published: course.isPublished,
        is_wishlisted: course.isWishlisted,
        frontendTrackingId: eventTrackingContext.courseTrackingId,
    };
    const couponStore = CouponStore.create({
        params: new URLSearchParams(window.location.search),
        courseTrackingId: eventTrackingContext.courseTrackingId,
        clcStore,
    });
    const giftCourseStore = new GiftCourseStore(course.id, eventTrackingContext.courseTrackingId);
    const wishlistStore = new WishlistStore(courseData, window);
    const sidebarPositionManagerStore = new SidebarPositionManagerStore();

    udRenderReactComponents(
        container,
        '.ud-component--course-landing-page--course-landing-page',
        CourseLandingPageContainerWithContext,
        {
            asyncFeatureContext,
            clcStore,
            couponStore,
            giftCourseStore,
            sidebarPositionManagerStore,
            wishlistStore,
            eventTrackingContext,
            hasOrganization: getConfigData().brand.has_organization,
            isMobile: getRequestData().isMobile,
            serverSideProps: moduleArgs.serverSideProps,
        },
    );
    Tracker.publishEvent(
        new CLPViewEvent({
            courseId: course.id,
            courseTrackingId: eventTrackingContext.courseTrackingId,
            isDirectLanded: eventTrackingContext.isDirectLanded,
            isPurchased: course.isEnrolled,
        }),
    );
}
