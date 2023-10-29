import React from 'react';

import {HeaderContext} from '../contexts/header-context';

export function useMyLearningStore() {
    const context = React.useContext(HeaderContext);
    if (!context?.myLearningStore) {
        throw new Error('myLearningStore is not set in HeaderContext');
    }

    return context.myLearningStore;
}
