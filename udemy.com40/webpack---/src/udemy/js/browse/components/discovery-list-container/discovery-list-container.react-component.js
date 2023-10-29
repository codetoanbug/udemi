import {pageTypes} from '@udemy/discovery-api';
import {TrackingContextProvider} from '@udemy/event-tracking';
import {FunnelLogContextProvider} from '@udemy/funnel-tracking';
import {withI18n} from '@udemy/i18n';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import {withUDData} from '@udemy/ud-data';
import {action, computed, observable, toJS, when} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import CourseCard from 'base-components/course-card/course-card.react-component';
import CourseDirectory from 'browse/components/course-directory/course-directory.react-component';
import {discoveryTracker} from 'browse/tracking';

import styles from './discovery-list-container.less';
import DiscoveryListContainerStore from './discovery-list-container.mobx-store';

@withRouter
@inject(({isConsumerSubsSubscriber}) => ({isConsumerSubsSubscriber}))
@observer
export class InternalDiscoveryListContainer extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        pageObjectId: PropTypes.number.isRequired,
        pageType: PropTypes.oneOf(pageTypes).isRequired,
        pageSize: PropTypes.number,
        unit: PropTypes.object,
        renderList: PropTypes.func,
        presetFilters: PropTypes.object,
        courseCardSize: CourseCard.propTypes.size,
        onPageChange: PropTypes.func,
        filterOrder: PropTypes.array,
        courseDirectoryProps: PropTypes.object,
        subsCollectionIds: PropTypes.string,
        query: PropTypes.string,
        isConsumerSubsSubscriber: PropTypes.bool,
        onAutoScroll: PropTypes.func,
        gettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        pageSize: 12,
        unit: undefined,
        renderList: undefined,
        presetFilters: undefined,
        courseCardSize: CourseCard.defaultProps.size,
        onPageChange: undefined,
        filterOrder: ['ratings', 'duration'],
        courseDirectoryProps: {},
        subsCollectionIds: undefined,
        query: undefined,
        isConsumerSubsSubscriber: false,
        onAutoScroll: undefined,
    };

    constructor(props) {
        super(props);
        const {location, pageObjectId, pageType, unit, history} = this.props;
        this.location = location;
        this.store = new DiscoveryListContainerStore(
            {
                pageObjectId,
                pageType,
                unit,
                history,
                gettext,
            },
            props.udData,
        );
    }

    async componentDidMount() {
        this.unlisten = this.props.history.listen(this.handleHistoryChange);
        if (!this.props.unit) {
            this.fetchData();
        }

        await when(() => !this.store.loading);
        this.props.onAutoScroll?.();
    }

    componentWillUnmount() {
        this.unlisten && this.unlisten();
    }

    @observable.ref location;

    @computed get searchParams() {
        return new URLSearchParams(this.location.search);
    }

    fetchData = () => {
        // For some reason, on initial render only, this.searchParams is re-evaluated every
        // time it's referenced in this method. Work around this by saving it to a local variable.
        const params = this.searchParams;
        if (this.props.isConsumerSubsSubscriber && !params.get('subs_filter_type')) {
            // not using DiscoveryListContainer's presetFilters property to set
            // this filter as this can be further updated by user actions. Preset filter will override any
            // filter property set by user action.
            params.set('subs_filter_type', 'subs_only');
        }
        this.store.fetchUnit({
            p: params.get('p'),
            pageSize: this.props.pageSize,
            selectedTopicIds: params.getAll('course_label'),
            selectedFilters: {
                subcategory: params.getAll('subcategory'),
                instructional_level: params.getAll('instructional_level'),
                lang: params.getAll('lang'),
                price: params.getAll('price'),
                duration: params.getAll('duration'),
                closed_captions: params.getAll('closed_captions'),
                subs_filter_type: params.getAll('subs_filter_type'),
                ...this.props.presetFilters,
            },
            has_closed_caption: params.get('has_closed_caption'),
            has_simple_quiz: params.get('has_simple_quiz'),
            has_coding_exercises: params.get('has_coding_exercises'),
            has_workspace: params.get('has_workspace'),
            has_practice_test: params.get('has_practice_test'),
            ratings: params.get('ratings'),
            sortBy: params.get('sort'),
            subs_coll_id: this.props.subsCollectionIds,
        });
    };

    @action
    handleHistoryChange = (location) => {
        this.location = location;
        this.fetchData();
    };

    refreshPage = () => {
        window.location.reload();
    };

    render() {
        if (this.store.unit === null && this.store.loading) {
            return <Loader size="medium" block={true} className={styles['loader-spacing']} />;
        }

        if (this.store.error) {
            return (
                <AlertBanner
                    title={gettext('There was a problem loading course recommendations')}
                    body={gettext('Please reload the page to resolve this issue')}
                    ctaText={pgettext('e.g. Refresh a webpage', 'Reload Page')}
                    onAction={this.refreshPage}
                    udStyle="warning"
                />
            );
        }

        const {onPageChange, filterOrder, query, courseDirectoryProps, udData} = this.props;
        const {Config} = udData;

        const {aggregations, items: courses, pagination, sort_options: sortOptions} = toJS(
            this.store.unit,
        );
        if (this.props.subsCollectionIds) {
            filterOrder.unshift('subs_filter_type');
        }

        const props = {
            aggregations,
            courses,
            pagination,
            sortOptions,
            loading: toJS(this.store.loading),
            onPageChange,
            filterOrder,
            showCtaOnPopover: !Config.brand.has_organization,
            query,
            ...courseDirectoryProps,
        };

        if (!pagination && courses.length === 0) {
            return null;
        }

        return (
            <FunnelLogContextProvider pageType={this.props.pageType}>
                <TrackingContextProvider
                    trackingContext={{
                        trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                        backendSource: this.store.backendSource,
                    }}
                >
                    <Provider
                        isConsumerSubsSubscriber={this.props.isConsumerSubsSubscriber}
                        discoveryListStore={this.store}
                    >
                        <CourseDirectory {...props}>{this.props.children}</CourseDirectory>
                    </Provider>
                </TrackingContextProvider>
            </FunnelLogContextProvider>
        );
    }
}

export default withI18n(withUDData(InternalDiscoveryListContainer));
