import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {FormGroup, TextInput, Select} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import MainContent from 'course-manage-v2/main-content.react-component';

import * as SettingsStoreModule from './settings.mobx-store';
import './course-settings.less';

@inject('store')
@observer
export default class CoursePrivacy extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @autobind
    updateSettings(event) {
        this.props.store.privacyStore.updatePrivacySetting(event.target.value);
    }

    @autobind
    updatePassword(event) {
        this.props.store.privacyStore.updatePassword(event.target.value);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.store.privacyStore.savePrivacySettings();
    }

    renderUFBText() {
        return (
            <>
                <h3 className="ud-heading-md" styleName="mb-xs">
                    {gettext('Enrollment (Privacy)')}
                </h3>
                <p>
                    <LocalizedHtml
                        html={gettext(
                            'This course is part of the Udemy Business ' +
                                'Content Collection. If you wish to make this course ' +
                                'private please contact the Udemy Business team at: ' +
                                '<a class="emailLink">ufbcontent@udemy.com</a>.',
                        )}
                        interpolate={{
                            emailLink: (
                                <a
                                    className="ud-link-underline"
                                    href="mailto:ufbcontent@udemy.com"
                                />
                            ),
                        }}
                    />
                </p>
            </>
        );
    }

    renderDropDownForm() {
        return (
            <form styleName="line-length-md privacy-form" onSubmit={this.onSubmit}>
                <FormGroup
                    label={gettext('Enrollment (Privacy)')}
                    labelProps={{typography: 'ud-heading-md'}}
                >
                    <Select
                        name="privacy"
                        onChange={this.updateSettings}
                        value={this.props.store.privacyStore.optionState}
                    >
                        <option value={SettingsStoreModule.OPTION_PUBLIC}>
                            {gettext('Public')}
                        </option>
                        <option value={SettingsStoreModule.OPTION_PRIVATE_INVITE}>
                            {gettext('Private (Invitation Only)')}
                        </option>
                        <option value={SettingsStoreModule.OPTION_PRIVATE_PASSWORD}>
                            {gettext('Private (Password Protected)')}
                        </option>
                    </Select>
                </FormGroup>
                {this.props.store.privacyStore.showPassword && (
                    <FormGroup
                        label={gettext('Password')}
                        labelProps={{className: 'ud-sr-only'}}
                        note={gettext('Password needs to be non-blank')}
                        validationState={this.props.store.privacyStore.validationState}
                    >
                        <TextInput
                            placeholder={gettext('Password')}
                            onChange={this.updatePassword}
                            value={this.props.store.privacyStore.course.coursePassword}
                        />
                    </FormGroup>
                )}
                <p styleName="mt-md">{this.props.store.privacyStore.dropDownHelpText}</p>
                <div styleName="mt-sm">
                    <Button type="submit" disabled={this.props.store.privacyStore.saveDisabled}>
                        {gettext('Save')}
                    </Button>
                </div>
            </form>
        );
    }

    render() {
        if (!this.props.store.privacyStore) {
            return null;
        }
        return (
            <MainContent>
                {this.props.store.privacyStore.course.isInContentSubscription
                    ? this.renderUFBText()
                    : this.renderDropDownForm()}
            </MainContent>
        );
    }
}
