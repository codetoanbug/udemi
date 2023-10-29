
import {action, observable} from 'mobx';

import udExpiringLocalStorage from 'udemy-django-static/js/utils/ud-expiring-local-storage';

const POPOVER_EXPIRATION_DATE = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

export class SaveToListPopoverStore {
    constructor(private readonly popoverName: string) {
        this.storage = udExpiringLocalStorage(
            'saveToListButton',
            popoverName,
            POPOVER_EXPIRATION_DATE,
        );
        this.isPopoverOpen = !this.storage.get('dismissed');
    }

    private storage;
    @observable isPopoverOpen;

    @action
    onDismissPopover = () => {
        this.isPopoverOpen = false;
        this.storage.set('dismissed', true);
    }
}
