import {action, observable, runInAction, computed} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import getConfigData from 'utils/get-config-data';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

const udConfig = getConfigData();

export default class SecurityStore {
    @observable hasPassword = false;
    @observable isLoaded = false;
    @observable isSCIMManaged = false;

    @action
    async fetchInitialData() {
        try {
            const response = await udApi.get('/users/me/', {
                params: {
                    'fields[user]': 'has_usable_password,is_scim_managed',
                },
            });
            runInAction(() => {
                this.hasPassword = response.data.has_usable_password;
                this.isLoaded = true;
                this.isSCIMManaged = response.data.is_scim_managed;
            });
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    @computed
    get isChangingProfileDisabled() {
        return (
            this.isSCIMManaged ||
            (udConfig.brand.has_organization && !udConfig.brand.is_profile_functions_enabled)
        );
    }

    get isChangingPasswordDisabled() {
        return udConfig.brand.has_organization && udConfig.brand.organization.is_forced_sso;
    }
}
