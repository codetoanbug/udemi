import {useFeatureVariantAssignmentsQuery} from 'src/generated/graphql';

export interface FeatureConfigs {
    [featureCode: string]: {
        [key: string]: string | number | boolean | null;
    };
}

export const FEATURES = {
    // Object of below feature configs keys with uppercase letters and spaces
    SHOW_CANCEL_ANYTIME_MESSAGING_FOR_PP: 'show_cancel_anytime_messaging_for_pp',
    PERSISTENT_SEARCH_BAR: 'persistent_search_bar',
    UPDATE_PERSONAL_PLAN_TOPIC_PAGE: 'update_personal_plan_topic_page',
    UPDATE_UDEMY_BUSINESS_TOPIC_PAGE: 'update_udemy_business_topic_page',
    CAREER_VERTICALS: 'career_verticals',
    // Make the below text uppercase and replace spaces with underscores
    MARKETPLACE_SUBSCRIPTION_OFFER: 'marketplace_subscription_offer',
};

/**
 * https://tapen.udemy.com/tapen/experimentation_platform/feature/470/settings
 */
export interface CancelAnytimeFeature extends FeatureConfigs {
    show_cancel_anytime_messaging_for_pp: {
        showCancelAnytime: boolean;
    };
}

/**
 * https://tapen.udemy.com/tapen/experimentation_platform/feature/390/settings
 */
export interface PersistentSearchBarFeature extends FeatureConfigs {
    persistent_search_bar: {
        persistSearchBar: boolean;
    };
}

export interface UpdatedPPTopicFeature extends FeatureConfigs {
    update_personal_plan_topic_page: {
        showUpdatedPPTopicPage: string;
    };
}
export interface ShowRelatedOccupationsFeature extends FeatureConfigs {
    career_verticals: {
        enableDiscoveryOnTopics: boolean;
    };
}

export interface MarketplaceSubscriptionOffer extends FeatureConfigs {
    marketplace_subscription_offer: {
        show_personal_plan_badge: boolean;
    };
}

/**
 * Fetch one or more feature configurations for the current user based on
 * their feature variant assignments.
 *
 * Write your feature name in the experimentation platform with all lowercase letters and underscores instead of spaces.
 *
 * ```typescript
 * interface MyPageFeatures {
 *  my_feature_1: {
 *   color: 'blue' | 'red';
 *   amount: number;
 *  };
 *  my_feature_2: {
 *   isEnabled: boolean;
 *  }
 * }
 *
 * const { configs } = useFeatureVariantConfigs<MyPageFeatures>('my_feature_1', 'my_feature_2')
 * const amount = configs?.my_feature_1?.amount;
 * ```
 *
 * @param featureCodes Feature codes as defined in Tapen
 * @returns Feature configs for the current user.
 */
export const useFeatureConfigs = <T extends FeatureConfigs>(
    ...featureCodes: Extract<keyof T, string>[]
): {isLoading: boolean; configs?: Partial<T>} => {
    const {isLoading, data} = useFeatureVariantAssignmentsQuery(
        {
            featureCodes,
            realtimeAttributes: [{key: 'custom_attribute', value: 'custom_value'}],
        },
        {refetchOnWindowFocus: false},
    );

    if (data) {
        const configs: Partial<T> = {};

        for (const assignment of data.featureVariantAssignmentsByCodeAndAttributes) {
            const {featureCode, configuration} = assignment;
            configs[featureCode as keyof T] = configuration;
        }

        return {isLoading, configs};
    }

    return {isLoading};
};
