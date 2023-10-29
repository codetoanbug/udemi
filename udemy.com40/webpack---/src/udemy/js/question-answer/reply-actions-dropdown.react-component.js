import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

const udConfig = getConfigData();

@inject('store')
@observer
export default class ReplyActionsDropdown extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired,
        response: PropTypes.object.isRequired,
    };

    @autobind
    toggleTopAnswer() {
        if (this.props.response.is_top_answer) {
            this.props.store.unmarkAsTopAnswer(this.props.thread, this.props.response);
        } else {
            this.props.store.markAsTopAnswer(this.props.thread, this.props.response);
        }
    }

    @autobind
    editReply() {
        this.props.store.startEditingReply(this.props.thread, this.props.response);
    }

    @autobind
    confirmDeleteResponse(onClose) {
        onClose();
        this.props.store.deleteResponse(this.props.thread, this.props.response);
    }

    render() {
        const {response} = this.props;
        return (
            <Dropdown
                canToggleOnHover={true}
                placement="bottom-end"
                trigger={
                    <IconButton className="ud-link-neutral" udStyle="ghost">
                        <MoreIcon label={gettext('Reply actions')} />
                    </IconButton>
                }
            >
                <Dropdown.Menu>
                    {response.user && response.user.id === udMe.id && (
                        <Dropdown.MenuItem onClick={this.editReply}>
                            {gettext('Edit response')}
                        </Dropdown.MenuItem>
                    )}
                    <Dropdown.MenuItem onClick={this.toggleTopAnswer}>
                        {response.is_top_answer
                            ? gettext('Unmark as top answer')
                            : gettext('Mark as top answer')}
                    </Dropdown.MenuItem>
                    <ModalTrigger
                        trigger={<Dropdown.MenuItem>{gettext('Delete')}</Dropdown.MenuItem>}
                        renderModal={({isOpen, onClose}) => (
                            <ConfirmModal
                                isOpen={isOpen}
                                onCancel={onClose}
                                onConfirm={() => this.confirmDeleteResponse(onClose)}
                                confirmText={gettext('Delete')}
                            >
                                {gettext('Are you sure you want to delete this response?')}
                            </ConfirmModal>
                        )}
                    />
                    {udConfig.features.report_abuse && (
                        <ReportAbuseModalTrigger
                            objectType="coursediscussionreply"
                            objectId={response.id}
                            trigger={
                                <Dropdown.MenuItem>{gettext('Report abuse')}</Dropdown.MenuItem>
                            }
                        />
                    )}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
