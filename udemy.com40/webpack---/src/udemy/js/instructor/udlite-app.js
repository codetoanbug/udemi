import {ErrorPage as NotFound} from '@udemy/react-structure-components';
import {Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Switch, Redirect} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import LiveChat from 'course-manage-v2/live-chat/live-chat.react-component';
import {ExperimentProvider} from 'experiment';
import MarketplaceInsights from 'teaching-courses/mkinsights/insights.react-component';
import udRenderReactComponents from 'utils/ud-render-react-components';

import Account from './account.react-component';
import Communications from './communications.react-component';
import Courses from './courses.react-component';
import Help from './help.react-component';
import {ContentOpportunities} from './insights/content-opportunities.react-component';
import {Insights} from './insights/insights.react-component';
import InstructorStore from './instructor.mobx-store';
import LabsDashboard from './labs/dashboard.react-component';
import LabsStore from './labs/labs.mobx-store';
import NewcomerChallenge from './newcomer-challenge.react-component';
import Performance from './performance.react-component';
import Profile from './profile.react-component';
import SideNav from './side-nav/side-nav.react-component';
import Tools from './tools.react-component';

import './app.global.less';
import './instructor-resources.global.less';

const propTypes = {
    hasPublishedCourse: PropTypes.bool.isRequired,
    action: PropTypes.string,
    subaction: PropTypes.string,
    showLiveChat: PropTypes.bool,
    performanceEnabled: PropTypes.bool.isRequired,
    performanceBaseUrl: PropTypes.string.isRequired,
    courseManageBaseUrl: PropTypes.string.isRequired,
    labsEnabled: PropTypes.bool,
    labCreateEnabled: PropTypes.bool,
    pageStore: PropTypes.instanceOf(InstructorStore), // Mainly for tests.
    hasQAPermission: PropTypes.bool,
    showMFAToggle: PropTypes.bool,
    isStaff: PropTypes.bool,
    isNewcomerChallengeEnabled: PropTypes.bool,
    isNewlyNewcomerChallengePageEnabled: PropTypes.bool,
    isUBOnlyDataPreviewEnabled: PropTypes.bool,
    isEngagementDismissibleMessageEnabled: PropTypes.bool,
    isInstructorSendAnnouncementEnabled: PropTypes.bool,
    isTaughtCoursesApiSlimVersionEnabled: PropTypes.bool,
    isUBInsightsProductTourEnabled: PropTypes.bool,
    isDisplayInstructorAllTimeCourseEngagementDataEnabled: PropTypes.bool,
    isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: PropTypes.bool,
    isInSupplyGapsTargetGroup: PropTypes.bool,
    isInstructorPartner: PropTypes.bool,
    isFinancialIncentiveBannerEnabled: PropTypes.bool,
    isInQAAITargetGroup: PropTypes.bool,
};

const defaultProps = {
    action: '',
    subaction: '',
    showLiveChat: true,
    pageStore: null,
    labsEnabled: false,
    labCreateEnabled: false,
    hasQAPermission: false,
    showMFAToggle: false,
    isStaff: false,
    isNewcomerChallengeEnabled: false,
    isNewlyNewcomerChallengePageEnabled: false,
    isUBOnlyDataPreviewEnabled: false,
    isEngagementDismissibleMessageEnabled: false,
    isInstructorSendAnnouncementEnabled: true,
    isTaughtCoursesApiSlimVersionEnabled: false,
    isUBInsightsProductTourEnabled: false,
    isDisplayInstructorAllTimeCourseEngagementDataEnabled: false,
    isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: false,
    isInSupplyGapsTargetGroup: false,
    isInstructorPartner: false,
    isFinancialIncentiveBannerEnabled: false,
    isInQAAITargetGroup: false,
};

export const InstructorFrame = withRouter(
    observer(
        ({
            performanceEnabled,
            hasPublishedCourse,
            performanceBaseUrl,
            courseManageBaseUrl,
            labsStore,
            hasQAPermission,
            showMFAToggle,
            isMFAEnabled,
            isNewcomerChallengeEnabled,
            isNewlyNewcomerChallengePageEnabled,
            isUBOnlyDataPreviewEnabled,
            isEngagementDismissibleMessageEnabled,
            isInstructorSendAnnouncementEnabled,
            isTaughtCoursesApiSlimVersionEnabled,
            isUBInsightsProductTourEnabled,
            isDisplayInstructorAllTimeCourseEngagementDataEnabled,
            isDisplayPracticeInsightsNewPageWithFunnelViewEnabled,
            isInSupplyGapsTargetGroup,
            isInstructorPartner,
            isFinancialIncentiveBannerEnabled,
            isInQAAITargetGroup,
        }) => {
            return (
                <div className="instructor-responsive-container">
                    <Switch>
                        <PageTrackingRoute
                            pageKey="instructor_courses"
                            exact={true}
                            path="/courses/"
                            render={() => (
                                <Courses
                                    hasPublishedCourse={hasPublishedCourse}
                                    isNewcomerChallengeEnabled={isNewcomerChallengeEnabled}
                                    isNewlyNewcomerChallengePageEnabled={
                                        isNewlyNewcomerChallengePageEnabled
                                    }
                                    isInstructorPartner={isInstructorPartner}
                                    isInSupplyGapsTargetGroup={isInSupplyGapsTargetGroup}
                                />
                            )}
                        />
                        {labsStore && (
                            <PageTrackingRoute
                                pageKey="instructor_labs"
                                path="/labs/"
                                render={() => <LabsDashboard labsStore={labsStore} />}
                            />
                        )}
                        <PageTrackingRoute
                            pageKey="instructor_communications"
                            path="/communication/"
                            render={() => (
                                <Communications
                                    hasQAPermission={hasQAPermission}
                                    isInstructorSendAnnouncementEnabled={
                                        isInstructorSendAnnouncementEnabled
                                    }
                                    isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                                    isTaughtCoursesApiSlimVersionEnabled={
                                        isTaughtCoursesApiSlimVersionEnabled
                                    }
                                    isInQAAITargetGroup={isInQAAITargetGroup}
                                />
                            )}
                        />
                        <PageTrackingRoute
                            pageKey="instructor_marketplace_insights"
                            exact={true}
                            path="/marketplace-insights/"
                            render={() => <MarketplaceInsights />}
                        />
                        <PageTrackingRoute
                            pageKey="instructor_opportunities"
                            exact={true}
                            path="/opportunities/:topic/"
                            render={() => <NotFound />}
                        />
                        {isInSupplyGapsTargetGroup && (
                            <PageTrackingRoute
                                pageKey="content_opportunities"
                                exact={true}
                                path="/opportunities/"
                                render={() => (
                                    <ContentOpportunities
                                        isInstructorPartner={isInstructorPartner}
                                        isFinancialIncentiveBannerEnabled={
                                            isFinancialIncentiveBannerEnabled
                                        }
                                    />
                                )}
                            />
                        )}
                        <PageTrackingRoute
                            pageKey="instructor_performance"
                            path="/performance/"
                            render={() => (
                                <Performance
                                    performanceEnabled={performanceEnabled}
                                    performanceBaseUrl={performanceBaseUrl}
                                    courseManageBaseUrl={courseManageBaseUrl}
                                    isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                                    isEngagementDismissibleMessageEnabled={
                                        isEngagementDismissibleMessageEnabled
                                    }
                                    isTaughtCoursesApiSlimVersionEnabled={
                                        isTaughtCoursesApiSlimVersionEnabled
                                    }
                                    isUBInsightsProductTourEnabled={isUBInsightsProductTourEnabled}
                                    isDisplayInstructorAllTimeCourseEngagementDataEnabled={
                                        isDisplayInstructorAllTimeCourseEngagementDataEnabled
                                    }
                                    isDisplayPracticeInsightsNewPageWithFunnelViewEnabled={
                                        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled
                                    }
                                />
                            )}
                        />
                        {isInSupplyGapsTargetGroup && (
                            <PageTrackingRoute
                                pageKey="insights"
                                exact={true}
                                path="/insights/"
                                render={() => <Insights />}
                            />
                        )}
                        <PageTrackingRoute
                            pageKey="instructor_tools"
                            exact={true}
                            path="/tools/"
                            render={() => (
                                <Tools isInSupplyGapsTargetGroup={isInSupplyGapsTargetGroup} />
                            )}
                        />
                        <PageTrackingRoute
                            pageKey="instructor_resources"
                            exact={true}
                            path="/help/"
                            render={() => <Help />}
                        />
                        <PageTrackingRoute
                            pageKey="instructor_account"
                            path="/account/"
                            render={() => (
                                <Account
                                    showMFAToggle={showMFAToggle}
                                    isMFAEnabled={isMFAEnabled}
                                />
                            )}
                        />
                        <PageTrackingRoute
                            pageKey="instructor_profile"
                            path="/profile/"
                            render={() => <Profile />}
                        />
                        <PageTrackingRoute
                            pageKey="newcomer_challenge"
                            path="/newcomer/"
                            render={
                                isNewlyNewcomerChallengePageEnabled
                                    ? () => <NewcomerChallenge />
                                    : () => <Redirect to="/courses/" />
                            }
                        />
                        <Redirect to="/courses/" />
                    </Switch>
                </div>
            );
        },
    ),
);

InstructorFrame.propTypes = propTypes;

InstructorFrame.defaultProps = defaultProps;

@observer
export class App extends Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.pageStore = props.pageStore || new InstructorStore(props.action, props.subaction);
        if (props.labsEnabled) {
            this._createLabStore(props);
        }
    }

    _createLabStore(props) {
        this.labsStore = new LabsStore(props.labCreateEnabled, props.isStaff);
    }

    render() {
        // Removing testing pageStore from props is important! Otherwise CourseManageFrame gets
        // props.pageStore instead if this.pageStore
        const {
            showLiveChat,
            performanceEnabled,
            hasQAPermission,
            showMFAToggle,
            isUBOnlyDataPreviewEnabled,
            isInstructorSendAnnouncementEnabled,
            isDisplayPracticeInsightsNewPageWithFunnelViewEnabled,
            isInSupplyGapsTargetGroup,
            isInstructorPartner,
            isFinancialIncentiveBannerEnabled,
            ...frameProps
        } = this.props;
        return (
            <ExperimentProvider experimentSet={['labs']}>
                <MemoizedBrowserRouter>
                    <Provider instructorStore={this.pageStore}>
                        <div className="instructor-page-frame">
                            <div className="instructor-side-nav">
                                <SideNav
                                    performanceEnabled={performanceEnabled}
                                    labsEnabled={!!this.labsStore}
                                    labsStore={this.labsStore}
                                    hasQAPermission={hasQAPermission}
                                    isDisplayPracticeInsightsNewPageWithFunnelViewEnabled={
                                        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled
                                    }
                                    isInSupplyGapsTargetGroup={isInSupplyGapsTargetGroup}
                                />
                            </div>
                            <div className="instructor-main-container">
                                <InstructorFrame
                                    performanceEnabled={performanceEnabled}
                                    labsStore={this.labsStore}
                                    hasQAPermission={hasQAPermission}
                                    showMFAToggle={showMFAToggle}
                                    isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                                    isInstructorSendAnnouncementEnabled={
                                        isInstructorSendAnnouncementEnabled
                                    }
                                    isDisplayPracticeInsightsNewPageWithFunnelViewEnabled={
                                        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled
                                    }
                                    isInSupplyGapsTargetGroup={isInSupplyGapsTargetGroup}
                                    isInstructorPartner={isInstructorPartner}
                                    isFinancialIncentiveBannerEnabled={
                                        isFinancialIncentiveBannerEnabled
                                    }
                                    {...frameProps}
                                />
                            </div>
                            {showLiveChat ? <LiveChat /> : ''}
                        </div>
                    </Provider>
                </MemoizedBrowserRouter>
            </ExperimentProvider>
        );
    }
}

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(container, '.ud-component--instructor--app', App, moduleArgs);
}
