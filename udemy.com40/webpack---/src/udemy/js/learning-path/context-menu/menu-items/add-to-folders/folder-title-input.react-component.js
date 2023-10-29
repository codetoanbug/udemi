import {onEnter} from '@udemy/design-system-utils';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AddLearningPathToFoldersStore from './add-learning-path-to-folders.mobx-store';
import {FOLDER_TITLE_MAX_SIZE} from './constants';

import './add-to-folders-modal.less';

@inject('actionCallbacks', 'lpToFolderStore')
@observer
export default class FolderTitleInput extends React.Component {
    static propTypes = {
        lpToFolderStore: PropTypes.instanceOf(AddLearningPathToFoldersStore).isRequired,
        actionCallbacks: PropTypes.shape({
            handleAddNewFolder: PropTypes.func.isRequired,
        }).isRequired,
    };

    @autobind
    scrollToFolder(folderId) {
        // setTimeout to make sure that the element was rendered in DOM and that we can scroll to it
        setTimeout(() => {
            const element = document.getElementById(`folder-${folderId}`);
            if (element) {
                element.scrollIntoView(true);
            }
        });
    }

    @autobind
    async handleClick() {
        if (this.props.lpToFolderStore.newFolderTitle === '') {
            return null;
        }

        const folder = await this.props.lpToFolderStore.createNewFolder();

        if (folder) {
            this.props.actionCallbacks.handleAddNewFolder(folder);
            this.scrollToFolder(folder.id);
        }
    }

    render() {
        const {setNewFolderTitle, isCreatingFolder} = this.props.lpToFolderStore;

        return (
            <FormGroup
                styleName="folder-create-new"
                label={gettext('Enter new folder name')}
                labelProps={{className: 'ud-sr-only'}}
            >
                <TextInputForm
                    onChange={setNewFolderTitle}
                    onKeyDown={onEnter(this.handleClick)}
                    onSubmit={this.handleClick}
                    placeholder={gettext('Type the name of the new folder here')}
                    submitButtonContent={gettext('Create folder')}
                    disabled={isCreatingFolder}
                    autoFocus={true}
                    type="text"
                    maxLength={FOLDER_TITLE_MAX_SIZE}
                    // withCounter={!isCreatingFolder} TODO make this work again
                />
            </FormGroup>
        );
    }
}
