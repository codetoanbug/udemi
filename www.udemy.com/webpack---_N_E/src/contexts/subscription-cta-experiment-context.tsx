import React, {createContext} from 'react';
export const ReactSubscriptionCTAContext = createContext<
    SubscriptionCTAContext | Record<string, never>
>({showCancelAnytime: false});

interface SubscriptionCTAContext {
    showCancelAnytime: boolean;
}

/**
 * Provides all context related to experimentation for Subscription CTAs; use this to pass context from experimentation
 * platform to subscription CTAs.
 */
export const SubscriptionCTAExperimentProvider: React.FC<{context: SubscriptionCTAContext}> = ({
    context,
    children,
}) => {
    return (
        <ReactSubscriptionCTAContext.Provider value={context}>
            {children}
        </ReactSubscriptionCTAContext.Provider>
    );
};
