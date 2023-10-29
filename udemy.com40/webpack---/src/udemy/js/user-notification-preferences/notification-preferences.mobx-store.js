import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import getConfigData from 'utils/get-config-data';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {SETTINGS, SETTING_VALUES} from './constants';

const udConfig = getConfigData();

export default class NotificationPreferencesStore {
    @observable isLoadingInitialData = true;
    @observable isLoading = true;
    @observable isInstructor = false;
    @observable
    emailPreferences = {
        disabledForInstructors: false,
        forStudents: false,
        instructorAnnouncements: false,
        forInstructors: false,
        disableAll: false,
    };

    constructor(showOrganization) {
        this.userId = udMe.id;
        this.hasOrganizationNotifications = showOrganization && udConfig.brand.has_organization;
        this.organizationId = udConfig.brand.organization.id || -1;
    }

    fetchInitialData() {
        return udApi
            .get('/users/me/', {
                params: {
                    'fields[user]': 'is_user_instructor',
                },
            })
            .then(
                action((response) => {
                    this.isInstructor = response.data.is_user_instructor;
                    this.isLoadingInitialData = false;
                }),
            );
    }

    @computed
    get formIsEmpty() {
        return Object.values(this.emailPreferences).indexOf(true) == -1;
    }

    @action
    getSettings() {
        return udApi.get('/users/me/notification-preferences/').then((response) => {
            this._onGetSettingsSuccess(response.data.results);
        });
    }

    @action
    _onGetSettingsSuccess(settings) {
        const disableAllSetting = settings.filter((obj) => obj.setting == SETTINGS.DISABLE_ALL)[0],
            disableAll = Boolean(disableAllSetting && disableAllSetting.value == SETTING_VALUES.ON),
            settingFilter = (userSetting) => {
                if (disableAll) {
                    return false;
                }

                const setting = settings.filter((obj) => obj.setting == userSetting);
                if (setting.length) {
                    return setting[0].value;
                }
                return null;
            };

        const settingFilterResultForStudentsAndForInstructors = settingFilter(
            this.hasOrganizationNotifications ? SETTINGS.UFB_PROMOTIONAL : SETTINGS.PROMOTIONAL,
        );
        const settingFilterResultInstructorAnnouncements = settingFilter(
            SETTINGS.INSTRUCTOR_ANNOUNCEMENT,
        );
        this.emailPreferences = {
            disabledForInstructors: false,
            forStudents:
                settingFilterResultForStudentsAndForInstructors === null
                    ? true
                    : settingFilterResultForStudentsAndForInstructors === SETTING_VALUES.ON,
            instructorAnnouncements:
                settingFilterResultInstructorAnnouncements === null &&
                this.hasOrganizationNotifications
                    ? udConfig.brand.organization.is_instructor_announcements_enabled
                    : settingFilterResultInstructorAnnouncements === null
                    ? true
                    : settingFilterResultInstructorAnnouncements === SETTING_VALUES.ON,
            forInstructors:
                settingFilterResultForStudentsAndForInstructors === null
                    ? true
                    : settingFilterResultForStudentsAndForInstructors === SETTING_VALUES.ON,
            disableAll,
        };

        this._setLoading(false);
    }

    @autobind
    @action
    setSetting(key, value) {
        if (key == 'disableAll') {
            this.emailPreferences.disableAll = value;
            this.emailPreferences.forStudents = value ? !value : this.emailPreferences.forStudents;
            this.emailPreferences.instructorAnnouncements = value
                ? !value
                : this.emailPreferences.instructorAnnouncements;
            this.emailPreferences.forInstructors = value
                ? !value
                : this.emailPreferences.forInstructors;
        } else if (key == 'instructorAnnouncements') {
            this.emailPreferences.instructorAnnouncements = value;
            this.emailPreferences.disableAll = false;
        } else {
            this.emailPreferences.forStudents = value;
            this.emailPreferences.forInstructors = value;
            this.emailPreferences.disableAll = false;
        }
    }

    @autobind
    @action
    saveMarketingOptInPreferences() {
        this._setLoading(true);
        return udApi
            .post(`/organizations/${this.organizationId}/users/me/marketing-opt-in/`, {
                marketing_opt_in:
                    this.emailPreferences.forStudents || this.emailPreferences.forInstructors,
                marketing_source: 'app-preferences',
            })
            .then(() => {
                this._setLoading(false);
            });
    }

    @autobind
    @action
    savePreferences() {
        this._setLoading(true);
        let data;

        if (this.hasOrganizationNotifications) {
            data = [
                {
                    setting: SETTINGS.INSTRUCTOR_ANNOUNCEMENT,
                    value: this.emailPreferences.instructorAnnouncements
                        ? SETTING_VALUES.ON
                        : SETTING_VALUES.OFF,
                },
            ];
        } else {
            data = [
                {
                    setting: SETTINGS.PROMOTIONAL,
                    value:
                        this.emailPreferences.forStudents || this.emailPreferences.forInstructors
                            ? SETTING_VALUES.ON
                            : SETTING_VALUES.OFF,
                },
                {
                    setting: SETTINGS.INSTRUCTOR_ANNOUNCEMENT,
                    value: this.emailPreferences.instructorAnnouncements
                        ? SETTING_VALUES.ON
                        : SETTING_VALUES.OFF,
                },
                {
                    setting: SETTINGS.DISABLE_ALL,
                    value: this.emailPreferences.disableAll
                        ? SETTING_VALUES.ON
                        : SETTING_VALUES.OFF,
                },
            ];
        }

        if (!data && this.hasOrganizationNotifications) {
            return this.saveMarketingOptInPreferences();
        }

        return udApi
            .post('/users/me/notification-preferences/', data)
            .then(() => {
                this._setLoading(false);
                showSuccessToast(gettext('Your changes have been successfully saved.'));

                if (this.hasOrganizationNotifications) {
                    this.saveMarketingOptInPreferences();
                }
            })
            .catch(this._onError);
    }

    @action
    _setLoading(value) {
        this.isLoading = value;
    }

    @action
    _onError() {
        showReloadPageErrorToast(defaultErrorMessage);
        this.emailPreferences = {
            disabledForInstructors: false,
            forStudents: false,
            instructorAnnouncements: false,
            forInstructors: false,
            disableAll: false,
        };
    }
}
