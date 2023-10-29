import {action, observable, when} from 'mobx';

import udApi from './ud-api';
import udMe from './ud-me';

// Currently this module only handles settings for the current (logged in) user.

// Values to set in the DB.
// Corresponds to values in udemy/user/constants/model.py
// Remember, JS objects treat all keys as string.
export const ON_NULL_MAP = {
    [true]: 'on',
    [false]: null,
};

export const TRUE_FALSE_MAP = {
    [true]: '1',
    [false]: '',
};

export const ON_OFF_MAP = {
    [true]: 'on',
    [false]: 'off',
};

// When fetching a value from udMe.settings, these values will correspond to true or false respectively.
const TRUE_VALUES = ['on', '1'];
const FALSE_VALUES = ['off', '', null];

export const SETTINGS = Object.freeze({
    captionEditorPauseWhenTyping: Object.freeze({
        settingCode: 'caption-editor-pause-when-typing',
        valueMap: ON_NULL_MAP,
        defaultValue: true,
    }),
    dismissOccupationCollectionBanner: Object.freeze({
        settingCode: 'dismissOccupationCollectionBanner',
        valueMap: ON_OFF_MAP,
        defaultValue: false,
    }),
    transcriptEditorPauseWhenTyping: Object.freeze({
        settingCode: 'transcript-editor-pause-when-typing',
        valueMap: ON_NULL_MAP,
        defaultValue: true,
    }),
    interstitialAutoplay: Object.freeze({
        settingCode: 'interstitialAutoNext',
        valueMap: ON_NULL_MAP,
        defaultValue: true,
    }),
    reviewPromptDisabled: Object.freeze({
        settingCode: 'review-prompt-disabled',
        valueMap: TRUE_FALSE_MAP,
        defaultValue: false,
    }),
    iaQAOnePaneMode: Object.freeze({
        settingCode: 'ia-qa-one-pane-mode',
        valueMap: ON_NULL_MAP,
        defaultValue: false,
    }),
    instructorCoursesOrdering: Object.freeze({
        settingCode: 'instructor-courses-ordering',
        defaultValue: '-created',
        isBoolean: false,
    }),
    directMessagingEnabled: Object.freeze({
        settingCode: 'direct_messaging_enabled',
        valueMap: ON_NULL_MAP,
        defaultValue: true,
    }),
    skippedOccupationFlow: Object.freeze({
        settingCode: 'skipped-occupation-flow',
        valueMap: TRUE_FALSE_MAP,
        defaultValue: false,
    }),
    mfaEnabled: Object.freeze({
        settingCode: 'mfa-enabled',
        valueMap: ON_OFF_MAP,
        defaultValue: true,
    }),
    exploredCareerTracks: Object.freeze({
        settingCode: 'exploredCareerTracks',
        valueMap: ON_OFF_MAP,
        defaultValue: false,
    }),
    exploredDataScientistCareerTracks: Object.freeze({
        settingCode: 'exploredDataScientistCareerTracks',
        valueMap: ON_OFF_MAP,
        defaultValue: false,
    }),
    seenOnboardingFlow: Object.freeze({
        settingCode: 'seenOnboardingFlow',
        valueMap: ON_OFF_MAP,
        defaultValue: false,
    }),
    seenSavedCourseAlertBanner: Object.freeze({
        settingCode: 'seenSavedCourseAlertBanner',
        valueMap: ON_OFF_MAP,
        defaultValue: false,
    }),
    seenSavedCoursePopover: Object.freeze({
        settingCode: 'seenSavedCoursePopover',
        valueMap: ON_OFF_MAP,
        defaultValue: false,
    }),
});

export const SETTINGS_BY_CODE = Object.freeze(
    Object.values(SETTINGS).reduce((acc, setting) => {
        acc[setting.settingCode] = setting;
        return acc;
    }, {}),
);

export class UserSettings {
    @observable.ref settings = {};

    @action
    initialize(settings) {
        this.settings = {...settings};
    }

    get(setting, defaultValueOverride = undefined) {
        const backendSettingValue = this.settings[setting.settingCode];
        if (setting.isBoolean === false) {
            return backendSettingValue;
        }

        if (backendSettingValue !== undefined) {
            if (TRUE_VALUES.includes(backendSettingValue)) {
                return true;
            }
            if (FALSE_VALUES.includes(backendSettingValue)) {
                return false;
            }
        }
        if (defaultValueOverride !== undefined) {
            return defaultValueOverride;
        }
        return setting.defaultValue;
    }

    set(setting, value, courseId = null) {
        let endPoint = '/users/me/settings/';
        if (courseId) {
            endPoint = `/users/me/course/${courseId}/settings/`;
        }
        if (setting.isBoolean !== false) {
            value = setting.valueMap[value];
        }
        return udApi
            .post(endPoint, {
                setting: setting.settingCode,
                value,
            })
            .then(() => {
                this.settings[setting.settingCode] = value;
            });
    }
}

const userSettings = new UserSettings();

when(
    () => !udMe.isLoading,
    () => {
        userSettings.initialize(udMe.settings);
    },
);

export default userSettings;
