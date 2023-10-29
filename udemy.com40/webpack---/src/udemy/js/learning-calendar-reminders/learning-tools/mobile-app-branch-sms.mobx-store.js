import {action, observable} from 'mobx';

import BranchMetrics from 'utils/branch-metrics/branch-metrics';
import {noop} from 'utils/noop';

import {COUNTRY_CODES, DEFAULT_COUNTRY_CODE} from './constants';

export default class MobileAppBranchSmsStore {
    @observable selectedCountry = DEFAULT_COUNTRY_CODE;
    @observable phoneNumber = '';
    @observable isSendingText = false;
    @observable isSendingTextSuccessful = false;

    /**
     * @param {string|null} deeplinkPath
     * @param {function} onSendCallback
     */
    constructor(deeplinkPath = null, onSendCallback = noop) {
        this.onSendCallback = onSendCallback;
        this.deeplinkPath = deeplinkPath;
    }

    @action
    updateSelectedCountry(countryName) {
        this.selectedCountry = COUNTRY_CODES.find((data) => {
            return data.name === countryName;
        });
    }

    @action
    updatePhoneNumber(number) {
        this.phoneNumber = number;
    }

    @action
    textApp() {
        if (this.isSendingText) {
            return;
        }
        this.isSendingText = true;
        const data = {
            phone: `${(this.selectedCountry.Iso + this.phoneNumber).replace(/\D+/g, '')}`,
            linkData: {
                channel: 'sms',
                feature: 'marketplace_cart_success_text_me_the_app',
            },
        };
        if (this.deeplinkPath) {
            data.linkData.data = {deeplink_path: this.deeplinkPath};
        }
        BranchMetrics.sendSMS(data)
            .then(
                action(() => {
                    this.isSendingTextSuccessful = true;
                }),
            )
            .finally(
                action(() => {
                    this.isSendingText = false;
                    this.onSendCallback();
                }),
            );
    }
}
