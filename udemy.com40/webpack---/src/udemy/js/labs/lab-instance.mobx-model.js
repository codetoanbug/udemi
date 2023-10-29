import {action, computed, observable} from 'mobx';

import {LAB_INSTANCE_STATUS} from 'labs/constants';
import {getTimeLimitMinutesForLab} from 'labs/utils';
import {APIModel} from 'utils/mobx';

export default class LabInstance extends APIModel {
    @observable.ref lab = null;
    @observable status = null;
    @observable startTime = null;

    constructor(data, lab) {
        super(data);
        this.lab = lab;
    }

    get apiDataMap() {
        return {
            id: 'id',
            uuid: 'uuid',
            awsAccessKeyId: 'aws_access_key_id',
            awsSecretAccessKey: 'aws_secret_access_key',
            awsSessionToken: 'aws_session_token',
            startTime: 'start_time',
            totalSpend: 'total_spend',
            allowedSpend: 'allowed_spend',
            sessionStartTime: 'session_start_time',
            workspaceSsoUrl: 'workspace_sso_url',
            workspaceLoginUrl: 'workspace_login_url',
            workspaceUsername: 'workspace_username',
            workspacePassword: 'workspace_password',
            workspaceResource: 'workspace_resource',
            status: 'status',
            expirationTime: 'expiration_time',
        };
    }

    @computed
    get expiryTime() {
        if (!this.startTime) {
            return null;
        }
        const expiryDateTime = new Date(this.startTime);
        expiryDateTime.setMinutes(
            expiryDateTime.getMinutes() + getTimeLimitMinutesForLab(this.lab),
        );
        return expiryDateTime;
    }

    @computed
    get timeLeftInSeconds() {
        // TODO - replace with countdown timer when ready
        if (this.expiryTime) {
            const now = new Date();
            const diffSecs = (this.expiryTime.getTime() - now.getTime()) / 1000;
            return diffSecs > 0 ? diffSecs : 0;
        }
        return 0;
    }

    @action
    maskAsTerminating() {
        this.status = LAB_INSTANCE_STATUS.killing;
    }
}
