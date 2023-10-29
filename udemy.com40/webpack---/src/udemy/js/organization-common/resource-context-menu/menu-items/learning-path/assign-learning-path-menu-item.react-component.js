import CalendarArrowRight from '@udemy/icons/dist/calendar-arrow-right.ud-icon';
import ShareIcon from '@udemy/icons/dist/share.ud-icon';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import AssignResourceModal from 'organization-common/assign-resource/assign-resource-modal.react-component';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

import ShareMenuItemStore from '../share-menu-item.mobx-store';

@inject('resourceContext')
@observer
export default class AssignLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.shareMenuItemStore = new ShareMenuItemStore(
            props.learningPath.id,
            RESOURCE_TYPES.LEARNING_PATH,
            props.resourceContext,
        );
    }

    @autobind
    @action
    async handleClick() {
        trackClickAction(this.props.resourceContext, 'Assign', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
        await this.shareMenuItemStore.resourcePreview();
    }

    @autobind
    @action
    handleOnClose() {
        this.shareMenuItemStore.hideModal();
    }

    render() {
        const icon = this.props.learningPath.isRecommendEnabled ? (
            <CalendarArrowRight label={false} />
        ) : (
            <ShareIcon label={false} />
        );

        return (
            <>
                <ContextMenuItem icon={icon} title={gettext('Assign')} onClick={this.handleClick} />
                <AssignResourceModal
                    isAutoAssignedEnabled={true}
                    resourceId={Number(this.props.learningPath.id)}
                    resourceType={RESOURCE_TYPES.LEARNING_PATH}
                    shareData={this.shareMenuItemStore.shareData}
                    isOpen={this.shareMenuItemStore.isModalShown}
                    onClose={this.handleOnClose}
                    context={this.props.resourceContext}
                />
            </>
        );
    }
}

AssignLearningPathMenuItem.shouldRender = function (props) {
    return !props.learningPath.isStudent;
};
