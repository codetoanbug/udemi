import {Button} from '@udemy/react-core-components';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import getRequestData from 'utils/get-request-data';

import {LAB_INSTANCE_STATUS_UI} from '../constants';
import LabLauncherStore from './lab-launcher.mobx-store';

import './lab-launcher.less';

const udRequest = getRequestData();

interface LabLaunchButtonProps {
    labLauncherStore: LabLauncherStore;
    startLabCallback: () => void;
    resumeLabCallback?: () => void;
    connectToLabCallback?: () => void;
    isRunningLabLimitExceeded?: boolean;
}

@observer
export class LabLaunchButton extends React.Component<LabLaunchButtonProps> {
    async componentDidMount() {
        if (!this.isLabLaunchDisabled) {
            await this.props.labLauncherStore.getLabResetTimeInfo();
        }
    }

    @computed
    get isLabLaunchDisabled() {
        const {areLabActionsDisabled} = this.props.labLauncherStore;
        return areLabActionsDisabled || this.props.isRunningLabLimitExceeded;
    }

    renderButton(onClickCallback: () => void, buttonText: string, dataPurpose: string) {
        const {labResetTimeInfo} = this.props.labLauncherStore;
        const isDisabled = this.isLabLaunchDisabled || labResetTimeInfo?.is_time_out;

        return (
            <Button
                udStyle="primary"
                styleName="lab-btn"
                data-purpose={dataPurpose}
                onClick={onClickCallback}
                disabled={isDisabled}
            >
                {buttonText}
            </Button>
        );
    }

    render() {
        const {lab} = this.props.labLauncherStore;
        const {resumeLabCallback, connectToLabCallback, startLabCallback} = this.props;
        const launchText = udRequest.isMobile ? gettext('Launch') : gettext('Launch workspace');

        const labStatus = lab.myLatestInstance
            ? LAB_INSTANCE_STATUS_UI[
                  lab.myLatestInstance.status as keyof typeof LAB_INSTANCE_STATUS_UI
              ]
            : LAB_INSTANCE_STATUS_UI.not_in_use;
        if (resumeLabCallback && labStatus === LAB_INSTANCE_STATUS_UI.stopped) {
            return this.renderButton(resumeLabCallback, gettext('Resume workspace'), 'resume');
        } else if (connectToLabCallback && labStatus === LAB_INSTANCE_STATUS_UI.running) {
            return this.renderButton(connectToLabCallback, gettext('Open workspace'), 'open');
        }
        return this.renderButton(startLabCallback, launchText, 'launch');
    }
}
