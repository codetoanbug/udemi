import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import udApi from 'utils/ud-api';

import EditableApiModel from '../../editable-api-model.mobx-model';
import {FOLDER_ACTIONS} from '../constants';

export default class LearningPathFolder extends EditableApiModel {
    @observable id;
    @observable title = '';
    @observable description = '';
    @observable type = '';
    @observable url = '';
    @observable isSelected = false;
    @observable isSaving = false;

    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
            description: {
                source: 'descriptions',
                map: (descriptions) => (descriptions[0] ? descriptions[0].text : ''),
            },
            url: 'url',
            type: 'type',
        };
    }

    /* title_cleaned and absolute_url are used in the NavigationMenu and to match with the variables
    there, we cannot use camelcase here.
    */
    // eslint-disable-next-line camelcase
    get title_cleaned() {
        return this.title;
    }

    // eslint-disable-next-line camelcase
    get absolute_url() {
        return this.url;
    }

    get editableFieldsMap() {
        return new Map([
            ['title', 'title'],
            ['description', 'description'],
        ]);
    }

    get resourceUrl() {
        return '/structured-data/actions/';
    }

    // API for SDTag is different from the normal REST approach
    // For more information check: structured_data/actions
    async _executeUpdate() {
        this.setIsSaving(true);
        const response = await udApi.post(this.resourceUrl, {
            actions: [
                {
                    action: FOLDER_ACTIONS.EDIT,
                    options: {
                        learning_path_folder: {id: this.id},
                        changed_data: this.changedData,
                    },
                },
            ],
        });

        this.setDataFromAPI(response.data.results[0].data);
        this.setIsSaving(false);
    }

    async removePath(path) {
        await udApi.post(this.resourceUrl, {
            actions: [
                {
                    action: FOLDER_ACTIONS.REMOVE_PATH,
                    options: {
                        learning_path_folder: {id: this.id},
                        learning_path: {id: path.id},
                    },
                },
            ],
        });
    }

    @autobind
    setTitle(title) {
        this._changeEditableField('title', title);
    }

    @autobind
    setDescription(description) {
        this._changeEditableField('description', description);
    }

    @action
    setIsSelected(value) {
        this.isSelected = value;
    }

    @action
    setIsSaving(value) {
        this.isSaving = value;
    }
}
