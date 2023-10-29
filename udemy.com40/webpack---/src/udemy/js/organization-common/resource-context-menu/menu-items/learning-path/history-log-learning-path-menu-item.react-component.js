import ScheduleIcon from '@udemy/icons/dist/schedule.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import {PropTypes} from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class HistoryLogLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
    };

    @autobind
    handleClick() {
        trackClickAction(this.props.resourceContext, 'View edit history', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
        this.props.learningPath.showHistoryLog();
    }

    render() {
        return (
            <ContextMenuItem
                icon={<ScheduleIcon label={false} />}
                title={gettext('View edit history')}
                onClick={this.handleClick}
            />
        );
    }
}

HistoryLogLearningPathMenuItem.shouldRender = function (props) {
    return props.learningPath.canUserEdit;
};
