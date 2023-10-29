import {BlockList} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from 'course-taking/registry/requires';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';
import {
    notificationPreferences,
    NOTIFICATION_TYPES_BY_CODE,
    NOTIFICATION_TYPES,
} from 'user-notification-preferences/notification-preferences';

import './email-settings-menu-item.less';

@observer
class EmailSettingOption extends React.Component {
    static propTypes = {
        typeCode: PropTypes.string.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
    };

    get notificationType() {
        return NOTIFICATION_TYPES_BY_CODE[this.props.typeCode];
    }

    @autobind
    @action
    toggleEmailSetting() {
        const {courseId, enrollment} = this.props.courseTakingStore;
        const {notificationSettings} = enrollment;
        const newValue = !notificationSettings[this.props.typeCode];
        notificationSettings[this.props.typeCode] = newValue;
        notificationPreferences.set(this.notificationType, newValue, courseId);
    }

    render() {
        const {notificationSettings} = this.props.courseTakingStore.enrollment;
        return (
            <BlockList.Item color="neutral">
                <Checkbox
                    onChange={this.toggleEmailSetting}
                    checked={!!notificationSettings[this.props.typeCode]}
                    disabled={!!notificationSettings.disableAllEmails}
                    styleName="email-settings-option-checkbox"
                >
                    {this.notificationType.title}
                </Checkbox>
            </BlockList.Item>
        );
    }
}

@inject('resourceContext')
@requires('courseTakingStore')
@observer
export default class EmailSettingsMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        addDivider: PropTypes.bool,
    };

    static defaultProps = {
        addDivider: true,
    };

    renderEmailSettingOptions() {
        const {notificationSettings} = this.props.courseTakingStore.enrollment;
        return Object.keys(notificationSettings)
            .sort()
            .filter((typeCode) => typeCode !== NOTIFICATION_TYPES.disableAllEmails.typeCode)
            .map((typeCode) => {
                return (
                    <EmailSettingOption
                        key={typeCode}
                        typeCode={typeCode}
                        courseTakingStore={this.props.courseTakingStore}
                    />
                );
            });
    }

    render() {
        return (
            <>
                {this.props.addDivider && <ResourceContextMenu.Divider />}
                {this.renderEmailSettingOptions()}
            </>
        );
    }
}

EmailSettingsMenuItem.shouldRender = ({enrollment}) => enrollment;
