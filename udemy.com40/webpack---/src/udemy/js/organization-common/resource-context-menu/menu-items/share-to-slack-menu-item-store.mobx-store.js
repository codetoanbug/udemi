import {action, observable} from 'mobx';

import udApi from 'utils/ud-api';

export default class ShareToSlackMenuItemStore {
    @observable isModalShown = false;
    @observable slackTeamName = '';
    @observable shareData = [];
    @observable isLoading = false;

    constructor(resourceId, resourceType, context, window) {
        this.resourceId = resourceId;
        this.resourceType = resourceType;
        this.context = context;
        this.window = window;
        this.currentPath = `${this.window.location.pathname}${this.window.location.search}`;
    }

    @action
    toggleIsLoading = () => {
        this.isLoading = !this.isLoading;
    };

    @action
    hideModal = () => {
        this.isModalShown = false;
    };

    @action
    showModal = (shareData, teamName) => {
        this.shareData = shareData;
        this.slackTeamName = teamName;

        this.isModalShown = true;
    };

    @action
    checkSlackAuthentication = () => {
        return udApi.post('/share/slack/check/', {
            return_url: this.currentPath,
            context: this.context,
            return_params: {id: this.resourceId, type: this.resourceType},
        });
    };

    shareResource() {
        this.checkSlackAuthentication().then((response) => {
            if (response.data.url) {
                this.window.location.href = response.data.url;
            } else {
                this.showModal(response.data.share_data, response.data.team_name);
            }
        });
    }
}
