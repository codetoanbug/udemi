import {getUniqueId} from '@udemy/design-system-utils';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import OpenInNewIcon from '@udemy/icons/dist/open-in-new.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import Clipboard from 'clipboard';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {showErrorToast, showSuccessToast} from 'instructor/toasts';
import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import getConfigData from 'utils/get-config-data';

import './thread-actions-dropdown.less';

const udConfig = getConfigData();

@inject('store')
@observer
export default class ThreadActionsDropdown extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired,
        onRemoveFeaturedQuestion: PropTypes.func,
    };

    static defaultProps = {
        onRemoveFeaturedQuestion: undefined,
    };

    constructor(props) {
        super(props);
        this.clipboardId = getUniqueId('in-course-qa-link');
        this.clipboard = new Clipboard(`#${this.clipboardId}`);
        this.clipboard.on('success', this.onCopySuccess);
        this.clipboard.on('error', this.onCopyError);
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    @autobind
    onCopySuccess() {
        showSuccessToast(gettext('Copied to clipboard'));
    }

    @autobind
    onCopyError() {
        showErrorToast(gettext('Unable to copy link'));
    }

    @autobind
    deleteThread(onClose) {
        onClose();
        this.props.store.deleteThread(this.props.thread);
    }

    @autobind
    toggleRead() {
        this.props.store.toggleRead(this.props.thread);
        return false;
    }

    @autobind
    toggleFeatured() {
        const thread = this.props.thread;
        this.props.store.toggleFeatured(thread);
        const isFeatured = thread.is_featured;
        if (this.props.onRemoveFeaturedQuestion && !isFeatured) {
            this.props.onRemoveFeaturedQuestion();
        }
    }

    @autobind
    toggleFollowing() {
        this.props.store.toggleFollowing(this.props.thread);
        return false;
    }

    render() {
        const {thread} = this.props;
        return (
            <Dropdown
                canToggleOnHover={true}
                detachFromTarget={true}
                placement="bottom-end"
                trigger={
                    <IconButton className="ud-link-neutral" udStyle="ghost">
                        <MoreIcon label={gettext('Thread actions')} />
                    </IconButton>
                }
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem onClick={this.toggleRead}>
                        {thread.is_read ? gettext('Mark as unread') : gettext('Mark as read')}
                    </Dropdown.MenuItem>
                    <Dropdown.MenuItem onClick={this.toggleFollowing}>
                        {thread.is_following
                            ? gettext('Unfollow thread')
                            : gettext('Follow thread')}
                    </Dropdown.MenuItem>
                    <ModalTrigger
                        trigger={<Dropdown.MenuItem>{gettext('Delete')}</Dropdown.MenuItem>}
                        renderModal={({isOpen, onClose}) => (
                            <ConfirmModal
                                isOpen={isOpen}
                                onCancel={onClose}
                                onConfirm={() => this.deleteThread(onClose)}
                            >
                                {gettext('Are you sure you want to delete this question?')}
                            </ConfirmModal>
                        )}
                    />
                    {udConfig.features.report_abuse && (
                        <ReportAbuseModalTrigger
                            objectType="coursediscussion"
                            objectId={thread.id}
                            trigger={
                                <Dropdown.MenuItem>{gettext('Report abuse')}</Dropdown.MenuItem>
                            }
                        />
                    )}
                    <Dropdown.MenuItem
                        data-clipboard-text={thread.learning_url}
                        data-purpose="in-course-qa-link"
                        id={this.clipboardId}
                        title={gettext('Get a shareable link to this question in your course')}
                    >
                        <OpenInNewIcon label={false} styleName="icon" />
                        {gettext('Copy thread link')}
                    </Dropdown.MenuItem>
                    <Dropdown.MenuItem onClick={this.toggleFeatured}>
                        {thread.is_featured
                            ? gettext('Remove from  Featured Questions')
                            : gettext('Add to Featured Questions')}
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
