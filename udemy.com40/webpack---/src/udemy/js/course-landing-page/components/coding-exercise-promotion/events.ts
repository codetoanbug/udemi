import {ClientEvent} from '@udemy/event-tracking';

import {LearningProduct} from 'browse/events';

export class CodingExercisePromotionImpressionEvent extends ClientEvent {
    constructor(public learningProduct: LearningProduct) {
        super('CodingExercisePromotionImpressionEvent');
    }
}

export class CodingExercisePromotionImageClickEvent extends ClientEvent {
    constructor(public learningProduct: LearningProduct) {
        super('CodingExercisePromotionImageClickEvent');
    }
}

export class CodingExercisePromotionSeeDemoLinkClickEvent extends ClientEvent {
    constructor(public learningProduct: LearningProduct) {
        super('CodingExercisePromotionSeeDemoLinkClickEvent');
    }
}

export class CodingExercisePromotionDemoVideoImpressionEvent extends ClientEvent {
    constructor(public learningProduct: LearningProduct) {
        super('CodingExercisePromotionDemoVideoImpressionEvent');
    }
}
