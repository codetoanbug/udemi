import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {SideDrawer} from '@udemy/react-dialog-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import FilterForm from '../filter-form/filter-form.react-component';
import FilterButtonContainer, {ClearFiltersButton} from './filter-button-container.react-component';
import styles from './filter-drawer.less';

// for mobile
const FilterDrawer = ({
    aggregations,
    pagination,
    sortOptions,
    backoffLanguages,
    queryLanguageInferenceTrackingId,
    loading,
}) => {
    const filterId = 'filter-button';
    const {gettext, ninterpolate} = useI18n();
    return (
        <div className={styles.container}>
            {aggregations && (
                <SideDrawer
                    id={filterId}
                    side="right"
                    mainDrawerId={`${filterId}--main`}
                    className={classNames(styles['filter-panel-container-content'], {
                        [styles.loading]: loading,
                    })}
                    title={gettext('Filter courses')}
                >
                    <div
                        className={classNames(
                            styles['filter-panel-sticky-bar'],
                            styles['filter-panel-sticky-bar-top'],
                        )}
                    >
                        <div className={styles['filter-panel-top-inner']}>
                            <span className={styles['filter-results']}>
                                {ninterpolate(
                                    '%s result',
                                    '%s results',
                                    pagination ? pagination.total_item_count : 0,
                                )}
                            </span>
                            <ClearFiltersButton aggregations={aggregations} />
                        </div>
                    </div>
                    <div className={styles['filter-panel']}>
                        <FilterForm
                            aggregations={aggregations}
                            sortOptions={sortOptions}
                            backoffLanguages={backoffLanguages}
                            data-purpose="mobile-filter-container"
                        />
                    </div>
                    <div
                        className={classNames(
                            styles['filter-panel-sticky-bar'],
                            styles['filter-panel-sticky-bar-bottom'],
                        )}
                    >
                        <Button
                            udStyle="primary"
                            cssToggleId={filterId}
                            data-purpose="confirm-filters"
                            style={{width: '100%'}}
                        >
                            {gettext('Done')}
                        </Button>
                    </div>
                </SideDrawer>
            )}
            <FilterButtonContainer
                aggregations={aggregations}
                sortOptions={sortOptions}
                backoffLanguages={backoffLanguages}
                queryLanguageInferenceTrackingId={queryLanguageInferenceTrackingId}
            />
        </div>
    );
};

FilterDrawer.propTypes = {
    aggregations: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    sortOptions: PropTypes.object.isRequired,
    backoffLanguages: PropTypes.object,
    queryLanguageInferenceTrackingId: PropTypes.string,
    className: PropTypes.string,
    loading: PropTypes.bool,
};

FilterDrawer.defaultProps = {
    className: undefined,
    loading: false,
    backoffLanguages: undefined,
    queryLanguageInferenceTrackingId: undefined,
};

export default FilterDrawer;
