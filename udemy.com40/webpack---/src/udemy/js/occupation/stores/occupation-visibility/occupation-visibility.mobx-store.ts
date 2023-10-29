import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {OCCUPATION_EXPLORER_URL} from 'occupation/constants';

export class OccupationVisibilityStore {
    modalURL: string;

    constructor(nextUrl?: string) {
        this.modalURL = `${OCCUPATION_EXPLORER_URL}?isAjaxModal${
            nextUrl ? `&next=${encodeURIComponent(nextUrl)}` : ''
        }`;
    }

    @observable isModalOpen = false;

    @action
    openModal() {
        this.isModalOpen = true;
    }

    @autobind
    @action
    closeModal() {
        this.isModalOpen = false;
    }
}
