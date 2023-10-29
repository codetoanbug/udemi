import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import {
    LAB_INSTANCE_API_PARAMS,
    labBaseApiUrl,
    LABS_BASE_API_URL,
    LABS_LIST_INSTRUCTOR_API_PARAMS,
    publishLabApiUrl,
    unpublishLabApiUrl,
} from 'labs/apis';
import {
    ERROR_NOTIFICATION_PROPS,
    LAB_INSTANCE_STATUS,
    LAB_INSTANCE_TRANSITIONAL_STATUS,
    LAB_STATUS,
    LAB_PENDING_STATUSES,
    MAX_RUNNING_LABS_CNT,
    NOTIFICATION_OPTIONS,
    LAB_TYPE,
    ALL_INSTRUCTOR_LAB_ACCESS_LEVELS,
} from 'labs/constants';
import Lab from 'labs/lab.mobx-model';
import {checkUserLabAccessLevelWithExperiment} from 'labs/utils';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import {
    RECHECK_PENDING_TIMER_INTERVAL_MS,
    LAB_ACTIONS,
    LAB_ACTIONS_FEEDBACK,
    API_SETTINGS,
} from './constants';

export default class LabsStore {
    @observable labs = [];
    @observable isLoading = false;
    @observable isLabCreating = false;
    @observable canCreate = false;
    @observable isStaff = false;
    @observable numUnreadReports = 0;

    constructor(canCreate = false, isStaff = false) {
        this.canCreate = canCreate;
        this.intervalId = null;
        this.isStaff = isStaff;
    }

    @computed
    get isRunningLabLimitExceeded() {
        if (this.isStaff) {
            return false;
        }

        let cnt = 0;

        for (const lab of this.labs) {
            if (
                lab.myLatestInstance?.status === LAB_INSTANCE_STATUS.running ||
                LAB_INSTANCE_TRANSITIONAL_STATUS.includes(lab.myLatestInstance?.status)
            ) {
                cnt += 1;
            }
        }

        return cnt >= MAX_RUNNING_LABS_CNT;
    }

    @action _setLabs(labs) {
        this.labs = labs.map((lab) => {
            return new Lab(lab);
        });
    }

    @action _setIsLoading(isLoading) {
        this.isLoading = isLoading;
    }

    @action _setIsLabCreating(value) {
        this.isLabCreating = value;
    }

    @autobind
    async loadLabs() {
        if (!this.isLoading) {
            this._setIsLoading(true);

            const params = {
                'fields[lab]': LABS_LIST_INSTRUCTOR_API_PARAMS,
                'fields[lab_instance]': LAB_INSTANCE_API_PARAMS,
                is_owned: 1,
            };

            try {
                const response = await udApi.get(LABS_BASE_API_URL, {
                    params,
                });
                this._setLabs(response.data.results);
                this._setIsLoading(false);
            } catch (e) {
                Raven.captureException(e);
                this._setIsLoading(false);
                this._handleActionError();
                return;
            }

            const pending = this.labs.some((lab) => LAB_PENDING_STATUSES.includes(lab.status));
            if (pending && this.intervalId === null) {
                this.intervalId = setInterval(this.loadLabs, RECHECK_PENDING_TIMER_INTERVAL_MS);
            } else if (!pending && this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    }

    @autobind
    async publishLab(labId) {
        try {
            await udApi.post(publishLabApiUrl(labId));
            this._changeLabStatus(labId, LAB_STATUS.published);
        } catch (e) {
            Raven.captureException(e);
            this._handleActionError(LAB_ACTIONS.SAVE);
        }
    }

    @autobind
    async unpublishLab(labId) {
        try {
            await udApi.post(unpublishLabApiUrl(labId));
            this._changeLabStatus(labId, LAB_STATUS.draft);
        } catch (e) {
            Raven.captureException(e);
            this._handleActionError(LAB_ACTIONS.SAVE);
        }
    }

    @autobind
    async deleteLab(labId) {
        try {
            await udApi.delete(labBaseApiUrl(labId));
            this._deleteLab(labId);
        } catch (e) {
            Raven.captureException(e);
            this._handleActionError(LAB_ACTIONS.DELETE);
        }
    }

    _handleActionError(type) {
        const title = LAB_ACTIONS_FEEDBACK.errors.title;
        const body = LAB_ACTIONS_FEEDBACK.errors[type]
            ? LAB_ACTIONS_FEEDBACK.errors[type]
            : LAB_ACTIONS_FEEDBACK.errors.default;
        toasterStore.addAlertBannerToast(
            {
                ...ERROR_NOTIFICATION_PROPS,
                title,
                body,
            },
            NOTIFICATION_OPTIONS,
        );
    }

    @action
    _deleteLab(labId) {
        // remove lab from the FE data structure
        const index = this._getLabIndex(labId);
        this.labs.splice(index, 1);
    }

    _changeLabStatus(labId, status) {
        const index = this._getLabIndex(labId);
        this.labs[index].setStatus(status);
    }

    _getLabIndex(labId) {
        return this.labs.findIndex((lab) => lab.id === labId);
    }

    async createLab(labType) {
        this._setIsLabCreating(true);
        try {
            const response = await udApi.post(LABS_BASE_API_URL, {
                title: gettext('New lab'),
                lab_type: labType,
            });
            return response.data.id;
        } catch (e) {
            this._handleActionError('create');
        } finally {
            this._setIsLabCreating(false);
        }
    }

    @computed
    get modularLabs() {
        return this.labs.filter((lab) => lab.labType === LAB_TYPE.modular.key);
    }

    @computed
    get devWorkspaces() {
        return this.labs.filter((lab) => lab.labType === LAB_TYPE.dev_workspace.key);
    }

    @computed
    get inCourseWorkspaces() {
        return this.labs.filter((lab) => lab.labType === LAB_TYPE.workspace.key);
    }

    @computed
    get hasUnreadLabCommunications() {
        return this.numUnreadReports > 0;
    }

    async getUnreadReportedIssues() {
        // TODO - reuse in secondary menu item
        if (
            !checkUserLabAccessLevelWithExperiment(
                ALL_INSTRUCTOR_LAB_ACCESS_LEVELS,
                'lab_taking',
                'reported_issues_instructor_panel_enabled',
                false,
                true,
            )
        ) {
            // TODO - consider moving to a more suitable place
            return false;
        }
        try {
            const response = await udApi.get(`${API_SETTINGS.countUrl}`);
            this.setUnreadReportedIssues(response.data.count);
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    @action
    setUnreadReportedIssues(count) {
        this.numUnreadReports = count;
    }
}
