import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import classNames from 'classnames';
import {inject, PropTypes as MobxPropTypes, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import {useHistory} from 'react-router-dom';

import {CollectionTypeSwitchEvent} from 'browse/events';
import {CollectionTypes} from 'browse/lib/constants';
import {UI_REGION} from 'browse/ui-regions';

import styles from './course-directory.less';
import CourseList from './course-list/course-list.react-component';
import FilterContainer from './filter-container/filter-container.react-component';
import FilterFormContext from './filter-form-context';
import Pager from './pager/pager.react-component';

const CourseDirectory = inject('isConsumerSubsSubscriber')(
    ({
        aggregations,
        children,
        courses,
        pagination,
        sortOptions,
        backoffLanguages,
        queryLanguageInferenceTrackingId,
        loading,
        onPageChange,
        renderCourseCard,
        filterOrder,
        hiddenFilters,
        hideNumFiltersApplied,
        hiddenSortOptions,
        showCtaOnPopover,
        query,
        isConsumerSubsSubscriber,
        lowerFirstPopover,
    }) => {
        const containerRef = useRef(null);
        const {gettext} = useI18n();

        function handlePageChange() {
            onPageChange
                ? onPageChange()
                : containerRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
        const history = useHistory();
        const searchParams = new URLSearchParams(history.location.search);

        const showSwitchToPPCollectionLink =
            isConsumerSubsSubscriber && searchParams.get('subs_filter_type') === 'purchasable_only';

        const handleSubsOnlyFilter = (e) => {
            e.preventDefault();
            onCollectionTypeChange(
                query,
                pagination.total_item_count,
                CollectionTypes.MX,
                CollectionTypes.CONSUMERSUBSCRIPTION,
            );
            if (searchParams.get('homeOnSwitch')) {
                window.location.href = '/';
            } else {
                switchCollectionType('subs_only', history, searchParams);
            }
        };

        return (
            <FilterFormContext.Provider
                value={{filterOrder, hiddenFilters, hiddenSortOptions, hideNumFiltersApplied}}
            >
                <Provider uiRegion={UI_REGION.COURSE_DIRECTORY} query={query}>
                    <div ref={containerRef} className={styles.container}>
                        {showSwitchToPPCollectionLink && (
                            <Button
                                udStyle="link"
                                onClick={handleSubsOnlyFilter}
                                data-purpose="filter-subs-only"
                            >
                                {gettext('Go back to the Personal Plan collection')}
                            </Button>
                        )}
                        <FilterContainer
                            aggregations={aggregations}
                            pagination={pagination}
                            sortOptions={sortOptions}
                            backoffLanguages={backoffLanguages}
                            queryLanguageInferenceTrackingId={queryLanguageInferenceTrackingId}
                            loading={loading}
                        >
                            <CourseList
                                courses={courses}
                                renderCourseCard={renderCourseCard}
                                showCtaOnPopover={showCtaOnPopover}
                                lowerFirstPopover={lowerFirstPopover}
                            >
                                {children}
                            </CourseList>
                            {pagination.total_page === 1 && isConsumerSubsSubscriber && (
                                <CollectionTypeSwitchLink
                                    handleClick={onPageChange}
                                    query={query}
                                    count={pagination.total_item_count}
                                />
                            )}
                        </FilterContainer>
                        <Pager pageCount={pagination.total_page} onPageChange={handlePageChange} />
                        {pagination.total_page > 1 && isConsumerSubsSubscriber && (
                            <CollectionTypeSwitchLink
                                handleClick={onPageChange}
                                query={query}
                                count={pagination.total_item_count}
                            />
                        )}
                    </div>
                </Provider>
            </FilterFormContext.Provider>
        );
    },
);

CourseDirectory.propTypes = {
    aggregations: MobxPropTypes.arrayOrObservableArray.isRequired,
    courses: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortOptions: MobxPropTypes.objectOrObservableObject.isRequired,
    backoffLanguages: MobxPropTypes.objectOrObservableObject,
    queryLanguageInferenceTrackingId: PropTypes.string,
    pagination: PropTypes.shape({total_page: PropTypes.number.isRequired}).isRequired,
    loading: PropTypes.bool,
    onPageChange: PropTypes.func,
    renderCourseCard: PropTypes.func,
    filterOrder: PropTypes.array,
    hiddenFilters: PropTypes.array,
    hideNumFiltersApplied: PropTypes.bool,
    hiddenSortOptions: PropTypes.array,
    showCtaOnPopover: PropTypes.bool,
    lowerFirstPopover: PropTypes.bool,
    query: PropTypes.string,
};

CourseDirectory.defaultProps = {
    backoffLanguages: undefined,
    queryLanguageInferenceTrackingId: undefined,
    loading: false,
    onPageChange: undefined,
    renderCourseCard: undefined,
    filterOrder: undefined,
    hiddenFilters: undefined,
    hideNumFiltersApplied: false,
    hiddenSortOptions: undefined,
    showCtaOnPopover: false,
    lowerFirstPopover: false,
    query: 'No query defined',
};

export default CourseDirectory;

export function onCollectionTypeChange(query, count, fromType, toType) {
    Tracker.publishEvent(
        new CollectionTypeSwitchEvent({
            query,
            resultCount: count,
            fromCollectionType: fromType,
            toCollectionType: toType,
        }),
    );
}

export function switchCollectionType(toType, history, currentParams, homeOnSwitch = false) {
    const q = currentParams.get('q');
    const queryParams = new URLSearchParams({subs_filter_type: toType});
    if (q) {
        queryParams.set('q', q);
    }
    if (homeOnSwitch) {
        queryParams.set('homeOnSwitch', homeOnSwitch);
    }
    history.push({
        pathname: history.location.pathname,
        search: queryParams.toString(),
    });
}

const CollectionTypeSwitchLink = ({handleClick, query, count}) => {
    const history = useHistory();
    const {gettext} = useI18n();
    const searchParams = new URLSearchParams(history.location.search);
    if (searchParams.get('subs_filter_type') === 'purchasable_only') {
        return null;
    }
    const handlePurchaseOnly = (e) => {
        e.preventDefault();
        switchCollectionType('purchasable_only', history, searchParams);
        onCollectionTypeChange(
            query,
            count,
            CollectionTypes.CONSUMERSUBSCRIPTION,
            CollectionTypes.MX,
        );
        handleClick();
    };
    return (
        <div className={styles['pp-tooltip-wrapper']} data-purpose="pp-tooltip-wrapper">
            <div className={styles['pp-tooltip-container']}>
                <Tooltip
                    placement="top-end"
                    trigger={
                        <div className={classNames('ud-text-md', styles['pp-tooltip'])}>
                            {gettext('Can’t find what you’re looking for?')}
                            <InfoIcon
                                label={false}
                                size="small"
                                className={styles['tooltip-icon']}
                            />
                        </div>
                    }
                >
                    {gettext(
                        'Personal Plan is a curated collection of 5,000+ courses on in-demand professional topics, ' +
                            'plus a selection of personal development courses.' +
                            ' You can explore and purchase courses outside of your subscription.',
                    )}
                </Tooltip>
                <Button udStyle="link" onClick={handlePurchaseOnly} data-purpose="filter-mx-only">
                    {gettext('Search outside your subscription')}
                </Button>
            </div>
        </div>
    );
};
CollectionTypeSwitchLink.propTypes = {
    handleClick: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
};
