import {action, observable, runInAction} from 'mobx';

import {BROWSE_TYPE} from '../../browse-constants';
import {SUBCATEGORY_NOT_IN_PERSONAL_PLAN} from '../../constants';
import {
    MOST_POPULAR_SUBCATEGORY_IDS,
    fetchMostPopularTopicsForSubcategories,
} from '../../fetch-popular-topics';
import {HeaderData} from '../../header.mobx-store';
import {BrowseNavCategory, SDTag} from '../../types/browse-nav-item';

export class MobileNavStore {
    @observable maxLoadedLevel = 0;
    @observable.ref navigationCategories: BrowseNavCategory[] | null = null;
    @observable.ref mostPopularSubcategories: BrowseNavCategory[] | null = null;

    isLevelLoaded(level: number) {
        return level <= this.maxLoadedLevel;
    }

    loadNavigationCategories = async (headerData: HeaderData) => {
        const {user} = headerData;

        // Map header data to `navigateCategories` structure
        const navigationCategories = headerData.navigationCategories.map(
            ({sd_tag: category, sublist}) => {
                // Build children from sublist categories
                const navigationCategoriesChildren = sublist.items.map(
                    ({sd_tag: subcategory}: {sd_tag: SDTag}) => {
                        // If user has a consumer subscription, exclude some subcategories
                        if (
                            user.consumer_subscription_active &&
                            SUBCATEGORY_NOT_IN_PERSONAL_PLAN.includes(subcategory.id)
                        ) {
                            return null;
                        }
                        return {
                            id: subcategory.id,
                            parentId: category.id,
                            title: subcategory.title,
                            absolute_url: subcategory.url,
                            type: BROWSE_TYPE.SUBCATEGORY,
                        } as BrowseNavCategory;
                    },
                );
                const navigationCategory: BrowseNavCategory = {
                    id: category.id,
                    title: category.title,
                    absolute_url: category.url as string,
                    type: BROWSE_TYPE.CATEGORY,
                    children: navigationCategoriesChildren.filter(Boolean) as BrowseNavCategory[],
                };
                return navigationCategory;
            },
        );

        runInAction(() => {
            this.navigationCategories = navigationCategories;
        });
    };

    loadMostPopularTopicsForSubcategories = async (locale: string) => {
        const popularTopics = await fetchMostPopularTopicsForSubcategories(locale);

        const mostPopularSubcategories = (this.navigationCategories as BrowseNavCategory[])
            .reduce(
                (acc, {children}) => [...acc, ...(children as BrowseNavCategory[])],
                [] as BrowseNavCategory[],
            )
            .filter(({id}: {id: number}) => MOST_POPULAR_SUBCATEGORY_IDS.includes(id))
            .map((mostPopularSubcategory) => ({
                ...mostPopularSubcategory,
                popularTopics: popularTopics[mostPopularSubcategory.id],
            }));

        runInAction(() => {
            this.mostPopularSubcategories = mostPopularSubcategories;
        });
    };

    @action
    ensureLevelIsLoaded(level: number) {
        this.maxLoadedLevel = Math.max(this.maxLoadedLevel, level);
    }
}
