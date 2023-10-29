import AddCircleSolidIcon from '@udemy/icons/dist/add-circle-solid.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer, Provider} from 'mobx-react';
import {PropTypes} from 'prop-types';
import React from 'react';

import AddLearningPathToFoldersStore from 'learning-path/context-menu/menu-items/add-to-folders/add-learning-path-to-folders.mobx-store';
import AddToFoldersModal from 'learning-path/context-menu/menu-items/add-to-folders/add-to-folders-modal.react-component';
import LearningPath from 'learning-path/learning-path.mobx-model';
import {isUserOrganizationAdminOrOwner} from 'learning-path/utils';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class AddLearningPathToFolderMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
        isAddToFoldersVisible: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.lpToFolderStore = new AddLearningPathToFoldersStore(this.props.learningPath);
    }

    @autobind
    handleClick() {
        trackClickAction(this.props.resourceContext, 'Add to folder', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
        return this.lpToFolderStore.showAddToFoldersModal();
    }

    render() {
        const {isAddToFoldersModalVisible} = this.lpToFolderStore;

        return (
            <>
                <ContextMenuItem
                    icon={<AddCircleSolidIcon label={false} />}
                    title={gettext('Add to folder')}
                    onClick={this.handleClick}
                />
                {isAddToFoldersModalVisible && (
                    <Provider lpToFolderStore={this.lpToFolderStore}>
                        <AddToFoldersModal />
                    </Provider>
                )}
            </>
        );
    }
}

AddLearningPathToFolderMenuItem.shouldRender = function (props) {
    return (
        isUserOrganizationAdminOrOwner() &&
        props.isAddToFoldersVisible &&
        props.learningPath.isOrgLearningPath &&
        props.learningPath.isPublic
    );
};
