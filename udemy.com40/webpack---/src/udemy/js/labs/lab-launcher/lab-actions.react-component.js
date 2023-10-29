import AlarmIcon from '@udemy/icons/dist/alarm.ud-icon';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import {Button} from '@udemy/react-core-components';
import {BasicPopover} from '@udemy/react-popup-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {
    LAB_TYPE,
    LAB_INSTANCE_STATUS,
    LAB_CLICK_TRACKING_ACTIONS,
    MAX_RUNNING_LABS_CNT,
    LAB_LAUNCHER_FEEDBACK,
    LAB_VERTICAL,
    USER_TYPES,
    LAB_EXTENDED_WORKSPACE_TIME_LIMIT_DAYS,
    LAB_TIME_LIMIT_MINUTES,
    LAB_TYPE_WORKSPACE,
    LAB_TRACKING_LAUNCH_UI_REGION,
    LAB_TRACKING_RESUME_UI_REGION,
    LAB_TRACKING_WORKSPACE_LAUNCHED_UI_REGION,
} from 'labs/constants';
import {LabLaunchButton} from 'labs/lab-launcher/lab-launch-button.react-component';
import {
    checkLabPauseResumeExperimentEnabled,
    checkLabPauseResumeExperimentEnabledForLab,
    getVerticalIconComponent,
    sendLabClickEvent,
    sendLabResumedEvent,
    sendLabWorkspaceLaunchedEvent,
} from 'labs/utils';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {LabVerticalSystemEventStore} from '../system-event/lab-vertical-system-event.mobx-store';
import {AwsCredentialsModal} from './aws-credentials-modal.react-component';
import {LAYOUT_DEFAULT, LAYOUT_HEADER, LAYOUT_COURSE_TAKING} from './constants';
import LabLauncherStore from './lab-launcher.mobx-store';

import './lab-launcher.less';

@inject('labVerticalSystemEventStore')
@observer
export default class LabActions extends React.Component {
    static propTypes = {
        layout: PropTypes.oneOf([LAYOUT_DEFAULT, LAYOUT_HEADER, LAYOUT_COURSE_TAKING]),
        labLauncherStore: PropTypes.instanceOf(LabLauncherStore).isRequired,
        isRunningLabLimitExceeded: PropTypes.bool,
        labVerticalSystemEventStore: PropTypes.instanceOf(LabVerticalSystemEventStore).isRequired,
        userType: PropTypes.string.isRequired,
    };

    static defaultProps = {
        isRunningLabLimitExceeded: false,
        layout: LAYOUT_DEFAULT,
    };

    @observable isApiKeysModalShown = false;

    @autobind
    async startLab() {
        const {lab} = this.props.labLauncherStore;
        sendLabClickEvent(lab, LAB_CLICK_TRACKING_ACTIONS.LAUNCH);
        if (lab.labType === LAB_TYPE.modular.key) {
            sendLabClickEvent(
                lab,
                LAB_CLICK_TRACKING_ACTIONS.MODULAR_LAB_WORKSPACE_LAUNCH,
                null,
                null,
                null,
                LAB_TRACKING_LAUNCH_UI_REGION.HEADER,
            );
        }
        await this.props.labLauncherStore.startLab();
        lab.labType === LAB_TYPE.modular.key &&
            sendLabWorkspaceLaunchedEvent(
                lab,
                lab.myLatestInstance,
                LAB_TRACKING_WORKSPACE_LAUNCHED_UI_REGION.LAB_WORKSPACE_LAUNCHER,
                lab.myLatestInstance?.sessionStartTime,
            );
    }

    @autobind
    connectToLab() {
        sendLabClickEvent(
            this.props.labLauncherStore.lab,
            LAB_CLICK_TRACKING_ACTIONS.CONNECT,
            null,
            null,
            null,
            LAB_TRACKING_LAUNCH_UI_REGION.HEADER,
        );
        this.props.labLauncherStore.connectToLab();
    }

    @autobind
    stopLab() {
        sendLabClickEvent(this.props.labLauncherStore.lab, LAB_CLICK_TRACKING_ACTIONS.PAUSE);
        this.props.labLauncherStore.stopLab();
    }

    @autobind
    async resumeLab() {
        sendLabClickEvent(this.props.labLauncherStore.lab, LAB_CLICK_TRACKING_ACTIONS.RESUME);
        await this.props.labLauncherStore.startLab();
        if (this.props.labLauncherStore.lab.labType === LAB_TYPE.modular.key) {
            sendLabResumedEvent(
                this.props.labLauncherStore.lab,
                LAB_TRACKING_RESUME_UI_REGION.LAB_WORKSPACE_LAUNCHER,
                this.props.labLauncherStore.lab?.myLatestInstance?.sessionStartTime,
                true,
            );
        }
    }

    @autobind
    terminateLab() {
        sendLabClickEvent(this.props.labLauncherStore.lab, LAB_CLICK_TRACKING_ACTIONS.END);
        this.props.labLauncherStore.setIsPendingTermination(true);
    }

    @autobind
    @action
    openApiKeys() {
        sendLabClickEvent(
            this.props.labLauncherStore.lab,
            LAB_CLICK_TRACKING_ACTIONS.MODULAR_LAB_SHOW_API_KEYS_CLICK,
        );
        this.isApiKeysModalShown = true;
    }

    @autobind
    @action
    closeApiKeys() {
        sendLabClickEvent(
            this.props.labLauncherStore.lab,
            LAB_CLICK_TRACKING_ACTIONS.MODULAR_LAB_CLOSE_API_KEYS_CLICK,
        );
        this.isApiKeysModalShown = false;
    }

    @computed
    get isPauseAvailable() {
        const {lab, isAzureLab, isGCPLab} = this.props.labLauncherStore;
        return !isAzureLab && !isGCPLab && LAB_TYPE_WORKSPACE.includes(lab.labType);
    }

    @computed
    get isLabLaunchDisabled() {
        const {areLabActionsDisabled} = this.props.labLauncherStore;
        return areLabActionsDisabled || this.props.isRunningLabLimitExceeded;
    }

    @autobind
    renderLoadingButton() {
        return (
            <Button
                udStyle="secondary"
                styleName="lab-btn"
                data-purpose="loading-instance"
                disabled={true}
            >
                <Loader block={false} size="small" />
            </Button>
        );
    }

    @autobind
    renderLabStartButton() {
        return (
            <div>
                <LabLaunchButton
                    labLauncherStore={this.props.labLauncherStore}
                    resumeLabCallback={this.resumeLab}
                    startLabCallback={this.startLab}
                />
            </div>
        );
    }

    renderProjectDetailsPopover() {
        const {lab} = this.props.labLauncherStore;

        return (
            <>
                <div styleName="project-workspace">
                    {getVerticalIconComponent(lab)}
                    <div styleName="project-content">
                        <span className="ud-heading-md">{gettext('Project workspace')}</span>
                        {interpolate(
                            gettext('%(labVertical)s'),
                            {labVertical: lab.verticalLabel},
                            true,
                        )}
                    </div>
                </div>
                <div styleName="project-expiration">
                    <AlarmIcon label={false} />
                    <div styleName="project-content">
                        <span className="ud-heading-md">{gettext('Project expiration')}</span>
                        {checkLabPauseResumeExperimentEnabledForLab(lab)
                            ? ninterpolate(
                                  '%s day',
                                  '%s days',
                                  LAB_EXTENDED_WORKSPACE_TIME_LIMIT_DAYS,
                              )
                            : ninterpolate(
                                  '%s hour',
                                  '%s hours',
                                  LAB_TIME_LIMIT_MINUTES[lab.labType] / 60,
                              )}
                    </div>
                </div>
            </>
        );
    }

    @autobind
    renderActiveLabActions() {
        const {
            lab,
            areLabActionsDisabled,
            isTerminateActionVisible,
            isTransitioningLab,
        } = this.props.labLauncherStore;
        return (
            <div>
                {isTransitioningLab(LAB_INSTANCE_STATUS.killing)
                    ? this.renderLoadingButton()
                    : isTerminateActionVisible && (
                          <Button
                              udStyle="secondary"
                              styleName="lab-btn"
                              data-purpose="terminate"
                              onClick={this.terminateLab}
                              disabled={areLabActionsDisabled}
                          >
                              {gettext('End')}
                          </Button>
                      )}
                {isTransitioningLab(LAB_INSTANCE_STATUS.stopping) && this.renderLoadingButton()}
                {!isTransitioningLab(LAB_INSTANCE_STATUS.stopping) && this.isPauseAvailable && (
                    <Button
                        udStyle="secondary"
                        styleName="lab-btn"
                        data-purpose="pause"
                        onClick={this.stopLab}
                        disabled={areLabActionsDisabled}
                    >
                        {gettext('Pause')}
                    </Button>
                )}
                {lab.vertical === LAB_VERTICAL.aws.key &&
                    lab.myLatestInstance &&
                    lab.myLatestInstance.awsAccessKeyId && (
                        <>
                            <Button
                                udStyle="secondary"
                                styleName="lab-btn"
                                data-purpose="show-api-keys"
                                onClick={this.openApiKeys}
                                disabled={areLabActionsDisabled}
                            >
                                {gettext('CLI')}
                            </Button>
                            <AwsCredentialsModal
                                labInstance={lab.myLatestInstance}
                                isShown={this.isApiKeysModalShown}
                                onClose={this.closeApiKeys}
                            />
                        </>
                    )}
                <Button
                    udStyle="primary"
                    styleName="lab-btn"
                    data-purpose="connect"
                    onClick={this.connectToLab}
                    disabled={areLabActionsDisabled}
                >
                    {gettext('Open')}
                </Button>
            </div>
        );
    }

    @autobind
    renderInactiveLabActions() {
        const {
            lab,
            isTransitioningLab,
            canBeTerminatedInTransitionState,
            labResetTimeInfo,
        } = this.props.labLauncherStore;
        const isInstructor = this.props.userType === USER_TYPES.INSTRUCTOR;
        const isInstructorCanTerminate = isInstructor && canBeTerminatedInTransitionState;
        const isLabPauseResumeEnabled = checkLabPauseResumeExperimentEnabled();

        if (
            isTransitioningLab(LAB_INSTANCE_STATUS.starting) ||
            isTransitioningLab(LAB_INSTANCE_STATUS.queued)
        ) {
            return this.renderLoadingButton();
        }

        if (lab.isLaunchDisabled) {
            if (
                this.isLabLaunchDisabled &&
                this.props.labVerticalSystemEventStore.activeMessage?.is_launch_disabled
            ) {
                const {title, description} = this.props.labVerticalSystemEventStore.activeMessage;
                const tooltipText = `<h2 class="ud-heading-md">${title}</h2><p class="ud-text-sm">${description}</p>`;
                return (
                    <BasicPopover
                        styleName="lab-launch-popover"
                        data-purpose="lab-disable-message-popover"
                        canToggleOnHover={true}
                        placement={this.props.layout === LAYOUT_DEFAULT ? 'top' : 'left-start'}
                        trigger={this.renderLabStartButton()}
                    >
                        <div styleName="lab-launch-popover-content">
                            {labResetTimeInfo?.is_time_out && <ErrorIcon />}
                            <span
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'launch-button:tooltip-text',
                                    html: tooltipText,
                                })}
                            />
                        </div>
                    </BasicPopover>
                );
            }

            return this.renderLabStartButton();
        }

        let tooltipText = '';
        if (!lab.vertical) {
            tooltipText = gettext('Select a vertical first!');
        } else if (labResetTimeInfo?.is_time_out) {
            tooltipText = interpolate(
                gettext(
                    "You've reached your %(resetPeriod)s-day limit for Labs. Your time will reset in <b>%(resetTime)s</b>.",
                ),
                {
                    resetPeriod: labResetTimeInfo.reset_period_days,
                    resetTime: labResetTimeInfo?.reset_time,
                },
                true,
            );
        } else if (lab.labType === LAB_TYPE.modular.key) {
            tooltipText = LAB_LAUNCHER_FEEDBACK.MODULAR_LABS_TIME_LIMIT_MESSAGE;
        } else if (this.props.isRunningLabLimitExceeded) {
            tooltipText = interpolate(
                gettext(
                    "You've reached the limit of %(maxLabs)s maximum Labs running simultaneously. Please end one of your running Labs to start a new one.",
                ),
                {maxLabs: MAX_RUNNING_LABS_CNT},
                true,
            );
        } else {
            tooltipText = gettext(
                'In order to conserve resources, you will be prompted to extend your time if needed, or end your session if you are finished with the assignment. Keep this window visible so that you can make your selection before your time is up.',
            );
        }

        return (
            <>
                {isInstructorCanTerminate && (
                    <Button
                        udStyle="primary"
                        styleName="lab-btn"
                        data-purpose="terminate-by-instructor"
                        onClick={this.terminateLab}
                    >
                        {gettext('End')}
                    </Button>
                )}
                <BasicPopover
                    styleName={classNames('lab-launch-popover', {
                        'lab-launcher-popover-no-padding': isLabPauseResumeEnabled,
                    })}
                    data-purpose="conserve-resources-popover"
                    canToggleOnHover={true}
                    placement={this.props.layout === LAYOUT_DEFAULT ? 'top' : 'left-start'}
                    trigger={this.renderLabStartButton()}
                >
                    {isLabPauseResumeEnabled && lab.labType === LAB_TYPE.modular.key ? (
                        this.renderProjectDetailsPopover()
                    ) : (
                        <div styleName="lab-launch-popover-content">
                            {labResetTimeInfo?.is_time_out && <ErrorIcon />}
                            <span
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'launch-button:tooltip-text',
                                    html: tooltipText,
                                })}
                            />
                        </div>
                    )}
                </BasicPopover>
            </>
        );
    }

    render() {
        if (
            this.props.labVerticalSystemEventStore.isLoading &&
            !this.props.labVerticalSystemEventStore.activeMessage
        ) {
            return <Loader styleName="lab-btn-loader" size="small" />;
        }
        return (
            <div styleName="lab-btn-group">
                {this.props.labLauncherStore.isActiveLab
                    ? this.renderActiveLabActions()
                    : this.renderInactiveLabActions()}
            </div>
        );
    }
}
