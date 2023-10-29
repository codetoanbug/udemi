import autobind from 'autobind-decorator';
import {AxiosResponse} from 'axios';
import {action, computed, observable} from 'mobx';

import {I18nApi} from '@udemy/i18n';
import {AlertBannerProps, ToasterStore} from '@udemy/react-messaging-components';
import {udSentry} from '@udemy/sentry';
import {udSystemMessage} from '@udemy/shared-utils';
import {udApi} from '@udemy/ud-api';

import {LAB_REFRESH_AND_RETRIEVE_LABS_URL, terminateLabInstanceApiUrl} from '../apis';
import {LABS_MODULAR_URL_PATTERN, LAB_LAUNCHER_FEEDBACK, LAB_MODE} from '../constants';
import {ActiveLabApiResponse, LabInstanceApiResponse} from '../types/labs';
import {MODAL_TYPE} from './constants';

export class LabsLearningBannerStore {
    @observable isDismissed = true;
    @observable.ref data: ActiveLabApiResponse[] = [];
    @observable modalType?: string;

    @autobind
    @action
    setData(data: ActiveLabApiResponse[]) {
        this.data = data;
    }

    @computed
    get firstRunningLab(): LabInstanceApiResponse | undefined {
        if (this.data.length === 1) {
            return this.data[0].lab_instance;
        }
    }

    @computed
    get url() {
        if (this.firstRunningLab) {
            if (this.firstRunningLab?.lab.url) {
                return this.firstRunningLab.lab.url;
            }
            return `${LABS_MODULAR_URL_PATTERN}${this.firstRunningLab?.id}/`;
        }
    }

    @computed
    get firstTaskUrl() {
        return `${this.url}tasks/1/`;
    }

    @computed
    get tasksPageUrl() {
        return `${this.url}tasks/`;
    }

    @computed
    get overviewUrl() {
        return `${this.url}overview/`;
    }

    @computed
    get projectOverviewUrl() {
        return `${this.url}project-overview/`;
    }

    @computed
    get lastActiveTaskPageUrl() {
        if (this.getActiveTaskNumber()) {
            return `${this.tasksPageUrl}${this.getActiveTaskNumber()}/`;
        }
        return this.firstTaskUrl;
    }

    @computed
    get continueLabPageUrl() {
        const currentMode = this.firstRunningLab?.lab.enrollment?.last_attempted_mode;
        if (currentMode === LAB_MODE.STRUCTURED) {
            // Student has started structured mode
            return this.lastActiveTaskPageUrl;
        }
        if (currentMode === LAB_MODE.FOLLOW_ALONG) {
            // Student has started follow along mode
            return this.tasksPageUrl;
        }
        return this.projectOverviewUrl;
    }

    private getActiveTaskNumber() {
        return this.data?.[0].active_task_number;
    }

    async refreshAndRetrieveRunningLabs() {
        try {
            const response: AxiosResponse<{results: ActiveLabApiResponse[]}> = await udApi.post(
                LAB_REFRESH_AND_RETRIEVE_LABS_URL,
            );
            if (response.data && response.data.results.length > 0) {
                this.setData(response.data.results);
            }
        } catch (e) {
            udSentry.captureException(e as Error);
        }
    }

    async checkDismissed() {
        const promises = (this.data || []).map(async (lab) => {
            if (lab.lab_instance) {
                const response = await udSystemMessage.hasSeen(
                    udSystemMessage.ids.hasSeenActiveLabBanner,
                    {
                        obj_type: 'lab_instance',
                        obj_id: lab.lab_instance.id,
                    },
                );
                if (response.data === false) {
                    this.setIsDismissed(false);
                }
            }
        });
        await Promise.allSettled(promises);
        this.setIsDismissed(this.isDismissed);
    }

    async setDismissed() {
        const promises = (this.data || []).map(async (lab) => {
            if (lab.lab_instance) {
                await udSystemMessage.seen(udSystemMessage.ids.hasSeenActiveLabBanner, {
                    obj_type: 'lab_instance',
                    obj_id: lab.lab_instance.id,
                });
            }
        });
        await Promise.allSettled(promises);
        this.setIsDismissed(true);
    }

    @action
    private setIsDismissed(value: boolean) {
        this.isDismissed = value;
    }

    _showErrorToast(title: string) {
        const bannerProps = {udStyle: 'error', title, showCta: false} as AlertBannerProps;
        ToasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
    }

    @action
    showDismissModal() {
        this.modalType = MODAL_TYPE.DISMISS_MODAL;
    }

    @autobind
    @action
    hideModal() {
        this.modalType = undefined;
    }

    @computed
    get shouldRenderMultipleLabsBanner() {
        return this.data.length > 1 && !this.isDismissed;
    }

    @computed
    get isDismissModalActive() {
        return this.modalType === MODAL_TYPE.DISMISS_MODAL;
    }

    async terminateLab(gettext: I18nApi['gettext']) {
        if (!this.firstRunningLab) {
            return;
        }

        try {
            await udApi.delete(
                terminateLabInstanceApiUrl(this.firstRunningLab?.id, this.firstRunningLab?.uuid),
            );
        } catch (e) {
            udSentry.captureException(e as Error);
            this._showErrorToast(LAB_LAUNCHER_FEEDBACK.TERMINATE_LAB_FEEDBACK(gettext));
        }
    }
}
