import {Image, Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {LAB_CLICK_TRACKING_ACTIONS} from 'labs/constants';
import {sendLabClickEvent} from 'labs/utils';
import udLink from 'utils/ud-link';
import SystemMessage from 'utils/ud-system-message';

import LabsStore from '../labs.mobx-store';

import './messages.less';

@observer
export default class SkipSetupModal extends React.Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
        courseId: PropTypes.number.isRequired,
        jumpToLecture: PropTypes.func.isRequired,
    };

    @autobind
    onCloseSkipSetupDialog() {
        sendLabClickEvent(
            this.props.labsStore.labs[0],
            LAB_CLICK_TRACKING_ACTIONS.SKIP_LABS_SETUP_DISMISS,
        );
        SystemMessage.seen(SystemMessage.ids.hasSeenLabsSkipSetupNotification, {
            obj_id: this.props.courseId,
            obj_type: 'course',
        }).then(
            action((response) => {
                if (response && response.status === 201) {
                    this.props.labsStore.setHasSeenLabsSkipSetupNotification(true);
                    this.props.labsStore.setShowSkipLabsSetup(false);
                }
            }),
        );
    }

    @autobind
    onConfirmSkipSetupDialog() {
        sendLabClickEvent(
            this.props.labsStore.labs[0],
            LAB_CLICK_TRACKING_ACTIONS.SKIP_LABS_SETUP_CONFIRM,
        );
        SystemMessage.seen(SystemMessage.ids.hasSeenLabsSkipSetupNotification, {
            obj_id: this.props.courseId,
            obj_type: 'course',
        }).then(
            action((response) => {
                if (response && response.status === 201) {
                    this.props.labsStore.setHasSeenLabsSkipSetupNotification(true);
                    this.props.labsStore.setShowSkipLabsSetup(false);
                }
            }),
        );

        this.props.jumpToLecture();
    }

    @autobind
    skipSetupDialogTitle() {
        return (
            <div className="ud-heading-lg">
                <span>{gettext('Udemy Workspaces')}</span>
            </div>
        );
    }

    render() {
        return (
            <Modal
                isOpen={!!this.props.labsStore?.showSkipLabsSetup}
                requireExplicitAction={true}
                data-purpose="skip-setup-dialog"
                title={this.skipSetupDialogTitle()}
            >
                <div styleName="skip-setup-image">
                    <Image
                        src={udLink.toStorageStaticAsset('labs/skip-setup.jpg')}
                        srcSet={`${udLink.toStorageStaticAsset(
                            'labs/skip-setup.jpg',
                        )} 1x, ${udLink.toStorageStaticAsset('labs/skip-setup-2x.jpg')} 2x`}
                        alt=""
                        height={270}
                        width={360}
                    />
                </div>
                <p>
                    {gettext(
                        "Hands On. No setup required. When you're ready for hands-on activities in this course, you can skip the setup lectures and jump right into action by launching your Workspace from the new Workspaces tab.",
                    )}
                </p>
                <FooterButtons>
                    <Button
                        data-purpose="cancel-skip-setup"
                        udStyle="ghost"
                        onClick={this.onCloseSkipSetupDialog}
                    >
                        {gettext('Dismiss')}
                    </Button>
                    <Button data-purpose="skip-setup" onClick={this.onConfirmSkipSetupDialog}>
                        {gettext('Try Workspaces')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
