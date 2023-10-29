import {Button} from '@udemy/react-core-components';
import {CheckboxBlock, ToggleInputBlockFormGroup} from '@udemy/react-form-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {NOTIFICATION_OPTIONS} from './constants';
import NotificationPreferencesStore from './notification-preferences.mobx-store';

import './notification-preferences.less';

export const StudentOptions = observer(({renderCheckbox}) => (
    <form>
        <ToggleInputBlockFormGroup label={gettext('I want to receive:')}>
            {renderCheckbox(NOTIFICATION_OPTIONS.forStudents)}
            {renderCheckbox(NOTIFICATION_OPTIONS.instructorAnnouncements)}
            <hr styleName="divider" />
            {renderCheckbox(NOTIFICATION_OPTIONS.disableAll)}
        </ToggleInputBlockFormGroup>
    </form>
));

StudentOptions.propTypes = {
    renderCheckbox: PropTypes.func.isRequired,
};

export const InstructorOptions = observer(({renderCheckbox}) => (
    <form>
        <ToggleInputBlockFormGroup label={gettext('As an instructor, I want to receive:')}>
            {renderCheckbox(NOTIFICATION_OPTIONS.forInstructors)}
        </ToggleInputBlockFormGroup>
        <ToggleInputBlockFormGroup label={gettext('As a student, I want to receive:')}>
            {renderCheckbox(NOTIFICATION_OPTIONS.disabledForInstructors)}
            {renderCheckbox(NOTIFICATION_OPTIONS.instructorAnnouncements)}
            <hr styleName="divider" />
            {renderCheckbox(NOTIFICATION_OPTIONS.disableAll)}
        </ToggleInputBlockFormGroup>
    </form>
));

InstructorOptions.propTypes = {
    renderCheckbox: PropTypes.func.isRequired,
};

export const OrganizationStudentOptions = observer(
    ({renderCheckbox, isInstructorAnnouncementsDisabled}) => {
        const instructorAnnouncementsOptions = isInstructorAnnouncementsDisabled
            ? NOTIFICATION_OPTIONS.instructorAnnouncementsDisabled
            : NOTIFICATION_OPTIONS.instructorAnnouncements;

        return (
            <form>
                <ToggleInputBlockFormGroup label={gettext('As a student, I want to receive:')}>
                    {renderCheckbox(NOTIFICATION_OPTIONS.forOrganizationStudents)}
                    {renderCheckbox(instructorAnnouncementsOptions)}
                </ToggleInputBlockFormGroup>
            </form>
        );
    },
);

OrganizationStudentOptions.propTypes = {
    renderCheckbox: PropTypes.func.isRequired,
    isInstructorAnnouncementsDisabled: PropTypes.bool,
};

OrganizationStudentOptions.defaultProps = {
    isInstructorAnnouncementsDisabled: false,
};

@observer
export default class NotificationPreferences extends Component {
    static propTypes = {
        showOrganization: PropTypes.bool,
        store: PropTypes.object,
    };

    static defaultProps = {
        showOrganization: false,
        store: null,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new NotificationPreferencesStore(props.showOrganization);
    }

    componentDidMount() {
        this.store.fetchInitialData();
        this.store.getSettings();
    }

    @autobind
    @action
    handleCheckboxClick(event) {
        const emailType = event.target.name;
        const isChecked = event.target.checked;
        return this.store.setSetting(emailType, isChecked);
    }

    @autobind
    renderCheckbox(option) {
        return (
            <CheckboxBlock
                name={option.name}
                disabled={option.disabled}
                checked={this.store.emailPreferences[option.name]}
                onChange={this.handleCheckboxClick}
                data-purpose={option.name}
                details={option.secondaryText}
            >
                {option.primaryText}
            </CheckboxBlock>
        );
    }

    render() {
        let options;
        if (this.store.isLoadingInitialData) {
            return <MainContentLoader />;
        }

        if (this.store.hasOrganizationNotifications) {
            options = (
                <OrganizationStudentOptions
                    renderCheckbox={this.renderCheckbox}
                    isInstructorAnnouncementsDisabled={this.store.isInstructorAnnouncementsDisabled}
                />
            );
        } else if (this.store.isInstructor) {
            options = <InstructorOptions renderCheckbox={this.renderCheckbox} />;
        } else {
            options = <StudentOptions renderCheckbox={this.renderCheckbox} />;
        }

        return (
            <div styleName="notification-preferences">
                {options}
                <FooterButtons alignment="left" styleName="submit-row">
                    <Button
                        onClick={this.store.savePreferences}
                        disabled={this.store.isLoading}
                        data-purpose="save-preferences"
                    >
                        {gettext('Save')}
                    </Button>
                </FooterButtons>
            </div>
        );
    }
}
