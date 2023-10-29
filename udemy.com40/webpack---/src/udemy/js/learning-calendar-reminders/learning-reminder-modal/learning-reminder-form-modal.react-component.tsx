import {Modal} from '@udemy/react-dialog-components';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {GoogleCalendarAuthStore} from 'learning-calendar-reminders/calendar-button/google-calendar-auth.mobx-store';

import {CreateReminderForm} from '../learning-reminder-form/create-reminder-form.react-component';
import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {LearningReminderModalStore} from './learning-reminder-modal.mobx-store';
import './learning-reminder-modal.less';

interface LearningReminderModalProps {
    learningReminderModalStore: LearningReminderModalStore;
    learningToolsStore: LearningToolsStore;
    googleAuthStore: GoogleCalendarAuthStore;
    shouldRedirect: boolean;
    contentType?: string;
    objectId?: number;
    objectTitle?: string;
    objectUrl?: string;
    title?: string;
}
@observer
export class LearningReminderFormModal extends Component<LearningReminderModalProps> {
    static defaultProps = {
        shouldRedirect: true,
        learningToolsStore: null,
    };

    constructor(props: LearningReminderModalProps) {
        super(props);
        this.learningReminderModalStore = this.props.learningReminderModalStore;
        this.createReminderFormStore = new LearningReminderFormStore(
            this.props.googleAuthStore,
            this.props.shouldRedirect,
            false,
            null,
            this.props.contentType,
            this.props.objectId,
            this.props.objectTitle,
            this.props.objectUrl,
            this.props.title,
        );
    }

    private learningReminderModalStore: LearningReminderModalStore;
    private readonly createReminderFormStore: LearningReminderFormStore;
    renderLearningReminder() {
        return (
            <CreateReminderForm
                store={this.createReminderFormStore}
                onFormCompleted={this.learningReminderModalStore.closeModal}
                learningToolsStore={this.props.learningToolsStore}
            />
        );
    }

    render() {
        return (
            <Modal
                title={gettext('Create an event')}
                isOpen={this.learningReminderModalStore.isModalOpen}
                onClose={this.learningReminderModalStore.closeModal}
            >
                {this.renderLearningReminder()}
            </Modal>
        );
    }
}
