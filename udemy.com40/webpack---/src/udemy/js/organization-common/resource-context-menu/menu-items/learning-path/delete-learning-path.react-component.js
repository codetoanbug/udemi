import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import {PropTypes} from 'prop-types';
import React from 'react';

import DeleteModal from 'learning-path/delete-path/delete-modal.react-component';
import DeleteStore from 'learning-path/delete-path/delete.mobx-store';
import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';

import ContextMenuItem from '../context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class DeleteLearningPath extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.deleteStore = new DeleteStore(props.learningPath);
    }

    @autobind
    handleClick() {
        trackClickAction(this.props.resourceContext, 'Delete', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
        this.deleteStore.toggleDeleteModal();
    }

    render() {
        const {isDeleteModalVisible} = this.deleteStore;

        return (
            <>
                <ContextMenuItem
                    icon={<DeleteIcon label={false} />}
                    title={gettext('Delete')}
                    onClick={this.handleClick}
                />
                {isDeleteModalVisible && <DeleteModal deleteStore={this.deleteStore} />}
            </>
        );
    }
}

DeleteLearningPath.shouldRender = function (props) {
    return props.learningPath.canUserEdit && props.learningPath.isOrgLearningPath;
};
