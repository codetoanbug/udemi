import {action, extendObservable} from 'mobx';

import {switchCollectionType} from 'browse/components/course-directory/course-directory.react-component';
import {DiscoveryItemImpressionEvent} from 'browse/events';
import DiscoveryAPI from 'browse/lib/backends/discovery-api';
import {attachFrontendTrackingIds} from 'browse/tracking';

export default class DiscoveryListContainerStore {
    constructor({unit = null, pageType, pageObjectId, history, gettext}, globalOverrides = {}) {
        extendObservable(this, {
            unit,
            loading: true,
            error: null,
        });
        if (unit) {
            attachFrontendTrackingIds(this.unit.items);
        }
        this.pageType = pageType;
        this.pageObjectId = Number(pageObjectId);
        this.history = history;
        this.gettext = gettext;
        this.discoveryAPI = new DiscoveryAPI({}, globalOverrides);
    }

    backendSource = DiscoveryItemImpressionEvent.backendSourceOptions.DISCOVERY_ALL_COURSES;

    @action
    async fetchUnit(options = {}) {
        this.options = options;
        const {selectedFilters, selectedTopicIds, sortBy, ...passthroughOptions} = options;
        const topicFilter =
            selectedTopicIds && selectedTopicIds.length
                ? {courseLabel: selectedTopicIds.join('|')}
                : {};
        const filterOptions = {
            ...Object.keys(selectedFilters || {}).reduce(
                (prev, key) => ({...prev, [key]: selectedFilters[key].join('|')}),
                {},
            ),
            ...topicFilter,
            sort: sortBy,
        };

        try {
            this.loading = true;
            const unit = await this.discoveryAPI.loadCourses(this.pageType, {
                pageObjectId: this.pageObjectId,
                ...passthroughOptions,
                ...filterOptions,
            });

            let {aggregations, course_labels: topics = [], ...unitWithoutAggregations} = unit;

            if (topics && topics.length) {
                aggregations = [
                    {
                        title: this.gettext('Topic'),
                        allTitle: this.gettext('All Topics'),
                        key: 'course_label',
                        options: topics.map(
                            ({
                                doc_count: count,
                                _class: key = 'course_label',
                                title,
                                id: value,
                            }) => ({
                                count,
                                key,
                                title,
                                value: String(value),
                                selected: selectedTopicIds.includes(String(value)),
                            }),
                        ),
                    },
                    ...aggregations,
                ];
            }

            this.receiveUnit({
                ...unitWithoutAggregations,
                aggregations,
            });
        } catch (e) {
            this.receiveError(e);
        }
    }

    @action
    receiveUnit(unit) {
        this.loading = false;
        if (
            unit.items.length === 0 &&
            this.options &&
            this.options.selectedFilters &&
            this.options.selectedFilters.subs_filter_type.includes('subs_only')
        ) {
            this.loading = true;
            switchCollectionType(
                'purchasable_only',
                this.history,
                new URLSearchParams(this.history.location.search),
                true,
            );
        }
        this.unit = unit;
        attachFrontendTrackingIds(this.unit.items);
    }

    @action
    receiveError(error) {
        this.loading = false;
        this.error = error;
    }
}
