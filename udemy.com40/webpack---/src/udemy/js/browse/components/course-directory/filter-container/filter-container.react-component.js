import {useMatchMedia} from '@udemy/hooks';
import {Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './filter-container.less';
import FilterDrawer from './filter-drawer.react-component';
import FilterPanel from './filter-panel.react-component';

const FilterContainer = ({
    aggregations,
    children,
    loading,
    pagination,
    sortOptions,
    backoffLanguages,
    queryLanguageInferenceTrackingId,
}) => {
    const isDesktop = useMatchMedia('lg-min');

    const props = {
        aggregations,
        pagination,
        sortOptions,
        backoffLanguages,
        queryLanguageInferenceTrackingId,
    };
    const loader = (
        <div className={classNames(styles['loading-overlay'], {[styles.show]: loading})}>
            <Loader size="xxlarge" />
        </div>
    );

    if (isDesktop) {
        return (
            <div data-purpose="desktop-filter-container">
                <FilterPanel {...props} loading={loading} defaultOpened={isDesktop}>
                    {loader}
                    {children}
                </FilterPanel>
            </div>
        );
    }
    return (
        <div data-purpose="mobile-filter-container" className={styles.container}>
            <FilterDrawer {...props} loading={loading} />
            {loader}
            {children}
        </div>
    );
};

FilterContainer.propTypes = {
    aggregations: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    sortOptions: PropTypes.object.isRequired,
    backoffLanguages: PropTypes.object,
    queryLanguageInferenceTrackingId: PropTypes.string,
    loading: PropTypes.bool.isRequired,
};

FilterContainer.defaultProps = {
    backoffLanguages: undefined,
    queryLanguageInferenceTrackingId: undefined,
};

export default FilterContainer;
