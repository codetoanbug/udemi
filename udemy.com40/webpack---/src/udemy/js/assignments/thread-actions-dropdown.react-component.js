import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@inject('store')
@observer
export default class ThreadActionsDropdown extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired,
    };

    @autobind
    toggleRead() {
        this.props.store.toggleRead(this.props.thread);
        return false;
    }

    render() {
        const {thread} = this.props;
        return (
            <Dropdown
                canToggleOnHover={true}
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
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
