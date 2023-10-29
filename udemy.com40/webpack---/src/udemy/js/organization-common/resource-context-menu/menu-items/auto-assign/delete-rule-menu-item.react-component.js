import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {ToasterStore} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AutoAssignRuleModel from 'organization-manage-assigned/auto-assign-rules/auto-assign-rule.mobx-model';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';

import {DELETION_WARNING_MESSAGE} from '../constants';
import ContextMenuItem from '../context-menu-item.react-component';

const udConfig = getConfigData();

@inject('actionCallbacks')
@observer
export default class DeleteRuleMenuItem extends React.Component {
    static propTypes = {
        assignmentRule: PropTypes.instanceOf(AutoAssignRuleModel).isRequired,
        actionCallbacks: PropTypes.shape({
            onRuleDeleted: PropTypes.func,
        }),
    };

    static defaultProps = {
        actionCallbacks: {},
    };

    @observable isModalOpen = false;

    @autobind
    async deleteRule() {
        const {onRuleDeleted} = this.props.actionCallbacks;

        try {
            await udApi.delete(
                `/organizations/${udConfig.brand.organization.id}/auto-assign-rules/${this.props.assignmentRule.id}/`,
            );
            onRuleDeleted && onRuleDeleted();
            ToasterStore.addAlertBannerToast(
                {
                    udStyle: 'success',
                    title: gettext('Auto-assign rule has been deleted.'),
                    showCta: false,
                },
                {
                    autoDismiss: true,
                },
            );
        } catch (e) {
            ToasterStore.addAlertBannerToast(
                {
                    udStyle: 'error',
                    title: gettext('Something went wrong, please try again later.'),
                    showCta: false,
                },
                {
                    autoDismiss: true,
                },
            );
        } finally {
            this.closeModal();
        }
    }

    @autobind
    @action
    openModal() {
        this.isModalOpen = true;
    }

    @autobind
    @action
    closeModal() {
        this.isModalOpen = false;
    }

    render() {
        return (
            <>
                <ContextMenuItem
                    icon={<DeleteIcon label={false} />}
                    title={gettext('Delete rule')}
                    onClick={this.openModal}
                />

                <Modal
                    title={gettext('Delete this auto-assign rule?')}
                    isOpen={this.isModalOpen}
                    onClose={this.closeModal}
                >
                    <p>{DELETION_WARNING_MESSAGE.TEXT}</p>

                    <FooterButtons>
                        <Button
                            data-purpose="close-modal"
                            onClick={this.closeModal}
                            udStyle="ghost"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            data-purpose="delete-rule"
                            udStyle="primary"
                            onClick={this.deleteRule}
                        >
                            {gettext('Delete')}
                        </Button>
                    </FooterButtons>
                </Modal>
            </>
        );
    }
}

DeleteRuleMenuItem.shouldRender = function (props) {
    return !props.assignmentRule.isActive;
};
