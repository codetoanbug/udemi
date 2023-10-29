import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import udMe from 'utils/ud-me';

@inject('store')
@observer
export default class FeedbackActionsDropdown extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired,
        response: PropTypes.object.isRequired,
    };

    @autobind
    deleteResponse() {
        this.props.store.deleteResponse(this.props.thread, this.props.response);
    }

    @autobind
    editReply() {
        this.props.store.startEditingReply(this.props.thread, this.props.response);
    }

    render() {
        const {response} = this.props;

        return (
            <Dropdown
                canToggleOnHover={true}
                placement="top-end"
                trigger={
                    <IconButton className="ud-link-neutral" udStyle="ghost">
                        <MoreIcon label={gettext('Response actions')} />
                    </IconButton>
                }
            >
                <Dropdown.Menu>
                    {response.user && response.user.id === udMe.id && (
                        <Dropdown.MenuItem onClick={this.editReply}>
                            {gettext('Edit response')}
                        </Dropdown.MenuItem>
                    )}
                    <Dropdown.MenuItem onClick={this.deleteResponse}>
                        {gettext('Delete')}
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
