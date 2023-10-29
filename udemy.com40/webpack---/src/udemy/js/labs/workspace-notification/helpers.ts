import udExpiringLocalStorage from 'utils/ud-expiring-local-storage';

import {LOCAL_STORAGE, NOTIFICATION_STORAGE_KEY, PERMISSION_STATUS} from './constants';
import LabIconImage from './lab-icon.png';

export async function sendNotification(labTitle: string) {
    if (!checkHasLocalPermissionEnabled()) {
        return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === PERMISSION_STATUS.GRANTED) {
        return new Notification(gettext('Your workspace is ready'), {
            body: interpolate(gettext('Get started with %(labTitle)s'), {labTitle}, true),
            icon: LabIconImage,
        });
    }
}

export function localStorage() {
    return udExpiringLocalStorage(LOCAL_STORAGE.NAMESPACE, LOCAL_STORAGE.NAME);
}

export function checkHasLocalPermissionEnabled() {
    return localStorage()?.get(NOTIFICATION_STORAGE_KEY || undefined);
}

export function setLocalStorageHasPermission(value: boolean) {
    localStorage()?.set(NOTIFICATION_STORAGE_KEY, value);
}
