import {formatCurrency} from '@udemy/shared-utils';
import {UDData} from '@udemy/ud-data';

import {
    AnnualSubscriptionPlanPricingOption,
    DateIntervalType,
    Maybe,
    SubscriptionPlan,
    SubscriptionPlanPricingOptionItem,
    SubscriptionPlanProductType,
    SubscriptionTrial,
} from 'udemy-django-static/js/gql-codegen/api-platform-graphql';
import {toGlobalId} from 'udemy-django-static/js/utils/ud-graphql';

import {getPersonalPlanPrice} from '../collection-stats';

// The semi-deprecated subset of fields previously used in the SubscriptionPlan object
export type LegacySubscriptionPlan = Pick<
    SubscriptionPlan,
    'id' | 'listPrice' | 'productType' | 'renewalInterval' | 'trial'
>;

export interface SubscriptionPlanPropType {
    trialPeriodDays?: number;
    listPriceText: string;
    id: string;
    intervalDisplay: string;
    productType: SubscriptionPlanProductType;
    monthlyPrice?: string;
}

export const getTrialPeriodDays = (
    trial: Maybe<SubscriptionTrial> | undefined,
): number | undefined => {
    if (trial === null || trial === undefined) {
        return undefined;
    }
    return trial?.dateInterval.type === DateIntervalType.Day ? trial?.dateInterval.count : 0;
};

// DEPRECATED: Once we've migrated to the subscription-plans.by-product-type GraphQL query, this function should be deleted!
export const adaptSubscriptionPlan = (
    plan: LegacySubscriptionPlan | undefined,
    udData?: UDData,
): SubscriptionPlanPropType | undefined => {
    if (!plan) {
        return undefined;
    }
    const monthlyPrice =
        plan?.renewalInterval.type === DateIntervalType.Year
            ? getPersonalPlanPrice('annualPerMonth', true, udData)
            : undefined;
    return {
        trialPeriodDays: getTrialPeriodDays(plan.trial),
        id: toGlobalId('StandardSubscriptionPlan', plan.id),
        intervalDisplay: plan.renewalInterval.type,
        listPriceText: formatCurrency(plan.listPrice.amount),
        productType: plan.productType,
        monthlyPrice,
    };
};

export const adaptSubscriptionPlanByProductType = (
    productType: SubscriptionPlanProductType,
    plan: SubscriptionPlanPricingOptionItem,
): SubscriptionPlanPropType | undefined => {
    if (!plan) {
        return undefined;
    }
    const annualPlanOption =
        plan.renewalInterval.type === DateIntervalType.Year
            ? (plan as AnnualSubscriptionPlanPricingOption)
            : undefined;
    return {
        trialPeriodDays: getTrialPeriodDays(plan.trial),
        id: plan.id,
        intervalDisplay: plan.renewalInterval.type,
        listPriceText: formatCurrency(plan.listPrice.amount),
        productType,
        monthlyPrice: annualPlanOption?.monthlyPrice
            ? formatCurrency(annualPlanOption?.monthlyPrice.amount)
            : undefined,
    };
};
