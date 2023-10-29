import FlagIcon from '@udemy/icons/dist/flag.ud-icon';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router';

import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import getConfigData from 'utils/get-config-data';

import requires from '../../../registry/requires';
import {TABS} from '../../constants';
import ActionMenu from './action-menu.react-component';

const udConfig = getConfigData();

@withRouter
@requires('questionAnswerStore')
@observer
export default class QuestionActionMenu extends React.Component {
    static propTypes = {
        questionAnswerStore: PropTypes.shape({
            activeQuestion: PropTypes.object,
            deleteQuestion: PropTypes.func,
        }).isRequired,
        onEdit: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
    };

    get question() {
        return this.props.questionAnswerStore.activeQuestion;
    }

    @autobind
    deleteQuestion(onClose) {
        onClose();
        this.props.questionAnswerStore
            .deleteQuestion(this.question)
            .then(this.goToQuestionsOverview);
    }

    @autobind
    goToQuestionsOverview() {
        this.props.history.push(`#${TABS.QUESTIONS}`);
    }

    get questionEdit() {
        if (!this.question.isMine) {
            return null;
        }
        return (
            <Dropdown.MenuItem data-purpose="edit-question" onClick={this.props.onEdit}>
                {gettext('Edit')}
            </Dropdown.MenuItem>
        );
    }

    get questionDelete() {
        if (!this.question.isMine) {
            return null;
        }
        return (
            <ModalTrigger
                trigger={
                    <Dropdown.MenuItem data-purpose="delete-question">
                        {gettext('Delete')}
                    </Dropdown.MenuItem>
                }
                renderModal={({isOpen, onClose}) => (
                    <ConfirmModal
                        isOpen={isOpen}
                        onCancel={onClose}
                        onConfirm={() => this.deleteQuestion(onClose)}
                    >
                        {gettext('Are you sure you want to delete your question?')}
                    </ConfirmModal>
                )}
            />
        );
    }

    get reportAbuse() {
        if (!udConfig.features.report_abuse || this.question.isMine) {
            return null;
        }
        return (
            <ReportAbuseModalTrigger
                objectType="coursediscussion"
                objectId={this.question.id}
                trigger={
                    <Dropdown.MenuItem icon={<FlagIcon label={false} />}>
                        {gettext('Report abuse')}
                    </Dropdown.MenuItem>
                }
            />
        );
    }

    render() {
        return (
            <ActionMenu ariaLabel={gettext('Question options')}>
                {this.questionEdit}
                {this.questionDelete}
                {this.reportAbuse}
            </ActionMenu>
        );
    }
}
