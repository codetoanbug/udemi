import {ClientSideRender} from '@udemy/design-system-utils';
import {
    PAGE_TYPE_COURSE_LANDING_PAGE_COURSE,
    PAGE_TYPE_ORG_COURSE_LANDING_PAGE,
    RelatedSourceTypeOptions,
    DiscoveryUnit,
} from '@udemy/discovery-api';
import {observer, Provider} from 'mobx-react';
import React, {useContext, useEffect, useRef, useState} from 'react';

import DiscoveryUnitsContainerStore from 'browse/components/discovery-units-container/discovery-units-container.mobx-store';
import {RelatedOccupationUnitWithSubscriptionPlans} from 'browse/components/discovery-units/related-occupations-unit/related-occupation-unit-with-subscription-plans.react-component';
import {getDeviceType} from 'browse/lib/device-type';
import {UI_REGION} from 'browse/ui-regions';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {CourseLandingPageStore} from 'course-landing-page/course-landing-page.mobx-store';
import {CLPEventTrackingContext} from 'course-landing-page/event-tracking';
import {FeatureContext, useAsyncFeature} from 'course-landing-page/feature-context';
import {ClpServerSideData} from 'course-landing-page/types/clp-server-side-data';
import {isBadgingDiscoveryEnabled} from 'open-badges/common/utils/utils';
import {CourseCertificationUnit} from 'open-badges/open-badge-unit/course-certification-unit.react-component';
import {ReactSubscriptionContext} from 'subscription-browse/subscription-plan-provider.react-component';
import {isConsumerSubscription} from 'subscription-browse/utils';
import getRequestData from 'utils/get-request-data';
import {isomorphic} from 'utils/isomorphic-rendering';

import AddToCartConfirmationBottomDrawer from '../add-to-cart/add-to-cart-confirmation-bottom-drawer.react-component';
import {AffiliateBranding} from '../affiliate-branding/affiliate-branding.react-component';
import Bundle from '../bundle/bundle.react-isocomponent';
import {CodingExercisePromotionCLP} from '../coding-exercise-promotion/coding-exercise-promotion-clp.react-component';
import {CourseRetirementBanner} from '../course-retirement-banner/course-retirement-banner.react-component';
import Curriculum from '../curriculum/curriculum.react-isocomponent';
import Description from '../description/description.react-isocomponent';
import FeaturedReview from '../featured-review/featured-review.react-isocomponent';
import FloatingButtons from '../floating-buttons/floating-buttons.react-component';
import {IncentivesPlacement} from '../incentives/constants';
import {Incentives} from '../incentives/incentives.react-component';
import Instructors from '../instructors/instructors.react-isocomponent';
import MoreCoursesByInstructors from '../more-courses-by-instructors/more-courses-by-instructors.react-isocomponent';
import CuratedForUfbNotice from '../notices/curated-for-ufb-notice/curated-for-ufb-notice.react-isocomponent';
import {PracticeIncentivesCarousel} from '../practice-incentive-cards/practice-incentive-cards.react-component';
import PriceDisclaimer from '../price-disclaimer/price-disclaimer.react-component';
import {PURCHASE_OPTION_TYPES} from '../purchase-section/constants';
import Recommendations from '../recommendations/recommendations.react-isocomponent';
import {ReportAbuseMobile, ReportAbuseDesktop} from '../report-abuse';
import Requirements from '../requirements/requirements.react-isocomponent';
import {ReviewsContainer} from '../reviews/reviews-container.react-component';
import {ShortcutNavigation} from '../shortcut-navigation/shortcut-navigation.react-component';
import TrainingCredits from '../training-credits/training-credits.react-isocomponent';
import WhatYouWillLearn from '../what-you-will-learn/what-you-will-learn.react-isocomponent';

export interface CLPBodyProps {
    clcStore: CourseLandingComponentsStore;
    clpStore: CourseLandingPageStore;
    asyncFeatureContext: Promise<FeatureContext>;
    eventTrackingContext?: CLPEventTrackingContext;
    /** See udemy/course_landing_page/views/base_views.py */
    serverSideProps: ClpServerSideData;
}

export const CLPBody = observer((props: CLPBodyProps) => {
    const subscriptionContext = useContext(ReactSubscriptionContext);
    const deviceType = getDeviceType();
    const isMobile = getRequestData().isMobile;
    const {clcStore, clpStore, asyncFeatureContext, eventTrackingContext, serverSideProps} = props;
    const {isUB, course, experiments, showUpdatedCertificationUnitOnCLP} = serverSideProps;
    const discoveryUnitsContainerStore = useRef(
        new DiscoveryUnitsContainerStore({
            pageType: isUB
                ? PAGE_TYPE_ORG_COURSE_LANDING_PAGE
                : PAGE_TYPE_COURSE_LANDING_PAGE_COURSE,
            pageObject: {course_id: props.serverSideProps.course.id},
        }),
    ).current;

    const shouldShowShortcutNavigation = experiments?.shouldShowShortcutNavigation ?? false;
    const persistentSearch = experiments?.persistentSearch ?? false;
    const ReportAbuseComponent = isMobile ? ReportAbuseMobile : ReportAbuseDesktop;
    const {
        isDarkModeEnabledOnCTAButtons,
    } = props.serverSideProps.purchaseBodyContainer.componentProps.purchaseSection;
    const subscriptionType = subscriptionContext?.subscriptionPlan?.productType;
    const secondaryStyling = isDarkModeEnabledOnCTAButtons ? 'primary' : 'secondary';
    const recommendationsProps = {
        clcStore,
        deviceType,
        discoveryUnitsContainerStore,
        filter: (unit: DiscoveryUnit) => unit.item_type !== 'occupation',
        unitPropsByType: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            SequenceUnit: {
                outerTitle: gettext('This course is part of a learning series'),
                showSubtitle: false,
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            CourseComparison: {
                hideCoursePrices: serverSideProps.isUB,
            },
        },
        relatedSourceId: props.serverSideProps.course.id.toString(),
        relatedSourceType: RelatedSourceTypeOptions.COURSE,
    };
    const personalPlanDynamicCTAEnabled =
        useAsyncFeature(props.asyncFeatureContext, 'personalPlanDynamicCTA')?.enabled ?? false;

    const renderRelatedOccupation = () => {
        if (
            !serverSideProps.showRelatedOccupation ||
            !subscriptionContext ||
            subscriptionContext?.isLoading ||
            subscriptionContext?.isPersonalPlanSubscriber ||
            clpStore.isLoading
        ) {
            return;
        }

        const occupationUnit = discoveryUnitsContainerStore.units.find(
            (u: DiscoveryUnit) => u.item_type === 'occupation',
        );

        if (occupationUnit) {
            const purchaseTabsContext = clpStore.purchaseBodyComponentProps?.purchaseTabsContext;
            if (purchaseTabsContext) {
                const {selectedPurchaseOption} = purchaseTabsContext;
                const isDefaultPurchaseOptionTransactional = personalPlanDynamicCTAEnabled
                    ? false
                    : selectedPurchaseOption === PURCHASE_OPTION_TYPES.transactional.name;
                return (
                    <RelatedOccupationUnitWithSubscriptionPlans
                        unit={occupationUnit}
                        showHeader={false}
                        className="component-margin"
                        ctaButtonStyle={
                            isDefaultPurchaseOptionTransactional ? secondaryStyling : 'brand'
                        }
                        cardProps={{
                            headingText: gettext('Included in Personal Plan for'),
                            uiRegion: UI_REGION.BODY,
                        }}
                        showCancelAnytime={props.serverSideProps.experiments.showCancelAnytime}
                    />
                );
            }
        }
    };

    const moveCourseContentToTopInClpBody =
        props.serverSideProps.experiments.moveCourseContentToTopInClpBody;

    const showPracticeCardsInClpCourseContent =
        props.serverSideProps.experiments.showPracticeCardsInClpCourseContent;

    const curriculumProps = {
        courseId: course.id,
        courseTrackingId: eventTrackingContext?.courseTrackingId,
        curriculum: clpStore.curriculum,
        practiceIncentiveCardsComponent: showPracticeCardsInClpCourseContent &&
            clpStore.incentivesData && (
                <PracticeIncentivesCarousel
                    courseId={course.id}
                    courseTrackingId={eventTrackingContext?.courseTrackingId}
                    incentivesData={clpStore.incentivesData}
                />
            ),
    };

    const [isBadgingUnitShown, setIsBadgingUnitShown] = useState(false);
    useEffect(() => {
        let isMounted = true;
        isBadgingDiscoveryEnabled().then((response) => {
            if (isMounted) {
                setIsBadgingUnitShown(response);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <ClientSideRender>
                {shouldShowShortcutNavigation ? (
                    <ShortcutNavigation
                        courseTrackingId={eventTrackingContext?.courseTrackingId}
                        className="course-landing-page__shortcut_navigation"
                    />
                ) : (
                    <FloatingButtons persistentSearch={persistentSearch} />
                )}
            </ClientSideRender>
            <div className="paid-course-landing-page__body">
                <div className="course-landing-page__main-content">
                    {isMobile && course.showCuratedForUFBNotice && (
                        <CuratedForUfbNotice clcStore={clcStore} />
                    )}
                    <ClientSideRender>
                        <CourseRetirementBanner clcStore={clcStore} />
                    </ClientSideRender>
                    {isBadgingUnitShown && (
                        <CourseCertificationUnit
                            courseId={course.id}
                            courseTopicId={course.topic?.id}
                            showUpdatedCertificationUnit={showUpdatedCertificationUnitOnCLP}
                        />
                    )}
                    {!course.isPracticeTestCourse && (
                        <WhatYouWillLearn objectives={course.objectives} />
                    )}
                    {renderRelatedOccupation()}
                    <ClientSideRender>
                        <AffiliateBranding asyncFeatureContext={asyncFeatureContext} />
                    </ClientSideRender>
                    <ClientSideRender>
                        <Incentives
                            incentivesData={clpStore.incentivesData}
                            placement={IncentivesPlacement.BODY}
                            courseId={course.id}
                            courseTrackingId={eventTrackingContext?.courseTrackingId}
                            listSize="large"
                            isConsumerSubsAware={isConsumerSubscription(subscriptionType)}
                        />
                    </ClientSideRender>

                    {!isMobile && course.showCuratedForUFBNotice && (
                        <CuratedForUfbNotice clcStore={clcStore} />
                    )}
                    {props.serverSideProps.experiments.codingExercisePromotion.moduleEnabled && (
                        <ClientSideRender>
                            <div className="component-margin">
                                <CodingExercisePromotionCLP
                                    courseId={course.id}
                                    courseTrackingId={eventTrackingContext?.courseTrackingId}
                                    shouldEnablePopupVideo={
                                        props.serverSideProps.experiments.codingExercisePromotion
                                            .popupVideoComponentEnabled
                                    }
                                />
                            </div>
                        </ClientSideRender>
                    )}
                    {(moveCourseContentToTopInClpBody ||
                        (course.isCategoryDevelopment && !course.isPracticeTestCourse)) && (
                        <Curriculum {...curriculumProps} />
                    )}
                    {!course.isPracticeTestCourse && (
                        <Requirements prerequisites={course.prerequisites} />
                    )}
                    {!moveCourseContentToTopInClpBody && course.isPracticeTestCourse && (
                        <Curriculum {...curriculumProps} />
                    )}
                    {course.isCPECompliant && <TrainingCredits {...course.trainingCredits} />}
                    <Description
                        description={course.description}
                        target_audiences={course.targetAudiences}
                    />
                    {course.featuredReview && (
                        <FeaturedReview
                            courseTrackingId={eventTrackingContext?.courseTrackingId}
                            {...course.featuredReview}
                            reviewableObjectId={course.id}
                            reviewableObjectType="course"
                        />
                    )}
                    <Provider
                        showCodingExercisesBadge={
                            props.serverSideProps.experiments.showCodingExercisesBadge
                        }
                    >
                        <Recommendations {...recommendationsProps} />
                    </Provider>
                    {!moveCourseContentToTopInClpBody &&
                        !course.isCategoryDevelopment &&
                        !course.isPracticeTestCourse && <Curriculum {...curriculumProps} />}
                    <Provider
                        showCodingExercisesBadge={
                            props.serverSideProps.experiments.showCodingExercisesBadge
                        }
                    >
                        {!isUB && <Bundle courseId={course.id} />}
                    </Provider>
                    <Instructors {...course.instructors} />
                    <>
                        <span id="reviews" className="in-page-offset-anchor"></span>
                        <ReviewsContainer
                            clcStore={clcStore}
                            frontendTrackingId={eventTrackingContext?.courseTrackingId}
                            courseId={course.id}
                            isMobile={isMobile}
                            className="component-margin"
                        />
                    </>
                    <MoreCoursesByInstructors clcStore={clcStore} />
                    <ClientSideRender>
                        <PriceDisclaimer />
                    </ClientSideRender>
                    <ClientSideRender>
                        <ReportAbuseComponent
                            objectId={course.id}
                            objectType="course"
                            fullWidthButton={true}
                            udStyle="secondary"
                        />
                    </ClientSideRender>
                </div>
                <ClientSideRender>
                    <AddToCartConfirmationBottomDrawer addToCartData={clpStore.addToCartData} />
                </ClientSideRender>
            </div>
        </>
    );
});

export default isomorphic(CLPBody);
