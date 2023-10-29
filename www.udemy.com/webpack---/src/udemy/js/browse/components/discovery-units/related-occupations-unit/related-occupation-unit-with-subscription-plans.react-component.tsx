import React, {useContext} from 'react';

import {
    RelatedOccupationsSkeleton,
    RelatedOccupationsUnit,
    RelatedOccupationsUnitProps,
} from 'browse/components/discovery-units/related-occupations-unit/related-occupations-unit.react-component';
import {ReactSubscriptionContext} from 'subscription-browse/subscription-plan-provider.react-component';
import {BrowseSubscriptionPlan} from 'subscription-browse/use-subscription-plans-by-product-type';

export const RelatedOccupationUnitWithSubscriptionPlans = ({
    unit,
    ctaButtonStyle,
}: RelatedOccupationsUnitProps) => {
    // Don't forget to use SubscriptionPlanProvider in the hierarchy if you're using this component
    const {isLoading, subscriptionPlan, subscriptionPlanIds, isAnnualPlanEnabled} = useContext(
        ReactSubscriptionContext,
    ) as BrowseSubscriptionPlan;

    if (isLoading) {
        return <RelatedOccupationsSkeleton className="component-margin" />;
    }

    if (!isLoading && subscriptionPlan) {
        return (
            <RelatedOccupationsUnit
                unit={unit}
                plan={subscriptionPlan}
                isAnnualPlanEnabled={isAnnualPlanEnabled}
                planPriceIds={subscriptionPlanIds}
                ctaButtonStyle={ctaButtonStyle}
            />
        );
    }

    return null;
};
