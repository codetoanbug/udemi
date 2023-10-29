import {action, observable, runInAction} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import SystemMessage from 'utils/ud-system-message';

const INSTRUCTOR_API_TOKEN_ENDPOINT = '/users/me/instructor-api-token/';

export default class ApiClientsStore {
    @observable instructorToken = undefined;
    @observable isPremiumInstructor = false;
    @observable isLoaded = false;
    @observable clientsApi = [];

    @action
    async fetchUserData() {
        const getUser = async () => {
            const response = await udApi.get('/users/me/', {
                params: {'fields[user]': 'is_user_premium_instructor'},
            });
            runInAction(() => {
                this.isPremiumInstructor = response.data.is_user_premium_instructor;
            });
        };
        const getToken = async () => {
            const response = await udApi.get(INSTRUCTOR_API_TOKEN_ENDPOINT);
            runInAction(() => {
                this.instructorToken = response.data.results.length > 0;
            });
        };
        const apiClients = async () => {
            const response = await udApi.get('/users/me/api-clients/');
            runInAction(() => {
                this.clientsApi = response.data.results.sort((a, b) =>
                    a.created > b.created ? 1 : -1,
                );
            });
        };

        try {
            const result = await Promise.all([getUser(), getToken(), apiClients()]);
            runInAction(() => {
                this.isLoaded = true;
            });
            return result;
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    async removeInstructorToken() {
        try {
            await udApi.delete(`${INSTRUCTOR_API_TOKEN_ENDPOINT}1/`);
            runInAction(() => {
                this.instructorToken = null;
            });
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    async createInstructorToken() {
        try {
            const response = await udApi.post(INSTRUCTOR_API_TOKEN_ENDPOINT);
            runInAction(() => {
                this.instructorToken = response.data.token;
            });
            return this.instructorToken;
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    markSeenEula() {
        return SystemMessage.seen(SystemMessage.ids.instructorApiEula);
    }
}
