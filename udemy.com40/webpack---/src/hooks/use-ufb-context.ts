import React from 'react';

import {HeaderContext} from '../contexts/header-context';

export function useUfbContext() {
    const context = React.useContext(HeaderContext);
    // if (!context?.ufbContext) {
    //     throw new Error('ufbContext is not set in HeaderContext');
    // }
    if (!context) {
        throw new Error('HeaderContext is not set');
    }

    return context.ufbContext;
}
