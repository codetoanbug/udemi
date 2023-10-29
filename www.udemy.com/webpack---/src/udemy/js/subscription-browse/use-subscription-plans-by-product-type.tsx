import {useEffect, useState} from 'react';

import loadCommonAppContext from 'common/load-common-app-context';
import {
    DateIntervalType,
    SubscriptionPlanPricingOptionItem,
    SubscriptionPlanProductType,
    useSubscriptionPlansByProductTypeQuery,
} from 'gql-codegen/api-platform-graphql';

import {
    adaptSubscriptionPlanByProductType,
    SubscriptionPlanPropType,
} from './graphql/subscription-plan-adapter';

export interface BrowseSubscriptionPlan {
    isAnnualPlanEnabled: boolean;
    isLoading: boolean;
    isPersonalPlanSubscriber: boolean;
    subscriptionPlan?: SubscriptionPlanPropType;
    subscriptionPlans: SubscriptionPlanPropType[];
    subscriptionPlanIds: string[];
    contentCollectionIds: string[];
}

export const useSubscriptionPlansByProductType = (): BrowseSubscriptionPlan => {
    const [isPersonalPlanSubscriber, setIsPersonalPlanSubscriber] = useState(false);
    const [isLoadingAppContext, setIsLoadingAppContext] = useState(true);
    useEffect(() => {
        let isMounted = true;
        loadCommonAppContext().then((context) => {
            if (isMounted) {
                const {user} = context.data.header;
                if ('consumer_subscription_active' in user) {
                    setIsPersonalPlanSubscriber(user.consumer_subscription_active);
                }
                setIsLoadingAppContext(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);
    const {isLoading: isLoadingPlan, data} = useSubscriptionPlansByProductTypeQuery(undefined, {
        refetchOnWindowFocus: false,
    });
    const consumerSubscriptionPlans = data?.subscriptionPlansByProductType;
    const consumerSubscriptionPlan = consumerSubscriptionPlans?.find(
        (subscriptionPlan) =>
            subscriptionPlan.productType == SubscriptionPlanProductType.Consumersubscription,
    );
    const planPriceOptions =
        consumerSubscriptionPlan?.priceOptions ?? ([] as SubscriptionPlanPricingOptionItem[]);
    const annualPlanOption: SubscriptionPlanPricingOptionItem = planPriceOptions.find(
        (planPriceOption) => planPriceOption.renewalInterval.type == DateIntervalType.Year,
    ) as SubscriptionPlanPricingOptionItem;
    const monthlyPlanOption: SubscriptionPlanPricingOptionItem = planPriceOptions.find(
        (planPriceOption) => planPriceOption.renewalInterval.type == DateIntervalType.Month,
    ) as SubscriptionPlanPricingOptionItem;
    const subscriptionPlans: SubscriptionPlanPropType[] = planPriceOptions
        .map((planPriceOption) => {
            return adaptSubscriptionPlanByProductType(
                consumerSubscriptionPlan?.productType ??
                    SubscriptionPlanProductType.Consumersubscription,
                planPriceOption,
            );
        })
        .filter((plan): plan is SubscriptionPlanPropType => !!plan);
    const subscriptionPlan = adaptSubscriptionPlanByProductType(
        consumerSubscriptionPlan?.productType ?? SubscriptionPlanProductType.Consumersubscription,
        annualPlanOption ?? monthlyPlanOption,
    );
    let isLoading = isLoadingPlan || isLoadingAppContext;
    if (!isLoadingAppContext && isPersonalPlanSubscriber) {
        isLoading = false;
    }
    const planOptionIds = planPriceOptions.map((planPriceOption) => planPriceOption.id);
    // TODO: contentCollectionIds should ideally be fetched from graphql
    const contentCollectionIds = isPersonalPlanSubscriber ? ['1004', '1010'] : [];
    return {
        isLoading,
        subscriptionPlan,
        subscriptionPlans,
        subscriptionPlanIds: planOptionIds,
        isAnnualPlanEnabled: !!annualPlanOption,
        isPersonalPlanSubscriber,
        contentCollectionIds,
    };
};
