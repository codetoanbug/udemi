import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {AlertBannerProps, ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, computed} from 'mobx';
import {observer, Provider} from 'mobx-react';
import React from 'react';

import {
    ASSIGNMENT_NUDGE_GROUPS,
    EMAIL_ASSIGNEES_MESSAGE_NEEDS_NUDGE,
    EMAIL_ASSIGNEES_MESSAGE_NOT_STARTED,
    EMAIL_ASSIGNEES_MESSAGE_ON_TRACK,
} from 'organization-common/assign-resource/constants';
import {EmailAssigneesStore} from 'organization-common/assign-resource/email-assignees.mobx-store';
import ResourcePreview from 'organization-common/resource-preview/resource-preview.react-component';
import UserAndGroupAutocomplete from 'organization-common/user-and-group-autocomplete/user-and-group-autocomplete.react-component';
import {
    UBAssignSummaryEmailUsersModalSubmitEvent,
    UBAssignSummaryEmailUsersModalOpenEvent,
} from 'organization-insights/course-details/events';
import {Entity} from 'organization-manage-common/user-and-group-pill/user-and-group-pill.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';

const udConfig = getConfigData();

/**
 * A modal component that allows assigners to email their assignees
 */

interface EmailAssigneesModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignees: Entity[];
    resourceId: number;
    resourceType: string;
    nudgeGroup: string | null;
    context: string;
}

@observer
export class EmailAssigneesModal extends React.Component<EmailAssigneesModalProps> {
    constructor(props: EmailAssigneesModalProps) {
        super(props);
        this.store = new EmailAssigneesStore(
            udConfig.brand.organization.id,
            props.resourceId,
            props.resourceType,
            props.assignees,
            props.nudgeGroup,
        );
        this.store.setSenderMessage(this.defaultMessage);
    }

    store: EmailAssigneesStore;

    @autobind
    @action
    async onOpen() {
        await this.store.resourcePreview();
        await this.store.getTotalNumberOfLicensedUsers();
        Tracker.publishEvent(
            new UBAssignSummaryEmailUsersModalOpenEvent({
                courseId: this.props.resourceId,
                nudgeGroup: this.props.nudgeGroup,
                context: this.props.context,
            }),
        );
    }

    @autobind
    handleClose() {
        this.store.resetModalValues();
        return this.props.onClose();
    }

    get defaultMessage() {
        const {nudgeGroup} = this.props;

        if (nudgeGroup === ASSIGNMENT_NUDGE_GROUPS.NOT_STARTED) {
            return EMAIL_ASSIGNEES_MESSAGE_NOT_STARTED;
        }

        if (nudgeGroup === ASSIGNMENT_NUDGE_GROUPS.NEEDS_NUDGE) {
            return EMAIL_ASSIGNEES_MESSAGE_NEEDS_NUDGE;
        }

        if (nudgeGroup === ASSIGNMENT_NUDGE_GROUPS.ON_TRACK) {
            return EMAIL_ASSIGNEES_MESSAGE_ON_TRACK;
        }
    }

    @autobind
    onChangeMessage(event: React.ChangeEvent<HTMLInputElement>) {
        this.store.setSenderMessage(event.target.value);
    }

    @computed
    get emailSendingButtonText() {
        if (this.store.selectedUsersAndGroups.length > 1) {
            return gettext('Send emails');
        }
        return gettext('Send email');
    }

    renderAlertBannerToast(successMessage: string, messageClass: string) {
        const successMessageComponent = (
            <div
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'assign-resource-modal:alert-banner-toast',
                    html: successMessage,
                })}
            ></div>
        );

        const bannerAlertProps = {
            udStyle: messageClass,
            title: successMessageComponent,
            showCta: false,
        } as AlertBannerProps;
        toasterStore.addAlertBannerToast(bannerAlertProps, {
            autoDismiss: true,
        });
        this.handleClose();
    }

    @autobind
    async sendEmails() {
        await this.store.sendEmails().then(([successMessage, messageClass]) => {
            if (successMessage) {
                Tracker.publishEvent(
                    new UBAssignSummaryEmailUsersModalSubmitEvent({
                        courseId: this.props.resourceId,
                        nudgeGroup: this.props.nudgeGroup,
                        numUsersAdded:
                            this.props.assignees.length < this.store.selectedUsers.length
                                ? this.store.selectedUsers.length - this.props.assignees.length
                                : 0,
                        numUsersRemoved:
                            this.props.assignees.length > this.store.selectedUsers.length
                                ? this.props.assignees.length - this.store.selectedUsers.length
                                : 0,
                        numGroupsAdded: this.store.selectedGroups.length,
                        isAllUsersSelected: this.store.isAllUsersSelected,
                        defaultMessageChanged: this.store.senderMessage !== this.defaultMessage,
                    }),
                );
                return this.renderAlertBannerToast(successMessage, messageClass);
            }
        });
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onClose={this.handleClose}
                onOpen={this.onOpen}
                title={gettext('Email users')}
            >
                <Provider store={this.store}>
                    <UserAndGroupAutocomplete context={'email_assignees_modal'} />
                </Provider>
                <div data-purpose="resource-preview">
                    {this.store.isLoadingMessageAndPreview ? (
                        <Loader size="large" block={true} />
                    ) : (
                        <ResourcePreview
                            resourceId={this.props.resourceId}
                            resourceType={this.props.resourceType}
                            shareData={this.store.shareData}
                            onChangeMessageCallback={this.onChangeMessage}
                            defaultMessage={this.defaultMessage}
                            className="modal--resource-preview"
                        />
                    )}
                </div>
                <FooterButtons>
                    <Button udStyle="ghost" onClick={this.handleClose}>
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        disabled={
                            this.store.isLoadingMessageAndPreview ||
                            this.store.isSendingEmails ||
                            (this.store.selectedUsersAndGroups.length < 1 &&
                                !this.store.isAllUsersSelected)
                        }
                        onClick={this.sendEmails}
                    >
                        {this.store.isSendingEmails
                            ? gettext('Sending...')
                            : this.emailSendingButtonText}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
