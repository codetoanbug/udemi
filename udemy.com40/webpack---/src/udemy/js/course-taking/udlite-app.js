import {ErrorPage} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {computed, reaction} from 'mobx';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {Switch} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {ExperimentProvider} from 'experiment';
import {CertificationAssertionStore} from 'organization-insights/open-badges/certification-assertion.mobx-store';
import {TargetedMediaModal} from 'targeted-media-modal/targeted-media-modal.react-component';
import {getVariantValue} from 'utils/get-experiment-data.js';
import udRenderReactComponents from 'utils/ud-render-react-components';
import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import AssessmentCourseGuideModal from './assessments/assessment-course-guide-modal.react-component';
import {BadgeSidebar} from './badge-sidebar/badge-sidebar.react-component';
import CertificateStore from './certificate.mobx-store';
import CpeSecondaryEmailModal from './certificate/cpe-secondary-email-modal.react-component';
import CpeSecondaryEmailStore from './certificate/cpe-secondary-email.mobx-store';
import CourseTakingStore from './course-taking.mobx-store';
import {ITEM_TYPES} from './curriculum/constants';
import CurriculumItemView from './curriculum/curriculum-item-view.react-component';
import ItemRedirect from './curriculum/item-redirect.react-component';
import Dashboard from './dashboard/dashboard.react-component';
import LabsStore from './dashboard/labs/labs.mobx-store';
import Header from './header/header.react-component';
import DashboardTranscript from './lecture-view/video-viewer/transcript/dashboard-transcript.react-component';
import registers from './registry/registers';
import root from './registry/root';
import Sidebar from './sidebar/sidebar.react-component';
import SubHeader from './sub-header/sub-header.react-component';

import './app.less';

function HeaderRow({id, children, courseTakingStore}) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        courseTakingStore.setHeaderHeight(id, ref.current.offsetHeight);
        return () => courseTakingStore.setHeaderHeight(id, 0);
    }, [courseTakingStore, id]);

    return (
        <div ref={ref} styleName="row header">
            <div styleName="row-content">{children}</div>
        </div>
    );
}

HeaderRow.propTypes = {
    id: PropTypes.string.isRequired,
    courseTakingStore: PropTypes.object.isRequired,
};

@root
@registers('courseTakingStore', 'certificateStore', 'cpeSecondaryEmailStore')
@observer
export class App extends React.Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        initialCurriculumItemType: PropTypes.string.isRequired,
        initialCurriculumItemId: PropTypes.number.isRequired,
        canUserEditCourse: PropTypes.bool.isRequired,
        isUserInstructor: PropTypes.bool.isRequired,
        canManageCourseQA: PropTypes.bool.isRequired,
        isPreviewingAsStudent: PropTypes.bool.isRequired,
        hasDismissedReviewPrompt: PropTypes.bool.isRequired,
        coursePortionId: PropTypes.number,
        learningPathId: PropTypes.number,
        learningPath: PropTypes.shape({
            id: PropTypes.number,
            isPublicLearningPath: PropTypes.bool,
            isUdemyPath: PropTypes.bool,
        }),
        programId: PropTypes.string,
        useCache: PropTypes.bool,
        availableFeatures: PropTypes.array,
        reviewData: PropTypes.object,
        featuredReviewData: PropTypes.object,
        courseLeadData: PropTypes.object,
        isUfbEnrollmentOrPurchase: PropTypes.bool,
        instructorInfo: PropTypes.object,
        isCourseInConsumerSubs: PropTypes.bool,
        googleClientId: PropTypes.string,
        adaptiveAssessmentForBanner: PropTypes.string,
        enableLabsInPersonalPlan: PropTypes.bool,
        isNewCodingExerciseUIEnabled: PropTypes.bool,
        userHasUBProAccess: PropTypes.bool,
        enableUBListExperiment: PropTypes.bool,
        showUpdatedCertificationUnitOnCTP: PropTypes.bool,
        enableCertDueDateTracker: PropTypes.bool,
    };

    static defaultProps = {
        coursePortionId: null,
        learningPathId: null,
        learningPath: {},
        programId: null,
        useCache: false,
        availableFeatures: [],
        reviewData: null,
        featuredReviewData: {},
        courseLeadData: {},
        isUfbEnrollmentOrPurchase: true,
        instructorInfo: {},
        isCourseInConsumerSubs: false,
        googleClientId: null,
        adaptiveAssessmentForBanner: null,
        enableLabsInPersonalPlan: false,
        isNewCodingExerciseUIEnabled: false,
        userHasUBProAccess: false,
        enableUBListExperiment: false,
        showUpdatedCertificationUnitOnCTP: false,
        enableCertDueDateTracker: false,
    };

    constructor(props) {
        super(props);
        this.courseTakingStore = new CourseTakingStore(
            props.courseId,
            props.canUserEditCourse,
            props.isUserInstructor,
            props.isPreviewingAsStudent,
            props.canManageCourseQA,
            props.hasDismissedReviewPrompt,
            props.coursePortionId,
            props.programId,
            props.learningPathId,
            props.learningPath,
            props.useCache,
            props.availableFeatures,
            props.reviewData,
            props.featuredReviewData,
            props.courseLeadData,
            props.isUfbEnrollmentOrPurchase,
            props.instructorInfo,
            props.isCourseInConsumerSubs,
            props.googleClientId,
            props.adaptiveAssessmentForBanner,
            props.enableLabsInPersonalPlan,
            props.isNewCodingExerciseUIEnabled,
            props.userHasUBProAccess,
            props.showUpdatedCertificationUnitOnCTP,
        );
        this.userHasUBProAccess = props.userHasUBProAccess;
        this.courseTakingStore.setUpMQLs();
        this.certificateStore = new CertificateStore(this.courseTakingStore);
        this.certificateAssertionStore = new CertificationAssertionStore(UD.me.id);
        this.cpeSecondaryEmailStore = new CpeSecondaryEmailStore();
        this.clcStore = new CourseLandingComponentsStore({courseId: props.courseId});
        if (props.isCourseInConsumerSubs) {
            this.courseTakingStore.enrollCourseSubscriptionQuery();
        }
        if (this.isLabsEnabled) {
            this.labsStore = new LabsStore(this.courseTakingStore.courseId);
        }
    }

    componentDidMount() {
        this.courseTakingStore.measureWindowSize();
        window.addEventListener('resize', this.courseTakingStore.debouncedMeasureWindowSize, {
            passive: true,
        });
        window.addEventListener('scroll', this.courseTakingStore.debouncedMeasureWindowScroll, {
            passive: true,
        });
        this.courseTakingStore.loadData(
            this.initialCurriculumItemType,
            this.initialCurriculumItemId,
        );
        if (this.props.enableCertDueDateTracker) {
            this.certificateAssertionStore.fetchUserAssertion();
            this.courseTakingStore.loadCourseCertificates();
        }
        reaction(() => this.courseTakingStore.isSidebarVisible, this.setFooterClassName, {
            fireImmediately: true,
        });
        if (this.isLabsEnabled) {
            this.courseTakingStore.checkHasUserSeenLabsPrompt();
            this.labsStore.loadLabs();
        }
    }

    componentWillUnmount() {
        this.courseTakingStore.tearDownMQLs();
        window.removeEventListener('resize', this.courseTakingStore.debouncedMeasureWindowSize);
        window.removeEventListener('scroll', this.courseTakingStore.debouncedMeasureWindowScroll);
    }

    @autobind
    setFooterClassName(isSidebarVisible) {
        /** we update the Udemy site footer width to exclude the course-content sidebar via a CSS class
         *  this is nice to do here since the sidebar width is known in the app.less grid layout variables
         *  (same approach is used in the instructor IA app as well) */
        const footer = document.querySelector('.ud-footer-container');
        if (!footer) {
            return;
        }
        if (isSidebarVisible) {
            footer.className = classNames(footer.className, 'has-sidebar');
        } else {
            footer.classList.remove('has-sidebar');
        }
    }

    @autobind
    renderCurriculumItem(props) {
        return (
            <CurriculumItemView
                {...props}
                initialCurriculumItemType={this.initialCurriculumItemType}
                initialCurriculumItemId={this.initialCurriculumItemId}
            />
        );
    }

    get isLabsEnabled() {
        return !!getVariantValue('labs', 'aws_labs_enabled', false) || this.userHasUBProAccess;
    }

    @computed
    get initialCoursePortionCurriculumItem() {
        /**
         * Get the first item in the course which is in the course portion
         */
        const {coursePortion, curriculumSections} = this.courseTakingStore;
        for (const section of curriculumSections) {
            for (const item of section.items) {
                if (coursePortion.selectedItemsMap[[item.type, item.id]]) {
                    return item;
                }
            }
        }
    }

    @computed
    get initialCurriculumItemType() {
        const {coursePortion} = this.courseTakingStore;
        const {initialCurriculumItemType, initialCurriculumItemId} = this.props;
        if (
            coursePortion &&
            !coursePortion.selectedItemsMap[[initialCurriculumItemType, initialCurriculumItemId]] &&
            this.initialCoursePortionCurriculumItem
        ) {
            return this.initialCoursePortionCurriculumItem.type;
        }
        return initialCurriculumItemType;
    }

    @computed
    get initialCurriculumItemId() {
        const {coursePortion} = this.courseTakingStore;
        const {initialCurriculumItemType, initialCurriculumItemId} = this.props;
        if (
            coursePortion &&
            !coursePortion.selectedItemsMap[[initialCurriculumItemType, initialCurriculumItemId]] &&
            this.initialCoursePortionCurriculumItem
        ) {
            return this.initialCoursePortionCurriculumItem.id;
        }
        return initialCurriculumItemId;
    }

    get curriculumItem() {
        const curriculumItemPath = `/:itemType(${ITEM_TYPES.LECTURE}|${ITEM_TYPES.QUIZ}|${ITEM_TYPES.PRACTICE})/:itemId`;

        return (
            <div styleName="curriculum-item">
                <Switch>
                    <PageTrackingRoute
                        pageKey="course_taking_curriculum_item"
                        path={curriculumItemPath}
                        render={this.renderCurriculumItem}
                    />
                    <ItemRedirect
                        itemType={this.initialCurriculumItemType}
                        itemId={this.initialCurriculumItemId}
                    />
                </Switch>
            </div>
        );
    }

    render() {
        const {
            isMobileViewportSize,
            isSidebarVisible,
            isProgramTakingExperience,
            showCourseVersioningErrorPage,
        } = this.courseTakingStore;
        const containerStyles = classNames({
            'mobile-app': getIsMobileApp(),
            'mobile-app-ready': this.courseTakingStore.isMobileAppViewReady,
            'no-sidebar': !isSidebarVisible,
        });
        const containerClasses = isSidebarVisible ? 'has-sidebar' : '';

        if (showCourseVersioningErrorPage) {
            this.setFooterClassName(false);
        }

        const showBadgeDueDateModule =
            this.props.enableCertDueDateTracker &&
            this.courseTakingStore.courseCertificates.length === 1 &&
            this.certificateAssertionStore.isUserAssertionsLoaded &&
            !this.certificateAssertionStore.assertionList.find((assertion) => {
                return assertion.badgeClass.id === this.courseTakingStore.courseCertificates[0].id;
            });

        return (
            <MemoizedBrowserRouter>
                <ExperimentProvider experimentSet={['sw', 'labs', 'ctp', 'frc']}>
                    <>
                        <div styleName={containerStyles} className={containerClasses}>
                            {!isMobileViewportSize && (
                                <Provider
                                    enableUBListExperiment={this.props.enableUBListExperiment}
                                >
                                    <HeaderRow id="main" courseTakingStore={this.courseTakingStore}>
                                        <Header />
                                    </HeaderRow>
                                </Provider>
                            )}
                            {!isMobileViewportSize && isProgramTakingExperience && (
                                <HeaderRow id="sub" courseTakingStore={this.courseTakingStore}>
                                    <SubHeader />
                                </HeaderRow>
                            )}
                            {!showCourseVersioningErrorPage ? (
                                <Provider
                                    workspaceEnabledLectures={
                                        this.labsStore?.allWorkspaceEnabledLectures
                                    }
                                    resourceContextMenu={this.resourceContextMenu}
                                    enableLabsInPersonalPlan={this.props.enableLabsInPersonalPlan}
                                    userHasConsumerSubs={this.props.isCourseInConsumerSubs}
                                    googleClientId={this.props.googleClientId}
                                    labVerticalSystemEventStore={
                                        this.labsStore?.labVerticalSystemEventStore
                                    }
                                    enableUBListExperiment={this.props.enableUBListExperiment}
                                >
                                    <main styleName="column-container">
                                        <div styleName="content-column">
                                            <div
                                                styleName="row body-container"
                                                ref={this.courseTakingStore.setBodyContainerRef}
                                            >
                                                <div styleName="row-content">
                                                    {this.curriculumItem}
                                                </div>
                                            </div>
                                            {isSidebarVisible && (
                                                <div
                                                    styleName="sidebar-column"
                                                    style={this.courseTakingStore.sidebarStyle}
                                                >
                                                    {showBadgeDueDateModule && (
                                                        <BadgeSidebar
                                                            badge={
                                                                this.courseTakingStore
                                                                    .courseCertificates[0]
                                                            }
                                                            userId={UD.me.id}
                                                            courseId={this.props.courseId}
                                                        />
                                                    )}
                                                    <Sidebar
                                                        autoFocus={
                                                            this.courseTakingStore
                                                                .enableSidebarControlAutoFocus
                                                        }
                                                    />
                                                </div>
                                            )}
                                            <div styleName="row dashboard">
                                                <div styleName="row-content">
                                                    <div styleName="dashboard-content">
                                                        <DashboardTranscript />
                                                        <Dashboard
                                                            labsStore={this.labsStore}
                                                            clcStore={this.clcStore}
                                                            showBadgeDueDateModule={
                                                                showBadgeDueDateModule
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </main>
                                </Provider>
                            ) : (
                                <ErrorPage
                                    heading={gettext('Your page failed to load!')}
                                    content={gettext(
                                        "Your page failed to load because you don't have access to this version of the course. Contact your admin and report the issue.",
                                    )}
                                />
                            )}
                        </div>
                        {this.courseTakingStore.isCourseCpeCompliant && <CpeSecondaryEmailModal />}
                        {this.courseTakingStore.hasAssessmentCourseGuideModal && (
                            <AssessmentCourseGuideModal />
                        )}
                        {this.courseTakingStore.publishedCurriculumItems.length > 0 && (
                            <TargetedMediaModal
                                page={'course_taking_page'}
                                features={{
                                    coding_exercise:
                                        this.courseTakingStore.numPublishedCodingExercises > 0,
                                }}
                            />
                        )}
                    </>
                </ExperimentProvider>
            </MemoizedBrowserRouter>
        );
    }
}

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(container, '.ud-component--course-taking--app', App, moduleArgs);
}
