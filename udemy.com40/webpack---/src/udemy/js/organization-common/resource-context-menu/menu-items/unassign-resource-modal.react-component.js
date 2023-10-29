import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Assignment from 'organization-manage-courses/assignment.mobx-model';
import {ORGANIZATION_HAS_USER_STATUS} from 'organization-manage-users/constants';

import {
    UNASSIGN_CONFIRM_BUTTON_TEXT,
    DEFAULT_UNASSIGN_MESSAGE,
    UNASSIGN_SUCCESS_MESSAGE,
    DEFAULT_ERROR_MESSAGE,
    DEFAULT_UNASSIGN_MESSAGE_INACTIVE_USER,
} from './constants';

/**
 * A modal component that allows team/org admin to unassign a resource from a user.
 */
@inject('actionCallbacks')
@observer
export default class UnassignResourceModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        closeConfirmationModal: PropTypes.func.isRequired,
        assignment: PropTypes.instanceOf(Assignment).isRequired,
        actionCallbacks: PropTypes.shape({
            onUnassign: PropTypes.func.isRequired,
        }).isRequired,
        userLicenseStatus: PropTypes.oneOf(Object.keys(ORGANIZATION_HAS_USER_STATUS)),
    };

    static defaultProps = {
        userLicenseStatus: null,
    };

    constructor(props) {
        super(props);
        this.resourceType = props.assignment.resourceType;
    }

    get unassignConfirmationMessage() {
        const {assignment, userLicenseStatus} = this.props;

        if (!assignment) {
            return [];
        }

        if (userLicenseStatus === null) {
            return '';
        }

        if (userLicenseStatus === ORGANIZATION_HAS_USER_STATUS.active) {
            if (assignment.canUnenrollUser) {
                return interpolate(
                    DEFAULT_UNASSIGN_MESSAGE[this.resourceType].canUnenroll,
                    {userName: assignment.assignedTo.name},
                    true,
                );
            }
            return interpolate(
                DEFAULT_UNASSIGN_MESSAGE[this.resourceType].cannotUnenroll,
                {userName: assignment.assignedTo.name},
                true,
            );
        }

        return interpolate(
            DEFAULT_UNASSIGN_MESSAGE_INACTIVE_USER[userLicenseStatus],
            {userName: assignment.assignedTo.name},
            true,
        );
    }

    renderAlertBannerToast(message, style) {
        const bannerAlertProps = {
            udStyle: style,
            title: message,
            showCta: false,
        };
        toasterStore.addAlertBannerToast(bannerAlertProps, {
            autoDismiss: true,
        });
    }

    @autobind
    unassignSelectedUser() {
        return this.props.assignment
            .unassign()
            .then(() => {
                this.props.closeConfirmationModal();
                this.props.actionCallbacks.onUnassign();
                this.renderAlertBannerToast(UNASSIGN_SUCCESS_MESSAGE[this.resourceType], 'success');
            })
            .catch(() => {
                this.renderAlertBannerToast(DEFAULT_ERROR_MESSAGE.TEXT, 'error');
            });
    }

    render() {
        const {isOpen, closeConfirmationModal} = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onClose={closeConfirmationModal}
                title={gettext('Confirm unassignment')}
            >
                <p>{this.unassignConfirmationMessage}</p>

                <FooterButtons>
                    <Button udStyle="ghost" onClick={closeConfirmationModal}>
                        {gettext('Cancel')}
                    </Button>
                    <Button onClick={this.unassignSelectedUser}>
                        {UNASSIGN_CONFIRM_BUTTON_TEXT[this.resourceType]}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
