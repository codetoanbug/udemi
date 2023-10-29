import {LocalizedHtml} from '@udemy/i18n';
import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {ProBadge} from '@udemy/learning-path';
import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';

import Tabs from 'base-components/tabs/tabs.react-component';
import CourseReviewDisplayLazy from 'course-landing-page/components/reviews/course-review-display-lazy.react-component';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {LAB_CLICK_TRACKING_ACTIONS} from 'labs/constants';
import LabLauncherStore from 'labs/lab-launcher/lab-launcher.mobx-store';
import {sendLabClickEvent} from 'labs/utils';
import {GoogleCalendarAuthStore} from 'learning-calendar-reminders/calendar-button/google-calendar-auth.mobx-store';
import {LearningTools} from 'learning-calendar-reminders/learning-tools/learning-tools.react-component';
import getConfigData from 'utils/get-config-data';
import serverOrClient from 'utils/server-or-client';
import SystemMessage from 'utils/ud-system-message';

import AssessmentLauncherSection from '../assessments/assessment-launcher-section.react-component';
import CourseContent from '../course-content/course-content.react-component';
import ScrollContainer from '../course-content/scroll-container.react-component';
import registers from '../registry/registers';
import requires from '../registry/requires';
import HashSwitch from '../utils/hash-switch.react-component';
import KeepRedirect from '../utils/keep-redirect.react-component.js';
import Announcements from './announcements/announcements.react-component';
import BookmarksStore from './bookmarks/bookmarks.mobx-store';
import Bookmarks from './bookmarks/bookmarks.react-component';
import {TAB_TITLES, TABS} from './constants';
import DashboardStore from './dashboard.mobx-store';
import Labs from './labs/labs.react-component';
import SkipSetupModal from './labs/messages/skip-setup-modal.react-component';
import WorkspaceEnabledModal from './labs/messages/workspace-enabled-modal.react-component';
import CourseOverview from './overview/course-overview.react-component';
import CourseOverviewV2 from './overview/v2/course-overview.react-component';
import QuestionAnswerStore from './questions/question-answer/question-answer.mobx-store';
import Questions from './questions/questions.react-component';
import SearchStore from './search/search.mobx-store';
import Search from './search/search.react-component';

import './dashboard.less';

@withRouter
@requires('courseTakingStore')
@registers('questionAnswerStore', 'bookmarksStore')
@observer
export default class Dashboard extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            courseId: PropTypes.number,
            track: PropTypes.func.isRequired,
            isMobileViewportSize: PropTypes.bool,
            isContentTabInDashboard: PropTypes.bool,
            course: PropTypes.shape({
                title: PropTypes.string,
                hasCertificate: PropTypes.bool,
            }),
            setPreferenceForCourse: PropTypes.func,
            getPreferenceForCourse: PropTypes.func,
            isQAndAEnabled: PropTypes.bool,
            featuredReviewData: PropTypes.object,
            isUserInstructor: PropTypes.bool,
            enrollment: PropTypes.object,
            currentCurriculumItemId: PropTypes.number,
            getCurriculumItemById: PropTypes.func,
            isCourseInConsumerSubs: PropTypes.bool,
            googleClientId: PropTypes.string,
            showUpdatedCertificationUnitOnCTP: PropTypes.bool,
        }).isRequired,
        labsStore: PropTypes.shape({
            labs: PropTypes.object,
            isLoading: PropTypes.bool,
            showSkipLabsSetup: PropTypes.bool,
            showWorkspaceEnabledLecturesPrompt: PropTypes.bool,
            hasSeenLabsSkipSetupNotification: PropTypes.bool,
            hasSeenWorkspaceEnabledLecturesPrompt: PropTypes.bool,
            isLabOutOfResources: PropTypes.bool,
            isLabAlmostOutOfResources: PropTypes.bool,
            tryWorkspacesClicked: PropTypes.bool,
            loadLabs: PropTypes.func,
            hasLabs: PropTypes.bool,
            setShowSkipLabsSetup: PropTypes.func,
            setShowWorkspaceEnabledLecturesPrompt: PropTypes.func,
            setHasSeenLabsSkipSetupNotification: PropTypes.func,
            setHasSeenWorkspaceEnabledLecturesPrompt: PropTypes.func,
            setTryWorkspacesClicked: PropTypes.func,
        }),
        clcStore: PropTypes.instanceOf(CourseLandingComponentsStore),
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        showBadgeDueDateModule: PropTypes.bool,
    };

    static defaultProps = {
        labsStore: undefined,
        clcStore: undefined,
        showBadgeDueDateModule: false,
    };

    constructor(props) {
        super(props);
        const {courseTakingStore, history} = props;
        this.dashboardStore = new DashboardStore(courseTakingStore, history);

        // The stores for each tab are defined here, not inside the tab components,
        // to avoid the problem in https://github.com/udemy/website-django/pull/57836.
        // Also, some of these stores are required outside the dashboard
        // (e.g. bookmarksStore is required by the video player). Such stores must be defined here
        // so that they're registered even if the tab is not selected.
        this.searchStore = new SearchStore(courseTakingStore);
        this.questionAnswerStore = new QuestionAnswerStore(courseTakingStore);
        this.bookmarksStore = new BookmarksStore(courseTakingStore);
        this.googleAuthStore = new GoogleCalendarAuthStore(
            this.props.courseTakingStore.googleClientId,
        );
    }

    async componentDidMount() {
        this.labsRedirectReactionDisposer = reaction(
            () => this.shouldRedirectToLabsTab,
            () => {
                this.shouldRedirectToLabsTab && this.props.history.push({hash: TABS.LABS});
            },
        );
        if (!this.props.courseTakingStore.showUpdatedCertificationUnitOnCTP) {
            await this.showCertificationToast();
        }
    }

    componentDidUpdate() {
        if (this.isLabsTabEnabled) {
            SystemMessage.hasSeen(SystemMessage.ids.hasSeenWorkspaceEnabledLecturesPrompt, {
                obj_id: this.props.courseTakingStore.courseId,
                obj_type: 'course',
            }).then(
                action((response) => {
                    if (!response.data) {
                        this.props.labsStore.setHasSeenWorkspaceEnabledLecturesPrompt(false);
                        this.setShowWelPrompt();
                    }
                }),
            );
            SystemMessage.hasSeen(SystemMessage.ids.hasSeenLabsSkipSetupNotification, {
                obj_id: this.props.courseTakingStore.courseId,
                obj_type: 'course',
            }).then(
                action((response) => {
                    if (!response.data) {
                        this.props.labsStore.setHasSeenLabsSkipSetupNotification(false);
                        this.setShowSkipLabsSetup();
                    }
                }),
            );
        }
    }

    componentWillUnmount() {
        this.labsRedirectReactionDisposer && this.labsRedirectReactionDisposer();
    }

    @observable labLauncherStore = null;

    setShowWelPrompt() {
        if (!this.props.labsStore.hasSeenWorkspaceEnabledLecturesPrompt) {
            this.props.labsStore.setShowWorkspaceEnabledLecturesPrompt(true);
        }
    }

    setShowSkipLabsSetup() {
        const {hasSeenLabsSkipSetupNotification} = this.props.labsStore;
        if (this.isSetupLecture && !hasSeenLabsSkipSetupNotification) {
            this.props.labsStore.setShowSkipLabsSetup(true);
        }
    }

    @computed
    get isSetupLecture() {
        const {currentCurriculumItemId} = this.props.courseTakingStore;
        const lab = this.props.labsStore.labs.length ? this.props.labsStore.labs[0] : null;
        return (
            lab?.setupStartLectureId &&
            lab?.postSetupLectureId &&
            currentCurriculumItemId === parseInt(lab?.setupStartLectureId, 10)
        );
    }

    @autobind
    @action
    onTabSelected(tabKey) {
        if (tabKey === TABS.LABS) {
            sendLabClickEvent(
                this.props.labsStore.labs[0],
                LAB_CLICK_TRACKING_ACTIONS.LAB_TAB_VISIT,
            );
        }
        this.dashboardStore.onTabSelected(tabKey);
    }

    @computed
    get isLabsTabEnabled() {
        return !!this.props.labsStore && this.props.labsStore.hasLabs;
    }

    @computed
    get shouldRedirectToLabsTab() {
        return this.isLabsTabEnabled && !!this.props.labsStore?.tryWorkspacesClicked;
    }

    renderTabButton(tabButton) {
        return <h2>{tabButton}</h2>;
    }

    getTabProps(tab) {
        const tabProps = {id: tab, title: TAB_TITLES[tab], renderTabButton: this.renderTabButton};
        if (tab === TABS.SEARCH) {
            tabProps.title = <SearchIcon label={TAB_TITLES[tab]} />;
        } else if (tab === TABS.QUESTIONS) {
            // Need span wrapper b/c we don't want margin on `button > :not(:first-child)`.
            tabProps.title = (
                <span>
                    <span aria-hidden="true">{TAB_TITLES[tab]}</span>
                    <span className="ud-sr-only">{gettext('Questions and answers')}</span>
                </span>
            );
        } else if (tab === TABS.LABS) {
            // Need array children b/c we want margin on `button > :not(:first-child)`.
            tabProps.title = [<span key="title">{TAB_TITLES[tab]}</span>, <ProBadge key="badge" />];
        }

        return tabProps;
    }

    @autobind
    jumpToLecture() {
        const jumpToItem = this.props.courseTakingStore.getCurriculumItemById(
            parseInt(this.props.labsStore.labs[0]?.postSetupLectureId, 10),
        );
        if (jumpToItem) {
            this.props.history.push({
                pathname: `/${jumpToItem.type}/${jumpToItem.id}`,
                hash: TABS.LABS,
            });
        }
    }

    certificateEnrollmentToastBody() {
        return (
            <>
                <div styleName="course-has-badge-toast-margin">
                    <div className="ud-text-sm">
                        {gettext('The course has been added to your certification preparation.')}
                    </div>
                </div>
                <LocalizedHtml
                    html={interpolate(
                        gettext("<a class='certificationPreparation'>%(linkText)s</a>"),
                        {
                            linkText: gettext('View certification preparation'),
                        },
                        true,
                    )}
                    interpolate={{
                        certificationPreparation: (
                            <a
                                href={`/home/my-courses/certifications${serverOrClient.global.location.search}`}
                                rel="noopener noreferrer"
                            />
                        ),
                    }}
                />
            </>
        );
    }

    async showCertificationToast() {
        const {courseTakingStore} = this.props;
        if (!courseTakingStore.isCertificationToastEnabled) {
            return;
        }

        const isToastHasSeen = await SystemMessage.hasSeen(
            SystemMessage.ids.CertificationPopupInCourseOverviewSeen,
            {
                obj_type: 'course',
                obj_id: courseTakingStore.courseId,
            },
        );

        if (isToastHasSeen.data) {
            return;
        }

        const certifications = await courseTakingStore.fetchCourseCertificates();
        if (certifications.length === 0) {
            return;
        }

        const toastProps = {
            autoDismiss: true,
            autoDismissTimeout: 5000,
            toastKey: courseTakingStore.courseId,
        };

        toasterStore.addAlertBannerToast(
            {
                udStyle: 'information',
                title: gettext('Certification preparation course'),
                body: this.certificateEnrollmentToastBody(),
                showCta: false,
            },
            toastProps,
        );

        await SystemMessage.seen(SystemMessage.ids.CertificationPopupInCourseOverviewSeen, {
            obj_type: 'course',
            obj_id: courseTakingStore.courseId,
        });
    }

    render() {
        const {
            isContentTabInDashboard,
            isQAndAEnabled,
            isCourseInConsumerSubs,
        } = this.props.courseTakingStore;
        const {onTabSelected, currentTab, previousOrDefaultTab} = this.dashboardStore;
        if (this.isLabsTabEnabled && !this.labLauncherStore) {
            this.labLauncherStore = new LabLauncherStore(this.props.labsStore.labs[0]);
        }
        return (
            <>
                {this.isLabsTabEnabled && (
                    <div>
                        <SkipSetupModal
                            labsStore={this.props.labsStore}
                            courseId={this.props.courseTakingStore.courseId}
                            jumpToLecture={this.jumpToLecture}
                        />
                        <WorkspaceEnabledModal
                            labsStore={this.props.labsStore}
                            courseId={this.props.courseTakingStore.courseId}
                        />
                    </div>
                )}
                <HashSwitch>
                    <Route path={TABS.SEARCH} />
                    {isContentTabInDashboard && <Route path={TABS.CONTENT} />}
                    <Route path={TABS.OVERVIEW} />
                    {isQAndAEnabled && <Route path={TABS.QUESTIONS} />}
                    <Route path={TABS.NOTES} />
                    <Route path={TABS.ANNOUNCEMENTS} />
                    {this.isLabsTabEnabled && <Route path={TABS.LABS} />}
                    <Route path={TABS.REVIEWS} />
                    <Route path={TABS.LEARNING_TOOLS} />
                    <KeepRedirect to={{hash: previousOrDefaultTab}} keepAll={true} />
                </HashSwitch>
                <section
                    styleName="tabs-container"
                    aria-label={gettext('Additional course options')}
                >
                    <Tabs
                        onSelect={this.onTabSelected}
                        activeTabId={currentTab}
                        defaultTabId={this.dashboardStore.defaultTab}
                        toggleStrategy="add-remove"
                    >
                        <Tabs.Tab {...this.getTabProps(TABS.SEARCH)}>
                            <div styleName="sizing-wrapper">
                                {this.props.courseTakingStore.course && (
                                    <Search searchStore={this.searchStore} />
                                )}
                            </div>
                        </Tabs.Tab>
                        {isContentTabInDashboard && (
                            <Tabs.Tab {...this.getTabProps(TABS.CONTENT)}>
                                <div styleName="sizing-wrapper">
                                    <ScrollContainer>
                                        <AssessmentLauncherSection useAlternateStyle={true} />
                                        <CourseContent
                                            showBadgeDueDateModule={
                                                this.props.showBadgeDueDateModule
                                            }
                                            data-purpose="dashboard-course-content"
                                        />
                                    </ScrollContainer>
                                </div>
                            </Tabs.Tab>
                        )}
                        <Tabs.Tab {...this.getTabProps(TABS.OVERVIEW)}>
                            {getConfigData().brand.has_organization || isCourseInConsumerSubs ? (
                                <div styleName="sizing-wrapper">
                                    <CourseOverviewV2
                                        isCourseInConsumerSubs={isCourseInConsumerSubs}
                                        onTabSelected={onTabSelected}
                                        googleClientId={this.props.courseTakingStore.googleClientId}
                                    />
                                </div>
                            ) : (
                                <CourseOverview />
                            )}
                        </Tabs.Tab>
                        {isQAndAEnabled && (
                            <Tabs.Tab {...this.getTabProps(TABS.QUESTIONS)}>
                                <div styleName="sizing-wrapper">
                                    <Questions />
                                </div>
                            </Tabs.Tab>
                        )}
                        <Tabs.Tab {...this.getTabProps(TABS.NOTES)}>
                            <div styleName="sizing-wrapper">
                                <Bookmarks />
                            </div>
                        </Tabs.Tab>
                        <Tabs.Tab {...this.getTabProps(TABS.ANNOUNCEMENTS)}>
                            <div styleName="sizing-wrapper">
                                <Announcements />
                            </div>
                        </Tabs.Tab>
                        {this.isLabsTabEnabled && (
                            <Tabs.Tab {...this.getTabProps(TABS.LABS)}>
                                <div styleName="sizing-wrapper">
                                    <Labs
                                        labsStore={this.props.labsStore}
                                        labLauncherStore={this.labLauncherStore}
                                    />
                                </div>
                            </Tabs.Tab>
                        )}
                        <Tabs.Tab {...this.getTabProps(TABS.REVIEWS)}>
                            <div styleName="sizing-wrapper">
                                <CourseReviewDisplayLazy clcStore={this.props.clcStore} />
                            </div>
                        </Tabs.Tab>
                        <Tabs.Tab {...this.getTabProps(TABS.LEARNING_TOOLS)}>
                            <div styleName="sizing-wrapper">
                                <LearningTools
                                    googleAuthStore={this.googleAuthStore}
                                    shouldRedirect={false}
                                />
                            </div>
                        </Tabs.Tab>
                    </Tabs>
                </section>
            </>
        );
    }
}
