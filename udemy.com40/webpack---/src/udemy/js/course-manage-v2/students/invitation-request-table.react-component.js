import {Avatar, Button} from '@udemy/react-core-components';
import {Table} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import InvitationRequestStore from './invitation-request-table.mobx-store';
import renderDate from './render-date';
import './invitation-request-table.less';

@observer
export default class InvitationRequestTable extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new InvitationRequestStore(this.props.courseId);
    }

    componentDidMount() {
        this.store.loadInvitationRequests();
    }

    @autobind
    renderNameCell(invitation) {
        return (
            <div styleName="user-profile">
                <Avatar size="medium" user={invitation.user} alt="NONE" srcKey="image_50x50" />
                <a href={invitation.user.url}>{invitation.user.title}</a>
            </div>
        );
    }

    @autobind
    renderDateCell(invitation) {
        return renderDate(invitation.created);
    }

    @autobind
    renderActionsCell(invitation) {
        const disabled = this.store.updateInProgress === invitation;
        return (
            <div styleName="actions">
                <Button
                    udStyle="ghost"
                    onClick={() => this.store.updateInvitationRequest(invitation, 'rejected')}
                    disabled={disabled}
                >
                    {gettext('Ignore')}
                </Button>
                <Button
                    onClick={() => this.store.updateInvitationRequest(invitation, 'approved')}
                    disabled={disabled}
                >
                    {gettext('Approve')}
                </Button>
            </div>
        );
    }

    get columns() {
        return [
            {
                fieldName: 'students',
                headerName: gettext('Students requesting to join'),
                renderMethod: this.renderNameCell,
            },
            {
                fieldName: 'date',
                headerName: gettext('Request Date'),
                renderMethod: this.renderDateCell,
            },
            {
                fieldName: 'actions',
                headerName: gettext('Actions'),
                isScreenReaderOnly: true,
                renderMethod: this.renderActionsCell,
            },
        ];
    }

    render() {
        if (this.store.invitations.length === 0) {
            return null;
        }
        return (
            <div styleName="invitation-request-table">
                <Table
                    noBackgroundColor={true}
                    noBorder={true}
                    caption={gettext('Student invitation requests')}
                    columns={this.columns}
                    rows={this.store.invitations.slice()}
                />
            </div>
        );
    }
}
