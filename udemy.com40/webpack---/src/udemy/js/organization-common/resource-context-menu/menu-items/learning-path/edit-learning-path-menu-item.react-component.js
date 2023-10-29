import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class EditLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
    };

    @autobind
    trackClick() {
        trackClickAction(this.props.resourceContext, 'Edit', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
    }

    render() {
        return (
            <ContextMenuItem
                icon={<EditIcon label={false} />}
                title={gettext('Edit')}
                href={this.props.learningPath.editUrl}
                onClick={this.trackClick}
            />
        );
    }
}

EditLearningPathMenuItem.shouldRender = function (props) {
    return props.learningPath.canUserEdit && props.learningPath.isOrgLearningPath;
};
