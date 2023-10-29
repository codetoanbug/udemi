import {action, decorate, observable} from 'mobx';

import {ActivityNotificationsStore} from './activity-notifications.mobx-store';

// This is used to share the same ActivityNotificationsStore between the
// notification dropdown in the header and the activity-notifications app.
// We want them to update in sync when the user makes a change, e.g. marks a notification as read.
const globalState: {
    store: ActivityNotificationsStore | null;
} = {
    store: null,
};

decorate(globalState, {
    store: observable.ref,
});

export const setGlobalActivityNotificationsStore = action(
    (store: ActivityNotificationsStore | null) => {
        globalState.store = store;
    },
);

export const getGlobalActivityNotificationsStore = () => globalState.store;
