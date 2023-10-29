import {runInAction, observable} from 'mobx';

import udApi from 'utils/ud-api';

export default class AccessibilityStore {
    @observable isLoaded = false;
    @observable settings = new Map();

    constructor(courseId = null) {
        this.courseId = courseId;
    }

    setSetting(setting, value) {
        udApi.post(`/courses/${this.courseId}/settings/`, {setting, value: value ? 'on' : 'off'});

        runInAction(() => {
            this.settings.set(setting, value);
        });
    }

    async loadAccessibilitySettings() {
        const response = await udApi.get(`/courses/${this.courseId}/settings/`);

        runInAction(() => {
            response.data.results.forEach((setting) => {
                this.settings.set(setting.setting, setting.value === 'on');
            });
            this.isLoaded = true;
        });
    }
}
