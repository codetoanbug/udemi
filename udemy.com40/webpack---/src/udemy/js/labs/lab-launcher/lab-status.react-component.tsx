import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import {BasicPopover, Tooltip} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {
    LAB_LAUNCHER_FEEDBACK,
    LAB_TYPE,
    LAB_INSTANCE_STATUS,
    LAB_INSTANCE_STATUS_UI,
    USER_TYPES,
    LAB_CLICK_TRACKING_ACTIONS,
    LAB_TYPE_WORKSPACE,
    LAB_UI_REGION,
} from 'labs/constants';
import {LabDuration} from 'labs/lab-duration-timer/lab-duration.react-component';
import {checkLabPauseResumeExperimentEnabled, sendLabClickEvent} from 'labs/utils';
import {noop} from 'utils/noop';

import LabLauncherStore from './lab-launcher.mobx-store';
import {LogsModal} from './logs-modal.react-component';
import {Layout, UserType} from './types';

import './lab-status.less';

interface LabStatusProps {
    labLauncherStore: LabLauncherStore;
    layout: Layout;
    userType: UserType;
    setIsLabAlmostOutOfResources: (value: boolean) => void;
    setIsLabOutOfResources: (value: boolean) => void;
}

@observer
export class LabStatus extends React.Component<LabStatusProps> {
    static defaultProps = {
        layout: Layout.DEFAULT,
        setIsLabAlmostOutOfResources: noop,
        setIsLabOutOfResources: noop,
    };

    componentDidUpdate() {
        const {setIsLabOutOfResources, setIsLabAlmostOutOfResources, labLauncherStore} = this.props;
        const {lab, isLabAlmostOutOfResources} = labLauncherStore;

        if (
            setIsLabOutOfResources !== noop &&
            lab.myLatestInstance?.status === LAB_INSTANCE_STATUS.deactivated
        ) {
            setIsLabOutOfResources(true);
        }
        if (setIsLabAlmostOutOfResources !== noop && isLabAlmostOutOfResources) {
            setIsLabAlmostOutOfResources(true);
        }
    }

    @observable isLogsModalShown = false;

    get isLabPauseResumeEnabled() {
        const {lab} = this.props.labLauncherStore;
        return checkLabPauseResumeExperimentEnabled() && lab.labType === LAB_TYPE.modular.key;
    }

    @computed
    get shouldShowLabDuration() {
        const {
            lab,
            pendingAction,
            showSessionEndPrompt,
            timeRemainingInSecondsToDisplay,
        } = this.props.labLauncherStore;

        return (
            this.isLabPauseResumeEnabled &&
            !showSessionEndPrompt &&
            [LAB_INSTANCE_STATUS.running, LAB_INSTANCE_STATUS.stopped].includes(
                lab.myLatestInstance?.status,
            ) &&
            pendingAction === null &&
            !!timeRemainingInSecondsToDisplay &&
            this.props.userType === USER_TYPES.STUDENT
        );
    }

    @computed
    get shouldShowRunningTimer() {
        const {
            lab,
            pendingAction,
            showSessionEndPrompt,
            timeRemainingSeconds,
            isModularLabCloseToUsageLimit,
        } = this.props.labLauncherStore;

        return (
            (LAB_TYPE_WORKSPACE.includes(lab.labType) ||
                (lab.labType === LAB_TYPE.modular.key && isModularLabCloseToUsageLimit)) &&
            !showSessionEndPrompt &&
            lab.myLatestInstance?.status === LAB_INSTANCE_STATUS.running &&
            pendingAction === null &&
            timeRemainingSeconds !== null &&
            this.props.userType === USER_TYPES.STUDENT &&
            !this.isLabPauseResumeEnabled
        );
    }

    @computed
    get shouldRenderLabStatus() {
        const {myLatestInstance} = this.props.labLauncherStore.lab;

        if (!this.isLabPauseResumeEnabled) {
            return true;
        }
        return (
            myLatestInstance !== null &&
            ![
                LAB_INSTANCE_STATUS.running,
                LAB_INSTANCE_STATUS.stopped,
                LAB_INSTANCE_STATUS.killed,
            ].includes(myLatestInstance?.status)
        );
    }

    @autobind
    @action
    openLogsModal() {
        sendLabClickEvent(
            this.props.labLauncherStore.lab,
            LAB_CLICK_TRACKING_ACTIONS.LOGS_MODAL_OPEN,
        );
        this.isLogsModalShown = true;
    }

    @autobind
    @action
    closeLogsModal() {
        sendLabClickEvent(
            this.props.labLauncherStore.lab,
            LAB_CLICK_TRACKING_ACTIONS.LOGS_MODAL_CLOSE,
        );
        this.isLogsModalShown = false;
    }

    renderLabStatus() {
        const {isWebLab, isLogViewAllowed, lab} = this.props.labLauncherStore;
        const {myLatestInstance, labType} = lab;

        const labStatus = myLatestInstance
            ? (LAB_INSTANCE_STATUS_UI as Record<string, string>)[myLatestInstance.status]
            : LAB_INSTANCE_STATUS_UI.not_in_use;

        return (
            <div className="ud-text-bold" styleName="status">
                <span data-purpose="lab-instance-status">{labStatus}</span>
                {!isWebLab && this.shouldShowRunningTimer && labType === LAB_TYPE.modular.key && (
                    <span data-purpose="time-limit-warning-icon">
                        <WarningIcon
                            styleName="time-limit-warning-icon"
                            label={false}
                            size="small"
                        />
                    </span>
                )}
                {isLogViewAllowed &&
                    this.props.userType === USER_TYPES.INSTRUCTOR &&
                    (myLatestInstance?.status === LAB_INSTANCE_STATUS.starting ||
                        myLatestInstance?.status === LAB_INSTANCE_STATUS.running) && (
                        <>
                            {' '}
                            <Button
                                udStyle="link"
                                typography="ud-text-sm"
                                onClick={this.openLogsModal}
                                styleName="logs-button"
                                data-purpose="logs-button"
                                aria-label={gettext('View logs')}
                            >
                                <Tooltip
                                    a11yRole="none"
                                    detachFromTarget={true}
                                    placement="top"
                                    trigger={
                                        <InfoIcon label={false} size="xsmall" color="neutral" />
                                    }
                                >
                                    {gettext('View logs')}
                                </Tooltip>
                            </Button>
                            {this.isLogsModalShown && (
                                <LogsModal
                                    lab={lab}
                                    isShown={this.isLogsModalShown}
                                    onClose={this.closeLogsModal}
                                />
                            )}
                        </>
                    )}
            </div>
        );
    }

    renderTimeLimitWarning() {
        const popoverText = LAB_LAUNCHER_FEEDBACK.MODULAR_LABS_TIME_LIMIT_MESSAGE;

        return (
            <div>
                <BasicPopover
                    styleName="lab-launch-popover"
                    data-purpose="time-limit-warning-popover"
                    canToggleOnHover={true}
                    placement={this.props.layout === Layout.DEFAULT ? 'top' : 'bottom'}
                    trigger={this.renderLabStatus()}
                >
                    {popoverText}
                </BasicPopover>
            </div>
        );
    }

    renderStatusSection() {
        const {lab} = this.props.labLauncherStore;

        if (this.shouldShowRunningTimer && lab.labType === LAB_TYPE.modular.key) {
            return this.renderTimeLimitWarning();
        }

        return this.renderLabStatus();
    }

    renderDurationSection() {
        const {timeRemainingSeconds, timeRemainingInSecondsToDisplay} = this.props.labLauncherStore;

        if (this.shouldShowLabDuration) {
            return (
                <LabDuration
                    durationInSeconds={timeRemainingInSecondsToDisplay}
                    isCountDownEnabled={false}
                    uiRegion={LAB_UI_REGION.LAUNCHER}
                    iconSize="small"
                    styleName="lab-duration-container"
                />
            );
        } else if (this.shouldShowRunningTimer) {
            return (
                <Duration
                    data-purpose="lab-timer"
                    numSeconds={timeRemainingSeconds}
                    presentationStyle={Duration.STYLE.TIMESTAMP}
                />
            );
        }
    }

    render() {
        return (
            <>
                {this.shouldRenderLabStatus && this.renderStatusSection()}
                {this.renderDurationSection()}
            </>
        );
    }
}
