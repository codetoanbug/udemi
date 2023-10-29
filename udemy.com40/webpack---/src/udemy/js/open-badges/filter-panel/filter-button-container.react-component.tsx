import {inject, observer} from 'mobx-react';
import React from 'react';

import {useMatchMedia} from 'base-components/responsive/match-media.react-component';

import {CertificationStore} from '../certification.mobx-store';
import {ClearFiltersButton} from './clear-filters-button.react-component';
import {FilterButton} from './filter-button.react-component';
import styles from './filters.less';

function FilterButtonContainerComponent() {
    const isLgMin = useMatchMedia('md-min');
    const clearFiltersButton = <ClearFiltersButton />;
    return (
        <>
            <div className={styles['filters-button-row']}>
                <FilterButton />
                {isLgMin && clearFiltersButton}
            </div>
        </>
    );
}

FilterButtonContainerComponent.defaultProps = {
    certificationStore: CertificationStore,
};
export const FilterButtonContainer = inject('certificationStore')(
    observer(FilterButtonContainerComponent),
);
