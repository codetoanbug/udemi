import CalendarArrowRight from '@udemy/icons/dist/calendar-arrow-right.ud-icon';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';

import AssignResourceModal from 'organization-common/assign-resource/assign-resource-modal.react-component';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

import ShareMenuItemStore from '../share-menu-item.mobx-store';
import Assessment from './assessment.mobx-model';

export interface AssignAssessmentMenuItemProps {
    assessment: Assessment;
    resourceContext: string;
    shouldDisable: () => boolean;
}

@inject('resourceContext')
@observer
export class AssignAssessmentMenuItem extends React.Component<AssignAssessmentMenuItemProps> {
    static shouldRender: (props: AssignAssessmentMenuItemProps) => boolean;

    constructor(props: AssignAssessmentMenuItemProps) {
        super(props);
        this.shareMenuItemStore = new ShareMenuItemStore(
            props.assessment.id,
            RESOURCE_TYPES.ASSESSMENT,
            props.resourceContext,
        );
    }

    private shareMenuItemStore: ShareMenuItemStore;

    @autobind
    @action
    async handleClick() {
        trackClickAction(this.props.resourceContext, 'Assign assessment', {
            resourceType: RESOURCE_TYPES.ASSESSMENT,
            resourceId: this.props.assessment.id,
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
                    resourceId={this.props.assessment.id}
                    resourceType={RESOURCE_TYPES.ASSESSMENT}
                    shareData={this.shareMenuItemStore.shareData}
                    isOpen={this.shareMenuItemStore.isModalShown}
                    onClose={this.shareMenuItemStore.hideModal}
                    context={this.props.resourceContext}
                />
            </>
        );
    }
}

AssignAssessmentMenuItem.shouldRender = function (props: AssignAssessmentMenuItemProps) {
    return !props.assessment.isStudent;
};
