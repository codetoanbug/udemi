import EmailIcon from '@udemy/icons/dist/email.ud-icon';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {EmailAssigneesModal} from 'organization-common/assign-resource/email-assignees-modal.react-component';
import {Entity} from 'organization-manage-common/user-and-group-pill/user-and-group-pill.react-component';
import {ORGANIZATION_HAS_USER_STATUS} from 'organization-manage-users/constants';

import {EMAIL_ASSIGNEES_MODAL_CONTEXTS} from '../../assign-resource/constants';
import ContextMenuItem from './context-menu-item.react-component';

export interface EmailAssigneeMenuItemProps {
    resourceContext: string;
    resourceId: number;
    resourceType: string;
    assignee: Entity;
    nudgeGroup: string | null;
    userLicenseStatus: string;
    isAssignSummaryEnabled: boolean;
}

@inject('resourceContext')
@observer
export class EmailAssigneeMenuItem extends React.Component<EmailAssigneeMenuItemProps> {
    static shouldRender: (props: EmailAssigneeMenuItemProps) => boolean;

    @observable isModalVisible = false;

    @autobind
    @action
    openModal() {
        this.isModalVisible = true;
    }

    @autobind
    @action
    onClose() {
        this.isModalVisible = false;
    }

    render() {
        return (
            <>
                <ContextMenuItem
                    icon={<EmailIcon label={false} />}
                    title={gettext('Email user')}
                    onClick={this.openModal}
                    data-purpose="email-assignees-context-menu-item"
                />
                <EmailAssigneesModal
                    isOpen={this.isModalVisible}
                    onClose={this.onClose}
                    resourceId={this.props.resourceId}
                    resourceType={this.props.resourceType}
                    assignees={[this.props.assignee]}
                    nudgeGroup={this.props.nudgeGroup}
                    context={EMAIL_ASSIGNEES_MODAL_CONTEXTS.INDIVIDUAL}
                />
            </>
        );
    }
}

EmailAssigneeMenuItem.shouldRender = function (props: EmailAssigneeMenuItemProps) {
    return (
        props.isAssignSummaryEnabled &&
        props.nudgeGroup !== null &&
        props.userLicenseStatus === ORGANIZATION_HAS_USER_STATUS.active
    );
};
