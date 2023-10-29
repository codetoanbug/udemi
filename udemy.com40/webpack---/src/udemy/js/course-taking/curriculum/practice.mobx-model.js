import {action, observable} from 'mobx';

import CurriculumItem from './curriculum-item.mobx-model';

export default class Practice extends CurriculumItem {
    @observable videoComponent;
    @observable textComponent;
    @observable downloadableAssets = [];
    @observable questions = [];

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            description: 'description',
            estimatedDuration: 'estimated_duration',
            isFree: 'is_free',
            numSubmissions: {
                source: 'num_submissions',
                defaultValue: 0,
            },
        };
    }

    get isExcludedFromCurriculumCount() {
        return true;
    }

    @action
    setVideoComponent(component) {
        this.videoComponent = component;
    }

    @action
    setTextComponent(component) {
        this.textComponent = component;
    }

    @action
    setDownloadableAssets(assets) {
        this.downloadableAssets = assets;
    }

    @action
    setQuestions(questions) {
        this.questions = questions;
    }

    get titleIndex() {
        return interpolate(gettext('Assignment %(index)s:'), {index: this.objectIndex}, true);
    }

    get canUserToggleCompletion() {
        return false;
    }

    get resourcesApiUrl() {
        return `/practices/${this.id}/supplementary-assets/`;
    }

    get progressApiUrl() {
        return `/users/me/subscribed-courses/${this.courseId}/practices/${this.id}/progress-logs/`;
    }
}
