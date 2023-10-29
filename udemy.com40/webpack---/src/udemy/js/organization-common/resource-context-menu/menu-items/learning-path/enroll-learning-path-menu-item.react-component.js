import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class EnrollLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
    };

    @autobind
    handleClick() {
        trackClickAction(this.props.resourceContext, 'Enroll', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
        return this.props.learningPath.addEnrollmentToPath({uiRegion: 'context_menu'});
    }

    render() {
        return (
            <ContextMenuItem
                icon={<TickIcon label={false} />}
                title={gettext('Enroll')}
                onClick={this.handleClick}
                data-purpose="enroll-path"
            />
        );
    }
}

EnrollLearningPathMenuItem.shouldRender = function (props) {
    // On the learning path page we display a Enroll button instead of having it the context menu
    return props.resourceContext === CONTEXT_TYPES.LEARNING_PATH
        ? props.learningPath.isUserEditor && !props.learningPath.isUserEnrolled
        : !props.learningPath.isUserEnrolled;
};
