import {ClientEvent} from '@udemy/event-tracking';

import {LearningProduct} from 'browse/events';
import {IncentivesPlacement} from 'course-landing-page/components/incentives/constants';

/**
 * CLPViewEvent is fired when a CLP Page is loaded on frontend
 */
export class CLPViewEvent extends ClientEvent {
    courseId;
    courseTrackingId;
    isDirectLanded;
    isPurchased;

    constructor({
        courseId,
        courseTrackingId,
        isDirectLanded,
        isPurchased,
    }: {
        courseId: number;
        courseTrackingId: string;
        isDirectLanded: boolean;
        isPurchased?: boolean;
    }) {
        super('CLPViewEvent');
        this.courseId = courseId;
        this.courseTrackingId = courseTrackingId;
        this.isDirectLanded = isDirectLanded;
        this.isPurchased = isPurchased;
    }
}

interface InstructorResponse {
    responseId: number;
    instructorTrackingId: string;
}

/**
 * Fired when Incentives component is viewed by user
 */
export class CourseIncentivesImpressionEvent extends ClientEvent {
    constructor(
        public uiRegion?: IncentivesPlacement,
        public learningProduct: LearningProduct | null = null,
    ) {
        super('CourseIncentivesImpressionEvent');
    }
}

/**
 * Fired when a course incentive comes into view
 */
export class CourseIncentiveImpressionEvent extends ClientEvent {
    constructor(
        public courseId: number,
        public courseTrackingId: string,
        public incentiveType: IncentiveType,
        public incentiveValue: string,
        public position: number,
    ) {
        super('CourseIncentiveImpressionEvent');
    }
}

export const enum IncentiveType {
    VIDEO_CONTENT_LENGTH = 'video_content_length',
    AUDIO_CONTENT_LENGTH = 'audio_content_length',
    NUM_ARTICLES = 'num_articles',
    NUM_RESOURCES = 'num_resources',
    NUM_QUIZZES = 'num_quizzes',
    NUM_PRACTICE_TESTS = 'num_practice_tests',
    NUM_CODING_EXERCISES = 'num_coding_exercises',
    HAS_LIFETIME_ACCESS = 'has_lifetime_access',
    DEVICES_ACCESS = 'devices_access',
    HAS_ASSIGNMENTS = 'has_assignments',
    HAS_CERTIFICATE = 'has_certificate',
    NUM_CPE_CREDITS = 'num_cpe_credits',
    HAS_CLOSED_CAPTIONS = 'has_closed_captions',
    HAS_AUDIO_DESCRIPTION = 'has_audio_description',
}

/**
 * Fired when ShortcutNavigation section is viewed by user
 */
export class ShortcutNavigationImpressionEvent extends ClientEvent {
    constructor(public courseTrackingId: string) {
        super('ShortcutNavigationImpressionEvent');
    }
}

/**
 * Fired when ShortcutNavigation section is clicked by user
 */
export class ShortcutNavigationClickEvent extends ClientEvent {
    constructor(public courseTrackingId: string, public sectionTitle: string) {
        super('ShortcutNavigationClickEvent');
    }
}

export class ReviewImpressionEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewId: number,
        public isFeatured: boolean,
        public instructorResponses: InstructorResponse[],
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewImpressionEvent');
    }
}

/**
 * Fired when Reviews section is seen by user
 */
export class ReviewsImpressionEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewsImpressionEvent');
    }
}

/**
 * Fired when Ratings Summary is seen by user
 */
export class RatingsSummaryImpressionEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('RatingsSummaryImpressionEvent');
    }
}

export class ReviewFeedbackSubmitEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewId: number,
        public isFeatured: boolean,
        public isHelpful: boolean,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewFeedbackSubmitEvent');
    }
}
export class ReviewFeedbackClearEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewId: number,
        public isFeatured: boolean,
        public wasHelpful: boolean,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewFeedbackClearEvent');
    }
}
export class ReviewReportEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewId: number,
        public isFeatured: boolean,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewReportEvent');
    }
}
export class ReviewExpandEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewId: number,
        public isFeatured: boolean,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewExpandEvent');
    }
}

/**
 * Fired when 'See More Reviews' is clicked by the user.
 */
export class SeeMoreReviewsClickEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('SeeMoreReviewsClickEvent');
    }
}

/**
 * Fired when more reviews are loaded onto the CLP.
 */
export class MoreReviewsLoadEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public numReviewsLoaded: number,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('MoreReviewsLoadEvent');
    }
}

/**
 * Fired when reviews search query is submitted.
 */
export class ReviewsSearchQuerySubmitEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public query: string | null,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewsSearchQuerySubmitEvent');
    }
}

/**
 * Fired when reviews are filtered by star rating.
 */
export class ReviewsFilterSubmitEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public rating: number | null,
        public query: string | null,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewsFilterSubmitEvent');
    }
}

/**
 * Fired when Curriculum component is viewed by user
 */
export class CurriculumImpressionEvent extends ClientEvent {
    constructor(public learningProduct: LearningProduct) {
        super('CurriculumImpressionEvent');
    }
}

export const enum PracticeIncentivesType {
    HAS_ASSIGNMENTS = 'has_assignments',
    NUM_CODING_EXERCISES = 'num_coding_exercises',
    NUM_PRACTICE_TESTS = 'num_practice_tests',
    NUM_QUIZZES = 'num_quizzes',
}

export class PracticeIncentiveImpressionEvent extends ClientEvent {
    constructor(
        public learningProduct: LearningProduct | null = null,
        public incentiveType: PracticeIncentivesType,
        public position: number,
    ) {
        super('PracticeIncentiveImpressionEvent');
    }
}

export class PracticeIncentivesImpressionEvent extends ClientEvent {
    constructor(public learningProduct: LearningProduct | null = null) {
        super('PracticeIncentivesImpressionEvent');
    }
}

export class PracticeIncentivesCarouselActionEvent extends ClientEvent {
    constructor(
        public learningProduct: LearningProduct | null = null,
        public action: 'scroll' | 'button-click' | null = null,
    ) {
        super('PracticeIncentivesCarouselActionEvent');
    }
}

export class PracticeIncentiveShowMoreClickEvent extends ClientEvent {
    constructor(
        public learningProduct: LearningProduct | null = null,
        public position: number | null = null,
    ) {
        super('PracticeIncentiveShowMoreClickEvent');
    }
}

/**
 * Fired when the reviews carousel is scrolled
 */
export class ReviewsCarouselScrollEvent extends ClientEvent {
    constructor(
        public courseTrackingId: string,
        public reviewableObjectId: number,
        public reviewableObjectType: string,
    ) {
        super('ReviewsCarouselScrollEvent');
    }
}
