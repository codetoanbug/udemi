import CancelIcon from '@udemy/icons/dist/cancel.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {ToasterStore} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AutoAssignRuleModel from 'organization-manage-assigned/auto-assign-rules/auto-assign-rule.mobx-model';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';

import {DEACTIVATION_BODY_MESSAGE, DEACTIVATION_WARNING_MESSAGE} from '../constants';
import ContextMenuItem from '../context-menu-item.react-component';

const udConfig = getConfigData();

@observer
export default class DeactivateRuleMenuItem extends React.Component {
    static propTypes = {
        assignmentRule: PropTypes.instanceOf(AutoAssignRuleModel).isRequired,
    };

    @observable isModalOpen = false;

    @autobind
    async deactivateRule() {
        try {
            const response = await udApi.patch(
                `/organizations/${udConfig.brand.organization.id}/auto-assign-rules/${this.props.assignmentRule.id}/`,
                {
                    is_active: false,
                },
            );
            this.props.assignmentRule.setDataFromAPI(response.data);
            ToasterStore.addAlertBannerToast(
                {
                    udStyle: 'success',
                    title: gettext('Auto-assign rule has been deactivated.'),
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

    getWarningTextForResourceType(resourceType, groupTitle) {
        return DEACTIVATION_WARNING_MESSAGE[resourceType](groupTitle);
    }

    render() {
        const {resourceType, groupTitle} = this.props.assignmentRule;
        return (
            <>
                <ContextMenuItem
                    icon={<CancelIcon label={false} />}
                    title={gettext('Deactivate rule')}
                    onClick={this.openModal}
                />

                <Modal
                    title={gettext('Deactivate this auto-assign rule?')}
                    isOpen={this.isModalOpen}
                    onClose={this.closeModal}
                >
                    <ul>
                        <li>{this.getWarningTextForResourceType(resourceType, groupTitle)}</li>
                        <li>{DEACTIVATION_BODY_MESSAGE[resourceType].firstParagraph}</li>
                        <li>{DEACTIVATION_BODY_MESSAGE[resourceType].secondParagraph}</li>
                    </ul>

                    <FooterButtons>
                        <Button
                            data-purpose="close-modal"
                            onClick={this.closeModal}
                            udStyle="ghost"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            data-purpose="deactivate-rule"
                            udStyle="primary"
                            onClick={this.deactivateRule}
                        >
                            {gettext('Deactivate')}
                        </Button>
                    </FooterButtons>
                </Modal>
            </>
        );
    }
}

DeactivateRuleMenuItem.shouldRender = function (props) {
    return props.assignmentRule.isActive;
};
