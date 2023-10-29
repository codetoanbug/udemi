import React from 'react';

import {HeaderContext} from '../contexts/header-context';

export function useBrowseNavStore() {
    const context = React.useContext(HeaderContext);
    if (!context?.browseNavStore) {
        throw new Error('browseNavStore is not set in HeaderContext');
    }

    return context.browseNavStore;
}
