import React from 'react';

const FilterFormContext = React.createContext({
    filterOrder: [],
    hiddenFilters: [],
    hiddenSortOptions: [],
    hideNumFiltersApplied: false,
});

export default FilterFormContext;
