import {udApi} from '@udemy/ud-api';

import {SDTag} from './types/browse-nav-item';

// Hardcoded list of most popular subcategories to display
// TODO: This could be data driven
export const MOST_POPULAR_SUBCATEGORY_IDS = [
    8, // 'web-development'
    132, // 'it-certification'
    44, // 'data-and-analytics'
    14, // 'game-development'
    10, // 'mobile-apps'
    540, // 'finance'
    110, // 'graphic-design'
    142, // 'personal-transformation'
    26, // 'entrepreneurship'
    62, // 'digital-marketing'
];

export interface PopularTopics {
    id: number;
    stats: SDTag[];
}

interface OldPopularTopic {
    display_name: string;
    id: number;
    title: string;
    topic_channel_url: string;
    url: string;
}

interface OldPopularTopicsResponse {
    results: OldPopularTopic[];
}

export const POPULAR_TOPICS = 'popular_topics';
export const POPULAR_TOPICS_IN_CATEGORY = 'popular_topics_in_category';
export const GLOBAL_STATS_BASE_URL = 'structured-data/tags/topic/global-stats/';
export const SD_TAG_BASE_URL = 'structured-data/tags/';
export const ROLE_MARKETPLACE = 'marketplace';
export const DEFAULT_STAT_SIZE = 100;

export const fetchPopularTopicsForSubcategory = async (
    subcategoryId: number,
    locale: string,
    stat_size = 10,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isUFB = false,
): Promise<PopularTopics> => {
    const url = `course-subcategories/${subcategoryId}/labels/`;
    const params = {
        page_size: stat_size,
        locale,
        navigation_locale: locale,
    };
    /*
    // TODO: Use the structured data API
    // We'd like to use this, but UB does not have any indexed data
    const url = `structured-data/tags/subcategory/${subcategoryId}/`;
    const params = {
        locale,
        'fields[course_subcategory]': 'stats',
        stat_types: 'popular_topics_in_subcategory',
        stat_size,
        stat_role: isUFB ? 'ufb' : 'marketplace',
    };
    */
    const response = await udApi.get(url, {
        params,
    });

    // Hack: shimming data response from old API to new API for better compatibility
    const popularTopicsOld = response.data as OldPopularTopicsResponse;

    const popularTopics: PopularTopics = {
        id: subcategoryId,
        stats: popularTopicsOld.results.map((popularTopicOld: OldPopularTopic) => {
            return {
                id: popularTopicOld.id,
                title: popularTopicOld.display_name,
                url: popularTopicOld.url,
                absolute_url: popularTopicOld.url,
                type: 'topic',
            };
        }),
    };

    // Supply the subCategories with a reference to the parent category
    for (let i = 0; i < popularTopics.stats.length; i++) {
        popularTopics.stats[i].parentId = popularTopics.id;
    }

    return popularTopics;
};

export const fetchMostPopularTopicsForSubcategories = async (
    locale: string,
    isUFB = false,
): Promise<Record<number, SDTag[]>> => {
    const popularTopicsPromises = await Promise.allSettled(
        MOST_POPULAR_SUBCATEGORY_IDS.map((subcategoryId) =>
            fetchPopularTopicsForSubcategory(subcategoryId, locale, 10, isUFB),
        ),
    );
    const popularTopics = popularTopicsPromises
        .filter((res): res is PromiseFulfilledResult<PopularTopics> => res.status === 'fulfilled')
        .reduce((acc, {value}) => ({...acc, [value.id]: value.stats}), {});

    return popularTopics;
};
