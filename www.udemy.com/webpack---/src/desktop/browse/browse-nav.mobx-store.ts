import {action, runInAction, observable, toJS} from 'mobx';

import {Tracker as tracker} from '@udemy/event-tracking';
import {I18nApi} from '@udemy/i18n';
import {debounce, udExpiringLocalStorage} from '@udemy/shared-utils';

import {BADGING_NAV, BROWSE_LEARNING_TYPES, BROWSE_TYPE} from '../../browse-constants';
import {SUBCATEGORY_NOT_IN_PERSONAL_PLAN} from '../../constants';
import {
    BadgeNavItemSelectEvent,
    BadgeNavItemType,
    CategoryNavItemSelectEvent,
    LearningTypeNavItemSelectEvent,
    LearningTypeNavItemType,
} from '../../events';
import {CommonAppContext, loadCommonAppContext} from '../../external/load-common-app-context';
import {fetchPopularTopicsForSubcategory} from '../../fetch-popular-topics';
import {BrowseNavItem, BrowseNavCategory, SDTag} from '../../types/browse-nav-item';

interface TrackSelectOptions {
    selectedVia?: string;
    learningItemType?: string;
    badgeItemType?: string;
}

export class BrowseNavStore {
    readonly _localStorage;
    _debouncedLoadTopics;
    @observable.ref navigationCategories: BrowseNavCategory[] = [];
    _topics = observable.map<number, SDTag[]>({}, {deep: false});
    @observable.ref selectedLevelOneItem: BrowseNavItem | null = null;
    @observable.ref selectedLevelTwoItem: BrowseNavItem | null = null;
    @observable.ref selectedLevelThreeItem: BrowseNavItem | null = null;
    commonAppContext?: CommonAppContext;

    constructor(
        private readonly gettext: I18nApi['gettext'],
        private readonly locale: string,
        private readonly navigation_locale?: string,
        private readonly isUFB = false,
    ) {
        const expirationDate = new Date(Date.now() + 4 * 3600 * 1000);
        this._localStorage = udExpiringLocalStorage('header-browse-nav', 'items', expirationDate);

        this._debouncedLoadTopics = debounce(this._loadTopics, 150);
    }

    loadNavigationCategories = async (locale: string, isUFB = false) => {
        // TODO: move common app context to argument (will require more unit test updates)
        if (!this.commonAppContext) {
            this.commonAppContext = await loadCommonAppContext(locale, isUFB);
        }
        const commonAppContext = this.commonAppContext as CommonAppContext;
        const headerData = commonAppContext.data.header;
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

    @action selectLevelOneItem = (
        item: BrowseNavItem,
        options: Partial<TrackSelectOptions> = {},
    ) => {
        this._selectItem('selectedLevelOneItem', item, options);
        this.selectedLevelTwoItem = null;
        this.selectedLevelThreeItem = null;
    };

    @action selectLevelTwoItem = (
        item: BrowseNavItem,
        options: Partial<TrackSelectOptions> = {},
    ) => {
        this._selectItem('selectedLevelTwoItem', item, options);
        this.selectedLevelThreeItem = null;
        if (this.selectedLevelTwoItem === item && item.type === BROWSE_TYPE.SUBCATEGORY) {
            this._debouncedLoadTopics(item, this.isUFB);
        }
    };

    @action selectLevelThreeItem = (
        item: BrowseNavItem,
        options: Partial<TrackSelectOptions> = {},
    ) => {
        this._selectItem('selectedLevelThreeItem', item, options);
    };

    trackSelect = () => {
        this._trackSelect({selectedVia: 'click'});
    };

    _trackSelect(options: TrackSelectOptions) {
        if (options.selectedVia === 'click') {
            // Event will vary depending on if it's a learning type nav item (labs, assessments)
            if (options.learningItemType) {
                tracker.publishEvent(
                    new LearningTypeNavItemSelectEvent(
                        options.learningItemType as LearningTypeNavItemType,
                    ),
                );
            } else if (options.badgeItemType) {
                tracker.publishEvent(
                    new BadgeNavItemSelectEvent(options.badgeItemType as BadgeNavItemType),
                );
            } else if (this.selectedLevelOneItem) {
                const context = {
                    categoryId: this.selectedLevelOneItem.id,
                    subcategoryId: this.selectedLevelTwoItem?.id,
                    topicId: this.selectedLevelThreeItem?.id,
                };
                tracker.publishEvent(new CategoryNavItemSelectEvent({context}));
            }
        }
    }

    _selectItem(
        selectedItemKey: keyof this,
        item: BrowseNavItem,
        givenOptions: Partial<TrackSelectOptions>,
    ) {
        const options = {toggle: true, ...givenOptions};

        // Identify the type of item being selected in order to fire appropriate event
        if (
            Object.values(BROWSE_LEARNING_TYPES(this.gettext))
                .map((item) => item.type)
                .includes(item.type as LearningTypeNavItemType)
        ) {
            options.learningItemType = item.type;
        } else if (
            Object.values(BADGING_NAV)
                .map((item) => item(this.gettext).type)
                .includes(item.type as BadgeNavItemType)
        ) {
            options.badgeItemType = item.type;
        }

        /* eslint-disable @typescript-eslint/no-explicit-any */
        if (item === (this[selectedItemKey] as any) && options.toggle) {
            (this[selectedItemKey] as any) = null;
        } else {
            (this[selectedItemKey] as any) = item;
            this._trackSelect(options);
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }

    getTopics(subcategory: BrowseNavCategory) {
        return this._topics.get(subcategory.id);
    }

    @action _loadTopics = async (subcategory: BrowseNavCategory, isUFB = false) => {
        if (!this.commonAppContext) {
            this.commonAppContext = await loadCommonAppContext(this.locale, isUFB);
        }
        const commonAppContext = this.commonAppContext as CommonAppContext;
        const {user} = commonAppContext.data.header;
        if (this.getTopics(subcategory)) {
            return Promise.resolve();
        }
        const cacheKey = user.consumer_subscription_active
            ? `PP:${subcategory.id}:${this.locale}`
            : `${subcategory.id}:${this.locale}`;

        const cachedTopics = this._localStorage.get(cacheKey);
        if (cachedTopics) {
            this._topics.set(subcategory.id, toJS(cachedTopics));
            return Promise.resolve();
        }
        const params: Record<string, number | string> = {page_size: 9, locale: this.locale};
        if (this.navigation_locale) {
            params.navigation_locale = this.navigation_locale;
        }

        try {
            const response = await fetchPopularTopicsForSubcategory(
                subcategory.id,
                this.locale,
                9,
                isUFB,
            );
            const topics = response.stats
                .map((topic) => {
                    return {
                        id: topic.id,
                        absolute_url: topic.url,
                        title: topic.title,
                        type: BROWSE_TYPE.TOPIC,
                    };
                })
                .filter((topic) => {
                    return (
                        topic.title.toLowerCase() !== (subcategory.title as string)?.toLowerCase()
                    );
                });
            this._localStorage.set(cacheKey, topics);
            this._topics.set(subcategory.id, topics);
        } catch (e) {
            this._topics.set(subcategory.id, []);
        }
    };
}
