import {useFormatNumber, useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import CheckedStateCheckbox from 'base-components/checked-state/checked-state-checkbox.react-component';

import FilterForm from '../filter-form/filter-form.react-component';
import FilterButtonContainer from './filter-button-container.react-component';
import styles from './filter-panel.less';

// For desktop
const FilterPanel = ({
    aggregations,
    pagination,
    children,
    sortOptions,
    backoffLanguages,
    queryLanguageInferenceTrackingId,
    loading,
    defaultOpened,
}) => {
    const {formatNumber} = useFormatNumber();
    const {gettext, interpolate} = useI18n();
    return (
        <>
            <div className={classNames(styles.heading, {[styles.loading]: loading})}>
                <FilterButtonContainer
                    aggregations={aggregations}
                    sortOptions={sortOptions}
                    backoffLanguages={backoffLanguages}
                    queryLanguageInferenceTrackingId={queryLanguageInferenceTrackingId}
                />
                <span className={classNames('ud-heading-md', styles['item-count'])} role="status">
                    {interpolate(
                        gettext('%(numberCourses)s results'),
                        {
                            numberCourses: formatNumber(pagination.total_item_count),
                        },
                        true,
                    )}
                </span>
            </div>
            <div className={styles['filtered-paginated-course-list']}>
                <CheckedStateCheckbox
                    id="filter-button"
                    className={styles['desktop-sidebar-checkbox']}
                    defaultChecked={defaultOpened}
                />
                <div className={styles['filtered-course-list']}>
                    {aggregations && (
                        <div className={classNames(styles.sidebar, {[styles.loading]: loading})}>
                            <FilterForm
                                aggregations={aggregations}
                                sortOptions={sortOptions}
                                data-purpose="desktop-filter-container"
                            />
                        </div>
                    )}
                    <div className={styles['paginated-course-list']}>{children}</div>
                </div>
            </div>
        </>
    );
};

FilterPanel.propTypes = {
    aggregations: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    sortOptions: PropTypes.object.isRequired,
    backoffLanguages: PropTypes.object,
    queryLanguageInferenceTrackingId: PropTypes.string,
    loading: PropTypes.bool,
    defaultOpened: PropTypes.bool,
};

FilterPanel.defaultProps = {
    loading: false,
    backoffLanguages: undefined,
    queryLanguageInferenceTrackingId: undefined,
    defaultOpened: false,
};

export default FilterPanel;
