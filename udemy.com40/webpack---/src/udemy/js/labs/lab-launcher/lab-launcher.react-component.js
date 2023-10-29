import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Badge} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {computed, reaction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {
    LAB_INSTANCE_STATUS,
    LAB_CLICK_TRACKING_ACTIONS,
    LAB_TYPE,
    USER_TYPES,
    LAB_TYPE_WORKSPACE,
    LAB_TRACKING_PAUSE_UI_REGION,
} from 'labs/constants';
import {LabBetaBadge} from 'labs/lab-card-components/lab-beta-badge.react-component';
import LabLauncherStore from 'labs/lab-launcher/lab-launcher.mobx-store';
import Lab from 'labs/lab.mobx-model';
import {
    getLabTypeLabelForKey,
    getLabVerticalGlyphForKey,
    getLabVerticalIconForKey,
    getLabVerticalLabelForKey,
    getSupportUrlForVertical,
    checkLabPauseResumeExperimentEnabled,
    checkLabPauseResumeExperimentEnabledForLab,
    sendLabClickEvent,
    sendLabExitedEvent,
} from 'labs/utils';
import {sendNotification} from 'labs/workspace-notification/helpers';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getRequestData from 'utils/get-request-data';
import {noop} from 'utils/noop';

import {LAYOUT_DEFAULT, LAYOUT_HEADER, LAYOUT_COURSE_TAKING} from './constants';
import LabActions from './lab-actions.react-component';
import LabSessionEndModal from './lab-session-end-modal.react-component';
import {LabStatus} from './lab-status.react-component';
import {LeaveModal} from './leave-modal.react-component';
import {ManualWorkspaceLaunchModal} from './manual-workspace-launch-modal.react-component';
import NewWorkspaceLaunchModal from './new-workspace-launch-modal.react-component';

import './lab-launcher.less';

@observer
export default class LabLauncher extends React.Component {
    static propTypes = {
        lab: PropTypes.instanceOf(Lab).isRequired,
        userType: PropTypes.string.isRequired,
        isRunningLabLimitExceeded: PropTypes.bool,
        layout: PropTypes.oneOf([LAYOUT_DEFAULT, LAYOUT_HEADER, LAYOUT_COURSE_TAKING]),
        areActionsHidden: PropTypes.bool,
        setIsLabOutOfResources: PropTypes.func,
        setIsLabAlmostOutOfResources: PropTypes.func,
        labLauncherStore: PropTypes.instanceOf(LabLauncherStore),
        labWorkspaceNotificationEnabled: PropTypes.bool,
        onLeaveLab: PropTypes.func,
    };

    static defaultProps = {
        setIsLabOutOfResources: noop,
        setIsLabAlmostOutOfResources: noop,
        areActionsHidden: false,
        isRunningLabLimitExceeded: false,
        layout: LAYOUT_DEFAULT,
        labLauncherStore: null,
        labWorkspaceNotificationEnabled: false,
        onLeaveLab: noop,
    };

    constructor(props) {
        super(props);
        this.isPauseResumeEnabled = checkLabPauseResumeExperimentEnabled();
        // FIXME - not a good practice - remove next line after LabLauncher refactoring
        this.labLauncherStore = this.props.labLauncherStore || new LabLauncherStore(this.props.lab);
        this.labLauncherStore.setUserType(this.props.userType);
    }

    componentDidMount() {
        this.labLauncherStore.handleLabOnRender();

        if (this.props.labWorkspaceNotificationEnabled) {
            this.sendNotificationDisposer = reaction(
                () => this.labLauncherStore.isRunning,
                () =>
                    !this.labLauncherStore.isAzureLab &&
                    this.labLauncherStore.isRunning &&
                    sendNotification(this.props.lab.title),
            );
        }
    }

    componentWillUnmount() {
        this.sendNotificationDisposer && this.sendNotificationDisposer();
    }

    @computed
    get isLauncherHidden() {
        return (
            this.props.layout === LAYOUT_COURSE_TAKING &&
            this.labLauncherStore?.lab?.myLatestInstance?.status === LAB_INSTANCE_STATUS.deactivated
        );
    }

    @autobind
    onCancelTerminationModal() {
        sendLabClickEvent(this.labLauncherStore.lab, LAB_CLICK_TRACKING_ACTIONS.END_CANCEL);
        this.labLauncherStore.setIsPendingTermination(false);
    }

    @autobind
    async onConfirmTerminationModal() {
        sendLabClickEvent(this.labLauncherStore.lab, LAB_CLICK_TRACKING_ACTIONS.END_CONFIRM);
        this.labLauncherStore.lab.resetLabResults();
        await this.labLauncherStore.terminateLab();
        this.labLauncherStore.setIsPendingTermination(false);
        this.props.onLeaveLab && this.props.onLeaveLab();
    }

    @autobind
    async onLeaveLab() {
        const sessionStartTime = this.labLauncherStore?.lab?.myLatestInstance?.sessionStartTime;
        if (checkLabPauseResumeExperimentEnabledForLab(this.props.lab)) {
            sendLabClickEvent(this.labLauncherStore.lab, LAB_CLICK_TRACKING_ACTIONS.PAUSE);
            await this.labLauncherStore.stopLab();
            sendLabExitedEvent(
                this.labLauncherStore.lab,
                LAB_TRACKING_PAUSE_UI_REGION.LEAVE_LAB_MODAL,
                sessionStartTime,
                true,
            );
        } else {
            this.labLauncherStore.closeLabWindow();
            sendLabExitedEvent(
                this.labLauncherStore.lab,
                LAB_TRACKING_PAUSE_UI_REGION.LEAVE_LAB_MODAL,
                sessionStartTime,
                false,
            );
            sendLabClickEvent(this.labLauncherStore.lab, LAB_CLICK_TRACKING_ACTIONS.END_CANCEL);
        }
        this.labLauncherStore.setIsPendingTermination(false);
        this.props.onLeaveLab && this.props.onLeaveLab();
    }

    renderTerminationModal() {
        const {isPendingTermination, isTransitioningLab} = this.labLauncherStore;
        return (
            <Modal
                isOpen={isPendingTermination}
                requireExplicitAction={true}
                title={gettext('Confirm instance termination?')}
                data-purpose="termination-confirmation"
            >
                <p>
                    {gettext(
                        "Ending an instance will reset the workspace and all data will be cleared. This action can't be undone. Close the console window once it's ended.",
                    )}
                </p>
                <FooterButtons>
                    <Button
                        udStyle="ghost"
                        onClick={this.onCancelTerminationModal}
                        data-purpose="cancel-end-instance"
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        onClick={this.onConfirmTerminationModal}
                        data-purpose="end-instance"
                        disabled={isTransitioningLab(LAB_INSTANCE_STATUS.killing)}
                    >
                        {gettext('End instance')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }

    renderSpec() {
        const {specName, verticalName} = this.labLauncherStore;
        if (!verticalName) {
            return null;
        }
        return (
            <div styleName="spec-container" className="ud-text-sm">
                <div styleName="vertical-title">{verticalName}</div>
                {specName && <div styleName="spec-title">{specName}</div>}
            </div>
        );
    }

    @computed
    get workspaceText() {
        if (!this.labLauncherStore?.lab || !this.labLauncherStore.lab.vertical) {
            return gettext('No workspace');
        }
        return interpolate(
            gettext('%(template)s'),
            {template: this.labLauncherStore.lab.specName},
            true,
        );
    }

    @computed
    get workspaceSpecText() {
        const {lab} = this.labLauncherStore;
        if (!lab.specName && !getLabVerticalLabelForKey(lab.vertical)) {
            return null;
        }
        if (lab.labType === LAB_TYPE.modular.key || !lab.title) {
            return `${getLabVerticalLabelForKey(lab.vertical)}`;
        }
        return `${lab.specName ? `${lab.specName} • ` : ''}${getLabVerticalLabelForKey(
            lab.vertical,
        )}`;
    }

    @computed
    get expirationWarningText() {
        const {lab, showExpirationWarning} = this.labLauncherStore;

        const supportLink = getSupportUrlForVertical(lab.vertical);
        const expirationTime = new Date(lab.myLatestInstance.expirationTime);
        const locale = getRequestData().locale.replace('_', '-') || 'en-US';
        const options = {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        const dateString = new Intl.DateTimeFormat(locale, options).format(expirationTime);

        if (showExpirationWarning) {
            return (
                <div
                    styleName="expiration-popover-text"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'lab-expiration-notification',
                        html: interpolate(
                            gettext(
                                'This workspace will automatically terminate on <strong>%(expirationTime)s</strong>. Once terminated, your work will no longer be available. <a target="_blank" href="%(supportLink)s">Learn more</a>',
                            ),
                            {
                                expirationTime: dateString,
                                supportLink,
                            },
                            true,
                        ),
                        dataPurpose: 'expiration-popover-text',
                    })}
                />
            );
        }
        return null;
    }

    @computed
    get labExpirationBadge() {
        return (
            <div data-purpose="expiration-warning" styleName="expiration-warning">
                <Badge styleName="expiration-badge">{gettext('Expires soon')}</Badge>
                <Popover
                    data-purpose="expiration-popover"
                    canToggleOnHover={true}
                    detachFromTarget={true}
                    placement="bottom-start"
                    trigger={<WarningIcon glyph="info-outline" label={false} />}
                >
                    {this.expirationWarningText}
                </Popover>
            </div>
        );
    }

    render() {
        const {
            lab,
            showExpirationWarning,
            timeRemainingInSecondsToDisplay,
            isPendingTermination,
        } = this.labLauncherStore;

        const layoutStyle = classNames({
            'container--header': this.props.layout === LAYOUT_HEADER,
        });

        if (this.isLauncherHidden) {
            // I have to do this to not break the logic for course taking dashboard alerts
            // FIXME - Lab launcher refactoring!!!
            return null;
        }

        const LabVerticalIconComponent =
            this.props.layout === LAYOUT_DEFAULT &&
            lab.vertical &&
            getLabVerticalIconForKey(lab.vertical);

        return (
            <div styleName={layoutStyle}>
                <LabSessionEndModal labLauncherStore={this.labLauncherStore} />
                <NewWorkspaceLaunchModal labLauncherStore={this.labLauncherStore} />
                {this.labLauncherStore.isManualLoginLabVertical &&
                    this.labLauncherStore.isRunning && (
                        <ManualWorkspaceLaunchModal labLauncherStore={this.labLauncherStore} />
                    )}
                {lab.labType === LAB_TYPE.modular.key && this.isPauseResumeEnabled ? (
                    <LeaveModal
                        timeRemainingInSeconds={timeRemainingInSecondsToDisplay}
                        isEndingLab={this.labLauncherStore.isTransitioningLab(
                            LAB_INSTANCE_STATUS.killing,
                        )}
                        isOpen={isPendingTermination}
                        onClose={this.onCancelTerminationModal}
                        onLeaveLab={this.onLeaveLab}
                        onEndLab={this.onConfirmTerminationModal}
                    />
                ) : (
                    this.renderTerminationModal()
                )}
                <div styleName="lab" data-purpose="lab">
                    <div styleName="lab-col title-col">
                        {LabVerticalIconComponent && (
                            <div>
                                <LabVerticalIconComponent
                                    label={false}
                                    glyph={getLabVerticalGlyphForKey(lab.vertical)}
                                    size="medium"
                                />
                            </div>
                        )}
                        <div styleName="lab-info">
                            <div className="ud-heading-md" styleName="title">
                                {this.props.userType === USER_TYPES.INSTRUCTOR &&
                                lab.labType === LAB_TYPE.modular.key ? (
                                    <span data-purpose="modular-workspace-info">
                                        {this.workspaceText}
                                    </span>
                                ) : (
                                    <span data-purpose="lab-title">
                                        {lab.title || lab.specName}
                                    </span>
                                )}
                                {lab.isBeta && (
                                    <span styleName="badge-container">
                                        <LabBetaBadge />
                                    </span>
                                )}
                                <span styleName="lab-badges">
                                    {showExpirationWarning && this.labExpirationBadge}
                                    {this.props.userType === USER_TYPES.INSTRUCTOR &&
                                        LAB_TYPE_WORKSPACE.includes(lab.labType) &&
                                        this.labLauncherStore.isLabHighlyConsumed && (
                                            <div
                                                styleName="high-consumption-container"
                                                data-purpose="high-consumption-warning"
                                            >
                                                <Badge styleName="high-consumption-badge">
                                                    {gettext('High consumption')}
                                                </Badge>
                                                <Popover
                                                    styleName="high-consumption-warning-popover"
                                                    canToggleOnHover={true}
                                                    detachFromTarget={true}
                                                    placement={
                                                        this.props.layout === LAYOUT_DEFAULT
                                                            ? 'top'
                                                            : 'left-start'
                                                    }
                                                    trigger={
                                                        <InfoOutlineIcon
                                                            styleName="high-consumption-warning-icon"
                                                            label={false}
                                                            size="xsmall"
                                                            color="neutral"
                                                        />
                                                    }
                                                >
                                                    <div styleName="high-consumption-warning-popover-content">
                                                        {gettext(
                                                            'This workspace has consumed more than half of the allocated budget. To conserve resources, pause or end your workspace instance if it’s not in active use.',
                                                        )}
                                                    </div>
                                                </Popover>
                                            </div>
                                        )}
                                </span>
                            </div>
                            {this.props.layout === LAYOUT_DEFAULT &&
                                this.props.userType === USER_TYPES.STUDENT && (
                                    <>
                                        {!LAB_TYPE_WORKSPACE.includes(lab.labType) && (
                                            <div
                                                className="ud-text-sm"
                                                styleName="lab-type"
                                                data-purpose="lab-type"
                                            >
                                                {getLabVerticalLabelForKey(lab.vertical)}{' '}
                                                {getLabTypeLabelForKey(lab.labType)}
                                            </div>
                                        )}
                                    </>
                                )}
                            {this.props.userType === USER_TYPES.INSTRUCTOR && (
                                <div
                                    className="ud-text-sm"
                                    styleName="lab-type"
                                    data-purpose="lab-type"
                                >
                                    {this.workspaceSpecText}
                                </div>
                            )}
                        </div>
                    </div>
                    <div styleName="lab-col lab-col--status">
                        {!this.props.areActionsHidden && (
                            <LabStatus
                                labLauncherStore={this.labLauncherStore}
                                userType={this.props.userType}
                                layout={this.props.layout}
                                setIsLabAlmostOutOfResources={
                                    this.props.setIsLabAlmostOutOfResources
                                }
                                setIsLabOutOfResources={this.props.setIsLabOutOfResources}
                            />
                        )}
                    </div>
                    {!this.props.areActionsHidden && (
                        <div styleName="lab-col lab-actions">
                            <LabActions
                                labLauncherStore={this.labLauncherStore}
                                userType={this.props.userType}
                                isRunningLabLimitExceeded={this.props.isRunningLabLimitExceeded}
                                layout={this.props.layout}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
