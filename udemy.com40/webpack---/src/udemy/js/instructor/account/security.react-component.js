import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import OrganizationUserProfileEditAlert from 'organization-common/organization-user-profile-edit-alert/organization-user-profile-edit-alert.react-component';
import UserManageAjaxModal from 'user-manage/ajax-modal/user-manage-ajax-modal.react-component';
import ShowMFA from 'user-manage/mfa/show-mfa.react-component';
import udMe from 'utils/ud-me';

import SecurityStore from './security.mobx-store';

import './security.less';

function renderEditEmailModal(props) {
    return (
        <UserManageAjaxModal
            {...props}
            url="/user/edit-email/"
            labelledById="edit-email-title"
            shouldInterceptContent={true}
        />
    );
}

export const EditEmailButton = (props) => {
    return (
        <ModalTrigger
            renderModal={renderEditEmailModal}
            trigger={
                <IconButton data-purpose="edit-email" {...props}>
                    <EditIcon label={gettext('Edit email')} />
                </IconButton>
            }
        />
    );
};

function renderEditPasswordModal(props) {
    return (
        <UserManageAjaxModal
            {...props}
            url="/user/edit-account/"
            labelledById="edit-account-title"
            shouldInterceptContent={true}
        />
    );
}

export const EditPasswordButton = (props) => {
    return (
        <ModalTrigger
            renderModal={renderEditPasswordModal}
            trigger={
                <IconButton data-purpose="edit-password" {...props}>
                    <EditIcon label={gettext('Edit password')} />
                </IconButton>
            }
        />
    );
};

@observer
export default class Security extends Component {
    static propTypes = {
        store: PropTypes.object,
        showMFAToggle: PropTypes.bool.isRequired,
        isMFAEnabled: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        store: undefined,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new SecurityStore();
    }

    componentDidMount() {
        this.store.fetchInitialData();
    }

    render() {
        const {
            isLoaded,
            hasPassword,
            isSCIMManaged,
            isChangingProfileDisabled,
            isChangingPasswordDisabled,
        } = this.store;

        if (!isLoaded) {
            return <MainContentLoader />;
        }

        return (
            <div styleName="container">
                {isSCIMManaged && (
                    <div styleName="scim-alert">
                        <OrganizationUserProfileEditAlert />
                    </div>
                )}
                <FormGroup label={gettext('Email:')}>
                    <div styleName="form-control-container">
                        <TextInput placeholder={udMe.email} disabled={true} />
                        {hasPassword && <EditEmailButton disabled={isChangingProfileDisabled} />}
                    </div>
                </FormGroup>
                <FormGroup label={gettext('Password:')}>
                    <div styleName="form-control-container">
                        <TextInput type="password" placeholder="********" disabled={true} />
                        <EditPasswordButton disabled={isChangingPasswordDisabled} />
                    </div>
                </FormGroup>
                <div styleName="mfa-panel">
                    <ShowMFA
                        showMFAToggle={this.props.showMFAToggle}
                        isUserMFAEnabled={this.props.isMFAEnabled}
                    />
                </div>
            </div>
        );
    }
}
