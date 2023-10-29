import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import {
    FOLDER_ACTIONS,
    LIST_PAGE_ERROR_MESSAGES,
    FOLDERS_PAGE_SIZE,
    LIST_PAGE_SUCCESS_MESSAGES,
} from 'learning-path/list-page/constants';
import LearningPathFolder from 'learning-path/list-page/folders/learning-path-folder.mobx-model';
import handleError from 'learning-path/utils';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';

const udConfig = getConfigData();

export default class AddLearningPathToFoldersStore {
    @observable isAddToFoldersModalVisible = false;
    @observable isAddToFoldersFormVisible = false;
    @observable isLoadingFolders = true;
    @observable isCreatingFolder = false;
    @observable folders = [];
    @observable newFolderTitle = '';

    constructor(learningPath) {
        this.learningPath = learningPath;
    }

    @autobind
    async fetchFolders() {
        this._setLoadingFolders(true);
        try {
            const response = await udApi.get('/structured-data/tags/learning_path_folder/', {
                params: {
                    page_size: FOLDERS_PAGE_SIZE,
                },
            });
            this._setFolders(response.data.results);
        } catch (e) {
            handleError(e, LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_LOAD_FOLDERS);
        } finally {
            this._setLoadingFolders(false);
        }
    }

    @autobind
    @action
    async createNewFolder() {
        let folder = {};

        this.isCreatingFolder = true;
        try {
            const response = await udApi.post('/structured-data/actions/', {
                actions: [
                    {
                        action: FOLDER_ACTIONS.CREATE,
                        options: {
                            org: {id: udConfig.brand.organization.id},
                            title: this.newFolderTitle,
                        },
                    },
                ],
            });
            runInAction(() => {
                folder = new LearningPathFolder(response.data.results[0].data);
                folder.setIsSelected(true);
                this.folders.push(folder);
                this.newFolderTitle = '';
            });
            return folder;
        } catch (e) {
            handleError(e, LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_CREATE_FOLDER);
        } finally {
            runInAction(() => {
                this.isCreatingFolder = false;
                this.isAddToFoldersFormVisible = false;
            });
        }
    }

    @action
    _setFolders(data) {
        this.folders = data.map((folderData) => new LearningPathFolder(folderData));
    }

    @action
    _setLoadingFolders(value) {
        this.isLoadingFolders = value;
    }

    @autobind
    @action
    toggleAddToFoldersForm() {
        this.isAddToFoldersFormVisible = !this.isAddToFoldersFormVisible;
    }

    @autobind
    @action
    setNewFolderTitle(event) {
        this.newFolderTitle = event.target.value.trim();
    }

    @action
    showAddToFoldersModal() {
        this.isAddToFoldersModalVisible = true;
    }

    @autobind
    @action
    closeAddToFoldersModalAndForm() {
        this.isAddToFoldersModalVisible = false;
        this.isAddToFoldersFormVisible = false;
    }

    @action
    addSelectedFolderIdsToPath() {
        this.selectedFolders.map((id) => {
            return this.learningPath.setNewFolderIdForPath(id);
        });
    }

    @computed
    get selectedFolders() {
        return this.folders.reduce((acc, folder) => {
            if (folder.isSelected) {
                acc.push({id: folder.id});
            }
            return acc;
        }, []);
    }

    @autobind
    async addLearningPathToFolders() {
        try {
            await udApi.post('/structured-data/actions/', {
                actions: [
                    {
                        action: FOLDER_ACTIONS.ASSIGN_LP_TO_FOLDERS,
                        options: {
                            learning_path: {id: this.learningPath.id},
                            learning_path_folders: {
                                items: this.selectedFolders,
                            },
                        },
                    },
                ],
            });
        } catch (e) {
            handleError(e, LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_ADD_PATH_TO_FOLDERS);
        } finally {
            const bannerProps = {
                udStyle: 'success',
                title: interpolate(
                    LIST_PAGE_SUCCESS_MESSAGES.ADDED_TO_FOLDER,
                    {pathTitle: this.learningPath.title},
                    true,
                ),
                showCta: false,
            };
            toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
            this.closeAddToFoldersModalAndForm();
            this.addSelectedFolderIdsToPath();
        }
    }
}
