import {ErrorPage} from '@udemy/react-structure-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import ErrorBoundary from 'base-components/error-boundary/error-boundary.react-component';
import {useClpContext} from 'course-landing-page/clp-context';
import {AlternateRedirect} from 'course-landing-page/components/alternate-redirect/alternate-redirect.react-isocomponent';
import {CLPBody} from 'course-landing-page/components/clp-body/clp-body.react-isocomponent';
import {DraftWarning} from 'course-landing-page/components/draft-warning/draft-warning.react-isocomponent';
import IntroductionAsset from 'course-landing-page/components/introduction-asset/introduction-asset.react-isocomponent';
import {Lede} from 'course-landing-page/components/lede/lede.react-isocomponent';
import PurchaseBodyContainer from 'course-landing-page/components/purchase-body-container/purchase-body-container.react-isocomponent';
import {SEOInfo} from 'course-landing-page/components/seo-info/seo-info.react-isocomponent';
import {
    BottomPositionToggleMarker,
    TopPositionToggleMarker,
} from 'course-landing-page/components/sidebar-container/position-toggle-marker.react-component';
import SidebarContainer from 'course-landing-page/components/sidebar-container/sidebar-container.react-isocomponent';
import {TopicMenu} from 'course-landing-page/components/topic-menu/topic-menu.react-isocomponent';
import {isomorphic} from 'utils/isomorphic-rendering';

export const CourseLandingPage = observer(() => {
    const {
        asyncFeatureContext,
        clcStore,
        clpStore,
        couponStore,
        giftCourseStore,
        sidebarPositionManagerStore,
        wishlistStore,
        eventTrackingContext,
        hasOrganization,
        isMobile,
        serverSideProps,
    } = useClpContext();

    const {course} = serverSideProps;
    return (
        <ErrorBoundary>
            {serverSideProps.isCourseVersioningEnabled &&
            !clpStore.isLoading &&
            !(clpStore.incentivesData && clpStore.curriculum) ? (
                <ErrorPage
                    heading={gettext('Your page failed to load!')}
                    content={gettext(
                        "Your page failed to load because you don't have access to this version of the course. Contact your admin and report the issue.",
                    )}
                />
            ) : (
                <main
                    className={classNames('paid-course-landing-page__container', {
                        'free-clp-page': !course.isPaid,
                    })}
                    id="main-content-anchor"
                >
                    <div
                        className={classNames({
                            'top-container': !hasOrganization,
                            'dark-background': serverSideProps.hasDarkBackground,
                        })}
                    >
                        <div
                            className={classNames({
                                'dark-background-inner-position-container':
                                    serverSideProps.hasDarkBackground,
                            })}
                        >
                            <div className={classNames({'component-margin': isMobile})}>
                                <TopicMenu
                                    hasDarkBackground={serverSideProps.hasDarkBackground}
                                    {...serverSideProps.topicMenu}
                                />
                                <AlternateRedirect
                                    hasDarkBackground={serverSideProps.hasDarkBackground}
                                    {...serverSideProps.alternateRedirect}
                                />
                                <div className="course-landing-page__introduction-asset__main">
                                    <IntroductionAsset {...serverSideProps.introductionAsset} />
                                </div>
                                <Lede
                                    hasDarkBackground={serverSideProps.hasDarkBackground}
                                    course={course}
                                    showCodingExercisesBadge={
                                        serverSideProps.experiments.showCodingExercisesBadge
                                    }
                                    {...serverSideProps.lede}
                                />
                                <div
                                    className={classNames(
                                        'course-landing-page__main-content',
                                        'course-landing-page__purchase-section__main',
                                        {
                                            'dark-background-inner-text-container':
                                                serverSideProps.hasDarkBackground,
                                        },
                                    )}
                                >
                                    <PurchaseBodyContainer
                                        asyncFeatureContext={asyncFeatureContext}
                                        store={clcStore}
                                        clpStore={clpStore}
                                        couponStore={couponStore}
                                        giftCourseStore={giftCourseStore}
                                        wishlistStore={wishlistStore}
                                        eventTrackingContext={eventTrackingContext}
                                        course={course}
                                        {...serverSideProps.purchaseBodyContainer}
                                    />
                                </div>
                                {course.isDraft && (
                                    <DraftWarning {...serverSideProps.draftWarning} />
                                )}
                                <div className="ud-component--course-landing-page--sidebar-container-top-mark">
                                    <TopPositionToggleMarker
                                        sidebarPositionManagerStore={sidebarPositionManagerStore}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SEOInfo {...serverSideProps.seoInfo} />
                    <SidebarContainer
                        asyncFeatureContext={asyncFeatureContext}
                        eventTrackingContext={eventTrackingContext}
                        store={clcStore}
                        couponStore={couponStore}
                        giftCourseStore={giftCourseStore}
                        sidebarPositionManagerStore={sidebarPositionManagerStore}
                        wishlistStore={wishlistStore}
                        course={course}
                        persistentSearch={serverSideProps.experiments.persistentSearch}
                        showCodingExercisesBadge={
                            serverSideProps.experiments.showCodingExercisesBadge
                        }
                        {...serverSideProps.sidebarContainer}
                    />
                    <CLPBody
                        clcStore={clcStore}
                        clpStore={clpStore}
                        asyncFeatureContext={asyncFeatureContext}
                        eventTrackingContext={eventTrackingContext}
                        serverSideProps={serverSideProps}
                    />
                </main>
            )}
            <div className="ud-component--course-landing-page--sidebar-container-bottom-mark">
                <BottomPositionToggleMarker
                    sidebarPositionManagerStore={sidebarPositionManagerStore}
                />
            </div>
        </ErrorBoundary>
    );
});

export default isomorphic(CourseLandingPage);
