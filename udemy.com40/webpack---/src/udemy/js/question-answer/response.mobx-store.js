import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import UpvoteEventFactory, {TypesEnum, ItemTypesEnum, ActionTypesEnum} from './tracking-events';

export default class ResponseStore {
    @observable response;
    @observable thread;
    @observable isUpvoted = false;
    @observable numUpvotes = 0;
    @observable url;

    constructor(thread, response) {
        this.thread = thread;
        this.response = response;
        this.isUpvoted = response.is_upvoted || false;
        this.numUpvotes = response.num_upvotes || 0;
        this.url = global.window.location.href;
    }

    @autobind
    getTypeFromUrl() {
        if (this.url.includes('/communication/qa')) {
            return TypesEnum.QA;
        } else if (this.url.includes('/communication/featured_questions')) {
            return TypesEnum.FQ;
        }
        return null;
    }

    @autobind
    @action
    upvote() {
        if (this.isUpvoted) {
            return this.deleteUpvote();
        }
        return this.createUpvote();
    }

    deleteUpvote() {
        return udApi
            .delete(
                `courses/${this.thread.course.id}/discussions/${this.thread.id}/replies/${this.response.id}/upvoters/${udMe.id}/`,
            )
            .then(
                action(() => {
                    this.publishEvent(ActionTypesEnum.REMOVEUPVOTE);
                    this.isUpvoted = !this.isUpvoted;
                    this.numUpvotes--;
                }),
            );
    }

    createUpvote() {
        return udApi
            .post(
                `courses/${this.thread.course.id}/discussions/${this.thread.id}/replies/${this.response.id}/upvoters/`,
            )
            .then(
                action(() => {
                    this.publishEvent(ActionTypesEnum.GIVEUPVOTE);
                    this.isUpvoted = !this.isUpvoted;
                    this.numUpvotes++;
                }),
            );
    }

    @autobind
    publishEvent(action) {
        const event = UpvoteEventFactory.create(
            this.getTypeFromUrl(),
            ItemTypesEnum.ANSWER,
            action,
            this.thread.course.id,
            this.thread.id,
            this.response.id,
        );
        event && Tracker.publishEvent(event);
    }
}
