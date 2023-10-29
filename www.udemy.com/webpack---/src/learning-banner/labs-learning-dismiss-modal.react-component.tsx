import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React from 'react';

import {withI18n, WithI18nProps} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';

import {LAB_CLICK_TRACKING_ACTIONS} from '../constants';
import {LabInstanceApiResponse} from '../types/labs';
import {sendLabClickEvent, sendLabsResumeBannerEndLabClickEvent} from './events';
import {LabsLearningBannerStore} from './labs-learning-banner.mobx-store';

interface LabsLearningDismissModalProps {
    labsLearningBannerStore: LabsLearningBannerStore;
    isOpen: boolean;
}

@observer
class InternalLabsLearningDismissModal extends React.Component<
    LabsLearningDismissModalProps & WithI18nProps
> {
    @autobind
    private async onConfirm() {
        this.props.labsLearningBannerStore.hideModal();
        sendLabClickEvent(
            this.props.labsLearningBannerStore.firstRunningLab,
            LAB_CLICK_TRACKING_ACTIONS.END_CONFIRM,
        );
        sendLabsResumeBannerEndLabClickEvent(
            this.props.labsLearningBannerStore.firstRunningLab as LabInstanceApiResponse,
        );
        await this.props.labsLearningBannerStore.terminateLab(this.props.gettext);
    }

    render() {
        const {isOpen, labsLearningBannerStore} = this.props;

        return (
            <Modal
                title={this.props.gettext('Would you like to terminate this lab?')}
                isOpen={isOpen}
                onClose={labsLearningBannerStore.hideModal}
            >
                <div>
                    {this.props.gettext(
                        'Ending the lab will reset the workspace and all data stored in the current session will be deleted.',
                    )}
                </div>
                <FooterButtons>
                    <Button
                        data-purpose="cancel-confirm-modal"
                        onClick={labsLearningBannerStore.hideModal}
                        udStyle="ghost"
                    >
                        {this.props.gettext('Cancel')}
                    </Button>
                    <Button data-purpose="submit-confirm-modal" onClick={this.onConfirm}>
                        {this.props.gettext('End lab')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}

export const LabsLearningDismissModal = withI18n(InternalLabsLearningDismissModal);
