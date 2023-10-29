import {SideDrawer} from '@udemy/react-dialog-components';
import classNames from 'classnames';
import React from 'react';

import {ClearFiltersButton} from './clear-filters-button.react-component';
import {FilterPanel} from './filter-panel.react-component';
import styles from './filters.less';

export const FilterDrawer = () => {
    return (
        <div className={styles['side-drawer']}>
            <SideDrawer
                side="right"
                id={'filter-button'}
                mainDrawerId={'filter-button-main'}
                title={gettext('Filter certifications')}
            >
                <div
                    className={classNames(
                        styles['filter-panel-sticky-bar'],
                        styles['filter-panel-sticky-bar-top'],
                    )}
                >
                    <div className={styles['filter-panel-top-inner']}>
                        <ClearFiltersButton />
                    </div>
                </div>
                <FilterPanel />
            </SideDrawer>
        </div>
    );
};
