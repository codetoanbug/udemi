import React from 'react';

import {HeaderContext} from '../contexts/header-context';

export function useHeaderStore() {
    const context = React.useContext(HeaderContext);
    if (!context?.headerStore) {
        throw new Error('headerStore is not set in HeaderContext');
    }

    return context.headerStore;
}
