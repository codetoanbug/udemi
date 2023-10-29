import {AxiosResponse} from 'axios';
import {action, observable} from 'mobx';

import SystemMessage from 'utils/ud-system-message';

export class ContentOpportunitiesStore {
    @observable
    showLocalizationWarningBanner = true;

    constructor() {
        SystemMessage.hasSeen(SystemMessage.ids.supplyGapsLocalizationWarningMessage).then(
            action((response: AxiosResponse<boolean>) => {
                this.showLocalizationWarningBanner = !response.data;
            }),
        );
    }

    @action
    hideLocalizationWarningBanner() {
        SystemMessage.seen(SystemMessage.ids.supplyGapsLocalizationWarningMessage);
        this.showLocalizationWarningBanner = false;
    }
}
