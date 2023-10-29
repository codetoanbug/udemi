import React, {createContext, useContext} from 'react';

import {SubscriptionContext} from 'course-landing-page/types/clc-contexts';
import {ReactSubscriptionContext} from 'subscription-browse/subscription-plan-provider.react-component';
import {BrowseSubscriptionPlan} from 'subscription-browse/use-subscription-plans-by-product-type';

export interface CLPSubscriptionContext {
    subscriptionPlan?: BrowseSubscriptionPlan;
    subscriptionContext?: SubscriptionContext;
}

interface ClpSubscriptionContextProviderProps {
    subscriptionContext?: SubscriptionContext;
}

export const ReactCLPSubscriptionContext = createContext<CLPSubscriptionContext | undefined>(
    undefined,
);

export const CLPSubscriptionContextProvider: React.FC<ClpSubscriptionContextProviderProps> = (
    props,
) => {
    const subscriptionPlan = useContext(ReactSubscriptionContext);
    return (
        <ReactCLPSubscriptionContext.Provider
            value={{subscriptionPlan, subscriptionContext: props.subscriptionContext}}
        >
            {props.children}
        </ReactCLPSubscriptionContext.Provider>
    );
};
