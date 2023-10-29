import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {Avatar, BlockList, Button} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import udLink from 'utils/ud-link';
import './subscription-modal-content.less';

export default class ExpiredSubscriptionContent extends Component {
    static propTypes = {
        store: PropTypes.shape({
            expirationData: PropTypes.object.isRequired,
            modalTitleId: PropTypes.string.isRequired,
        }).isRequired,
        window: PropTypes.object,
    };

    static defaultProps = {
        window,
    };

    renderAdminList() {
        const {expirationData} = this.props.store;
        const adminItems = expirationData.admins.map((admin) => (
            <BlockList.Item key={admin.id}>
                <div styleName="admin-list-item">
                    <Avatar user={admin} alt="NONE" />
                    <strong styleName="details" className="ud-heading-lg">
                        {admin.fullname}
                    </strong>
                </div>
            </BlockList.Item>
        ));
        return (
            <BlockList
                styleName="admin-list"
                data-purpose="admin-list"
                size="small"
                padding="tight"
            >
                {adminItems}
            </BlockList>
        );
    }

    render() {
        return (
            <div>
                <WarningIcon label={false} color="warning" styleName="modal-icon" />
                <h3
                    id={this.props.store.modalTitleId}
                    className="ud-heading-xxl"
                    styleName="modal-title"
                    data-purpose="modal-title"
                >
                    {gettext('Your subscription has expired')}
                </h3>
                <div styleName="modal-message">
                    <p>
                        {gettext(
                            'Here are the admins of this account who can renew your subscription',
                        )}
                    </p>
                    {this.renderAdminList()}
                </div>
                <div styleName="cta-wrapper">
                    <Button
                        udStyle="ghost"
                        size="medium"
                        componentClass="a"
                        href={udLink.toSupportContact(undefined, 'user')}
                        target="_blank"
                        data-purpose="chat-with-us"
                    >
                        {gettext('Got questions? Chat with us')}
                    </Button>
                </div>
            </div>
        );
    }
}
