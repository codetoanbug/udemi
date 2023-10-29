import React from 'react';

import {CertificationsFilteredList} from './certifications-filtered-list.react-component';
import {CertificationsSearch} from './certifications-search.react-component';
import {FilterButtonContainer} from './filter-panel/filter-button-container.react-component';

export const CertificationListPage = () => {
    return (
        <>
            <CertificationsSearch />
            <FilterButtonContainer />
            <CertificationsFilteredList />
        </>
    );
};
