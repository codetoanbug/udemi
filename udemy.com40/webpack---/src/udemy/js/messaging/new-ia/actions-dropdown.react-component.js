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

const udConfig = getConfigData();

@inject('store')
@observer
export default class ActionsDropdown extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired,
    };

    @autobind
    deleteThread(onClose) {
        onClose();
        this.props.store.deleteThread(this.props.thread);
    }

    @autobind
    muteThread() {
        this.props.store.setMuted(this.props.thread);
    }

    @autobind
    toggleStarred() {
        this.props.store.toggleStarred(this.props.thread);
        return false;
    }

    @autobind
    toggleRead() {
        this.props.store.toggleRead(this.props.thread);
        return false;
    }

    render() {
        const {store, thread} = this.props;
        return (
            <Dropdown
                canToggleOnHover={true}
                placement="bottom-end"
                trigger={
                    <IconButton className="ud-link-neutral" udStyle="ghost">
                        <MoreIcon label={gettext('Conversation actions')} />
                    </IconButton>
                }
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem onClick={this.toggleRead}>
                        {thread.is_read ? gettext('Mark as unread') : gettext('Mark as read')}
                    </Dropdown.MenuItem>
                    <Dropdown.MenuItem onClick={this.toggleStarred}>
                        {thread.is_starred
                            ? gettext('Mark as unimportant')
                            : gettext('Mark as important')}
                    </Dropdown.MenuItem>
                    <ModalTrigger
                        trigger={<Dropdown.MenuItem>{gettext('Block')}</Dropdown.MenuItem>}
                        renderModal={({isOpen, onClose}) => (
                            <ConfirmModal
                                isOpen={isOpen}
                                onCancel={onClose}
                                onConfirm={() => this.deleteThread(onClose)}
                            >
                                {gettext(
                                    'Are you sure you want to block this message thread? ' +
                                        'You will no longer receive updates if this user sends you a new message. If ' +
                                        'you send this user a new message, the thread will be unblocked.',
                                )}
                            </ConfirmModal>
                        )}
                    />
                    {store.showMuteMessage && (
                        <Dropdown.MenuItem onClick={this.muteThread}>
                            {gettext('Archive')}
                        </Dropdown.MenuItem>
                    )}
                    {udConfig.features.report_abuse && (
                        <ReportAbuseModalTrigger
                            objectType="messagethread"
                            objectId={thread.id}
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
