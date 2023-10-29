import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {
    LAB_INSTANCE_API_PARAMS,
    LAB_TIME_UNTIL_RUN_LIMIT_RESET_URL,
    labInstanceBaseApiUrl,
    saveProgressForLabInstanceApiUrl,
    stopLabInstanceApiUrl,
    syncLabInstanceApiUrl,
    terminateLabInstanceApiUrl,
    resetLabInstanceSessionApiUrl,
} from 'labs/apis';
import {
    LAB_TYPE,
    LAB_VERTICAL,
    LAB_INSTANCE_STATUS,
    LAB_INSTANCE_STATUS_UI,
    LAB_INSTANCE_TRANSITIONAL_STATUS,
    LAB_LAUNCHER_FEEDBACK,
    AWS_LOGOUT_URL,
    AZURE_LOGOUT_URL,
    PROGRESS_LOGGING_INTERVAL_MS,
    PROGRESS_LOGGING_INTERVAL_LIMIT_MS,
    LAB_ACTION_TIMEOUT_MS,
    WORKSPACE_WARNING_TIME_BEFORE_PAUSE_MS,
    MODULAR_LAB_WARNING_TIME_BEFORE_END_MS,
    MODULAR_LAB_TIME_BEFORE_COUNTDOWN_MS,
    LAB_CONSUMPTION_SOURCE,
    LAB_PENDING_STATUSES,
    LAB_PROVIDER,
    USER_TYPES,
    NEW_WORKSPACE_LAUNCH_MODAL_CONTENT,
    WORKSPACE_AUTO_TERMINATE_WARNING_TIME_DAYS,
    LAB_INSTANCE_UNSTARTABLE_STATUS,
    LAB_TIME_INSTRUCTOR_CAN_TERMINATE_AFTER_SEC,
    LAB_TYPE_WORKSPACE,
    LAB_CONTAINER_VERTICALS,
    GCP_LOGOUT_URL,
    labLoadingUrl,
} from 'labs/constants';
import Heartbeat from 'labs/heartbeat';
import {
    checkLabAlmostOutOfResources,
    checkLabHighlyConsumed,
    checkLabPauseResumeExperimentEnabled,
    getTimeLimitMsForLab,
    sendLabHeartbeatEvent,
} from 'labs/utils';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

export default class LabLauncherStore {
    /** @type {Lab} lab */
    @observable lab = null;
    @observable pendingAction = null;
    @observable isPendingTermination = false;
    @observable labWindow = null;
    @observable labSessionStartTimeMs = null;
    @observable labSessionEndTimeMs = null;
    @observable showSessionEndPrompt = false;
    @observable isModularLabCloseToUsageLimit = false;
    /** @type {number} timeRemainingSeconds */
    @observable timeRemainingSeconds = null;
    @observable canBeTerminatedInTransitionState = false;
    @observable showWorkspaceLoginPopup = false;
    @observable runningLabs = [];
    @observable showNewWorkspaceLaunchModal = false;
    @observable newWorkspaceLaunchModalContent = null;
    @observable showExpirationWarning = false;
    @observable showAzureLoginExpanded = false;
    /** @type {AnyObject|null} labResetTimeInfo */
    @observable labResetTimeInfo = null;

    get modularLabTimeLimitBeforeCountdownMs() {
        if (checkLabPauseResumeExperimentEnabled()) {
            return MODULAR_LAB_TIME_BEFORE_COUNTDOWN_MS;
        }
        return MODULAR_LAB_WARNING_TIME_BEFORE_END_MS;
    }

    @computed
    get isWebLab() {
        return this.lab?.vertical === LAB_VERTICAL.web.key;
    }

    @computed
    get isDataScienceLab() {
        return this.lab?.vertical === LAB_VERTICAL.data_science.key;
    }

    @computed
    get isAWSLab() {
        return this.lab?.vertical === LAB_VERTICAL.aws.key;
    }

    @computed
    get isAzureLab() {
        return this.lab?.vertical === LAB_VERTICAL.azure.key;
    }

    @computed
    get isGCPLab() {
        return this.lab?.vertical === LAB_VERTICAL.gcp.key;
    }

    @computed
    get isManualLoginLabVertical() {
        return this.isAzureLab || this.isGCPLab;
    }

    @computed
    get isAzureSsoLab() {
        return this.lab?.vertical === LAB_VERTICAL.azure.key && this.lab?.hasSso;
    }

    @computed
    get isDevOpsLab() {
        return this.lab?.vertical === LAB_VERTICAL.devops.key;
    }

    @computed
    get isSecurityLab() {
        return this.lab?.vertical === LAB_VERTICAL.security.key;
    }

    @computed
    get isRunning() {
        return this.lab?.myLatestInstance?.status === LAB_INSTANCE_STATUS.running;
    }

    @computed
    get specName() {
        return this.lab.specName;
    }

    @computed
    get verticalName() {
        if (!this.lab.vertical) {
            return null;
        }
        return LAB_VERTICAL[this.lab.vertical]?.label;
    }

    @computed
    get isLabAlmostOutOfResources() {
        return checkLabAlmostOutOfResources(this.lab);
    }

    @computed
    get isLabHighlyConsumed() {
        return checkLabHighlyConsumed(this.lab);
    }

    @computed
    get isLogViewAllowed() {
        return LAB_CONTAINER_VERTICALS.includes(this.lab?.vertical);
    }

    @computed
    get isModularLabWithPauseResume() {
        return checkLabPauseResumeExperimentEnabled() && this.lab?.labType === LAB_TYPE.modular.key;
    }

    @computed
    get isResumableLab() {
        return (
            this.isModularLabWithPauseResume &&
            this.lab?.myLatestInstance?.status === LAB_INSTANCE_STATUS.stopped
        );
    }

    @computed
    get timeRemainingInSecondsToDisplay() {
        if (this.timeRemainingSeconds) {
            return this.timeRemainingSeconds;
        }

        return this.lab.myLatestInstance?.timeLeftInSeconds || 0;
    }

    constructor(lab) {
        this.lab = lab;
        this.userType = USER_TYPES.STUDENT;
        this.refreshInProgress = false;
        this.heartbeat = new Heartbeat(PROGRESS_LOGGING_INTERVAL_MS, this.onTick);
    }

    @autobind
    setUserType(userType) {
        this.userType = userType;
    }

    @autobind
    isTransitioningLab(status = null) {
        return (
            this.pendingAction !== null && (status === null || this.pendingAction.action === status)
        );
    }

    @action
    async handleLabOnRender() {
        if (this.lab.myLatestInstance && (this.isAWSLab || this.isAzureLab || this.isGCPLab)) {
            await this.syncInstance();
        }
        // if lab instance is running, start the heartbeat
        if (
            this.isRunning ||
            LAB_INSTANCE_TRANSITIONAL_STATUS.includes(this.lab.myLatestInstance?.status) ||
            this.isResumableLab
        ) {
            this.heartbeat.start();
        }

        if (this.lab.labType === LAB_TYPE.modular.key && this.isModularLabCloseToUsageLimit) {
            this.markModularLabCloseToLimit();
        }
    }

    resetLabState() {
        this.closeLabWindow();
        this.setPendingAction();
        this.updateLabInstance({});
    }

    @action
    async startLab() {
        if (this.isAWSLab || this.isAzureSsoLab) {
            // TODO: remove Azure when Vocareum doesn't require a ping on their endpoint
            this.labWindow = window.open(labLoadingUrl(this.lab.id), '_blank', 'close=yes');
        } else if (this.isDataScienceLab || this.isWebLab || this.isDevOpsLab) {
            this.labWindow = window.open('about:blank', '_blank', 'close=yes');
        }
        // don't open a window for Azure labs; we'll show a dialog with manual login instructions when the sync runs

        if (this.isWebLab) {
            this.setPendingAction({
                action: LAB_INSTANCE_STATUS.queued,
            });

            this.updateLabInstance({status: LAB_INSTANCE_STATUS.queued});
        } else {
            this.setPendingAction({
                action: LAB_INSTANCE_STATUS.starting,
            });

            this.updateLabInstance({status: LAB_INSTANCE_STATUS.starting});
        }

        const response = await this._createLabInstance();
        if (!response) {
            return;
        }

        this.updateLabInstance(response.data);

        if (this.lab.myLatestInstance.status === LAB_INSTANCE_STATUS.error) {
            this.resetLabState();
            this._showErrorToast(LAB_LAUNCHER_FEEDBACK.START_LAB_FEEDBACK);
            return;
        }

        // Existing AWS credentials should be invalidated using the logout url
        if (this.isAWSLab) {
            this.redirectToUrl(AWS_LOGOUT_URL);
            await new Promise((resolve) => setTimeout(resolve, LAB_ACTION_TIMEOUT_MS));
        }

        const launchParam = this.userType === USER_TYPES.INSTRUCTOR ? '?version=head' : '';
        if (this.isAWSLab || this.isAzureSsoLab) {
            // TODO: remove Azure when Vocareum doesn't require a ping on their endpoint
            this.redirectToUrl(this.lab.myLatestInstance.workspaceSsoUrl);
        } else if (LAB_CONTAINER_VERTICALS.includes(this.lab?.vertical)) {
            this.redirectToUrl(
                `/labs/${this.lab.id}/workspace/${this.lab.myLatestInstance.uuid}/${launchParam}`,
            );
        } else if (this.isManualLoginLabVertical) {
            this.setShowWorkspaceLoginPopup(true, true);
        }

        if (!this.isAzureSsoLab) {
            this.setPendingAction();
        }

        this.heartbeat.start();
        return this.lab.myLatestInstance;
    }

    @action
    setRunningLabs(labs) {
        this.runningLabs = labs;
    }

    @action
    setShowNewWorkspaceModal(value = false) {
        this.showNewWorkspaceLaunchModal = value;
        const content = value ? NEW_WORKSPACE_LAUNCH_MODAL_CONTENT.RUNNING_INSTANCES : null;
        this.setNewWorkspaceLaunchModalContent(content);
    }

    @action
    setNewWorkspaceLaunchModalContent(value = null) {
        this.newWorkspaceLaunchModalContent = value;
    }

    @autobind
    @action
    setShowWorkspaceLoginPopup(showLoginPopup = true, showLoginExpanded = false) {
        this.showAzureLoginExpanded = showLoginExpanded;
        this.showWorkspaceLoginPopup = showLoginPopup;
    }

    redirectToUrl(url = this.lab.myLatestInstance.workspaceSsoUrl) {
        this.labWindow.location = url;
    }

    @action
    connectToLab() {
        let labUrl;
        const launchParam = this.userType === USER_TYPES.INSTRUCTOR ? '?version=head' : '';
        if (this.isWebLab || this.isDevOpsLab || this.isDataScienceLab || this.isSecurityLab) {
            labUrl = `/labs/${this.lab.id}/workspace/${this.lab.myLatestInstance.uuid}/${launchParam}`;
            this.labWindow = window.open(labUrl, '_blank', 'close=yes');
        } else if (this.isManualLoginLabVertical) {
            this.setShowWorkspaceLoginPopup(true, false);
        } else {
            labUrl = this.lab.myLatestInstance.workspaceSsoUrl;
            this.labWindow = window.open(labUrl, '_blank', 'close=yes');
        }
    }

    @autobind
    @action
    async openWorkspace() {
        if (this.isAzureLab) {
            this.labWindow = window.open(AZURE_LOGOUT_URL, '_blank', 'close=yes');
        } else if (this.isGCPLab) {
            this.labWindow = window.open(GCP_LOGOUT_URL, '_blank', 'close=yes');
        }
        await new Promise((resolve) => setTimeout(resolve, LAB_ACTION_TIMEOUT_MS));
        this.redirectToUrl(this.lab.myLatestInstance.workspaceLoginUrl);
    }

    @action
    async stopLab() {
        if (!this.isModularLabWithPauseResume) {
            // reset timer if experiment is disabled or it's an in-course workspace
            this.resetTimer();
        }
        this.closeLabWindow();
        this.setPendingAction({
            action: LAB_INSTANCE_STATUS.stopping,
        });
        this.updateLabInstance({
            ...this.lab.myLatestInstance,
            status: LAB_INSTANCE_STATUS.stopping,
        });

        try {
            await udApi.delete(stopLabInstanceApiUrl(this.lab.id, this.lab.myLatestInstance.uuid));
        } catch (e) {
            Raven.captureException(e);
            this._showErrorToast(LAB_LAUNCHER_FEEDBACK.STOP_LAB_FEEDBACK);
        }
        // leave pendingAction set; when celery task executes, the heartbeat will check and clear the pendingAction when the action is complete
    }

    @action
    async terminateLab() {
        this.resetTimer();
        this.closeLabWindow();
        this.setPendingAction({
            action: LAB_INSTANCE_STATUS.killing,
        });
        this.updateLabInstance({
            ...this.lab.myLatestInstance,
            status: LAB_INSTANCE_STATUS.killing,
        });

        try {
            await udApi.delete(
                terminateLabInstanceApiUrl(this.lab.id, this.lab.myLatestInstance.uuid),
            );
            this.setShowExpirationWarning(false);
            this.heartbeat.start();
        } catch (e) {
            Raven.captureException(e);
            this._showErrorToast(LAB_LAUNCHER_FEEDBACK.TERMINATE_LAB_FEEDBACK);
            this.resetLabState();
        }
        // leave pendingAction set; the heartbeat will ask for regular status updates and clear the pendingAction when the action is complete
    }

    @action
    async terminateRunningLabs() {
        this.setNewWorkspaceLaunchModalContent(
            NEW_WORKSPACE_LAUNCH_MODAL_CONTENT.TERMINATING_EXISTING_INSTANCES,
        );
        for (const workspace of this.runningLabs) {
            try {
                await udApi.delete(terminateLabInstanceApiUrl(workspace.lab.id, workspace.uuid));
            } catch (e) {
                Raven.captureException(e);
                this._showErrorToast(LAB_LAUNCHER_FEEDBACK.TERMINATE_LAB_FEEDBACK);
            }
        }
        this.setNewWorkspaceLaunchModalContent(NEW_WORKSPACE_LAUNCH_MODAL_CONTENT.TERMINATE_DONE);
    }

    @action
    async syncInstance() {
        const params = {
            'fields[lab_instance]': LAB_INSTANCE_API_PARAMS,
        };

        try {
            const response = await udApi.put(
                syncLabInstanceApiUrl(this.lab.id, this.lab.myLatestInstance.uuid),
                {},
                {params},
            );
            this.updateLabInstance(response.data);
            this.checkExpirationTime();
        } catch (e) {
            Raven.captureException(e);
            this._showErrorToast(LAB_LAUNCHER_FEEDBACK.SYNC_LAB_FEEDBACK);
        }
    }

    @action
    checkExpirationTime() {
        if (
            !LAB_TYPE_WORKSPACE.includes(this.lab.labType) ||
            LAB_INSTANCE_UNSTARTABLE_STATUS.includes(this.lab.myLatestInstance.status)
        ) {
            this.setShowExpirationWarning(false);
            return;
        }
        if (this.daysTillExpiration < WORKSPACE_AUTO_TERMINATE_WARNING_TIME_DAYS) {
            this.setShowExpirationWarning(true);
        }
    }

    @computed
    get daysTillExpiration() {
        const now = Date.now();
        return (Date.parse(this.lab.myLatestInstance.expirationTime) - now) / (1000 * 60 * 60 * 24);
    }

    @action
    updateLabInstance(labInstance) {
        this.lab.setLabInstanceFromData(labInstance);
    }

    // the following autobind is needed for stopping->stopped to track properly
    @autobind
    @action
    setPendingAction(value = null) {
        this.pendingAction = value;
    }

    @action
    setIsPendingTermination(value = false) {
        this.isPendingTermination = value;
    }

    @action
    setShowSessionEndPrompt(value = false) {
        this.labSessionEndTimeMs = value ? Date.now() : null;
        this.showSessionEndPrompt = value;
    }

    @action
    setShowExpirationWarning(value = false) {
        this.showExpirationWarning = value;
    }

    @action
    async setLabSessionStartTime() {
        this.resetTimer();
        const params = {
            'fields[lab_instance]': LAB_INSTANCE_API_PARAMS,
        };

        try {
            const response = await udApi.patch(
                resetLabInstanceSessionApiUrl(this.lab.id, this.lab.myLatestInstance.uuid),
                {},
                {params},
            );
            this.updateLabInstance(response.data);
        } catch (e) {
            Raven.captureException(e);
            this._showErrorToast(LAB_LAUNCHER_FEEDBACK.SYNC_LAB_FEEDBACK);
        }
    }

    @action
    closeLabWindow() {
        if (this.labWindow) {
            this.labWindow.close();
        }
        this.labWindow = null;
    }

    @computed
    get isActiveLab() {
        const {myLatestInstance} = this.lab;
        const labStatus = myLatestInstance
            ? LAB_INSTANCE_STATUS_UI[myLatestInstance.status]
            : LAB_INSTANCE_STATUS_UI.not_in_use;

        return (
            myLatestInstance &&
            [
                LAB_INSTANCE_STATUS_UI.running,
                LAB_INSTANCE_STATUS_UI.stopping,
                LAB_INSTANCE_STATUS_UI.killing,
            ].includes(labStatus)
        );
    }

    @computed
    get areLabActionsDisabled() {
        if (this.lab.isLaunchDisabled) {
            return true;
        }
        if (LAB_PENDING_STATUSES.includes(this.lab.status) || !this.lab.vertical) {
            return true;
        }
        const {myLatestInstance} = this.lab;
        return (
            this.pendingAction ||
            (myLatestInstance &&
                (LAB_INSTANCE_TRANSITIONAL_STATUS.includes(
                    LAB_INSTANCE_STATUS[myLatestInstance.status],
                ) ||
                    myLatestInstance.status === LAB_INSTANCE_STATUS.deactivated))
        );
    }

    @computed
    get isTerminateActionVisible() {
        return (
            this.lab.vertical !== LAB_VERTICAL.data_science.key ||
            this.lab.provider !== LAB_PROVIDER.vocareum
        );
    }

    @action
    resetTimer() {
        this.timeRemainingSeconds = null;
        this.labSessionStartTimeMs = null;
        this.labSessionEndTimeMs = null;
    }

    @action
    setIsModularLabCloseToUsageLimit(value) {
        this.isModularLabCloseToUsageLimit = value;
    }

    @action
    updateWorkspaceTimer() {
        if (this.showSessionEndPrompt) {
            this.setTimeRemaining(
                this.labTimeLeftMs(
                    this.labSessionEndTimeMs,
                    WORKSPACE_WARNING_TIME_BEFORE_PAUSE_MS,
                ),
            );
        } else {
            const startTime = Date.parse(this.lab.myLatestInstance.sessionStartTime);
            this.setTimeRemaining(this.labTimeLeftMs(startTime, getTimeLimitMsForLab(this.lab)));
        }
    }

    @action
    async handleModularLabTime() {
        const timeLeftMs = this.labTimeLeftMs(
            Date.parse(this.lab.myLatestInstance.startTime),
            getTimeLimitMsForLab(this.lab),
        );
        if (timeLeftMs <= this.modularLabTimeLimitBeforeCountdownMs && timeLeftMs > 0) {
            this.isModularLabCloseToUsageLimit = true;
            this.setTimeRemaining(timeLeftMs);
        } else if (
            timeLeftMs <= 0 &&
            this.lab.myLatestInstance.status === LAB_INSTANCE_STATUS.running
        ) {
            await this.terminateLab();
        }
    }

    @action
    setTimeRemaining(timeRemainingMs) {
        this.timeRemainingSeconds = Math.ceil(timeRemainingMs / 1000);
    }

    labTimeLeftMs(startTime, timeLimitMs) {
        return timeLimitMs - new Date(Date.now() - startTime);
    }

    @action
    setCanBeTerminatedInTransitionState() {
        const {sessionStartTime, status} = this.lab.myLatestInstance;
        const isInTerminableState = !LAB_INSTANCE_UNSTARTABLE_STATUS.includes(status);

        this.canBeTerminatedInTransitionState =
            isInTerminableState &&
            (Date.now() - new Date(sessionStartTime)) / 1000 >
                LAB_TIME_INSTRUCTOR_CAN_TERMINATE_AFTER_SEC;
    }

    @autobind
    @action
    markModularLabCloseToLimit() {
        this.isModularLabCloseToUsageLimit = true;
    }

    @autobind
    @action
    async onTick(elapsedSinceLastActivityMs) {
        if (this.userType === USER_TYPES.STUDENT) {
            await this._handleLabTimer();
        }
        if (elapsedSinceLastActivityMs >= PROGRESS_LOGGING_INTERVAL_MS) {
            this._updateProgress(this.heartbeat.lastActivityDate, elapsedSinceLastActivityMs);
            await this._refreshPendingStatus();
        }
        this.setCanBeTerminatedInTransitionState();
    }

    async _handleLabTimer() {
        if (this.lab.labType === LAB_TYPE.modular.key) {
            await this.handleModularLabTime();
        } else {
            this.updateWorkspaceTimer();

            if (this._hasReachedSessionPromptTimeLimit) {
                this.setShowSessionEndPrompt(false);
                await this.stopLab();
            } else if (this._hasReachedSessionTimeLimit) {
                this.setShowSessionEndPrompt(true);
            }
        }
    }

    _updateProgress(startTimeMs, elapsedTimeMs) {
        const progressData = {
            start_time: Math.round(startTimeMs / 1000),
            elapsed_time: Math.min(
                Math.round(elapsedTimeMs / 1000.0),
                Math.round(PROGRESS_LOGGING_INTERVAL_LIMIT_MS / 1000),
            ),
            consumption_source:
                this.lab.labType === LAB_TYPE.modular.key
                    ? LAB_CONSUMPTION_SOURCE.MODULAR_LAB_WORKSPACE_LAUNCHER
                    : null,
        };
        if (this.lab.myLatestInstance?.status === LAB_INSTANCE_STATUS.running) {
            const uuid = this.lab.myLatestInstance.uuid;

            udApi.post(saveProgressForLabInstanceApiUrl(this.lab.id, uuid), progressData);

            sendLabHeartbeatEvent(uuid, startTimeMs, elapsedTimeMs, this.lab.currentMode);
        }
    }

    async _refreshPendingStatus() {
        if (
            (this.pendingAction ||
                LAB_INSTANCE_TRANSITIONAL_STATUS.includes(this.lab.myLatestInstance?.status)) &&
            !this.refreshInProgress
        ) {
            this.refreshInProgress = true;
            await this.syncInstance(this.lab.myLatestInstance);
            this.refreshInProgress = false;
            if (!LAB_INSTANCE_TRANSITIONAL_STATUS.includes(this.lab.myLatestInstance.status)) {
                this.updateLabInstance(this.lab.myLatestInstance);
                this._replacePendingLabInstance(this.lab.myLatestInstance);
                this.setPendingAction();
                if (
                    this.lab.myLatestInstance.status !== LAB_INSTANCE_STATUS.running &&
                    !this.isResumableLab
                ) {
                    this.heartbeat.stop();
                }
            }
        }
    }

    @action
    _replacePendingLabInstance(labInstance) {
        if (this.pendingAction && this.lab?.myLatestInstance?.uuid === labInstance.uuid) {
            this.lab.myLatestInstance = labInstance;
        }
    }

    _showErrorToast(title) {
        const bannerProps = {udStyle: 'error', title, showCta: false};
        toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
    }

    @computed
    get _hasReachedSessionTimeLimit() {
        const elapsedTimeSinceLabSessionStart =
            this.lab.myLatestInstance.sessionStartTime &&
            !this.showSessionEndPrompt &&
            Math.floor(Date.now() - Date.parse(this.lab.myLatestInstance.sessionStartTime));
        return (
            elapsedTimeSinceLabSessionStart &&
            elapsedTimeSinceLabSessionStart >= getTimeLimitMsForLab(this.lab) &&
            !this.showSessionEndPrompt &&
            this.lab.myLatestInstance.status === LAB_INSTANCE_STATUS.running
        );
    }

    @computed
    get _hasReachedSessionPromptTimeLimit() {
        const elapsedTimeSinceLabSessionEnd =
            this.labSessionEndTimeMs &&
            this.showSessionEndPrompt &&
            Math.floor(Date.now() - this.labSessionEndTimeMs);
        return (
            elapsedTimeSinceLabSessionEnd &&
            elapsedTimeSinceLabSessionEnd >= 60000 &&
            this.showSessionEndPrompt
        );
    }

    @action
    _setLabResetTimeInfo(labResetTimeInfo) {
        this.labResetTimeInfo = labResetTimeInfo;
    }

    async getLabResetTimeInfo() {
        try {
            const response = await udApi.get(LAB_TIME_UNTIL_RUN_LIMIT_RESET_URL);
            this._setLabResetTimeInfo(response.data);
        } catch (e) {
            Raven.captureException(e);
        }
    }

    terminateOnLabCompletion() {
        // the lab terminates in the backend but we need to update the buttons in the lab header
        this.heartbeat.start();
        this.setPendingAction({action: LAB_INSTANCE_STATUS.killing});
        this.updateLabInstance({
            ...this.lab.myLatestInstance,
            status: LAB_INSTANCE_STATUS.killing,
        });
    }

    async _createLabInstance() {
        const params = {
            'fields[lab_instance]': LAB_INSTANCE_API_PARAMS,
            'fields[lab]': 'id,title,vertical,provider,has_sso',
        };
        try {
            return await udApi.post(labInstanceBaseApiUrl(this.lab.id), {}, {params});
        } catch (e) {
            if (e.response.status === 409) {
                this.setRunningLabs(e.response.data.results);
                this.setShowNewWorkspaceModal(true);
                this.closeLabWindow();
                this.resetLabState();
                this._resetLabInstance();
                return;
            }
            if (e.response.status === 400 && e.response.data.detail) {
                this._showErrorToast(e.response.data.detail);
            } else {
                this._showErrorToast(LAB_LAUNCHER_FEEDBACK.START_LAB_FEEDBACK);
            }
            Raven.captureException(e);
            this.resetLabState();
        }
    }

    @action
    _resetLabInstance() {
        this.lab.myLatestInstance = null;
    }
}
