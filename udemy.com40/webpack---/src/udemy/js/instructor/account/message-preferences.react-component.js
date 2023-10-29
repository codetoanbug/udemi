import {Button} from '@udemy/react-core-components';
import {CheckboxBlock} from '@udemy/react-form-components';
import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {DIRECT_MESSAGING_EVENTS} from 'messaging/events';
import DirectMessageEventTracker from 'messaging/trackers';

import MessagePreferencesStore from './message-preferences.mobx-store';

import './message-preferences.less';

const primaryText = gettext('Turn off direct messaging');
const secondaryText = gettext(
    'When you turn off direct messages, you will no longer be able to send or receive ' +
        'direct messages as an instructor.',
);

@observer
export default class MessagePreferences extends Component {
    static propTypes = {
        store: PropTypes.object,
    };

    static defaultProps = {
        store: null,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new MessagePreferencesStore();
    }

    componentDidMount() {
        this.store.getSettings();
    }

    @autobind
    @action
    handleCheckboxClick(event) {
        this.store.setDisableDirectMessagingData(event.target.checked);
        DirectMessageEventTracker.track(
            DIRECT_MESSAGING_EVENTS.DirectMessageSettingActionEvent,
            'set',
            {
                name: 'direct_messaging_enabled',
                value: this.store.isDirectMessagingDisabled ? 'off' : 'on',
            },
        );
    }

    @autobind
    @action
    onSubmit(event) {
        event.preventDefault();
        this.store.updateMessageSetting();
        if (this.store.isUpdated) {
            const bannerProps = {
                udStyle: 'success',
                title: gettext('You have updated your message settings'),
                showCta: false,
            };
            toasterStore.addAlertBannerToast(bannerProps, {
                autoDismiss: true,
                autoDismissTimeout: 5000,
            });
        }
        DirectMessageEventTracker.track(
            DIRECT_MESSAGING_EVENTS.DirectMessageSettingActionEvent,
            'save',
            {
                name: 'direct_messaging_enabled',
                value: this.store.isDirectMessagingDisabled ? 'off' : 'on',
            },
        );
    }

    render() {
        const store = this.store;

        if (!this.store.hasLoadedSettings) {
            return <MainContentLoader />;
        }

        return (
            <div>
                <form onSubmit={this.onSubmit} data-purpose="message-settings-form">
                    <CheckboxBlock
                        checked={store.isDirectMessagingDisabled}
                        details={secondaryText}
                        onChange={this.handleCheckboxClick}
                        name="isDirectMessagingDisabled"
                    >
                        {primaryText}
                    </CheckboxBlock>
                    <div className="ud-text-with-links" styleName="link-container">
                        <a
                            href="https://support.udemy.com/hc/articles/229231387-Messaging-Students"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {gettext('Learn more about the setting')}
                        </a>
                    </div>
                    <FooterButtons alignment="left">
                        <Button
                            type="submit"
                            disabled={!store.isSubmitting}
                            data-purpose="message-settings-submit-button"
                        >
                            {gettext('Save')}
                        </Button>
                    </FooterButtons>
                </form>
            </div>
        );
    }
}
