import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import Tabs from 'base-components/tabs/tabs.react-component';
import NotificationPreferences from 'user-notification-preferences/notification-preferences.react-component';
import getConfigData from 'utils/get-config-data';

import ApiClients from './account/api-clients.react-component';
import CloseAccountInfo from './account/close-account-info.react-component';
import MessagePreferences from './account/message-preferences.react-component';
import Security from './account/security.react-component';

const udConfig = getConfigData();

@withRouter
@observer
export default class Account extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        showMFAToggle: PropTypes.bool.isRequired,
        isMFAEnabled: PropTypes.bool.isRequired,
    };

    sections = {
        security: {
            title: gettext('Account security'),
            path: '/account/security/',
        },
        notifications: {
            title: gettext('Notifications settings'),
            path: '/account/notifications/',
        },
        messages: {
            title: gettext('Message settings'),
            path: '/account/messages/',
        },
        api: {
            title: gettext('API clients'),
            path: '/account/api/',
            show: !udConfig.brand.has_organization,
        },
        close: {
            title: gettext('Close account'),
            path: '/account/close/',
        },
    };

    @autobind @action onSelectTab(id) {
        this.activeTabId = id;
        this.props.history.push(id);
    }

    render() {
        return (
            <>
                <h1 className="instructor-main-heading ud-heading-serif-xxl">
                    {gettext('Account')}
                </h1>
                <Tabs
                    activeTabId={
                        this.props.history.location.pathname || this.sections.notifications.path
                    }
                    onSelect={this.onSelectTab}
                >
                    <Tabs.Tab id={this.sections.security.path} title={this.sections.security.title}>
                        <Security
                            showMFAToggle={this.props.showMFAToggle}
                            isMFAEnabled={this.props.isMFAEnabled}
                        />
                    </Tabs.Tab>
                    <Tabs.Tab
                        id={this.sections.notifications.path}
                        title={this.sections.notifications.title}
                    >
                        <NotificationPreferences showOrganization={true} />
                    </Tabs.Tab>
                    <Tabs.Tab id={this.sections.messages.path} title={this.sections.messages.title}>
                        <MessagePreferences />
                    </Tabs.Tab>
                    {this.sections.api.show && (
                        <Tabs.Tab id={this.sections.api.path} title={this.sections.api.title}>
                            <ApiClients />
                        </Tabs.Tab>
                    )}
                    <Tabs.Tab id={this.sections.close.path} title={this.sections.close.title}>
                        <CloseAccountInfo />
                    </Tabs.Tab>
                </Tabs>
            </>
        );
    }
}
