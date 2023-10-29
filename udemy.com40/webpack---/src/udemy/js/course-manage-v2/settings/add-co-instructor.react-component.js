import {Button} from '@udemy/react-core-components';
import {Checkbox, FormGroup, TextInput} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './add-co-instructor.less';
import {PermissionsPopover} from './course-instructors.react-component';

@observer
export default class AddCoInstructor extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        onSubmitted: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    @autobind
    onEmailChangeHandler(event) {
        this.props.store.setNewInstructorEmail(event.target.value);
    }

    @autobind
    onPermissionChangeHandler(event) {
        this.props.store.setNewInstructorPermission(event.target.id, event.target.checked);
    }

    @autobind
    onVisibleChangeHandler(event) {
        this.props.store.setNewInstructorVisible(event.target.checked);
    }

    renderPermissions() {
        return this.props.store.newInstructorPermissions.map((permission) => (
            <div key={`permission-div-${permission.id}`} styleName="permission-checkbox">
                <Checkbox
                    id={permission.id}
                    checked={permission.checked}
                    onChange={this.onPermissionChangeHandler}
                    disabled={permission.disabled}
                >
                    {permission.text}
                </Checkbox>
            </div>
        ));
    }

    @autobind
    onSaveSuccess() {
        this.props.onSubmitted();
    }

    render() {
        return (
            <div>
                <FormGroup
                    label={gettext('Email')}
                    note={this.props.store.newInstructorEmailError}
                    validationState={this.props.store.newInstructorEmailError ? 'error' : null}
                >
                    <TextInput
                        value={this.props.store.newInstructorEmail}
                        onChange={this.onEmailChangeHandler}
                        data-purpose="membership-duration"
                        placeholder={gettext('Associated with a Udemy account')}
                        styleName="co-instructor-email-input"
                        data-dialog-auto-focus={true}
                    />
                </FormGroup>
                <div styleName="permissions-info">
                    <h3 className="ud-heading-sm">{gettext('Permissions')}</h3>
                    <PermissionsPopover />
                </div>
                <div styleName="permission-checkbox-container">
                    <div styleName="permission-checkbox">
                        <Checkbox
                            checked={this.props.store.newInstructorVisible}
                            onChange={this.onVisibleChangeHandler}
                        >
                            {gettext('Visible')}
                        </Checkbox>
                    </div>
                    {this.renderPermissions()}
                </div>
                <FooterButtons>
                    <Button
                        data-purpose="cancel-button"
                        udStyle="ghost"
                        onClick={() => this.props.onCancel()}
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        data-purpose="send-invitation-button"
                        disabled={!this.props.store.isEmailValid || this.props.store.isSaving}
                        onClick={() => this.props.store.save(this.onSaveSuccess, null)}
                    >
                        {gettext('Send invitation')}
                    </Button>
                </FooterButtons>
            </div>
        );
    }
}
