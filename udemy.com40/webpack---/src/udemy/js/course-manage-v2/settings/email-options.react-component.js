import {Checkbox} from '@udemy/react-form-components';
import {Dropdown} from '@udemy/react-menu-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {NOTIFICATION_TYPES_BY_CODE} from 'user-notification-preferences/notification-preferences';

@observer
export default class EmailOptions extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    onChange(setting, value) {
        return () =>
            this.props.store.updateUserNotification(NOTIFICATION_TYPES_BY_CODE[setting], value);
    }

    render() {
        if (!this.props.store.courseLoaded) {
            return null;
        }
        const userNotifications = this.props.store.course.userNotifications;
        return (
            <Dropdown
                placement="bottom-end"
                menuWidth="fullWidth"
                trigger={<Dropdown.Button>{gettext('Manage Email Notifications')}</Dropdown.Button>}
            >
                <Dropdown.Menu>
                    {Object.keys(userNotifications)
                        .sort()
                        .filter((setting) => setting !== 'disableAllEmails')
                        .map((setting) => (
                            <Dropdown.MenuItem
                                key={setting}
                                componentClass={Checkbox}
                                checked={userNotifications[setting]}
                                onChange={this.onChange(setting, !userNotifications[setting])}
                                onClick={() => false}
                                disabled={userNotifications.disableAllEmails}
                                data-purpose={`user-notification-checkbox-${setting}`}
                            >
                                {NOTIFICATION_TYPES_BY_CODE[setting].title}
                            </Dropdown.MenuItem>
                        ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
