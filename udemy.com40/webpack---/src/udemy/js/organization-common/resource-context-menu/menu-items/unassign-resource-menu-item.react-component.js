import CancelIcon from '@udemy/icons/dist/cancel.ud-icon';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Assignment from 'organization-manage-courses/assignment.mobx-model';
import {ORGANIZATION_HAS_USER_STATUS} from 'organization-manage-users/constants';

import ResourceContextMenu from '../resource-context-menu.react-component';
import ContextMenuItem from './context-menu-item.react-component';
import UnassignResourceModal from './unassign-resource-modal.react-component';

@inject('resourceContext')
@observer
export default class UnassignResourceMenuItem extends React.Component {
    static propTypes = {
        assignment: PropTypes.instanceOf(Assignment).isRequired,
        userLicenseStatus: PropTypes.oneOf(Object.keys(ORGANIZATION_HAS_USER_STATUS)),
        resourceContext: PropTypes.string.isRequired,
        addDivider: PropTypes.bool,
    };

    static defaultProps = {
        userLicenseStatus: null,
        addDivider: false,
    };

    @observable isConfirmModalVisible = false;

    @autobind
    @action
    openModal() {
        this.isConfirmModalVisible = true;
    }

    @autobind
    @action
    closeModal() {
        this.isConfirmModalVisible = false;
    }

    render() {
        return (
            <>
                <ContextMenuItem
                    icon={<CancelIcon label={false} />}
                    title={gettext('Unassign')}
                    onClick={this.openModal}
                    data-purpose="unassign-context-menu-item"
                />
                <UnassignResourceModal
                    isOpen={this.isConfirmModalVisible}
                    closeConfirmationModal={this.closeModal}
                    assignment={this.props.assignment}
                    userLicenseStatus={this.props.userLicenseStatus}
                />
                {this.props.addDivider && <ResourceContextMenu.Divider />}
            </>
        );
    }
}

UnassignResourceMenuItem.shouldRender = (props) => !!props.assignment;
