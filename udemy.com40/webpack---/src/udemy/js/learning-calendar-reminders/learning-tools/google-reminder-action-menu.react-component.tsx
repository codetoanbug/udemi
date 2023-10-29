import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import './learning-tools.less';

import {GoogleCalendarButton} from '../calendar-button/google-calendar-button.react-component';
import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {UpdateReminderForm} from '../learning-reminder-form/update-reminder-form.react-component';
import {LearningToolsStore} from './learning-tools.mobx-store';

interface GoogleReminderActionMenuProps {
    learningToolsStore: LearningToolsStore;
    formStore: LearningReminderFormStore;
}

@observer
export class GoogleReminderActionMenu extends Component<GoogleReminderActionMenuProps> {
    @autobind
    handleClick(e: React.MouseEvent) {
        // Prevent dropdown menu from closing on click
        e.preventDefault();
    }

    render() {
        const {formStore} = this.props;

        const editModal = (
            <Modal
                isOpen={formStore.showModal}
                onClose={formStore.closeModal}
                title={gettext('Update your event')}
            >
                <UpdateReminderForm
                    store={formStore}
                    learningToolsStore={this.props.learningToolsStore}
                />
            </Modal>
        );

        const deleteButton = (
            <GoogleCalendarButton
                action="delete"
                udStyle="link"
                typography="ud-text-sm"
                formStore={formStore}
                learningToolsStore={this.props.learningToolsStore}
                googleAuthStore={formStore.googleAuthStore}
            />
        );

        const redownloadButton = (
            <GoogleCalendarButton
                action="redownload"
                udStyle="link"
                typography="ud-text-sm"
                formStore={formStore}
                learningToolsStore={this.props.learningToolsStore}
                googleAuthStore={formStore.googleAuthStore}
            />
        );

        return (
            <>
                <Dropdown
                    placement="bottom-end"
                    trigger={
                        <Button udStyle="link" styleName="more-button">
                            <MoreIcon label={gettext('More learning reminder actions')} />
                        </Button>
                    }
                    styleName="dropdown"
                >
                    <Dropdown.Menu>
                        <Dropdown.MenuItem data-purpose="edit-button" onClick={formStore.openModal}>
                            {gettext('Edit')}
                        </Dropdown.MenuItem>
                        <Dropdown.MenuItem
                            componentClass="a"
                            styleName="google-button"
                            onClick={(e: React.MouseEvent) => {
                                this.handleClick(e);
                            }}
                        >
                            {deleteButton}
                        </Dropdown.MenuItem>
                        <Dropdown.MenuItem
                            componentClass="a"
                            styleName="google-button"
                            onClick={(e: React.MouseEvent) => {
                                this.handleClick(e);
                            }}
                        >
                            {redownloadButton}
                        </Dropdown.MenuItem>
                    </Dropdown.Menu>
                </Dropdown>
                {formStore.showModal && editModal}
            </>
        );
    }
}
