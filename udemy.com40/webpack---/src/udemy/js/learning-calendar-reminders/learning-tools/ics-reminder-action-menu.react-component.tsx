import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import './learning-tools.less';
import {IcsCalendarButton} from '../calendar-button/ics-calendar-button.react-component';
import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {UpdateReminderForm} from '../learning-reminder-form/update-reminder-form.react-component';
import {uppercaseFirstChar} from '../utils';
import {LearningToolsStore} from './learning-tools.mobx-store';

interface IcsReminderActionMenuProps {
    learningToolsStore: LearningToolsStore;
    formStore: LearningReminderFormStore;
}

@observer
export class IcsReminderActionMenu extends Component<IcsReminderActionMenuProps> {
    @observable showDeleteModal = false;
    @observable showDownloadModal = false;

    @autobind
    @action
    openDeleteModal() {
        this.showDeleteModal = true;
    }

    @autobind
    @action
    closeDeleteModal() {
        this.showDeleteModal = false;
    }

    @autobind
    @action
    openDownloadModal() {
        this.showDownloadModal = true;
    }

    @autobind
    @action
    closeDownloadModal() {
        this.showDownloadModal = false;
    }

    render() {
        const editModal = (
            <Modal
                isOpen={this.props.formStore.showModal}
                onClose={this.props.formStore.closeModal}
                title={gettext('Update your event')}
            >
                <UpdateReminderForm
                    store={this.props.formStore}
                    learningToolsStore={this.props.learningToolsStore}
                />
            </Modal>
        );

        const deleteModal = (
            <Modal
                title={gettext('Delete event')}
                isOpen={this.showDeleteModal}
                onClose={this.closeDeleteModal}
            >
                <p>
                    {this.props.formStore.calendarType &&
                        interpolate(
                            gettext(
                                '%(calendarType)s will download an ics file. Open the file to delete the event from your calendar.',
                            ),
                            {
                                calendarType: uppercaseFirstChar(this.props.formStore.calendarType),
                            },
                            true,
                        )}
                </p>
                <div styleName="button-container">
                    <Button
                        udStyle="secondary"
                        styleName="cancel-button"
                        onClick={this.closeDeleteModal}
                        data-purpose="close-delete-modal"
                    >
                        {gettext('Cancel')}
                    </Button>
                    <IcsCalendarButton
                        action="delete"
                        udStyle="primary"
                        formStore={this.props.formStore}
                        learningToolsStore={this.props.learningToolsStore}
                        onComplete={this.closeDeleteModal}
                    />
                </div>
            </Modal>
        );

        const downloadModal = (
            <Modal
                title={gettext('Download event')}
                isOpen={this.showDownloadModal}
                onClose={this.closeDownloadModal}
            >
                <p>
                    {this.props.formStore.calendarType &&
                        interpolate(
                            gettext(
                                '%(calendarType)s will download an ics file. Open the file to add the event from your calendar.',
                            ),
                            {
                                calendarType: uppercaseFirstChar(this.props.formStore.calendarType),
                            },
                            true,
                        )}
                </p>
                <div styleName="button-container">
                    <Button
                        udStyle="secondary"
                        styleName="cancel-button"
                        onClick={this.closeDownloadModal}
                        data-purpose="close-download-modal"
                    >
                        {gettext('Cancel')}
                    </Button>
                    <IcsCalendarButton
                        action="redownload"
                        udStyle="primary"
                        formStore={this.props.formStore}
                        learningToolsStore={this.props.learningToolsStore}
                        onComplete={this.closeDownloadModal}
                    />
                </div>
            </Modal>
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
                        <Dropdown.MenuItem
                            data-purpose="edit-button"
                            onClick={this.props.formStore.openModal}
                        >
                            {gettext('Edit')}
                        </Dropdown.MenuItem>
                        <Dropdown.MenuItem
                            data-purpose="delete-button"
                            onClick={this.openDeleteModal}
                        >
                            {gettext('Delete')}
                        </Dropdown.MenuItem>
                        <Dropdown.MenuItem
                            data-purpose="redownload-button"
                            onClick={this.openDownloadModal}
                        >
                            {gettext('Download again')}
                        </Dropdown.MenuItem>
                    </Dropdown.Menu>
                </Dropdown>
                {this.props.formStore.showModal && editModal}
                {this.showDeleteModal && deleteModal}
                {this.showDownloadModal && downloadModal}
            </>
        );
    }
}
