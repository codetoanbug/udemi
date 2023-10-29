import {ClientEvent} from '@udemy/event-tracking';

import {QUIZ_TYPES, PRACTICE_CURRICULUM_TYPE} from './curriculum/constants';

/**
 * This event is fired when user visit one of the dashboard tab in the course taking page
 */
class CourseTakingDashboardTabViewEvent extends ClientEvent {
    constructor({courseTakingHeader, tab, curriculum}) {
        super('CourseTakingDashboardTabViewEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.tab = tab;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when user does a text search in a course
 */
class CourseTakingSearchEvent extends ClientEvent {
    constructor({courseTakingHeader, query, mode, curriculum}) {
        super('CourseTakingSearchEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.query = query;
        this.mode = mode;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when user clicks on the results returned from the search in course taking
 */
class CourseTakingSearchResultClickEvent extends ClientEvent {
    constructor({courseTakingHeader, linkType, curriculum}) {
        super('CourseTakingSearchResultClickEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.linkType = linkType;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when user interacts with notes in a course
 */
class CourseTakingNoteActionEvent extends ClientEvent {
    constructor({courseTakingHeader, action, location, curriculum}) {
        super('CourseTakingNoteActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.action = action;
        this.location = location;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when user interacts with course taking assessment guide
 */
class CourseTakingAssessmentGuideActionEvent extends ClientEvent {
    constructor({courseTakingHeader, action, curriculum}) {
        super('CourseTakingAssessmentGuideActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.action = action;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when user interacts with assessment banner in course taking
 */
class CourseTakingAssessmentBannerActionEvent extends ClientEvent {
    constructor({courseTakingHeader, action, curriculum}) {
        super('CourseTakingAssessmentBannerActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.action = action;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when we display assessment banner in course taking
 */
class CourseTakingAssessmentBannerDisplayEvent extends ClientEvent {
    constructor({courseTakingHeader, action, curriculum}) {
        super('CourseTakingAssessmentBannerDisplayEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.action = action;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when practice test results page is displayed
 */
class CourseTakingPracticeTestResultsViewPageEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, userAttemptedQuizId}) {
        super('CourseTakingPracticeTestResultsViewPageEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.userAttemptedQuizId = userAttemptedQuizId;
    }
}

/**
 * This event is fired when knowledge filter practice test results page
 */
class CourseTakingPracticeTestResultsKnowledgeFilterActionEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, userAttemptedQuizId}) {
        super('CourseTakingPracticeTestResultsKnowledgeFilterActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.userAttemptedQuizId = userAttemptedQuizId;
    }
}

/**
 * This event is fired when question filter practice test results page
 */
class CourseTakingPracticeTestResultsQuestionFilterActionEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, userAttemptedQuizId}) {
        super('CourseTakingPracticeTestResultsQuestionFilterActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.userAttemptedQuizId = userAttemptedQuizId;
    }
}

/**
 * This event is fired when user scrolls practice test results content section
 */
class CourseTakingPracticeTestResultsScrollContentActionEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, userAttemptedQuizId}) {
        super('CourseTakingPracticeTestResultsScrollContentActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.userAttemptedQuizId = userAttemptedQuizId;
    }
}

/**
 * This event is fired when user filters notes
 */
class CourseTakingNoteFilterEvent extends ClientEvent {
    constructor({courseTakingHeader, filter, curriculum}) {
        super('CourseTakingNoteFilterEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.filter = filter;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when user sorts notes
 */
class CourseTakingNoteSortEvent extends ClientEvent {
    constructor({courseTakingHeader, sort, curriculum}) {
        super('CourseTakingNoteSortEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.sort = sort;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when user interacts with transcripts in a course
 */
class CourseTakingTranscriptActionEvent extends ClientEvent {
    constructor({courseTakingHeader, action, curriculum}) {
        super('CourseTakingTranscriptActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.action = action;
        this.curriculum = curriculum;
    }
}

class CourseTakingQASearchEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, searchQuery}) {
        super('CourseTakingQASearchEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.searchQuery = searchQuery;
    }
}

class CourseTakingQASearchResponseLoadEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, featuredQAResultCount, qaResultCount}) {
        super('CourseTakingQASearchResponseLoadEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.featuredQAResultCount = featuredQAResultCount;
        this.qaResultCount = qaResultCount;
    }
}

class CourseTakingQAItemImpressionEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, questionId, serveTrackingId}) {
        super('CourseTakingQAItemImpressionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.questionId = questionId;
        this.serveTrackingId = serveTrackingId;
    }
}

class CourseTakingQAItemActionEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, action, questionId, serveTrackingId}) {
        super('CourseTakingQAItemActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.action = action;
        this.questionId = questionId;
        this.serveTrackingId = serveTrackingId;
    }
}

class CourseTakingAskNewQuestionActionEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum, action, category = null}) {
        super('CourseTakingAskNewQuestionActionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
        this.action = action;
        this.category = category;
    }
}
/**
 * This event is fired when a lecture opens in the user screen
 */
class CourseTakingVideoViewEvent extends ClientEvent {
    constructor({courseTakingHeader, resource, curriculum}) {
        super('CourseTakingVideoViewEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.resource = resource;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when a user downloads a lecture from the current course
 */
class CourseTakingLectureDownloadEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum}) {
        super('CourseTakingLectureDownloadEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when a user reports an abuse, either technical issue or policy issue
 */
class CourseTakingReportAbuseEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum}) {
        super('CourseTakingReportAbuseEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when a user views a content of a course after clicking in any item from the course content menu
 */
class CourseTakingContentViewEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum}) {
        super('CourseTakingContentViewEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when a user clicks on the course content open button in the coding exercise page
 */

class CodingExerciseCourseContentListOpenEvent extends ClientEvent {
    constructor({courseTakingHeader, codingExerciseId}) {
        super('CodingExerciseCourseContentListOpenEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.codingExerciseId = codingExerciseId;
    }
}

/**
 * This event is fired when a user downloads a content from any item of the course content menu
 */
class CourseTakingContentDownloadEvent extends ClientEvent {
    constructor({courseTakingHeader, resourceType, curriculum}) {
        super('CourseTakingContentDownloadEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.resourceType = resourceType;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when any transition of the interstitial content occurs in the video player
 */
class CourseTakingVideoInterstitialTransitionEvent extends ClientEvent {
    constructor({courseTakingHeader, transition, curriculum}) {
        super('CourseTakingVideoInterstitialTransitionEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.transition = transition;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when a user update his/her progress in the curriculum item menu
 */
class CourseTakingItemProgressUpdateEvent extends ClientEvent {
    constructor({courseTakingHeader, progress, curriculum}) {
        super('CourseTakingItemProgressUpdateEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.progress = progress;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when a user a user changes the autoplay option of a video lecture
 */
class CourseTakingVideoAutoplayToggleEvent extends ClientEvent {
    constructor({courseTakingHeader, autoplay, curriculum}) {
        super('CourseTakingVideoAutoplayToggleEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.autoplay = autoplay;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when a user navigates through lectures in the Curriculum Item View
 */
class CourseTakingVideoNavigationEvent extends ClientEvent {
    constructor({courseTakingHeader, navigation, curriculum}) {
        super('CourseTakingVideoNavigationEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.navigation = navigation;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when the end screen is shown to the user after completing a course
 */
class CourseTakingEndScreenViewEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum}) {
        super('CourseTakingEndScreenViewEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired when a user clicks in the "find more course" button
 */
class CourseTakingFindMoreCourseEvent extends ClientEvent {
    constructor({courseTakingHeader, curriculum}) {
        super('CourseTakingFindMoreCourseEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.curriculum = curriculum;
    }
}

/**
 * This event is fired in the Coding Exercise on the Course Taking app.
 * It is triggered by the frontend monolith when the evaluator platform
 * can't evaluate the Coding Exercise submission for any reason.
 * The Pusher WebSocket creates the communication between the monolith and
 * the evaluator platform
 */
class CodingExerciseEvaluateErrorEvent extends ClientEvent {
    constructor({pusherChannelId, reason, ceDisplay, isOutputEvaluation}) {
        super('CodingExerciseEvaluateErrorEvent');
        this.pusherChannelId = pusherChannelId;
        this.reason = reason;
        this.ceDisplay = ceDisplay;
        this.isOutputEvaluation = isOutputEvaluation;
    }
}

/**
 * This event is fired in the Coding Exercise on the Course Taking app.
 * It is triggered by the frontend monolith when it receives the Coding Exercise
 * response from the evaluator platform.
 * The Pusher WebSocket creates the communication between the monolith and
 * the evaluator platform
 */
class CodingExerciseEvaluateResponseEvent extends ClientEvent {
    constructor({
        pusherChannelId,
        success,
        evaluatorFeedback,
        userOutput,
        duration,
        errorType,
        ceDisplay,
        isOutputEvaluation,
    }) {
        super('CodingExerciseEvaluateResponseEvent');
        this.pusherChannelId = pusherChannelId;
        this.success = success;
        this.evaluatorFeedback = evaluatorFeedback;
        this.userOutput = userOutput;
        this.duration = duration;
        this.errorType = errorType;
        this.ceDisplay = ceDisplay;
        this.isOutputEvaluation = isOutputEvaluation;
    }
}

/**
 * This event is fired in the Coding Exercise on the Course Taking app.
 * It is triggered by the frontend monolith when the user submits
 * the Coding Exercise to be evaluated by the Udemy Coding Platform.
 * The Pusher WebSocket creates the communication between the monolith and
 * the evaluator platform
 */
class CodingExerciseEvaluateSubmitEvent extends ClientEvent {
    constructor({pusherChannelId, assessmentId, userType, ceDisplay, isOutputEvaluation}) {
        super('CodingExerciseEvaluateSubmitEvent');
        this.pusherChannelId = pusherChannelId;
        this.assessmentId = assessmentId;
        this.userType = userType;
        this.ceDisplay = ceDisplay;
        this.isOutputEvaluation = isOutputEvaluation;
    }
}

/**
 * This event is fired in the Coding Exercise on the Course Taking app.
 * It is triggered by the frontend monolith when the Coding Exercise
 * is submitted with success to the evaluation platform.
 * The Pusher WebSocket creates the communication between the monolith and
 * the evaluator platform
 */
class CodingExerciseEvaluateSuccessEvent extends ClientEvent {
    constructor({pusherChannelId, duration, isOutputEvaluation}) {
        super('CodingExerciseEvaluateSuccessEvent');
        this.pusherChannelId = pusherChannelId;
        this.duration = duration;
        this.isOutputEvaluation = isOutputEvaluation;
    }
}

/**
 This event is fired in the course taking page when the student takes action on the coding exercise.
 */
class CodingExerciseStudentActionEvent extends ClientEvent {
    constructor({action, assessmentId, language, ceDisplay}) {
        super('CodingExerciseStudentActionEvent');
        this.action = action;
        this.assessmentId = assessmentId;
        this.language = language;
        this.ceDisplay = ceDisplay;
    }
}

/**
 This event is fired in the course taking page when the student takes action on the coding exercise.
 */
class CodingExerciseFileStudentActionEvent extends ClientEvent {
    constructor({action, assessmentId, fileName, language}) {
        super('CodingExerciseFileStudentActionEvent');
        this.action = action;
        this.assessmentId = assessmentId;
        this.fileName = fileName;
        this.language = language;
    }
}

/**
 * This event is fired when a user views a content of a coding exercise after clicking in coding exercise item from the
 * course content menu
 */

class CodingExerciseViewEvent extends ClientEvent {
    constructor({courseTakingHeader, codingExerciseId}) {
        super('CodingExerciseViewEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.codingExerciseId = codingExerciseId;
    }
}

/**
 This event is fired when a user views a content of a practice test after clicking in practice test item from the
 course content menu
 */

class PracticeTestViewEvent extends ClientEvent {
    constructor({courseTakingHeader, practiceTestId}) {
        super('PracticeTestViewEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.practiceTestId = practiceTestId;
    }
}

/**
 This event is fired when a user views a content of a simple quiz after clicking in simple quiz item from the course
 content menu
 */

class SimpleQuizViewEvent extends ClientEvent {
    constructor({courseTakingHeader, simpleQuizId}) {
        super('SimpleQuizViewEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.simpleQuizId = simpleQuizId;
    }
}

/**
 This event is fired when a user views a content of an assignment after clicking in assignment item from the course
 content menu
 */

class AssignmentViewEvent extends ClientEvent {
    constructor({courseTakingHeader, assignmentId}) {
        super('AssignmentViewEvent');
        this.courseTakingHeader = courseTakingHeader;
        this.assignmentId = assignmentId;
    }
}

class PracticeActivityViewEventFactory {
    static create(type, courseTakingHeader, id) {
        if (type === QUIZ_TYPES.CODING_EXERCISE) {
            return new CodingExerciseViewEvent({courseTakingHeader, codingExerciseId: id});
        } else if (type === QUIZ_TYPES.PRACTICE_TEST) {
            return new PracticeTestViewEvent({courseTakingHeader, practiceTestId: id});
        } else if (type === QUIZ_TYPES.SIMPLE_QUIZ) {
            return new SimpleQuizViewEvent({courseTakingHeader, simpleQuizId: id});
        } else if (type === PRACTICE_CURRICULUM_TYPE) {
            return new AssignmentViewEvent({courseTakingHeader, assignmentId: id});
        }
        return null;
    }
}

export {
    CourseTakingDashboardTabViewEvent,
    CourseTakingSearchEvent,
    CourseTakingSearchResultClickEvent,
    CourseTakingAssessmentBannerActionEvent,
    CourseTakingAssessmentBannerDisplayEvent,
    CourseTakingAssessmentGuideActionEvent,
    CourseTakingNoteActionEvent,
    CourseTakingNoteFilterEvent,
    CourseTakingNoteSortEvent,
    CourseTakingTranscriptActionEvent,
    CourseTakingPracticeTestResultsViewPageEvent,
    CourseTakingPracticeTestResultsKnowledgeFilterActionEvent,
    CourseTakingPracticeTestResultsQuestionFilterActionEvent,
    CourseTakingPracticeTestResultsScrollContentActionEvent,
    CourseTakingQASearchEvent,
    CourseTakingQASearchResponseLoadEvent,
    CourseTakingQAItemImpressionEvent,
    CourseTakingQAItemActionEvent,
    CourseTakingAskNewQuestionActionEvent,
    CourseTakingVideoViewEvent,
    CourseTakingLectureDownloadEvent,
    CourseTakingReportAbuseEvent,
    CourseTakingContentViewEvent,
    CourseTakingContentDownloadEvent,
    CourseTakingVideoInterstitialTransitionEvent,
    CourseTakingItemProgressUpdateEvent,
    CourseTakingVideoAutoplayToggleEvent,
    CourseTakingVideoNavigationEvent,
    CourseTakingEndScreenViewEvent,
    CourseTakingFindMoreCourseEvent,
    CodingExerciseCourseContentListOpenEvent,
    CodingExerciseEvaluateErrorEvent,
    CodingExerciseEvaluateResponseEvent,
    CodingExerciseEvaluateSubmitEvent,
    CodingExerciseEvaluateSuccessEvent,
    CodingExerciseStudentActionEvent,
    CodingExerciseFileStudentActionEvent,
    PracticeActivityViewEventFactory,
};
