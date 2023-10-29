import {action, computed, observable} from 'mobx';

import AssetModel from 'asset/asset.mobx-model';
import {ASSET_TYPE} from 'asset/constants';
import {AutomatedReviewTestApiData} from 'lab-manage/types';
import {labTasksApiUrl} from 'labs/apis';
import BaseLabResource from 'labs/base-lab-resource.mobx-model';
import LabTask from 'labs/lab-task.mobx-model';

import {ALR_UI_MODE} from './constants';

export class AutomatedReviewTest extends BaseLabResource {
    @observable declare id: number;
    @observable declare testTitle: string;
    @observable declare successMessage: string;
    @observable declare errorMessage: string;
    @observable declare asset?: AssetModel;
    @observable declare labTask: LabTask;
    @observable declare isForOpenChallenge: boolean;
    @observable uiMode: string;

    constructor(data: AutomatedReviewTestApiData, labTask: LabTask, uiMode?: string) {
        super(data);
        this.labTask = labTask;
        this.uiMode = uiMode ?? ALR_UI_MODE.CODE_EDITOR;
    }

    get apiDataMap() {
        return {
            id: 'id',
            testTitle: 'test_title',
            successMessage: 'success_message',
            errorMessage: 'error_message',
            isForOpenChallenge: {
                source: 'is_for_open_challenge',
                defaultValue: false,
            },
            asset: {
                source: 'asset',
                map: (asset: AssetModel) => {
                    if (!asset) {
                        return;
                    }
                    return new AssetModel(asset);
                },
            },
        };
    }

    // @ts-expect-error the EditableApiModel expects type 'void'
    get editableFieldsMap() {
        return new Map([
            ['testTitle', 'test_title'],
            ['successMessage', 'success_message'],
            ['errorMessage', 'error_message'],
            ['isForOpenChallenge', 'is_for_open_challenge'],
        ]);
    }

    // @ts-expect-error the EditableApiModel expects type 'void'
    get resourceUrl() {
        return `${labTasksApiUrl(this.labTask.lab.id)}${this.labTask.id}/automated-review-test/${
            this.id
        }/`;
    }

    get assetUrl() {
        return this.labTask.lab.assetsUrl;
    }

    @computed
    get resourceAssetUrl() {
        const assetsUrl = this.assetUrl;
        // @ts-expect-error type is not defined in 'AssetModel'
        if (this.asset && assetsUrl && this.asset.type === ASSET_TYPE.SOURCE_CODE) {
            return `${assetsUrl}${this.asset.id}/`;
        }
    }

    @action
    setUIMode(uiMode: string) {
        this.uiMode = uiMode;
    }

    @action
    removeAsset() {
        this.asset = undefined;
    }
}
