import React, {createContext} from 'react';

import {
    BrowseSubscriptionPlan,
    useSubscriptionPlansByProductType,
} from './use-subscription-plans-by-product-type';

export const ReactSubscriptionContext = createContext<BrowseSubscriptionPlan | undefined>(
    undefined,
);

// Provider that fetches subscription plan information using new pricing API calls; use this going forward
export const SubscriptionPlansByProductTypeProvider: React.FC = (props) => {
    const subscriptionPlan = useSubscriptionPlansByProductType();
    return (
        <ReactSubscriptionContext.Provider value={subscriptionPlan}>
            {props.children}
        </ReactSubscriptionContext.Provider>
    );
};

export const SubscriptionPlanProvider: React.FC = (props) => {
    return (
        <SubscriptionPlansByProductTypeProvider>
            {props.children}
        </SubscriptionPlansByProductTypeProvider>
    );
};
