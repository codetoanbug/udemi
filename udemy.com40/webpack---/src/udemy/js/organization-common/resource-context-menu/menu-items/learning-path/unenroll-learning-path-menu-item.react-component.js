import CancelIcon from '@udemy/icons/dist/cancel.ud-icon';
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
export default class UnenrollLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
    };

    @autobind
    handleClick() {
        trackClickAction(this.props.resourceContext, 'Unenroll', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
        return this.props.learningPath.removeEnrollmentFromPath();
    }

    render() {
        return (
            <ContextMenuItem
                icon={<CancelIcon label={false} />}
                title={gettext('Unenroll')}
                onClick={this.handleClick}
            />
        );
    }
}

UnenrollLearningPathMenuItem.shouldRender = function (props) {
    return props.learningPath.isUserEnrolled;
};
