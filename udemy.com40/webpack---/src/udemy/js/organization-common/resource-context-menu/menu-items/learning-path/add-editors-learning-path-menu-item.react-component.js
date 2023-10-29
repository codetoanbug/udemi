import PersonIcon from '@udemy/icons/dist/person.ud-icon';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import EditPathEditorsModal from 'learning-path/path-editors-modals/edit-path-editors-modal.react-component';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class AddEditorsLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
    };

    @observable isEditPathEditorsModalVisible = false;

    @autobind
    @action
    toggleEditPathEditorsModal() {
        this.isEditPathEditorsModalVisible = !this.isEditPathEditorsModalVisible;
    }

    @autobind
    handleClick() {
        trackClickAction(this.props.resourceContext, 'Add editors', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
        this.toggleEditPathEditorsModal();
    }

    render() {
        return (
            <>
                <ContextMenuItem
                    icon={<PersonIcon label={false} />}
                    title={gettext('Add editors')}
                    onClick={this.handleClick}
                />
                {this.isEditPathEditorsModalVisible && (
                    <EditPathEditorsModal
                        isVisible={this.isEditPathEditorsModalVisible}
                        onHide={this.toggleEditPathEditorsModal}
                        learningPath={this.props.learningPath}
                    />
                )}
            </>
        );
    }
}

AddEditorsLearningPathMenuItem.shouldRender = function (props) {
    return props.learningPath.canUserEdit && props.learningPath.isOrgLearningPath;
};
