import {Tracker} from '@udemy/event-tracking';
import {CookieConsent} from '@udemy/onetrust';
import {tokens} from '@udemy/styles';
import autobind from 'autobind-decorator';
import Cookies from 'js-cookie';
import {action, computed, observable, observe, runInAction, when} from 'mobx';

import reviewBackend from 'course-reviews/common/review-backend';
import {
    LearningProductType,
    useBadgeClassesByLearningProductsQuery,
} from 'gql-codegen/api-platform-graphql';
import {TRACKING_ACTIONS} from 'labs/events/lab-in-course-prompt-action-event';
import {sendLabInCoursePromptActionEvent} from 'labs/utils';
import {isBadgingCertPrepEnabled} from 'open-badges/common/utils/utils';
import debounce from 'utils/debounce';
import getConfigData from 'utils/get-config-data';
import {getVariantValue} from 'utils/get-experiment-data.js';
import udApi from 'utils/ud-api';
import udGraphql from 'utils/ud-graphql';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';
import udPerf from 'utils/ud-performance';
import SystemMessage from 'utils/ud-system-message';
import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import * as constants from './constants';
import CoursePortion from './course-portion.mobx-model';
import Course from './course.mobx-model';
import {
    ITEM_TYPES,
    MAIN_CONTENT,
    PRACTICE_CURRICULUM_TYPE,
    PROGRESS_INFO_CURRICULUM_TYPE_MAP,
    QUIZ_TYPES,
} from './curriculum/constants';
import CurriculumSection from './curriculum/curriculum-section.mobx-model';
import Lecture from './curriculum/lecture.mobx-model';
import Practice from './curriculum/practice.mobx-model';
import Quiz from './curriculum/quiz.mobx-model';
import Enrollment from './enrollment.mobx-model';
import {
    CodingExerciseCourseContentListOpenEvent,
    CourseTakingAskNewQuestionActionEvent,
    CourseTakingAssessmentBannerActionEvent,
    CourseTakingAssessmentBannerDisplayEvent,
    CourseTakingAssessmentGuideActionEvent,
    CourseTakingContentDownloadEvent,
    CourseTakingContentViewEvent,
    CourseTakingDashboardTabViewEvent,
    CourseTakingEndScreenViewEvent,
    CourseTakingFindMoreCourseEvent,
    CourseTakingItemProgressUpdateEvent,
    CourseTakingLectureDownloadEvent,
    CourseTakingNoteActionEvent,
    CourseTakingNoteFilterEvent,
    CourseTakingNoteSortEvent,
    CourseTakingPracticeTestResultsKnowledgeFilterActionEvent,
    CourseTakingPracticeTestResultsQuestionFilterActionEvent,
    CourseTakingPracticeTestResultsScrollContentActionEvent,
    CourseTakingPracticeTestResultsViewPageEvent,
    CourseTakingQAItemActionEvent,
    CourseTakingQAItemImpressionEvent,
    CourseTakingQASearchEvent,
    CourseTakingQASearchResponseLoadEvent,
    CourseTakingReportAbuseEvent,
    CourseTakingSearchEvent,
    CourseTakingSearchResultClickEvent,
    CourseTakingTranscriptActionEvent,
    CourseTakingVideoAutoplayToggleEvent,
    CourseTakingVideoInterstitialTransitionEvent,
    CourseTakingVideoNavigationEvent,
    CourseTakingVideoViewEvent,
    PracticeActivityViewEventFactory,
} from './events';
import {ENROLL_COURSE_WITH_SUBSCRIPTION_QUERY} from './graphql-queries';
import Program from './program.mobx-model';
import {
    COURSE_COMPLETION_REVIEW_PROMPT_STAGES,
    FIRST_REVIEW_PROMPT_DELAY,
    MIDPOINT_REVIEW_THRESHOLD,
    REVIEW_PROMPT_INTERVAL,
    REVIEW_PROMPT_STAGE_OVERRIDE_QUERY_PARAM,
    REVIEW_PROMPT_STAGES,
} from './reviews/constants';

const udConfig = getConfigData();

export default class CourseTakingStore {
    @observable isLoading = true;
    @observable.ref course = null;
    @observable.ref enrollment = null;
    @observable.ref coursePortion = null;
    @observable.ref program = null;
    @observable curriculumSections = [];
    @observable currentCurriculumItemType = '';
    @observable currentCurriculumItemId = 0;
    @observable courseReview = null;
    @observable isReviewInitialized = false;
    @observable activeReviewPromptStage = null;
    // The Welcome Back tooltip should only show once per visit to course taking, so we track its
    // availability in this store, even though it's only used by the video viewer.
    @observable mainContentType = MAIN_CONTENT.CURRICULUM_ITEM;
    @observable selectedSidebarContent;
    @observable isFirstCurriculumItemViewed = true;
    @observable windowScrollTop = 0;
    // `windowSize` is only for getting the exact size of the window, e.g. to make react-confetti responsive.
    // `window.matchMedia` is for JS media queries, e.g. `isMobileViewportSize`.
    @observable windowSize = {innerWidth: null, innerHeight: null};
    @observable isMobileViewportSize = false;
    @observable isSmallScreenViewportSize = false;
    @observable isMediumScreenViewportSize = false;
    @observable isXLargeScreenViewportSize = false;
    _mqlDisposers = [];
    @observable isMobileAppViewReady = false;
    @observable userCompleteCourseBefore = false;
    @observable hasAssessmentCourseGuideModal = false;
    @observable headerHeights = {main: 0, sub: 0};
    @observable enableSidebarControlAutoFocus = false;
    @observable adaptiveAssessmentForBanner = null;
    @observable sidebarContentAvailability = Object.keys(constants.SIDEBAR_CONTENT).reduce(
        (acc, sidebarContentKey) => {
            acc[constants.SIDEBAR_CONTENT[sidebarContentKey]] =
                sidebarContentKey === constants.SIDEBAR_CONTENT.DEFAULT;
            return acc;
        },
        {},
    );

    @observable hasOpenedCodingExercise = false;

    @observable ceResizablePanelSizes = {
        resultPanel: null,
        testCases: null,
        problemContainer: null,
        preview: null,
    };

    @observable isTranscriptButtonHighlighted = false;
    @observable showCourseVersioningErrorPage = false;
    @observable courseCertificates = [];

    // eslint-disable-next-line max-statements
    constructor(
        courseId,
        canUserEditCourse,
        isUserInstructor,
        isPreviewingAsStudent,
        canManageCourseQA,
        hasDismissedReviewPrompt,
        coursePortionId = null,
        programId = null,
        learningPathId = null,
        learningPath = null,
        useCache = false,
        availableFeatures,
        reviewData = null,
        featuredReviewData,
        courseLeadData,
        isUfbEnrollmentOrPurchase = true,
        instructorInfo,
        isCourseInConsumerSubs = false,
        googleClientId,
        adaptiveAssessmentForBanner = null,
        enableLabsInPersonalPlan = false,
        isNewCodingExerciseUIEnabled = false,
        userHasUBProAccess = false,
        showUpdatedCertificationUnitOnCTP = false,
    ) {
        this.courseId = courseId;
        this.coursePortionId = coursePortionId;
        this.learningPathId = learningPathId;
        if (learningPath) {
            this.learningPath = {
                id: learningPath.id,
                isPublicLearningPath: learningPath.isPublicLearningPath,
                isUdemyPath: learningPath.isUdemyPath,
            };
        }
        this.canUserEditCourse = canUserEditCourse;
        this.isUserInstructor = isUserInstructor;
        this.isPreviewingAsStudent = isPreviewingAsStudent;
        this.isLimitedConsumptionTrial =
            udConfig.brand.has_organization &&
            udConfig.brand.organization.is_limited_consumption_trial;
        this.isEnrolledStudent = !this.isUserInstructor && !this.isLimitedConsumptionTrial;
        this.initializeUserPreferences();
        this.canManageCourseQA = canManageCourseQA;
        this.availableFeatures = availableFeatures;
        this.dismissReviewUntilEndOfCourse = hasDismissedReviewPrompt;
        this.isBeyondMidpointAtPageLoad = false;
        this.initialReviewPromptIntervalCount = 0;
        this.hasUserSeenMidpointReviewPrompt = false;
        this.hasUserSeenPracticeReviewPrompt = false;
        this.hasUserSeenLabsPrompt = false;
        this.programId = programId;
        this.isProgramTakingExperience = programId !== null;
        this.useCache = useCache;
        this._setReviewPromptStageOverride();
        this.reviewData = reviewData;
        this.featuredReviewData = featuredReviewData;
        this.courseLeadData = courseLeadData;
        this.disableConfettiInEndScreen = false;
        this.progressData = {};
        this.userHasUBProAccess = userHasUBProAccess;
        this.isCourseInConsumerSubs = isCourseInConsumerSubs;
        this.is_assessment_course_guide_enabled =
            this.userHasAssessmentCourseGuideAccess &&
            constants.IS_ASSESSMENT_GUIDE_ENABLED_COURSE_LIST.includes(this.courseId);
        observe(
            this,
            'currentCurriculumItem',
            action((change) => {
                if (change.oldValue) {
                    this.isFirstCurriculumItemViewed = false;
                }
            }),
        );
        this.shouldResumeCurrentCurriculumItemForMobile = false;
        this.isUfbEnrollmentOrPurchase = isUfbEnrollmentOrPurchase;
        this.instructorInfo = instructorInfo;
        this.googleClientId = googleClientId;

        this.debouncedMeasureWindowSize = debounce(this.measureWindowSize, 10);
        this.debouncedMeasureWindowScroll = debounce(this.measureWindowScroll, 10);
        this.isAssessmentGuidanceViaTopicsEnabled = this.is_assessment_course_guide_enabled
            ? !!getVariantValue('ctp', 'is_assessment_guidance_via_topics_enabled', false)
            : false;
        this.adaptiveAssessmentForBanner = adaptiveAssessmentForBanner;

        this.initialItem = null;

        this.assessment_course_topic_recommendations_query = `
            query getAssessmentCourseTopicRecommendations($course_topics_input: CourseTopicsInputV2!) {
              assessmentCourseTopicRecommendationsV2(courseTopicsInput: $course_topics_input) {
                contentId
              }
            }
        `;

        this.assessment_topic_chapter_recommendations_query = `
            query getAssessmentTopicChapterRecommendations($chapter_ids: [Int!]!) {
                assessmentTopicChapterRecommendationsV2(chapterIds: $chapter_ids) {
                    contentId
                    assessmentTitle
                }
            }
        `;
        this.enableLabsInPersonalPlan = enableLabsInPersonalPlan;
        this.isNewCodingExerciseUIEnabled = isNewCodingExerciseUIEnabled;
        this.showUpdatedCertificationUnitOnCTP = showUpdatedCertificationUnitOnCTP;
        this.isCourseVersioningEnabled =
            udConfig.brand.has_organization &&
            udConfig.features.organization.is_course_versioning_enabled;
    }

    _setUpMQL(query, flag) {
        const mql = window.matchMedia(query);
        const setMatches = action(({matches}) => {
            this[flag] = matches;
        });
        setMatches(mql);
        mql.addListener(setMatches);
        this._mqlDisposers.push(() => {
            mql.removeListener(setMatches);
        });
    }

    @action
    setUpMQLs() {
        this._setUpMQL(
            `(max-width: ${tokens['breakpoint-mobile-max']}), (max-height: 35em)`,
            'isMobileViewportSize',
        );
        this._setUpMQL(`(max-width: ${tokens['breakpoint-sm-max']})`, 'isSmallScreenViewportSize');
        this._setUpMQL(`(max-width: ${tokens['breakpoint-md-max']})`, 'isMediumScreenViewportSize');
        this._setUpMQL(`(max-width: ${tokens['breakpoint-xl-max']})`, 'isXLargeScreenViewportSize');
    }

    tearDownMQLs() {
        this._mqlDisposers.forEach((disposer) => disposer());
    }

    @autobind
    @action
    measureWindowSize() {
        this.windowSize.innerWidth = window.innerWidth;
        this.windowSize.innerHeight = window.innerHeight;
    }

    @autobind
    @action
    measureWindowScroll() {
        const scrollContainer = document.scrollingElement || document.documentElement;
        this.windowScrollTop = scrollContainer.scrollTop;
    }

    @autobind
    @action
    setCodingExerciseResizePanelValue(panelName, value) {
        this.ceResizablePanelSizes[panelName] = value;
    }

    @computed
    get learningPathUrl() {
        if (this.learningPathId) {
            return udLink.toLearningPath(this.learningPathId);
        }
        return null;
    }

    @computed
    get userHasAssessmentCourseGuideAccess() {
        return this.userHasUBProAccess || this.isCourseInConsumerSubs;
    }

    @action
    setMobileAppViewReady() {
        if (!this.isMobileAppViewReady) {
            this.isMobileAppViewReady = true;
        }
    }

    @action
    setHasAssessmentCourseGuideModal(value = false) {
        this.hasAssessmentCourseGuideModal = value;
    }

    @autobind
    track(category, action, extraData) {
        const defaultData = {
            courseId: this.courseId,
            ctVersion: constants.CT_VERSION,
            userType: this.isUserInstructor
                ? constants.USER_TYPES.INSTRUCTOR
                : constants.USER_TYPES.STUDENT,
            category,
            action,
        };

        if (this.currentCurriculumItemType && this.currentCurriculumItemId) {
            defaultData.objectType = this.currentCurriculumItemType;
            defaultData.objectId = this.currentCurriculumItemId;
        }
        const eventData = Object.assign(defaultData, extraData);

        const courseTakingHeader = {
            courseId: this.courseId,
            userMode: this.isUserInstructor
                ? constants.USER_TYPES.INSTRUCTOR.toLowerCase()
                : constants.USER_TYPES.STUDENT.toLowerCase(),
        };

        let curriculum = null;
        if (this.currentCurriculumItemType && this.currentCurriculumItemId) {
            let practiceSubType = null;
            if (this.currentCurriculumItemType === ITEM_TYPES.PRACTICE) {
                practiceSubType = PRACTICE_CURRICULUM_TYPE;
            } else if (
                this.currentCurriculumItemType === ITEM_TYPES.QUIZ &&
                this.currentCurriculumItem
            ) {
                practiceSubType = this.currentCurriculumItem.quizType;
            }
            curriculum = {
                curriculumType: this.currentCurriculumItemType,
                curriculumId: this.currentCurriculumItemId,
                practiceSubType,
            };
        }

        switch (category) {
            case constants.TRACKING_CATEGORIES.DASHBOARD:
                Tracker.publishEvent(
                    new CourseTakingDashboardTabViewEvent({
                        courseTakingHeader,
                        tab: eventData.tab,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.SEARCH:
                Tracker.publishEvent(
                    new CourseTakingSearchEvent({
                        courseTakingHeader,
                        query: eventData.searchQuery,
                        mode: eventData.mode.toLowerCase(),
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.SEARCH_VISIT:
                Tracker.publishEvent(
                    new CourseTakingSearchResultClickEvent({
                        courseTakingHeader,
                        linkType: action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.TRANSCRIPT:
                Tracker.publishEvent(
                    new CourseTakingTranscriptActionEvent({
                        courseTakingHeader,
                        action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.BOOKMARK_FILTER:
                Tracker.publishEvent(
                    new CourseTakingNoteFilterEvent({
                        courseTakingHeader,
                        filter: action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.BOOKMARK_SORT:
                Tracker.publishEvent(
                    new CourseTakingNoteSortEvent({
                        courseTakingHeader,
                        sort: action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.BOOKMARK_ACTION:
                Tracker.publishEvent(
                    new CourseTakingNoteActionEvent({
                        courseTakingHeader,
                        action,
                        location: eventData.location,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS:
                switch (action) {
                    case constants.DETAILED_PRACTICE_TEST_RESULTS_ACTIONS
                        .CLICK_KNOWLEDGE_AREAS_FILTER:
                        Tracker.publishEvent(
                            new CourseTakingPracticeTestResultsKnowledgeFilterActionEvent({
                                courseTakingHeader,
                                curriculum,
                                userAttemptedQuizId: eventData.userAttemptedQuizId,
                            }),
                        );
                        break;
                    case constants.DETAILED_PRACTICE_TEST_RESULTS_ACTIONS
                        .CLICK_QUESTION_TYPE_FILTER:
                        Tracker.publishEvent(
                            new CourseTakingPracticeTestResultsQuestionFilterActionEvent({
                                courseTakingHeader,
                                curriculum,
                                userAttemptedQuizId: eventData.userAttemptedQuizId,
                            }),
                        );
                        break;
                    case constants.DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.SCROLL_PAGE:
                        Tracker.publishEvent(
                            new CourseTakingPracticeTestResultsScrollContentActionEvent({
                                courseTakingHeader,
                                curriculum,
                                userAttemptedQuizId: eventData.userAttemptedQuizId,
                            }),
                        );
                        break;
                    case constants.DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.VIEW_PAGE:
                        Tracker.publishEvent(
                            new CourseTakingPracticeTestResultsViewPageEvent({
                                courseTakingHeader,
                                curriculum,
                                userAttemptedQuizId: eventData.userAttemptedQuizId,
                            }),
                        );
                        break;
                }
                break;
            case constants.TRACKING_CATEGORIES.ASSESSMENT_BANNER_VIEW:
                Tracker.publishEvent(
                    new CourseTakingAssessmentBannerDisplayEvent({
                        courseTakingHeader,
                        action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.ASSESSMENT_BANNER_CLICK:
                Tracker.publishEvent(
                    new CourseTakingAssessmentBannerActionEvent({
                        courseTakingHeader,
                        action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.ASSESSMENT_GUIDE:
                Tracker.publishEvent(
                    new CourseTakingAssessmentGuideActionEvent({
                        courseTakingHeader,
                        action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.QUESTION:
                switch (action) {
                    case constants.QUESTION_TRACKING_ACTIONS.SEARCH_QUESTION:
                        Tracker.publishEvent(
                            new CourseTakingQASearchEvent({
                                courseTakingHeader,
                                curriculum,
                                searchQuery: extraData.searchQuery,
                            }),
                        );
                        break;
                    case constants.QUESTION_TRACKING_ACTIONS.LOAD_SEARCH_RESPONSE:
                        Tracker.publishEvent(
                            new CourseTakingQASearchResponseLoadEvent({
                                courseTakingHeader,
                                curriculum,
                                featuredQAResultCount: extraData.featuredQAResultCount,
                                qaResultCount: extraData.qaResultCount,
                            }),
                        );
                        break;
                    case constants.QUESTION_TRACKING_ACTIONS.CLICK:
                        Tracker.publishEvent(
                            new CourseTakingQAItemActionEvent({
                                courseTakingHeader,
                                curriculum,
                                action: 'click',
                                questionId: extraData.objectId,
                                serveTrackingId: extraData.serveTrackingId,
                            }),
                        );
                        break;
                    case constants.QUESTION_TRACKING_ACTIONS.BACK_TO_ALL_QUESTIONS:
                        Tracker.publishEvent(
                            new CourseTakingQAItemActionEvent({
                                courseTakingHeader,
                                curriculum,
                                action: 'back_to_all_questions',
                                questionId: extraData.objectId,
                                serveTrackingId: extraData.serveTrackingId,
                            }),
                        );
                        break;
                    case constants.QUESTION_TRACKING_ACTIONS.IMPRESSION:
                        Tracker.publishEvent(
                            new CourseTakingQAItemImpressionEvent({
                                courseTakingHeader,
                                curriculum,
                                questionId: extraData.objectId,
                                serveTrackingId: extraData.serveTrackingId,
                            }),
                        );
                        break;
                    case constants.NEW_QUESTION_TRACKING_ACTIONS.CLICK:
                        Tracker.publishEvent(
                            new CourseTakingAskNewQuestionActionEvent({
                                courseTakingHeader,
                                curriculum,
                                action: 'click',
                            }),
                        );
                        break;
                    case constants.NEW_QUESTION_TRACKING_ACTIONS.BACK_TO_ALL_QUESTIONS:
                        Tracker.publishEvent(
                            new CourseTakingAskNewQuestionActionEvent({
                                courseTakingHeader,
                                curriculum,
                                action: 'back_to_all_questions',
                            }),
                        );
                        break;
                    case constants.NEW_QUESTION_TRACKING_ACTIONS.CATEGORY_SELECT:
                        Tracker.publishEvent(
                            new CourseTakingAskNewQuestionActionEvent({
                                courseTakingHeader,
                                curriculum,
                                action: 'category_select',
                                category: eventData.category,
                            }),
                        );
                        break;
                    case constants.NEW_QUESTION_TRACKING_ACTIONS.SUBMIT:
                        Tracker.publishEvent(
                            new CourseTakingAskNewQuestionActionEvent({
                                courseTakingHeader,
                                curriculum,
                                action: 'submit',
                            }),
                        );
                        break;
                }
                break;
            case constants.TRACKING_CATEGORIES.LECTURE:
                Tracker.publishEvent(
                    new CourseTakingVideoViewEvent({
                        courseTakingHeader,
                        resource: action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.LECTURE_DOWNLOAD:
                Tracker.publishEvent(
                    new CourseTakingLectureDownloadEvent({
                        courseTakingHeader,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.REPORT_VISIT:
                Tracker.publishEvent(
                    new CourseTakingReportAbuseEvent({
                        courseTakingHeader,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.COURSE_CONTENT_DOWNLOAD:
                Tracker.publishEvent(
                    new CourseTakingContentDownloadEvent({
                        courseTakingHeader,
                        resourceType: action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.COURSE_CONTENT_VIEW:
                Tracker.publishEvent(
                    new CourseTakingContentViewEvent({
                        courseTakingHeader,
                        curriculum,
                    }),
                );

                if (curriculum && curriculum.practiceSubType) {
                    Tracker.publishEvent(
                        PracticeActivityViewEventFactory.create(
                            curriculum.practiceSubType,
                            courseTakingHeader,
                            curriculum.curriculumId,
                        ),
                    );
                }

                break;
            case constants.TRACKING_CATEGORIES.COURSE_CONTENT_LIST_OPEN:
                if (
                    curriculum &&
                    curriculum.practiceSubType &&
                    curriculum.practiceSubType === QUIZ_TYPES.CODING_EXERCISE
                ) {
                    Tracker.publishEvent(
                        new CodingExerciseCourseContentListOpenEvent({
                            courseTakingHeader,
                            codingExerciseId: curriculum.curriculumId,
                        }),
                    );
                }

                break;
            case constants.TRACKING_CATEGORIES.INTERSTITIAL:
                Tracker.publishEvent(
                    new CourseTakingVideoInterstitialTransitionEvent({
                        courseTakingHeader,
                        transition: action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.PROGRESS:
                Tracker.publishEvent(
                    new CourseTakingItemProgressUpdateEvent({
                        courseTakingHeader,
                        progress: action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.PLAYER_SETTINGS:
                Tracker.publishEvent(
                    new CourseTakingVideoAutoplayToggleEvent({
                        courseTakingHeader,
                        autoplay: eventData.newValue,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.NAVIGATION:
                Tracker.publishEvent(
                    new CourseTakingVideoNavigationEvent({
                        courseTakingHeader,
                        navigation: action,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.END_SCREEN:
                Tracker.publishEvent(
                    new CourseTakingEndScreenViewEvent({
                        courseTakingHeader,
                        curriculum,
                    }),
                );
                break;
            case constants.TRACKING_CATEGORIES.FIND_MORE_COURSES:
                Tracker.publishEvent(
                    new CourseTakingFindMoreCourseEvent({
                        courseTakingHeader,
                        curriculum,
                    }),
                );
                break;
            default:
                break;
        }
    }

    @autobind
    @action
    onFinishReviewing(review = null) {
        this.courseReview = review;
    }

    @action
    async loadCurriculumItemsPage(curriculumPromise, currentSection) {
        const response = await curriculumPromise;

        runInAction(() => {
            response.data.results.forEach((curriculumItemData) => {
                if (curriculumItemData._class === ITEM_TYPES.CHAPTER) {
                    currentSection = new CurriculumSection(curriculumItemData);
                    this.curriculumSections.push(currentSection);
                } else {
                    if (!currentSection) {
                        currentSection = new CurriculumSection({});
                        this.curriculumSections.push(currentSection);
                    }

                    // Check if item is in the selected course portion, if applicable
                    if (
                        this.coursePortion &&
                        !this.coursePortion.selectedItemsMap[
                            [curriculumItemData._class, curriculumItemData.id]
                        ]
                    ) {
                        // we are viewing a course portion and this item is not included, therefore skip over
                        // the remaining lines in this loop which would add the item to the current CurriculumSection.
                        return;
                    }

                    // If this is the initial curriculum item, update the data instead of creating a new model
                    if (
                        this.initialItem &&
                        this.initialItem.type === curriculumItemData._class &&
                        this.initialItem.id === curriculumItemData.id
                    ) {
                        this.initialItem.setData(curriculumItemData);
                        currentSection.addItem(this.initialItem);
                        return;
                    }

                    // Create curriculum item model instance and add to the section structure as normal
                    currentSection.addItem(this._loadCurriculumItemFromData(curriculumItemData));
                }
            });
        });

        if ('next' in response.data && response.data.next !== null) {
            await this.loadCurriculumItemsPage(udApi.get(response.data.next), currentSection);
        }

        // For course portions only, filter the curriculum sections to include only those that have items in the course portion.
        // Do this only after all of the results have been processed, to ensure that each page of the result set
        // has been checked for course portion items.
        runInAction(() => {
            if (this.coursePortion) {
                // Only sections that contain items which are included in the course portion should be non-zero in length.
                this.curriculumSections = this.curriculumSections.filter(
                    (section) => section.items.length > 0,
                );
            }
        });
    }

    @autobind
    @action
    async loadData(initialCurriculumItemType = null, initialCurriculumItemId = null) {
        this.isLoading = true;
        this.curriculumSections = [];
        const coursePromises = [];

        // Load general course data
        const courseParams = {
            'fields[course]': this.useCache
                ? constants.API_COURSE_FIELDS_CACHEABLES
                : constants.API_COURSE_ALL_FIELDS,
            'fields[locale]': constants.API_LOCALE_FIELDS,
            'fields[user]': constants.API_USER_FIELDS,
            use_remote_version: true,
        };
        if (this.useCache) {
            courseParams.caching_intent = 'True';

            const courseCachePromise = udApi.get(`/courses/${this.courseId}/`, {
                params: courseParams,
            });
            coursePromises.push(courseCachePromise);

            const courseNoCachePromise = udApi.get(`/courses/${this.courseId}/`, {
                params: {
                    'fields[course]': constants.API_COURSE_FIELDS_NO_CACHEABLES,
                },
            });
            coursePromises.push(courseNoCachePromise);
        } else {
            const courseCachePromise = udApi.get(`/courses/${this.courseId}/`, {
                params: courseParams,
            });
            coursePromises.push(courseCachePromise);
        }
        Promise.all(coursePromises)
            .then(
                action(([baseResponse, responseNoCacheables = {data: {}}]) => {
                    const courseData = {
                        id: this.courseId,
                        ...baseResponse.data,
                        ...responseNoCacheables.data,
                    };
                    this.course = new Course(courseData);
                }),
            )
            .catch((e) => {
                if (this.isCourseVersioningEnabled && e.response && e.response.status === 404) {
                    runInAction(() => {
                        this.showCourseVersioningErrorPage = true;
                    });
                }
            });

        // Load user-specific enrollment details
        if (
            this.isEnrolledStudent &&
            !this.isProgramTakingExperience &&
            this.isUfbEnrollmentOrPurchase
        ) {
            udApi
                .get(`/users/me/enrollments/${this.courseId}/`, {
                    params: constants.API_ENROLLMENT_FIELDS,
                })
                .then(
                    action((response) => {
                        const enrollmentData = Object.assign({}, response.data, {
                            courseId: this.courseId,
                        });
                        this.enrollment = new Enrollment(enrollmentData);
                    }),
                );
        }

        // Preload initial curriculum item data ASAP, without waiting for whole curriculum to load
        // Currently only supports preloading lectures
        const initialItemPromises = [];
        if (
            initialCurriculumItemType &&
            initialCurriculumItemId &&
            initialCurriculumItemType === ITEM_TYPES.LECTURE
        ) {
            this.initialItem = this._loadCurriculumItemFromData({
                _class: initialCurriculumItemType,
                id: initialCurriculumItemId,
            });
            initialItemPromises.push(this.loadItemData(this.initialItem));
        }

        // Load curriculum data
        const curriculumResource = this.canUserEditCourse
            ? 'instructor-curriculum-items'
            : 'subscriber-curriculum-items';
        const curriculumUrl = `/courses/${this.courseId}/${curriculumResource}/`;
        const curriculumCashedFields = this.isAssessmentGuidanceViaTopicsEnabled
            ? constants.API_CURRICULUM_CACHED_FIELDS_ASSESSMENT_EXPERIMENT
            : constants.API_CURRICULUM_CACHED_FIELDS;

        const curriculumItemsParams = {
            page_size: constants.MAX_NUM_OF_CURRICULUM_OBJECTS,
            ...curriculumCashedFields,
        };
        if (this.useCache) {
            curriculumItemsParams.caching_intent = 'True';
        }
        const curriculumItemsPromise = udApi.get(curriculumUrl, {
            params: {
                ...curriculumItemsParams,
            },
        });
        let curriculumPromise = curriculumItemsPromise;
        if (this.coursePortionId) {
            // For course portion we include portion promise to make sure we can filter data
            curriculumPromise = Promise.all([
                curriculumItemsPromise,
                this.loadCoursePortionData(),
            ]).then((values) => values[0]);
            // Return result of items promise to be able to follow curriculum parsing logic
        }

        await this.loadCurriculumItemsPage(curriculumPromise, null);

        // do course coursePortion logic here after all curriculum items have been loaded

        // For Assessment v1 we will only have guided content for a few courses in UFB.
        // This will greatly limit impact on course-taking loading until we can introduce
        // proper caching and optimizations.
        if (this.is_assessment_course_guide_enabled) {
            if (this.isAssessmentGuidanceViaTopicsEnabled) {
                this._fetchAndSetTopicBasedRecommendations();
            } else {
                this._fetchAndSetRecommendations();
            }
        }
        const progressPromise = udApi
            .get(`/users/me/subscribed-courses/${this.courseId}/progress/`, {
                params: {
                    'fields[course]': constants.API_PROGRESS_COURSE_FIELDS.join(','),
                },
            })
            .then(
                action(({data: progressData}) => {
                    this.progressData = progressData;
                    this.userCompleteCourseBefore = !!progressData.first_completion_time;
                }),
            );
        const curriculumInitializationPromise = Promise.all([curriculumPromise, progressPromise])
            .then(this.initializeCompletionStatuses)
            .then(() => {
                // userCompleteCourseBefore represents what the servers knows about completion
                // isCourseCompleted represents what the client know about completion base on completed
                // lectures
                this.checkForUpdateProgress();
                when(() => this.isCourseCompleted, this.checkForUpdateProgress);
            });

        const courseAndCurriculumPromise = Promise.all([
            ...coursePromises,
            ...initialItemPromises,
            curriculumInitializationPromise,
        ])
            .then(
                action(() => {
                    this.isLoading = false;
                    udPerf.mark('CourseTakingV5.data-loaded');
                    this.initializeReviewPromptFlags();
                    if (this.isCourseCpeCompliant) {
                        this._setCpeFinalExam();
                    }
                    this.disableConfettiInEndScreen =
                        this.userCompleteCourseBefore || this.isCourseCompleted;
                }),
            )
            .catch((e) => {
                if (this.isCourseVersioningEnabled && e.response && e.response.status === 404) {
                    runInAction(() => {
                        this.showCourseVersioningErrorPage = true;
                    });
                }
            });

        const programPromise = this.isProgramTakingExperience ? this.loadProgramInfo() : null;

        return Promise.all([courseAndCurriculumPromise, this.loadCourseReview(), programPromise]);
    }

    @autobind
    _fetchAndSetRecommendations() {
        udGraphql
            .query({
                query: this.assessment_topic_chapter_recommendations_query,
                variables: {
                    chapter_ids: this.curriculumSections.map((section) => section.id),
                },
            })
            .then((response) => {
                const data =
                    response.data.assessmentTopicChapterRecommendations ||
                    response.data.assessmentTopicChapterRecommendationsV2;

                const assessmentRecommendationChapters = new Map();
                data.map((recommendation) =>
                    assessmentRecommendationChapters.set(
                        recommendation.contentId,
                        recommendation.assessmentTitle,
                    ),
                );
                const assessmentRecommendationChapterIds = Array.from(
                    assessmentRecommendationChapters.keys(),
                );
                this.setHasAssessmentCourseGuideModal(!!assessmentRecommendationChapters.size);
                this.curriculumSections.forEach((section) => {
                    if (assessmentRecommendationChapterIds.includes(section.id)) {
                        section.setIsRecommendationAssessmentTopic(true);
                        section.setRecommendationAssessmentTitle(
                            assessmentRecommendationChapters.get(section.id),
                        );
                    }
                });
            });
    }

    @autobind
    _fetchAndSetTopicBasedRecommendations() {
        udGraphql
            .query({
                query: this.assessment_course_topic_recommendations_query,
                variables: {
                    course_topics_input: {
                        courseId: this.courseId,
                        topicIds: this.curriculumSections.reduce(
                            (acc, section) => acc.concat(section.chapterGtAssignmentIds),
                            [],
                        ),
                    },
                },
            })
            .then((response) => {
                const data =
                    response.data.assessmentCourseTopicRecommendations ||
                    response.data.assessmentCourseTopicRecommendationsV2;

                const assessmentRecommendationCourseTopicIds = data.map(
                    (recommendation) => recommendation.contentId,
                );
                this.setHasAssessmentCourseGuideModal(
                    !!assessmentRecommendationCourseTopicIds.length,
                );
                this.curriculumSections.forEach((section) => {
                    if (
                        section.chapterGtAssignmentIds.some((assignmentIds) =>
                            assessmentRecommendationCourseTopicIds.includes(assignmentIds),
                        )
                    ) {
                        section.setIsRecommendationAssessmentTopic(true);
                    }
                });
            });
    }

    enrollCourseSubscriptionQuery() {
        udGraphql.query({
            query: ENROLL_COURSE_WITH_SUBSCRIPTION_QUERY,
            variables: {
                courseId: this.courseId,
            },
        });
    }

    _setCpeFinalExam() {
        // For CPE compliant courses the last item is always a final exam practice test
        // We don't use numPublishedCurriculumItems because it removes Assignments
        const lastItem = this.publishedCurriculumItems[this.publishedCurriculumItems.length - 1];
        if (lastItem instanceof Quiz && lastItem.quizType === QUIZ_TYPES.PRACTICE_TEST) {
            lastItem.isCpeFinalExam = true;
        }
    }

    _loadCurriculumItemFromData(data) {
        switch (data._class) {
            case ITEM_TYPES.LECTURE:
                return new Lecture(data, this.courseId);
            case ITEM_TYPES.QUIZ:
                return new Quiz(data, this.courseId);
            case ITEM_TYPES.PRACTICE:
                return new Practice(data, this.courseId);
            default:
                throw new Error(`Unknown curriculum item type, ${data._class}.`);
        }
    }

    loadProgramInfo() {
        return udApi
            .get(`/programs-v2/${this.programId}/`, {
                params: {
                    'fields[program]': 'title,content_courses',
                },
            })
            .then(
                action((response) => {
                    this.program = new Program(response.data);
                }),
            )
            .catch(
                action(() => {
                    this.programId = null;
                }),
            );
    }

    loadCoursePortionData() {
        return udApi
            .get(`/course-portions/${this.coursePortionId}/`, {
                params: {
                    'fields[course_portion]': '@default,items,num_selected_items',
                },
            })
            .then(
                action((response) => {
                    this.coursePortion = new CoursePortion(response.data);
                }),
            )
            .catch(
                action(() => {
                    this.coursePortion = null;
                }),
            );
    }

    @autobind
    initializeCompletionStatuses() {
        Object.entries(PROGRESS_INFO_CURRICULUM_TYPE_MAP).forEach(
            ([progressTypeKey, completedItemType]) => {
                const completedItemIds = this.progressData[progressTypeKey];
                completedItemIds.forEach((completedItemId) => {
                    const {curriculumItem} = this.getCurriculumItemContextByTypeAndId(
                        completedItemType,
                        completedItemId,
                    );
                    if (curriculumItem) {
                        curriculumItem.setComplete();
                    }
                });
            },
        );
        return Promise.resolve();
    }

    initializeReviewPromptFlags() {
        // to correctly set the time for next review prompt is some content was watched in a previous session
        this.initialReviewPromptIntervalCount =
            Math.floor(
                (this.completedVideoContentLength - FIRST_REVIEW_PROMPT_DELAY) /
                    REVIEW_PROMPT_INTERVAL,
            ) + 1;

        if (this.hasWatchedMoreThanHalfway) {
            // for reviews, we need to distinguish whether user passed the midpoint in a previous session
            this.isBeyondMidpointAtPageLoad = true;
        }
    }

    @action
    setCurrentCurriculumItem(curriculumItemType, curriculumItemId) {
        this.currentCurriculumItemType = curriculumItemType;
        this.currentCurriculumItemId = curriculumItemId;
        this.shouldResumeCurrentCurriculumItemForMobile = false;
        this.setMainContentType(MAIN_CONTENT.CURRICULUM_ITEM);
    }

    @action
    setMainContentType(contentType) {
        this.mainContentType = contentType;
    }

    @action
    selectSidebarContent(contentKey, enableAutoFocus = true) {
        // This enables controlling focus in both the sidebar close button and the open course content button
        // When enabled, such components can get focus to attend a11y requirements for some specific behaviours
        this.enableSidebarControlAutoFocus = enableAutoFocus;
        this.selectedSidebarContent = contentKey;
        // Do not remember practice test questions sidebar
        if (contentKey === constants.SIDEBAR_CONTENT.PRACTICE_TEST_QUESTIONS) {
            this.isTranscriptButtonHighlighted = false;
            return;
        } else if (contentKey === constants.SIDEBAR_CONTENT.NONE) {
            this.isTranscriptButtonHighlighted = true;
        } else {
            this.isTranscriptButtonHighlighted = false;
        }
        this.setPreferenceForCourse(constants.USER_PREFERENCES.SIDEBAR_CONTENT, contentKey);
    }

    @autobind
    deselectSidebarContent(enableAutoFocus = true) {
        this.selectSidebarContent(constants.SIDEBAR_CONTENT.DEFAULT, enableAutoFocus);
    }

    @autobind
    closeSidebar() {
        this.selectSidebarContent(constants.SIDEBAR_CONTENT.NONE);
    }

    @action
    setSidebarContentAvailability(contentKey, isAvailable) {
        this.sidebarContentAvailability[contentKey] = isAvailable;
    }

    @autobind
    @action
    toggleSidebar() {
        this.selectSidebarContent(
            this.hasSidebarContent
                ? constants.SIDEBAR_CONTENT.NONE
                : constants.SIDEBAR_CONTENT.DEFAULT,
            false,
        );
    }

    @computed
    get isMobileView() {
        return this.isMobileViewportSize || getIsMobileApp();
    }

    @computed
    get mobileHeaderBackUrl() {
        if (this.learningPathUrl) {
            return this.learningPathUrl;
        }
        return udLink.toMyCourses();
    }

    @computed
    get isContentTabInDashboard() {
        return (
            !this.canShowSidebar || this.activeSidebarContent !== constants.SIDEBAR_CONTENT.DEFAULT
        );
    }

    @computed
    get isTranscriptInDashboard() {
        return (
            this.activeSidebarContent === constants.SIDEBAR_CONTENT.TRANSCRIPT &&
            !this.canShowSidebar
        );
    }

    @computed
    get canShowSidebar() {
        // defines whether we have visible space to show the sidebar
        return !this.isMediumScreenViewportSize;
    }

    @computed
    get hasSidebarContent() {
        // defines whether sidebar has any content mode selected
        return !!this.activeSidebarContent;
    }

    @computed
    get isSidebarVisible() {
        // true if sidebar is currently visible with some content
        return this.canShowSidebar && this.hasSidebarContent;
    }

    @autobind
    getSidebarScrollContainers() {
        if (!this.isSidebarVisible) {
            return [];
        }
        const sidebar = document.getElementById(constants.SIDEBAR_SCROLL_CONTAINER_ID);
        return sidebar ? [sidebar, window] : [];
    }

    @computed
    get _curriculumItemsByTypeAndId() {
        const itemsByTypeAndId = {
            [ITEM_TYPES.LECTURE]: {},
            [ITEM_TYPES.QUIZ]: {},
            [ITEM_TYPES.PRACTICE]: {},
        };
        this.curriculumSections.forEach((section, sectionIndex) => {
            section.items.forEach((curriculumItem, itemIndex) => {
                itemsByTypeAndId[curriculumItem.type][curriculumItem.id] = {
                    section,
                    curriculumItem,
                    sectionIndex,
                    itemIndex,
                };
            });
        });
        return itemsByTypeAndId;
    }

    getCurriculumItemContextByTypeAndId(curriculumType, curriculumItemId) {
        // a null-safe, exception-free mechanism so that any calling code need not worry about errors around curriculumType or curriculumItemId
        // e.g. courseTakingStore.getCurriculumItemContextByTypeAndId(foo, bar).curriculumItem will not throw an error
        try {
            const mapForCurriculumType = this._curriculumItemsByTypeAndId[curriculumType] || {};
            return mapForCurriculumType[curriculumItemId] || {};
        } catch (e) {
            return {};
        }
    }

    @computed
    get currentCurriculumItem() {
        return this.getCurriculumItemContextByTypeAndId(
            this.currentCurriculumItemType,
            this.currentCurriculumItemId,
        ).curriculumItem;
    }

    @computed
    get currentCurriculumSection() {
        return this.getCurriculumItemContextByTypeAndId(
            this.currentCurriculumItemType,
            this.currentCurriculumItemId,
        ).section;
    }

    @computed
    get nextCurriculumItemSection() {
        if (!this.nextCurriculumItem) {
            return null;
        }
        return this.getCurriculumItemContextByTypeAndId(
            this.nextCurriculumItem.type,
            this.nextCurriculumItem.id,
        ).section;
    }

    @computed
    get previousCurriculumItem() {
        if (!this.currentCurriculumItem) {
            return null;
        }
        const {sectionIndex, itemIndex} = this.getCurriculumItemContextByTypeAndId(
            this.currentCurriculumItemType,
            this.currentCurriculumItemId,
        );
        const currentSection = this.curriculumSections[sectionIndex];
        if (0 <= itemIndex - 1 && itemIndex - 1 < currentSection.items.length) {
            return currentSection.items[itemIndex - 1];
        }
        let previousSection;
        for (let i = sectionIndex - 1; i >= 0; i--) {
            if (this.curriculumSections[i].items.length) {
                previousSection = this.curriculumSections[i];
                break;
            }
        }
        if (!previousSection) {
            return null;
        }
        return previousSection.items[previousSection.items.length - 1];
    }

    @computed
    get nextCurriculumItem() {
        if (!this.currentCurriculumItem) {
            return null;
        }
        const {sectionIndex, itemIndex} = this.getCurriculumItemContextByTypeAndId(
            this.currentCurriculumItemType,
            this.currentCurriculumItemId,
        );
        const currentSection = this.curriculumSections[sectionIndex];
        if (0 <= itemIndex + 1 && itemIndex + 1 < currentSection.items.length) {
            return currentSection.items[itemIndex + 1];
        }
        let nextSection;
        for (let i = sectionIndex + 1; i < this.curriculumSections.length; i++) {
            if (this.curriculumSections[i].items.length) {
                nextSection = this.curriculumSections[i];
                break;
            }
        }
        if (!nextSection) {
            return null;
        }
        return nextSection.items[0];
    }

    getCurriculumItemById(curriculumItemId) {
        for (let sectionIndex = 0; sectionIndex < this.curriculumSections.length; sectionIndex++) {
            const item = this.curriculumSections[sectionIndex].items?.find(
                (item) => item.id === curriculumItemId,
            );
            if (item) {
                return item;
            }
        }
        return null;
    }

    @computed
    get hasInvalidCurriculumItem() {
        return (
            !this.isLoading &&
            this.currentCurriculumItemType &&
            this.currentCurriculumItemId &&
            !this.currentCurriculumItem
        );
    }

    @computed
    get publishedCurriculumItems() {
        return this.curriculumSections.reduce((acc, section) => {
            return acc.concat(section.publishedItems);
        }, []);
    }

    @computed
    get _countablePublishedCurriculumItems() {
        // e.g. Assignments are not part of the count
        return this.publishedCurriculumItems.filter((item) => !item.isExcludedFromCurriculumCount);
    }

    @computed
    get numPublishedCurriculumItems() {
        return this._countablePublishedCurriculumItems.length;
    }

    @computed
    get numPublishedLectures() {
        return this.publishedCurriculumItems.filter((item) => item instanceof Lecture).length;
    }

    @computed
    get numPublishedPracticeTests() {
        return this.publishedCurriculumItems.filter(
            (item) => item instanceof Quiz && item.quizType === QUIZ_TYPES.PRACTICE_TEST,
        ).length;
    }

    @computed
    get numPublishedAssignments() {
        return this.publishedCurriculumItems.filter((item) => item instanceof Practice).length;
    }

    @computed
    get numPublishedCodingExercises() {
        return this.publishedCurriculumItems.filter(
            (item) => item instanceof Quiz && item.quizType === QUIZ_TYPES.CODING_EXERCISE,
        ).length;
    }

    @computed
    get numCompletedItems() {
        // Assignments are not part of the count (regardless of completion status)
        return this._countablePublishedCurriculumItems.filter((item) => item.isCompleted).length;
    }

    @computed
    get publishedVideoItems() {
        return this.publishedCurriculumItems.filter(
            (item) => item instanceof Lecture && item.isVideo,
        );
    }

    @computed
    get videoContentLength() {
        return this.publishedVideoItems.reduce(
            (acc, videoLecture) => acc + videoLecture.asset.timeEstimation,
            0,
        );
    }

    @computed
    get completedVideoContentLength() {
        return this.publishedVideoItems
            .filter((item) => item.isCompleted)
            .reduce((acc, videoLecture) => acc + videoLecture.asset.timeEstimation, 0);
    }

    @computed
    get hasWatchedMoreThanHalfway() {
        return this.completedVideoContentLength >= this.videoContentLength / 2;
    }

    @computed
    get completionRatio() {
        /** we are deliberately not rounding up/down this ratio to avoid edge cases when checking
         *  whether course has started or is completely complete. This is quite prominent when you have courses
         *  that have curriculum items in the order of 100s */
        return this.numCompletedItems / this.numPublishedCurriculumItems;
    }

    @computed
    get isCourseCompleted() {
        return this.course && this.completionRatio >= 1;
    }

    @computed
    get isCourseCpeCompliant() {
        return !!this.course && this.course.isCpeCompliant;
    }

    @computed
    get courseHasLabsPrompt() {
        return !!this.course && this.course.hasLabsInCoursePromptSetting;
    }

    @computed
    get activeSidebarContent() {
        if (this.selectedSidebarContent === constants.SIDEBAR_CONTENT.NONE) {
            return null;
        }

        return this.sidebarContentAvailability[this.selectedSidebarContent]
            ? this.selectedSidebarContent
            : constants.SIDEBAR_CONTENT.DEFAULT;
    }

    @computed
    get hasReviewsFeature() {
        const courseHasReviewsViewFeature = !!(
            this.course.features && this.course.features.reviews_view
        );
        return (
            udConfig.brand.is_add_reviews_enabled &&
            udConfig.features.course_review.leave_feedback &&
            (this.isUserInstructor || courseHasReviewsViewFeature)
        );
    }

    @computed
    get hasReviewsFeatureForStudent() {
        return this.hasReviewsFeature && !this.isUserInstructor;
    }

    @computed
    get _hasLeaveReviewFeature() {
        return (
            this.hasReviewsFeatureForStudent &&
            this.numCompletedItems > 0 &&
            this.isReviewInitialized &&
            !this.courseReview
        );
    }

    @computed
    get hasLeaveReviewHeaderButton() {
        return this._hasLeaveReviewFeature && !this.isSmallScreenViewportSize;
    }

    @computed
    get hasEditReviewHeaderMenuItem() {
        if (this._hasLeaveReviewFeature) {
            return this.isSmallScreenViewportSize;
        }
        return this.hasReviewsFeatureForStudent && this.isReviewInitialized && !!this.courseReview;
    }

    @computed
    get areQuestionsDisabled() {
        return this.course && this.course.features && !this.course.features.discussions_view;
    }

    get areOrgQuestionsDisabled() {
        return !udConfig.brand.is_discussions_enabled;
    }

    get initialReviewPromptTime() {
        return (
            FIRST_REVIEW_PROMPT_DELAY +
            REVIEW_PROMPT_INTERVAL * this.initialReviewPromptIntervalCount
        );
    }

    get hasCriteriaForInitialReview() {
        return (
            this.completedVideoContentLength >= this.initialReviewPromptTime &&
            !this.dismissReviewUntilEndOfCourse
        );
    }

    get hasCriteriaForMidpointReview() {
        return (
            this.videoContentLength >= MIDPOINT_REVIEW_THRESHOLD &&
            this.hasWatchedMoreThanHalfway &&
            !this.isBeyondMidpointAtPageLoad &&
            !this.hasUserSeenMidpointReviewPrompt &&
            !this.dismissReviewUntilEndOfCourse
        );
    }

    get hasCriteriaForFirstPracticeTestReview() {
        return (
            this.numCompletedItems === 1 &&
            this.publishedCurriculumItems.find(
                (item) => item.isCompleted && item.quizType === QUIZ_TYPES.PRACTICE_TEST,
            ) &&
            !this.isUserInstructor
        );
    }

    get reviewPromptStage() {
        if (this._reviewPromptStageOverride) {
            return this._reviewPromptStageOverride;
        }
        if (!this.hasReviewsFeature || this.coursePortion || this.isProgramTakingExperience) {
            // Disable review for course portion, programs, or if feature is disabled
            return undefined;
        }
        if (!this.nextCurriculumItem || this._isConfettiRequired) {
            return !this.courseReview ? REVIEW_PROMPT_STAGES.FINAL_NEW : REVIEW_PROMPT_STAGES.FINAL;
        }
        if (this.hasCriteriaForFirstPracticeTestReview && !this.hasUserSeenPracticeReviewPrompt) {
            return REVIEW_PROMPT_STAGES.INITIAL_PRACTICE;
        }
        if (this.courseReview) {
            if (this.hasCriteriaForMidpointReview) {
                return REVIEW_PROMPT_STAGES.MIDDLE;
            }
        } else if (this.hasCriteriaForInitialReview) {
            return REVIEW_PROMPT_STAGES.INITIAL;
        }
    }

    @computed
    get isFinalReviewStageActive() {
        return (
            this.activeReviewPromptStage &&
            COURSE_COMPLETION_REVIEW_PROMPT_STAGES.includes(this.activeReviewPromptStage.key)
        );
    }

    get _isConfettiRequired() {
        return !this.disableConfettiInEndScreen && this.isCourseCompleted;
    }

    get isConfettiRequired() {
        const isConfetti = this._isConfettiRequired;
        if (isConfetti) {
            this.disableConfettiInEndScreen = true;
        }
        return isConfetti;
    }

    @computed
    get isSubsUserWithLabsAccess() {
        return this.isCourseInConsumerSubs && this.enableLabsInPersonalPlan;
    }

    @action
    showReviewPromptIfNeeded() {
        if (this._isConfettiRequired) {
            if (!this._showReviewPromptIfNeeded()) {
                this.setMainContentType(MAIN_CONTENT.END_SCREEN);
            }
            return true;
        }

        return this._showReviewPromptIfNeeded();
    }

    @action
    showLabsPromptIfNeeded() {
        if (this.mainContentType === MAIN_CONTENT.LABS_PROMPT) {
            sendLabInCoursePromptActionEvent({
                courseId: this.courseId,
                action: TRACKING_ACTIONS.NAVIGATE_AWAY,
            });
        }
        // Show labs prompt every time when the current section is about to change
        if (
            // TODO - add to mobile when design is ready
            !this.isMobileView &&
            this.courseHasLabsPrompt &&
            this.mainContentType !== MAIN_CONTENT.LABS_PROMPT &&
            (this.userHasUBProAccess || this.isSubsUserWithLabsAccess) &&
            !this.hasUserSeenLabsPrompt &&
            this.nextCurriculumItemSection &&
            this.currentCurriculumSection.id !== this.nextCurriculumItemSection.id
        ) {
            sendLabInCoursePromptActionEvent({
                courseId: this.courseId,
                action: TRACKING_ACTIONS.SHOW,
            });
            this.setMainContentType(MAIN_CONTENT.LABS_PROMPT);
            return true;
        }
        return false;
    }

    @action
    dismissReviewState() {
        this.activeReviewPromptStage = null;
    }

    _showReviewPromptIfNeeded() {
        // we take a snapshot of the computed review prompt stage because showing a review prompt affects this computed value
        this.activeReviewPromptStage = this.reviewPromptStage;
        if (!this.activeReviewPromptStage) {
            return false;
        }

        if (this.courseReview && this.isFinalReviewStageActive) {
            this.dismissReviewState();
            return false;
        }

        this.setMainContentType(MAIN_CONTENT.REVIEW_PROMPT);
        switch (this.activeReviewPromptStage.key) {
            case REVIEW_PROMPT_STAGES.INITIAL.key:
                // to delay next prompt until an additional REVIEW_PROMPT_INTERVAL has elapsed
                this.initialReviewPromptIntervalCount++;
                break;
            case REVIEW_PROMPT_STAGES.MIDDLE.key:
                // since mid-point review should be shown only once
                this.hasUserSeenMidpointReviewPrompt = true;
                break;
        }
        return true;
    }

    @action
    hideReviewPrompt(dontAsk) {
        const wasFinalReviewActive = this.isFinalReviewStageActive;
        this.dismissReviewState();
        this._reviewPromptStageOverride = null;

        if (dontAsk) {
            this.dismissReviewUntilEndOfCourse = true;
        }

        return new Promise((resolve) => {
            const nextContentType =
                this.nextCurriculumItem && !wasFinalReviewActive
                    ? MAIN_CONTENT.CURRICULUM_ITEM
                    : MAIN_CONTENT.END_SCREEN;
            this.setMainContentType(nextContentType);
            resolve(nextContentType === MAIN_CONTENT.CURRICULUM_ITEM);
        });
    }

    _setReviewPromptStageOverride() {
        const reviewPromptStageOverrideQueryParamValue = new URLSearchParams(location.search).get(
            REVIEW_PROMPT_STAGE_OVERRIDE_QUERY_PARAM,
        );
        this._reviewPromptStageOverride = Object.values(REVIEW_PROMPT_STAGES).find(
            (item) => item.id === reviewPromptStageOverrideQueryParamValue,
        );
    }

    @autobind
    getPreferenceForCourse(key) {
        return Cookies.get(`${key}_${this.courseId}`);
    }

    @autobind
    setPreferenceForCourse(key, value) {
        if (!CookieConsent.allowsFunctionalCookies()) {
            return;
        }
        if (!value) {
            value = ''; // setting false to "falsy" string value
        }
        Cookies.set(`${key}_${this.courseId}`, value, {
            expires: 30, // days
            path: '/',
        });
    }

    @action
    initializeUserPreferences() {
        this.selectedSidebarContent =
            this.getPreferenceForCourse(constants.USER_PREFERENCES.SIDEBAR_CONTENT) ||
            constants.SIDEBAR_CONTENT.DEFAULT;
    }

    @autobind
    @action
    setCourseReview(review = null) {
        this.courseReview = review;
    }

    @autobind
    @action
    loadCourseReview() {
        reviewBackend()
            .forCourse(this.courseId)
            .get({user: udMe.id})
            .then(this.setCourseReview)
            .finally(
                action(() => {
                    this.isReviewInitialized = true; // we only care that the attempt to fetch user's review completed
                }),
            );
    }

    @autobind
    setBodyContainerRef(bodyContainerRef) {
        this.bodyContainerRef = bodyContainerRef; // the sibling div to Header
    }

    @autobind
    setCurriculumItemContentContainerRef(curriculumItemContentContainerRef) {
        this.curriculumItemContentContainerRef = curriculumItemContentContainerRef;
    }

    isInitialScrollPositionSet = false;

    @autobind
    markInitialScrollPositionSet() {
        // used for skipping scroll animation for the first time the course content is loaded
        this.isInitialScrollPositionSet = true;
    }

    @computed
    get isQAndAEnabled() {
        if (this.isProgramTakingExperience) {
            return true;
        }
        return this.availableFeatures.includes(constants.AVAILABLE_FEATURES.Q_AND_A_ENABLED);
    }

    @autobind
    @action
    setHeaderHeight(id, height) {
        this.headerHeights[id] = height;
    }

    @computed
    get sidebarStyle() {
        // if Udemy header is visible, position the sidebar below it, else at top of viewport
        const headerHeight = Object.values(this.headerHeights).reduce((sum, h) => sum + h, 0);
        const sidebarTop = Math.max(0, headerHeight - this.windowScrollTop);
        const sidebarHeight = sidebarTop > 0 ? `calc(100% - ${sidebarTop}px)` : '100%';
        return {top: `${sidebarTop}px`, height: sidebarHeight};
    }

    @autobind
    checkForUpdateProgress() {
        if (!this.userCompleteCourseBefore && this.isCourseCompleted) {
            this.setCourseCompletion();
            return udApi.post(`/users/me/subscribed-courses/${this.courseId}/progress/`, {
                check: 1,
            });
        }
    }

    @action
    setCourseCompletion() {
        this.userCompleteCourseBefore = true;
    }

    @autobind
    markCurrentItemComplete() {
        // TODO use this function from all curriculum item viewer classes
        this.currentCurriculumItem.markAsComplete();
        this.preloadNextItem();
    }

    preloadNextItem() {
        // preload the next curriculum item as soon as the current one is completed
        // currently only supports preloading lectures
        if (this.nextCurriculumItem?.type === ITEM_TYPES.LECTURE) {
            this.loadItemData(this.nextCurriculumItem);
        }
    }

    loadItemData(item) {
        const courseResource = this.canUserEditCourse ? 'taught-courses' : 'subscribed-courses';
        const extraParams = {};
        if (this.isPreviewingAsStudent) {
            extraParams.instructorPreviewMode = 'student_v4';
        }
        return item.loadData(courseResource, extraParams);
    }

    @autobind
    async checkHasUserSeenLabsPrompt() {
        const response = await SystemMessage.hasSeen(SystemMessage.ids.hasSeenLabsInCoursePrompt, {
            obj_type: 'course',
            obj_id: this.courseId,
        });
        if (response.data) {
            this.markHasUserSeenLabsPrompt();
        }
    }

    @autobind
    @action
    markHasUserSeenLabsPrompt() {
        this.hasUserSeenLabsPrompt = true;
    }

    async fetchCourseCertificates() {
        const learningProductInput = {
            id: this.courseId,
            type: LearningProductType.Course,
        };
        const resp = await useBadgeClassesByLearningProductsQuery.fetcher({
            learningProducts: [learningProductInput],
        })();

        return resp.badgeClassesByLearningProducts ?? [];
    }

    @autobind
    @action
    setCourseCertificates(certificates) {
        this.courseCertificates = certificates;
    }

    @autobind
    async loadCourseCertificates() {
        this.setCourseCertificates(await this.fetchCourseCertificates());
    }

    get isCertificationToastEnabled() {
        return isBadgingCertPrepEnabled();
    }
}
