import {Tracker} from '@udemy/event-tracking';
import {udApi} from '@udemy/ud-api';
import {AxiosResponse} from 'axios';
import {action, observable} from 'mobx';

import {WEB_DEVELOPER_UNIT_TITLE, DATA_SCIENTIST_UNIT_TITLE} from 'occupation/constants';
import {CareerTrackPageLinkAddEvent} from 'occupation/events';
import userSettings, {SETTINGS} from 'utils/user-settings';

// TODO: get rid of these interfaces once userSettings is converted to TS
interface UserSetting {
    settingCode: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    valueMap: {}; // NOTE: this is expected to conform to the ValueMap interface definition
    defaultValue: boolean;
}

interface UserSettingResponse {
    id: number;
    setting: string;
    value: string | null;
}

interface ValueMap {
    true: string;
    false: string;
}

export class LearningMapStore {
    constructor() {
        this.getUserExploredWebDeveloperCareerTrack();
        this.getUserExploredDataScientistCareerTrack();
    }

    @observable selectedSkill = '';

    @action
    selectSkill(skillSlug: string) {
        this.selectedSkill = skillSlug;
    }

    @observable userExploredWebDeveloperCareerTrack: boolean | null = null;
    @observable userExploredDataScientistCareerTrack: boolean | null = null;
    @observable webDeveloperCareerTrackSettingLoaded = false;
    @observable dataScientistCareerTrackSettingLoaded = false;

    private endPoint = '/users/me/settings/';
    private determineSettingValue = (
        response: AxiosResponse<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
        settingDefinition: Readonly<UserSetting>,
    ) => {
        // determine if user has configured the setting we're looking for (i.e. there's a matching value)
        const matchingSetting = response.data.results.find(
            (result: UserSettingResponse) => result.setting === settingDefinition.settingCode,
        );

        if (matchingSetting) {
            // return boolean equivalent of whether the setting's value has been
            // set to be "enabled" (i.e. 'true'/'on'/etc.)
            const truthyValue = (settingDefinition.valueMap as ValueMap).true;
            return matchingSetting.value === truthyValue;
        }

        // otherwise, if user has NOT configured the setting we're looking for,
        // the setting value is considered null
        return null;
    };

    async getUserExploredWebDeveloperCareerTrack() {
        udApi
            .get(this.endPoint)
            .then((response) => this.determineSettingValue(response, SETTINGS.exploredCareerTracks))
            .then(this._userExploredWebDeveloperCareerTrackContinuationHelper);
    }

    async getUserExploredDataScientistCareerTrack() {
        udApi
            .get(this.endPoint)
            .then((response) =>
                this.determineSettingValue(response, SETTINGS.exploredDataScientistCareerTracks),
            )
            .then(this._userExploredDataScientistCareerTrackContinuationHelper);
    }

    @action
    setUserExploredWebDeveloperCareerTrack = (settingValue: boolean) => {
        if (this.userExploredWebDeveloperCareerTrack != settingValue) {
            userSettings.set(SETTINGS.exploredCareerTracks, settingValue);
            this.userExploredWebDeveloperCareerTrack = settingValue;
            Tracker.publishEvent(
                new CareerTrackPageLinkAddEvent({
                    displayTitle: WEB_DEVELOPER_UNIT_TITLE,
                    nonInteraction: false,
                }),
            );
        }
    };

    @action
    setUserExploredDataScientistCareerTrack = (settingValue: boolean) => {
        if (this.userExploredDataScientistCareerTrack != settingValue) {
            userSettings.set(SETTINGS.exploredDataScientistCareerTracks, settingValue);
            this.userExploredDataScientistCareerTrack = settingValue;
            Tracker.publishEvent(
                new CareerTrackPageLinkAddEvent({
                    displayTitle: DATA_SCIENTIST_UNIT_TITLE,
                    nonInteraction: false,
                }),
            );
        }
    };

    /*
     * This helper function is necessary to ensure the proper "this" keyword object binding
     * when setting observable state properties from within a continuation
     */
    @action
    _userExploredWebDeveloperCareerTrackContinuationHelper = (value: boolean | null) => {
        this.userExploredWebDeveloperCareerTrack = value;
        this.webDeveloperCareerTrackSettingLoaded = true;
    };

    /*
     * This helper function is necessary to ensure the proper "this" keyword object binding
     * when setting observable state properties from within a continuation
     */
    @action
    _userExploredDataScientistCareerTrackContinuationHelper = (value: boolean | null) => {
        this.userExploredDataScientistCareerTrack = value;
        this.dataScientistCareerTrackSettingLoaded = true;
    };

    readyToShowUnitByTitle = (title: string) => {
        if (title === WEB_DEVELOPER_UNIT_TITLE) {
            return this.webDeveloperCareerTrackSettingLoaded;
        } else if (title === DATA_SCIENTIST_UNIT_TITLE) {
            return this.dataScientistCareerTrackSettingLoaded;
        }
        return false;
    };

    shouldShowBySettingForUnitWithTitle = (title: string) => {
        if (title === WEB_DEVELOPER_UNIT_TITLE) {
            return this.userExploredWebDeveloperCareerTrack !== false;
        } else if (title === DATA_SCIENTIST_UNIT_TITLE) {
            return this.userExploredDataScientistCareerTrack !== false;
        }
        return false;
    };
}
