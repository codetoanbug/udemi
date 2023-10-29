import {withI18n} from '@udemy/i18n';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Avatar, IconButton} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {GA_CAN_INVITE_AND_DEACTIVATE} from 'organization-manage-users/permissions/constants';
import userHasPermission from 'organization-manage-users/permissions/utils';

import styles from './user-autocomplete-result.less';

@observer
class InternalUserAutocompleteResult extends Component {
    static propTypes = {
        onClose: PropTypes.func,
        user: PropTypes.object.isRequired,
        isAssigned: PropTypes.bool,
        isPermissionsEnabled: PropTypes.bool,
        onPermissionChange: PropTypes.func,
        displayEmails: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        onClose: undefined,
        isAssigned: false,
        isPermissionsEnabled: false,
        onPermissionChange: undefined,
        displayEmails: true,
    };

    onCloseClick = () => {
        if (this.props.onClose) {
            this.props.onClose(this.props.user);
        }
    };

    changePermission = () => {
        if (this.props.onPermissionChange) {
            this.props.onPermissionChange(this.props.user);
        }
    };

    get checkedSet() {
        if (userHasPermission(this.props.user, GA_CAN_INVITE_AND_DEACTIVATE)) {
            this.changePermission();
            return true;
        }
        return false;
    }

    render() {
        const {user, onClose, isAssigned, isPermissionsEnabled, gettext} = this.props;
        return (
            <div
                key={user.id}
                className={classNames(styles.wrapper, {
                    [styles['is-suggestion-item']]: onClose,
                })}
                data-purpose="user-autocomplete-result"
            >
                <Avatar alt="NONE" user={user} size="small" />

                <div className={styles['user-info']}>
                    <div data-purpose="display-name" className="ud-heading-sm">
                        {user.display_name}
                    </div>
                    {this.props.displayEmails && (
                        <div
                            data-purpose="email"
                            className={classNames('ud-text-xs', styles['user-email'])}
                        >
                            {user.email}
                        </div>
                    )}
                    {isPermissionsEnabled && (
                        <Checkbox
                            className={styles['permission-assign']}
                            defaultChecked={this.checkedSet}
                            onChange={this.changePermission}
                        >
                            {gettext(
                                'Allow user to invite and deactivate users within the groups they manage',
                            )}
                        </Checkbox>
                    )}
                </div>
                {onClose && (
                    <IconButton
                        data-purpose="close-button"
                        onClick={this.onCloseClick}
                        udStyle="ghost"
                        size="small"
                    >
                        <CloseIcon label={gettext('remove user')} color="neutral" />
                    </IconButton>
                )}
                {isAssigned && (
                    <div
                        data-purpose="is-assigned"
                        className={classNames('ud-text-xs', styles['assigned-text'])}
                    >
                        {gettext('Already assigned')}
                    </div>
                )}
            </div>
        );
    }
}

const UserAutocompleteResult = withI18n(InternalUserAutocompleteResult);

export default UserAutocompleteResult;
