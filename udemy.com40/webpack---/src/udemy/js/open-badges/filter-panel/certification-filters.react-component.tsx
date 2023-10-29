import {useMatchMedia} from '@udemy/hooks';
import React from 'react';

import styles from '../certifications-page.less';
import {FilterDrawer} from './filter-drawer.react-component';
import {FilterPanel} from './filter-panel.react-component';

export const CertificationFilters = () => {
    const isMobile = useMatchMedia('mobile-max');

    if (isMobile) {
        return <FilterDrawer />;
    }
    return (
        <div className={styles.sidebar}>
            <FilterPanel />
        </div>
    );
};
