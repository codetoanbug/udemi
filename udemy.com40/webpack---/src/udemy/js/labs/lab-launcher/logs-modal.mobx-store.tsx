import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {labInstanceApiUrl, labInstanceRequestLogsApiUrl} from 'labs/apis';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import {GET_LOGS_INTERVAL_MS} from './constants';

export class LogsModalStore {
    @observable logs: Record<string, Record<'previous' | 'current', string>> = {};
    @observable isLoading = true;
    @observable isError = false;

    get logsPollInterval() {
        return GET_LOGS_INTERVAL_MS;
    }

    constructor(public labId: number, public labInstanceUuid: string) {
        this.labId = labId;
        this.labInstanceUuid = labInstanceUuid;
    }

    getLogsInterval!: ReturnType<typeof setInterval>;

    @action private setLogs(logs = {}) {
        this.logs = logs;
    }

    @action private setIsError(value: boolean) {
        this.isError = value;
    }

    @action private setIsLoading(value: boolean) {
        this.isLoading = value;
    }

    stopPollingForLogs() {
        this.getLogsInterval && clearInterval(this.getLogsInterval);
    }

    @autobind
    async getLogs() {
        try {
            const response = await udApi.get(labInstanceApiUrl(this.labId, this.labInstanceUuid), {
                params: {
                    'fields[lab_instance]': 'logs',
                },
            });
            if (Object.keys(response.data.logs).length) {
                this.stopPollingForLogs();
                this.setLogs(response.data.logs);
                this.setIsLoading(false);
            }
        } catch (e) {
            this.handleApiError(e);
        }
    }

    @autobind
    async requestLogs() {
        try {
            this.setIsError(false);
            this.setIsLoading(true);
            await udApi.post(labInstanceRequestLogsApiUrl(this.labId, this.labInstanceUuid));
            this.getLogsInterval = setInterval(this.getLogs, this.logsPollInterval);
        } catch (e) {
            this.handleApiError(e);
        }
    }

    private handleApiError(e: Error) {
        Raven.captureException(e);
        this.stopPollingForLogs();
        this.setIsError(true);
        this.setIsLoading(false);
    }
}
