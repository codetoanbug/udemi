import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {runInAction, observable} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {FeatureState} from 'browse/components/feature-discovery/feature-discoverability.mobx-store';
import {FeatureDiscoverability} from 'browse/components/feature-discovery/feature-discoverability.react-component';
import FeatureList from 'browse/components/feature-discovery/feature-discovery.json';
import Description from 'course-landing-page/components/description/description.react-isocomponent';
import FeaturedReview from 'course-landing-page/components/featured-review/featured-review.react-isocomponent';
import Instructors from 'course-landing-page/components/instructors/instructors.react-isocomponent';
import Requirements from 'course-landing-page/components/requirements/requirements.react-isocomponent';
import TrainingCredits from 'course-landing-page/components/training-credits/training-credits.react-isocomponent';
import WhatYouWillLearn from 'course-landing-page/components/what-you-will-learn/what-you-will-learn.react-isocomponent';
import {TABS} from 'course-taking/dashboard/constants';
import requires from 'course-taking/registry/requires';
import {GoogleCalendarAuthStore} from 'learning-calendar-reminders/calendar-button/google-calendar-auth.mobx-store';
import {LearningReminderBanner} from 'learning-calendar-reminders/learning-reminder-banner/learning-reminder-banner.react-component';
import {LearningReminderDiscoveryModal} from 'learning-calendar-reminders/learning-reminder-modal/learning-reminder-discovery-modal.react-component';
import {isBadgingDiscoveryEnabled} from 'open-badges/common/utils/utils';
import {CourseCertificationUnit} from 'open-badges/open-badge-unit/course-certification-unit.react-component';
import CourseRetirementBanner from 'organization-common/course-retirement/course-retirement-banner.react-isocomponent';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import getConfigData from 'utils/get-config-data';
import {formatNumber} from 'utils/numeral';

import CourseLead from './course-lead.react-component';

import './course-overview.less';

@requires('courseTakingStore')
@inject(({googleClientId}) => ({
    googleClientId,
}))
@observer
export default class CourseOverviewV2 extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        onTabSelected: PropTypes.func,
        googleClientId: PropTypes.string,
    };

    static defaultProps = {
        onTabSelected: null,
        googleClientId: null,
    };

    constructor(props) {
        super(props);
        this.courseTakingStore = this.props.courseTakingStore;
        this.resourceContextMenu = createUFBContextMenu();
        this.googleAuthStore = props.googleClientId
            ? new GoogleCalendarAuthStore(props.googleClientId)
            : null;
        if (
            !getConfigData().brand.organization &&
            this.googleAuthStore &&
            !this.googleAuthStore.googleAuth
        ) {
            this.googleAuthStore.loadGoogleAuth();
        }
    }

    async componentDidMount() {
        const response = await isBadgingDiscoveryEnabled();
        runInAction(() => {
            this.isBadgeUnitShown = response;
        });
    }

    @observable isBadgeUnitShown = false;

    get course() {
        return this.props.courseTakingStore.course;
    }

    @autobind
    handleReviewButton() {
        this.props.onTabSelected(TABS.REVIEWS);
        window.scrollTo(0, 0);
    }

    renderLearningReminderFeatureDiscoverability() {
        if (!this.props.googleClientId) return null;
        return (
            <FeatureDiscoverability
                config={FeatureList.learning_event_scheduler}
                renderingStrategy={{
                    [FeatureState.PASSIVE]: {
                        component: (
                            <LearningReminderBanner
                                googleAuthStore={this.googleAuthStore}
                                shouldRedirect={false}
                            />
                        ),
                        primaryComponentType: 'banner',
                    },
                    [FeatureState.ACTIVE]: {
                        component: (
                            <>
                                <LearningReminderBanner
                                    googleAuthStore={this.googleAuthStore}
                                    shouldRedirect={false}
                                />
                                <LearningReminderDiscoveryModal
                                    googleAuthStore={this.googleAuthStore}
                                    shouldRedirect={false}
                                />
                            </>
                        ),
                        primaryComponentType: 'modal',
                    },
                }}
            />
        );
    }

    render() {
        const isEnterpriseOrg =
            !getConfigData().brand.is_team && getConfigData().brand.has_organization;
        const showUpdatedCertificationUnit = this.courseTakingStore
            .showUpdatedCertificationUnitOnCTP;

        if (!this.course) {
            return <Loader size="xxlarge" block={true} />;
        }

        const courseCertificationUnit = (
            <CourseCertificationUnit
                courseId={this.course.id}
                courseTopicId={this.course.primaryCourseLabel?.id}
                showUpdatedCertificationUnit={showUpdatedCertificationUnit}
            />
        );

        return (
            <>
                {this.renderLearningReminderFeatureDiscoverability()}
                {/* Show this unit above course lead if `showUpdatedCertificationUnit` is true */}
                {this.isBadgeUnitShown && showUpdatedCertificationUnit && courseCertificationUnit}
                <Provider resourceContextMenu={this.resourceContextMenu}>
                    <CourseLead
                        styleName={classNames({
                            'component-margin':
                                this.props.googleClientId && !showUpdatedCertificationUnit,
                        })}
                        courseTakingStore={this.courseTakingStore}
                    />
                </Provider>
                {isEnterpriseOrg && (
                    <CourseRetirementBanner
                        courseId={this.course.id}
                        courseLabelId={this.course.primaryCourseLabel.id}
                        styleName="course-retirement-banner-margin"
                    />
                )}
                {/* Show this unit below course lead if `showUpdatedCertificationUnit` is false */}
                {this.isBadgeUnitShown && !showUpdatedCertificationUnit && courseCertificationUnit}
                <div styleName="component-margin">
                    <WhatYouWillLearn objectives={this.course.objectives} />
                </div>
                {this.course.isCpeCompliant && (
                    <TrainingCredits
                        numCpeCredits={this.course.numCpeCredits}
                        cpeFieldOfStudy={this.course.cpeFieldOfStudy}
                        cpeProgramLevel={this.course.cpeProgramLevel}
                    />
                )}
                <Description
                    styleName="component-margin"
                    description={this.course.description}
                    target_audiences={this.course.targetAudiences}
                />
                <Instructors
                    styleName="component-margin"
                    course_id={this.course.id}
                    instructors_info={this.courseTakingStore.instructorInfo.instructors_info}
                />
                {this.courseTakingStore.featuredReviewData.reviewInfo && (
                    <FeaturedReview
                        styleName="component-margin"
                        page={this.courseTakingStore.featuredReviewData.page}
                        review_info={this.courseTakingStore.featuredReviewData.reviewInfo}
                    />
                )}

                {this.courseTakingStore.reviewData &&
                    this.courseTakingStore.featuredReviewData.reviewInfo && (
                        <Button
                            udStyle="ghost"
                            componentClass="button"
                            onClick={this.handleReviewButton}
                            data-purpose="all-reviews"
                        >
                            {interpolate(
                                gettext('See all reviews (%(numReviews)s) '),
                                {
                                    numReviews: formatNumber(
                                        this.courseTakingStore.courseLeadData.num_reviews,
                                    ),
                                },
                                true,
                            )}
                        </Button>
                    )}
                <Requirements
                    styleName="component-margin"
                    prerequisites={this.course.prerequisites}
                    isCollapsible={false}
                />
            </>
        );
    }
}
