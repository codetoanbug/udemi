import {observable, action} from 'mobx';

import {LinksProps} from '../links/links.react-component';
import {UfbNoticeProps} from '../ufb-notice/constants';

export interface UserData {
    has_instructor_intent: boolean;
}

export interface FooterServerData {
    currentLocaleId: string;
    linkColumns: LinksProps['linkColumns'];
    isJpFooter: boolean;
    ufbNotice: UfbNoticeProps;
    hideFooterUntilContentReady?: boolean;
}

export interface FooterClientData {
    user: UserData | null;
}

export type FooterData = FooterServerData & FooterClientData;

export class FooterStore {
    constructor(serverData: FooterServerData, clientData?: FooterClientData) {
        this.updateServerData(serverData);
        if (clientData) {
            this.updateClientData(clientData);
        }
    }

    // Server data
    @observable hideFooterUntilContentReady = false;
    @observable currentLocaleId = 'en_US';
    @observable isJpFooter = false;
    @observable.ref linkColumns: LinksProps['linkColumns'] = [];
    @observable.ref ufbNotice: UfbNoticeProps = {
        link: undefined,
        placement: undefined,
        isOnsiteRequestDemo: false,
    };

    // Client data
    @observable.ref user: UserData | null = null;

    @action
    updateServerData(data: FooterServerData) {
        this.currentLocaleId = data.currentLocaleId;
        this.linkColumns = data.linkColumns;
        this.isJpFooter = data.isJpFooter;
        this.ufbNotice = data.ufbNotice;
        this.hideFooterUntilContentReady = data?.hideFooterUntilContentReady ?? false;
    }

    @action
    updateClientData(data: FooterClientData) {
        this.user = data.user;
    }
}
