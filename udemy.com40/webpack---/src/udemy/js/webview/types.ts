import {Buyable} from 'browse/events';

import {SubscriptionPlanProductType} from '../gql-codegen/api-platform-graphql';

// Standard interface that defines the messages.
// Equivalent protocols/interfaces should exist in consuming iOS, Android code
export interface WebviewMessage {
    methodName: string;
    payload: WebviewMessagePayload;
}

// Enum that registers supported events
const enum WebviewEvents {
    ON_ENROLLED = 'onEnrolled',
    ON_KEEP_SHOPPING = 'onKeepShopping',
    ON_SUBSCRIBED = 'onSubscribed',
    ON_EXIT_SUBSCRIPTION_FLOW = 'onExitSubscriptionFlow',
    ON_SAVE_AND_EXIT_ASSESSMENT = 'onSaveAndExitAssessment',
    ON_ASSESSMENT_COURSE_RECOMMENDATION = 'onAssessmentCourseRecommendation',
    ON_TURNSTILE_VERIFICATION = 'onTurnstileVerification',
}

// In order to add a new message payload type, you'll need to inherit from this
// class and define the structure of the payload for a given message type. These
// definitions should map 1:1 with payload protocols/interfaces in iOS and Android code
export abstract class WebviewMessagePayload {}

class OnEnrolledMessagePayload extends WebviewMessagePayload {
    buyables: Array<Buyable>;
    purchasePrice: string;

    constructor(buyables: Array<Buyable>, purchasePrice: string) {
        super();
        this.buyables = buyables;
        this.purchasePrice = purchasePrice;
    }

    toJSON() {
        return {buyables: this.buyables, purchasePrice: this.purchasePrice};
    }
}

class OnSubscribedMessagePayload extends WebviewMessagePayload {
    productType: SubscriptionPlanProductType;
    hasFreeTrial: boolean;
    constructor(productType: SubscriptionPlanProductType, hasFreeTrial: boolean) {
        super();
        this.productType = productType;
        this.hasFreeTrial = hasFreeTrial;
    }

    toJSON() {
        return {
            productType: this.productType,
            hasFreeTrial: this.hasFreeTrial,
        };
    }
}

export class OnAssessmentCourseRecommendationMessagePayload extends WebviewMessagePayload {
    courseId: number;
    constructor(courseId: number) {
        super();
        this.courseId = courseId;
    }

    toJSON() {
        return {
            courseId: this.courseId,
        };
    }
}

class OnTurnstileVerificationMessagePayload extends WebviewMessagePayload {
    challengeToken: string;

    constructor(challengeToken: string) {
        super();
        this.challengeToken = challengeToken;
    }

    toJSON() {
        return {
            challengeToken: this.challengeToken,
        };
    }
}

export class OnEnrolledMessage implements WebviewMessage {
    methodName = WebviewEvents.ON_ENROLLED;
    payload: OnEnrolledMessagePayload;

    constructor(buyables: Array<Buyable>, purchasePrice: string) {
        this.payload = new OnEnrolledMessagePayload(buyables, purchasePrice);
    }
}

export class OnKeepShoppingMessage implements WebviewMessage {
    methodName = WebviewEvents.ON_KEEP_SHOPPING;
    payload = {};
}

export class OnSubscribedMessage implements WebviewMessage {
    methodName = WebviewEvents.ON_SUBSCRIBED;
    payload: OnSubscribedMessagePayload;

    constructor(productType: SubscriptionPlanProductType, hasFreeTrial: boolean) {
        this.payload = new OnSubscribedMessagePayload(productType, hasFreeTrial);
    }
}

export class OnExitSubscriptionCheckoutMessage implements WebviewMessage {
    methodName = WebviewEvents.ON_EXIT_SUBSCRIPTION_FLOW;
    payload = {};
}

export class OnSaveAndExitAssessmentMessage implements WebviewMessage {
    methodName = WebviewEvents.ON_SAVE_AND_EXIT_ASSESSMENT;
    payload = {};
}

export class OnAssessmentCourseRecommendationMessage implements WebviewMessage {
    methodName = WebviewEvents.ON_ASSESSMENT_COURSE_RECOMMENDATION;
    payload: OnAssessmentCourseRecommendationMessagePayload;

    constructor(courseId: number) {
        this.payload = new OnAssessmentCourseRecommendationMessagePayload(courseId);
    }
}

export class OnTurnstileVerificationMessage implements WebviewMessage {
    methodName = WebviewEvents.ON_TURNSTILE_VERIFICATION;
    payload: OnTurnstileVerificationMessagePayload;

    constructor(challengeToken: string) {
        this.payload = new OnTurnstileVerificationMessagePayload(challengeToken);
    }
}
