import React, {createContext, useContext, useEffect, useState} from 'react';

import CourseLandingComponentsStore from './course-landing-components.mobx-store';

export const ReactFeatureContext = createContext<FeatureContext | Record<string, never>>({});

export interface Feature {
    enabled: boolean;
    variant?: string;
    [x: string]: unknown;
}

export interface FeatureContext {
    [x: string]: Feature;
}

/**
 * TB-7034 : This provider will be moved out from the CLP codebase and will be placed in a common place. Since we
 * want to use for any feature, not only for CLP.
 */
export const FeatureContextProvider: React.FC<{
    asyncFeatureContext: Promise<FeatureContext>;
}> = ({asyncFeatureContext, children}) => {
    const [featureContext, setFeatureContext] = useState<FeatureContext>({});

    useEffect(() => {
        let isMounted = true;
        asyncFeatureContext.then((value) => {
            if (isMounted) {
                setFeatureContext(value);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [asyncFeatureContext]);

    return (
        <ReactFeatureContext.Provider value={featureContext}>
            {children}
        </ReactFeatureContext.Provider>
    );
};

/**
 * This hook returns a feature configuration using the FeatureContextProvider.
 * In order to useFeature you have to provide feature via FeatureContextProvider otherwise you'll get empty context
 */
export function useFeature(featureName: string) {
    const featureContext = useContext(ReactFeatureContext);
    const [feature, setFeature] = useState<Feature>();

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            setFeature(featureContext[featureName]);
        }
        return () => {
            isMounted = false;
        };
    }, [featureContext, featureName]);

    return feature;
}

/**
 * This hook returns a feature configuration using a promise that resolves a FeatureContext.
 * This is useful when a feature is needed from a root component.
 */
export function useAsyncFeature(asyncFeatureContext: Promise<FeatureContext>, featureName: string) {
    const [feature, setFeature] = useState<Feature>();

    useEffect(() => {
        let isMounted = true;
        asyncFeatureContext.then((context) => {
            if (isMounted) {
                setFeature(context[featureName]);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [asyncFeatureContext, featureName]);

    return feature;
}

export const getAsyncFeatureContext = async (
    clcStore: CourseLandingComponentsStore,
): Promise<FeatureContext> => {
    const response = await clcStore.getOrPopulate<{
        feature_context?: {
            features?: FeatureContext;
        };
    }>(['feature_context']);
    return response?.feature_context?.features ?? {};
};
