import {Button} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {observer, PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

import {CAN_NOT_DELETE_REASONS} from './constants';
import './course-settings.less';

@observer
export default class DeleteCourse extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        disabled: PropTypes.bool,
        hasOrganization: PropTypes.bool,
        canNotDeleteReason: mobxTypes.arrayOrObservableArrayOf(PropTypes.string),
        window: PropTypes.object, // used by specs to mock window
    };

    static defaultProps = {
        disabled: false,
        hasOrganization: false,
        canNotDeleteReason: [],
        window,
    };

    @autobind
    deleteCourse(onClose) {
        onClose();
        return udApi
            .delete(`/courses/${this.props.courseId}/`)
            .then(() => {
                this.props.window.location.href = '/instructor/courses/?flash=delete';
            })
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    renderDeleteReasonMessage() {
        const canNotDeleteReason = this.props.canNotDeleteReason;

        if (this.props.hasOrganization) {
            return gettext('If you delete your course it will be removed permanently.');
        }

        if (
            canNotDeleteReason.includes(CAN_NOT_DELETE_REASONS.HAS_WORKSPACE_ASSOCIATED) &&
            canNotDeleteReason.includes(CAN_NOT_DELETE_REASONS.HAS_ENROLLMENTS)
        ) {
            return gettext(
                'We promise students lifetime access, so courses cannot be deleted after students have enrolled. ' +
                    'Additionally, this course is linked to a workspace, and courses with a workspace enabled cannot be deleted.',
            );
        }

        if (canNotDeleteReason.includes(CAN_NOT_DELETE_REASONS.HAS_WORKSPACE_ASSOCIATED)) {
            return gettext(
                'This course is linked to a workspace, and courses with a workspace enabled cannot be deleted.',
            );
        }

        return gettext(
            'We promise students lifetime access, so courses cannot be deleted after students have enrolled.',
        );
    }

    render() {
        return (
            <div styleName="mt-md danger-row">
                <ModalTrigger
                    trigger={
                        <Button
                            udStyle="secondary"
                            styleName="danger-btn"
                            size="small"
                            disabled={this.props.disabled}
                        >
                            {gettext('Delete')}
                        </Button>
                    }
                    renderModal={({isOpen, onClose}) => (
                        <ConfirmModal
                            isOpen={isOpen}
                            title={gettext('Delete Your Course?')}
                            onCancel={onClose}
                            confirmText={gettext('Yes')}
                            cancelText={gettext('No')}
                            onConfirm={() => this.deleteCourse(onClose)}
                        >
                            {gettext(
                                'Are you sure you want to delete this course? This is permanent and cannot be undone.',
                            )}
                        </ConfirmModal>
                    )}
                />
                <p styleName="danger-info">{this.renderDeleteReasonMessage()}</p>
            </div>
        );
    }
}
