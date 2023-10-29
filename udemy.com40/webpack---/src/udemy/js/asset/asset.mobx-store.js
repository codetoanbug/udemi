import {action, observable} from 'mobx';

import udApi from 'utils/ud-api';

import AssetModel from './asset.mobx-model';

export default class AssetStore {
    @observable.ref asset = null;

    constructor(assetId, ModelClass, courseId, lectureId, practiceId) {
        this.assetId = assetId;
        this.courseId = courseId;
        this.lectureId = lectureId;
        this.practiceId = practiceId;

        if (!ModelClass) {
            ModelClass = AssetModel;
        }
        this.modelClass = ModelClass;
    }

    @action
    fetchData(asset, assetData) {
        // data already passed to component, use that instead of making an API call
        if (asset || assetData) {
            this.asset = asset || new this.modelClass(assetData);
            return;
        }

        // no data passed, fetch from API
        const requestFields = this.modelClass.requestFields;
        // extra fields required for checking asset permissions in course snapshots
        this.modelClass.extraParams.course_id = this.courseId;
        this.modelClass.extraParams.lecture_id = this.lectureId;
        this.modelClass.extraParams.practice_id = this.practiceId;
        return udApi
            .get(`/assets/${this.assetId}/`, {
                params: Object.assign(
                    {'fields[asset]': `@min,${requestFields.join(',')}`},
                    this.modelClass.extraParams,
                ),
            })
            .then(
                action((response) => {
                    this.asset = new this.modelClass(response.data);
                }),
            );
    }
}
