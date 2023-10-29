import React, {createContext} from 'react';

import {
    BrowseSubscriptionPlan,
    useSubscriptionPlansByProductType,
} from 'udemy-django-static/js/subscription-browse/use-subscription-plans-by-product-type';

export const ReactSubscriptionContext =
    createContext<BrowseSubscriptionPlan | undefined>(undefined);

export const SubscriptionPlanProvider: React.FC<{
    children?: React.ReactNode;
}> = (props) => {
    const subscriptionPlan = useSubscriptionPlansByProductType();
    return (
        <ReactSubscriptionContext.Provider value={subscriptionPlan}>
            {props.children}
        </ReactSubscriptionContext.Provider>
    );
};
