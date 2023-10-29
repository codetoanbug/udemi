import FlagIcon from '@udemy/icons/dist/flag.ud-icon';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import getConfigData from 'utils/get-config-data';

import requires from '../../../registry/requires';
import ActionMenu from './action-menu.react-component';

const udConfig = getConfigData();

@requires('questionAnswerStore')
@observer
export default class AnswerActionMenu extends React.Component {
    static propTypes = {
        questionAnswerStore: PropTypes.shape({
            markTopAnswer: PropTypes.func,
            canManageCourseQA: PropTypes.bool,
        }).isRequired,
        question: PropTypes.object.isRequired,
        answer: PropTypes.object.isRequired,
        onEdit: PropTypes.func.isRequired,
    };

    @autobind
    deleteAnswer(onClose) {
        onClose();
        this.props.question.deleteAnswer(this.props.answer);
    }

    @autobind
    onTopAnswerToggle() {
        this.props.questionAnswerStore.markTopAnswer(
            this.props.question,
            this.props.answer,
            !this.props.answer.isTopAnswer,
        );
    }

    get answerEdit() {
        if (!this.props.answer.isMine) {
            return null;
        }
        return (
            <Dropdown.MenuItem data-purpose="edit-answer" onClick={this.props.onEdit}>
                {gettext('Edit')}
            </Dropdown.MenuItem>
        );
    }

    get answerDelete() {
        if (!this.props.answer.isMine) {
            return null;
        }
        return (
            <ModalTrigger
                trigger={
                    <Dropdown.MenuItem data-purpose="delete-answer">
                        {gettext('Delete')}
                    </Dropdown.MenuItem>
                }
                renderModal={({isOpen, onClose}) => (
                    <ConfirmModal
                        isOpen={isOpen}
                        onCancel={onClose}
                        onConfirm={() => this.deleteAnswer(onClose)}
                    >
                        {gettext('Are you sure you want to delete your reply?')}
                    </ConfirmModal>
                )}
            />
        );
    }

    get reportAbuse() {
        if (!udConfig.features.report_abuse || this.props.answer.isMine) {
            return null;
        }
        return (
            <ReportAbuseModalTrigger
                objectType="coursediscussionreply"
                objectId={this.props.answer.id}
                trigger={
                    <Dropdown.MenuItem
                        data-purpose="report-abuse"
                        icon={<FlagIcon label={false} />}
                    >
                        {gettext('Report abuse')}
                    </Dropdown.MenuItem>
                }
            />
        );
    }

    get markAsTopAnswerToggle() {
        if (!this.props.question.isMine && !this.props.questionAnswerStore.canManageCourseQA) {
            return null;
        }
        return (
            <Dropdown.MenuItem onClick={this.onTopAnswerToggle} data-purpose="mark-as-top-answer">
                {this.props.answer.isTopAnswer
                    ? gettext('Unmark as top answer')
                    : gettext('Mark as top answer')}
            </Dropdown.MenuItem>
        );
    }

    render() {
        return (
            <ActionMenu ariaLabel={gettext('Answer options')}>
                {this.markAsTopAnswerToggle}
                {this.answerEdit}
                {this.answerDelete}
                {this.reportAbuse}
            </ActionMenu>
        );
    }
}
