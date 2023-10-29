import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import udMe from 'utils/ud-me';

import User from './user.mobx-model';

export default class Answer {
    @observable body;
    @observable numUpvotes;
    @observable isUpvoted;
    @observable isTopAnswer;

    constructor(apiData = {}) {
        this.id = apiData.id || -1;
        this.isUserInstructor = apiData.is_instructor;
        this.userIsVisibleInstructor = apiData.is_visible_instructor;
        this.created = apiData.created;

        const userData = apiData.user || {};
        // This data not available from the user serializer.
        userData.is_banned = apiData.is_banned_user;
        this.user = new User(userData);

        this.setObservablesFromAPIData(apiData);
    }

    @action
    setObservablesFromAPIData(apiData) {
        this.body = apiData.body || '';
        this.numUpvotes = apiData.num_upvotes || 0;
        this.isUpvoted = apiData.is_upvoted || false;
        this.isTopAnswer = apiData.is_top_answer || false;
    }

    @autobind
    @action
    setBody(body) {
        this.body = body;
    }

    @action
    upVote() {
        this.isUpvoted = true;
        this.numUpvotes++;
    }

    @action
    downVote() {
        this.isUpvoted = false;
        this.numUpvotes--;
    }

    @action
    markTop() {
        this.isTopAnswer = true;
    }

    @action
    unmarkTop() {
        this.isTopAnswer = false;
    }

    get isNew() {
        return this.id === -1;
    }

    get isMine() {
        return this.user.id === udMe.id;
    }
}
