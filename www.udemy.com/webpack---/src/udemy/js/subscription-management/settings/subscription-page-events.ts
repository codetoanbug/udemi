import {ClientEvent} from '@udemy/event-tracking';

import {SubscriptionPlanProductType} from 'gql-codegen/api-platform-graphql';
import {idFromGlobalId} from 'utils/ud-graphql';

type PlanType =
    | SubscriptionPlanProductType.Udemypro
    | SubscriptionPlanProductType.Consumersubscription;
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
    planType: SubscriptionPlanProductType;
    ctaType: CtaType;
    uiRegion: string;
    courseId: number | null;
    courseTrackingId?: string;
    planPriceIds?: number[] | null;
    constructor(
        planId: string,
        planType: SubscriptionPlanProductType,
        ctaType: CtaType,
        uiRegion: string,
        courseId: number | null = null,
        courseTrackingId?: string,
        planPriceIds: string[] | null = null,
    ) {
        super('SubscriptionCTAClickEvent');
        this.planPriceId = parseGlobalIdOrPlanPriceId(planId).toString();
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
    planType: SubscriptionPlanProductType;
    uiRegion: string;
    planPriceIds?: number[];

    constructor(
        planId: string,
        planType: SubscriptionPlanProductType,
        uiRegion: string,
        planPriceIds: string[] | null = null,
    ) {
        super('SubscriptionLearnMoreEvent');
        this.planPriceId = parseGlobalIdOrPlanPriceId(planId).toString();
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

const parseGlobalIdOrPlanPriceId = (id: string) => {
    try {
        return getIdFromGlobalId(id); // For the new store the id is will be an integer 74
    } catch {
        return parseInt(id, 10);
    }
};

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
        this.planPriceId = parseGlobalIdOrPlanPriceId(planId);
        this.hasTrial = hasTrial;
        this.trialDays = trialDays;
        this.badges = badges;
        this.nonInteraction = nonInteraction;
        this.planPriceIds = planPriceIds?.map((planPriceId) =>
            parseGlobalIdOrPlanPriceId(planPriceId),
        );
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
        this.planPriceId = parseGlobalIdOrPlanPriceId(planId);
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
        this.planPriceId = parseGlobalIdOrPlanPriceId(planId);
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
