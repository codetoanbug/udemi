import {ClientEvent} from '@udemy/event-tracking';
import {idFromGlobalId} from 'udemy-django-static/js/utils/ud-graphql';

type PlanType = 'UDEMYPRO' | 'CONSUMERSUBSCRIPTION';
type CtaType = 'trial' | 'paid';
type SubscriptionStatus = 'trial' | 'active';

class SubscriptionCancelEvent extends ClientEvent {
    subscriptionPlanEnrollmentId: string;
    constructor(subscriptionPlanEnrollmentId: string) {
        super('SubscriptionCancelEvent');
        this.subscriptionPlanEnrollmentId = subscriptionPlanEnrollmentId;
    }
}

class SubscriptionReactivateEvent extends ClientEvent {
    planId: string;
    constructor(subscriptionPlanEnrollmentId: string) {
        super('SubscriptionReactivateEvent');
        this.planId = subscriptionPlanEnrollmentId;
    }
}

class SubscriptionAvailablePlanPurchaseInitiateEvent extends ClientEvent {
    planId: string;
    constructor(planId: string) {
        super('SubscriptionAvailablePlanPurchaseInitiateEvent');
        this.planId = planId;
    }
}

function getIdFromGlobalId(planId: string) {
    const intPlanId = parseInt(planId, 10);
    return isNaN(intPlanId) ? idFromGlobalId(planId) : intPlanId;
}

class SubscriptionOfferImpressionEvent extends ClientEvent {
    planPriceId: string;
    courseId: number | null;
    uiRegion: string;
    courseTrackingId?: string;
    hasTrial: boolean | null;
    trialDays: number | null;
    badges: string[] | null;
    planPriceIds?: number[];

    constructor(
        planId: string,
        courseId: number | null = null,
        uiRegion: string,
        courseTrackingId?: string,
        hasTrial: boolean | null = null,
        trialDays: number | null = null,
        badges: string[] | null = null,
        planPriceIds: string[] | null = null,
    ) {
        super('SubscriptionOfferImpressionEvent');
        this.planPriceId = getIdFromGlobalId(planId).toString();
        this.courseId = courseId;
        this.uiRegion = uiRegion;
        this.courseTrackingId = courseTrackingId;
        this.hasTrial = hasTrial;
        this.trialDays = trialDays;
        this.badges = badges;
        this.planPriceIds = planPriceIds?.map((planPriceId) => getIdFromGlobalId(planPriceId));
    }
}

class SubscriptionCTAClickEvent extends ClientEvent {
    planPriceId: string;
    planType: PlanType;
    ctaType: CtaType;
    uiRegion: string;
    courseId: number | null;
    courseTrackingId?: string;
    planPriceIds?: number[] | null;
    constructor(
        planId: string,
        planType: PlanType,
        ctaType: CtaType,
        uiRegion: string,
        courseId: number | null = null,
        courseTrackingId?: string,
        planPriceIds: string[] | null = null,
    ) {
        super('SubscriptionCTAClickEvent');
        try {
            this.planPriceId = idFromGlobalId(planId).toString();
        } catch {
            this.planPriceId = planId.toString();
        }
        this.planType = planType;
        this.ctaType = ctaType;
        this.uiRegion = uiRegion;
        this.courseId = courseId;
        this.courseTrackingId = courseTrackingId;
        this.planPriceIds = planPriceIds?.map((planPriceId) => getIdFromGlobalId(planPriceId));
    }
}

class SubscriptionLearnMoreEvent extends ClientEvent {
    planPriceId: string;
    planType: PlanType;
    uiRegion: string;
    planPriceIds?: number[];

    constructor(
        planId: string,
        planType: PlanType,
        uiRegion: string,
        planPriceIds: string[] | null = null,
    ) {
        super('SubscriptionLearnMoreEvent');
        try {
            this.planPriceId = idFromGlobalId(planId).toString();
        } catch {
            this.planPriceId = planId.toString();
        }
        this.planType = planType;
        this.uiRegion = uiRegion;
        this.planPriceIds = planPriceIds?.map((planPriceId) => getIdFromGlobalId(planPriceId));
    }
}

class SubscriptionSurveyClickEvent extends ClientEvent {
    planPriceId: string;
    status: SubscriptionStatus;
    url: string;
    uiRegion: string;
    constructor(planId: string, status: SubscriptionStatus, url: string, uiRegion: string) {
        super('SubscriptionSurveyClickEvent');
        this.planPriceId = planId;
        this.status = status;
        this.url = url;
        this.uiRegion = uiRegion;
    }
}

class SubscriptionPlanSelectEvent extends ClientEvent {
    planPriceId: number;
    hasTrial: boolean;
    trialDays: number;
    badges: string[] | null;
    nonInteraction: boolean;
    planPriceIds?: number[] | null;

    constructor(
        planId: string,
        hasTrial: boolean,
        trialDays: number,
        badges: string[] | null = null,
        nonInteraction = false,
        planPriceIds: string[] | null = null,
    ) {
        super('SubscriptionPlanSelectEvent');
        try {
            this.planPriceId = idFromGlobalId(planId);
        } catch {
            this.planPriceId = parseInt(planId, 10);
        }
        this.hasTrial = hasTrial;
        this.trialDays = trialDays;
        this.badges = badges;
        this.nonInteraction = nonInteraction;
        this.planPriceIds = planPriceIds?.map((planPriceId) => getIdFromGlobalId(planPriceId));
    }
}

class SubscriptionStartClickEvent extends ClientEvent {
    planPriceId: number;
    hasTrial: boolean;
    trialDays: number;
    planPriceIds?: number[] | null;

    constructor(
        planId: string,
        hasTrial: boolean,
        trialDays: number,
        planPriceIds: string[] | null = null,
    ) {
        super('SubscriptionStartClickEvent');
        try {
            this.planPriceId = idFromGlobalId(planId);
        } catch {
            this.planPriceId = parseInt(planId, 10);
        }
        this.hasTrial = hasTrial;
        this.trialDays = trialDays;
        this.planPriceIds = planPriceIds?.map((planPriceId) => getIdFromGlobalId(planPriceId));
    }
}

class SubscriptionStartErrorEvent extends ClientEvent {
    planPriceId: number;
    errorMessage: string;
    constructor(planId: string, errorMessage: string) {
        super('SubscriptionStartErrorEvent');
        try {
            this.planPriceId = idFromGlobalId(planId);
        } catch {
            this.planPriceId = parseInt(planId, 10);
        }
        this.errorMessage = errorMessage;
    }
}

export type {PlanType};
export {getIdFromGlobalId};

export {
    SubscriptionCancelEvent,
    SubscriptionReactivateEvent,
    SubscriptionAvailablePlanPurchaseInitiateEvent,
    SubscriptionOfferImpressionEvent,
    SubscriptionCTAClickEvent,
    SubscriptionLearnMoreEvent,
    SubscriptionSurveyClickEvent,
    SubscriptionPlanSelectEvent,
    SubscriptionStartClickEvent,
    SubscriptionStartErrorEvent,
};
