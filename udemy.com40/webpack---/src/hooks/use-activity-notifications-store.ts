import React from 'react';

import {HeaderContext} from '../contexts/header-context';

export function useActivityNotificationsStore() {
    const context = React.useContext(HeaderContext);
    if (!context?.activityNotificationsStore) {
        throw new Error('activitiyNotificationsStore is not set in HeaderContext');
    }

    return context.activityNotificationsStore;
}
