import CalendarArrowRight from '@udemy/icons/dist/calendar-arrow-right.ud-icon';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Lab from 'labs/lab.mobx-model';
import AssignResourceModal from 'organization-common/assign-resource/assign-resource-modal.react-component';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

import ShareMenuItemStore from '../share-menu-item.mobx-store';

@inject('resourceContext')
@observer
export default class AssignLabMenuItem extends React.Component {
    static propTypes = {
        lab: PropTypes.instanceOf(Lab).isRequired,
        resourceContext: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.shareMenuItemStore = new ShareMenuItemStore(
            props.lab.id,
            RESOURCE_TYPES.LAB,
            props.resourceContext,
        );
    }

    @autobind
    @action
    async handleClick() {
        trackClickAction(this.props.resourceContext, 'Assign', {
            resourceType: RESOURCE_TYPES.LAB,
            resourceId: this.props.lab.id,
        });
        await this.shareMenuItemStore.resourcePreview();
    }

    render() {
        return (
            <>
                <ContextMenuItem
                    icon={<CalendarArrowRight label={false} />}
                    title={gettext('Assign')}
                    onClick={this.handleClick}
                />
                <AssignResourceModal
                    isAutoAssignedEnabled={true}
                    resourceId={this.props.lab.id}
                    resourceType={RESOURCE_TYPES.LAB}
                    shareData={this.shareMenuItemStore.shareData}
                    isOpen={this.shareMenuItemStore.isModalShown}
                    onClose={this.shareMenuItemStore.hideModal}
                    context={this.props.resourceContext}
                />
            </>
        );
    }
}

AssignLabMenuItem.shouldRender = function (props) {
    return !props.lab.isStudent;
};
