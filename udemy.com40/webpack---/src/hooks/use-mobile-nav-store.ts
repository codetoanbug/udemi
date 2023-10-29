import React from 'react';

import {HeaderContext} from '../contexts/header-context';

export function useMobileNavStore() {
    const context = React.useContext(HeaderContext);
    if (!context?.mobileNavStore) {
        throw new Error('mobileNavStore is not set in HeaderContext');
    }

    return context.mobileNavStore;
}
