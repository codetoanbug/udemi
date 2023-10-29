import AddCircleSolidIcon from '@udemy/icons/dist/add-circle-solid.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AddLearningPathToFoldersStore from './add-learning-path-to-folders.mobx-store';
import FolderCheckbox from './folder-checkbox.react-component';
import FolderTitleInput from './folder-title-input.react-component';

import './add-to-folders-modal.less';

@inject('lpToFolderStore')
@observer
export default class AddToFoldersModal extends React.Component {
    static propTypes = {
        lpToFolderStore: PropTypes.instanceOf(AddLearningPathToFoldersStore).isRequired,
    };

    componentDidMount() {
        this.props.lpToFolderStore.fetchFolders();
    }

    renderCreateNewFolderContent() {
        const {isAddToFoldersFormVisible, toggleAddToFoldersForm} = this.props.lpToFolderStore;

        if (isAddToFoldersFormVisible) {
            return <FolderTitleInput />;
        }

        return (
            <Button
                udStyle="ghost"
                size="medium"
                onClick={toggleAddToFoldersForm}
                data-purpose="create-new-folder-btn"
            >
                <AddCircleSolidIcon label={false} />
                {gettext('Create new folder')}
            </Button>
        );
    }

    renderContent() {
        const {isLoadingFolders, learningPath, folders} = this.props.lpToFolderStore;

        if (isLoadingFolders) {
            return <Loader size="small" block={true} />;
        }

        return (
            <FormGroup
                label={gettext('Which folder would you like this path added to?')}
                data-purpose="folders-selection"
            >
                <FormGroup
                    label={gettext('Select folders to add the path to')}
                    labelProps={{className: 'ud-sr-only'}}
                    styleName="folders-selection-checkbox-group"
                    udStyle="fieldset"
                >
                    {folders.map((folder) => {
                        return (
                            <FolderCheckbox
                                key={folder.id}
                                folder={folder}
                                isPathInFolder={learningPath.folderIds.includes(folder.id)}
                            />
                        );
                    })}
                </FormGroup>
                {this.renderCreateNewFolderContent()}
            </FormGroup>
        );
    }

    render() {
        const {
            isAddToFoldersModalVisible,
            closeAddToFoldersModalAndForm,
            addLearningPathToFolders,
            selectedFolders,
        } = this.props.lpToFolderStore;

        return (
            <Modal
                isOpen={isAddToFoldersModalVisible}
                onClose={closeAddToFoldersModalAndForm}
                title={gettext('Add to folder')}
            >
                {this.renderContent()}

                <FooterButtons>
                    <Button
                        udStyle="ghost"
                        onClick={closeAddToFoldersModalAndForm}
                        data-purpose="add-to-folders-cancel-btn"
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        onClick={addLearningPathToFolders}
                        disabled={!selectedFolders.length}
                        data-purpose="add-to-folders-save-btn"
                    >
                        {gettext('Save')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
