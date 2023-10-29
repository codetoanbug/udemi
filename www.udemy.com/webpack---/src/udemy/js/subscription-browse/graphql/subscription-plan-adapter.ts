import {formatCurrency} from '@udemy/shared-utils';

import {
    AnnualSubscriptionPlanPricingOption,
    DateIntervalType,
    Maybe,
    SubscriptionPlanPricingOptionItem,
    SubscriptionPlanProductType,
    SubscriptionTrial,
} from 'gql-codegen/api-platform-graphql';

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
