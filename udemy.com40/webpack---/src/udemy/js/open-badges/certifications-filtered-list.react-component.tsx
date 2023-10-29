import {withMatchMedia} from '@udemy/hooks';
import {inject, observer} from 'mobx-react';
import React from 'react';

import CheckedStateCheckbox from '../base-components/checked-state/checked-state-checkbox.react-component';
import {CertificationStore} from './certification.mobx-store';
import {CertificationsList} from './certifications-list.react-component';
import styles from './certifications-page.less';
import {FilterPanelProps} from './common/types';
import {CertificationFilters} from './filter-panel/certification-filters.react-component';
import {Pager} from './filter-panel/pager.react-component';

// better name for this ???
interface MobileProps {
    isMobile: boolean;
}

@inject('certificationStore')
@withMatchMedia({isMobile: 'mobile-max'})
@observer
export class CertificationsFilteredList extends React.Component<FilterPanelProps & MobileProps> {
    static defaultProps = {
        certificationStore: CertificationStore,
        isMobile: false,
    };

    handlePageChange = (activePage: number) => {
        // We have 0 based indexing in the query
        this.props.certificationStore.performSearch(activePage - 1);
    };

    render() {
        const {currentPage, pageCount} = this.props.certificationStore;
        const checkedStateBox = (
            <CheckedStateCheckbox
                id="filter-button"
                className={styles['desktop-sidebar-checkbox']}
                defaultChecked={true}
            />
        );

        return (
            <>
                <div className={styles['filtered-list-container']}>
                    {/* Look for better ways to achieve this later */}
                    {!this.props.isMobile && checkedStateBox}
                    <div className={styles['filtered-certifications-list']}>
                        <CertificationFilters />
                        <CertificationsList />
                    </div>
                </div>
                <div className={styles.pager}>
                    <Pager
                        /* We have 0 based indexing here */
                        activePage={(currentPage ?? 0) + 1}
                        pageCount={pageCount ?? 0}
                        onPageChange={this.handlePageChange}
                    />
                </div>
            </>
        );
    }
}
