import {Tracker} from '@udemy/event-tracking';
import {action, observable} from 'mobx';

import {
    LearningListCreateEvent,
    LearningListEditEvent,
} from 'browse/components/save-to-list/events';
import {showSuccessToast, showReloadPageErrorToast} from 'course-taking/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

export default class CollectionModalStore {
    @observable id = null;
    @observable title = '';
    @observable description = '';
    @observable listId = null;
    @observable isLoading = false;

    constructor(uiRegion) {
        this.uiRegion = uiRegion;
    }

    @action
    reset(collection) {
        this.id = collection ? collection.id : null;
        this.setTitle(collection ? collection.title : '');
        this.setDescription(collection ? collection.description : '');
        this.listId = collection ? collection.list_id : null;
    }

    @action
    setTitle(inputValue) {
        this.title = inputValue;
    }

    @action
    setDescription(inputValue) {
        this.description = inputValue;
    }

    @action
    createCollection() {
        this.isLoading = true;
        return udApi
            .post('/users/me/subscribed-courses-collections/', {
                title: this.title,
                description: this.description,
            })
            .then(
                action((response) => {
                    this.setTitle('');
                    this.setDescription('');
                    Tracker.publishEvent(
                        new LearningListCreateEvent({
                            listId: response.data.list_id,
                            nonInteraction: false,
                            uiRegion: this.uiRegion,
                        }),
                    );
                    this.isLoading = false;
                    return response.data;
                }),
            )
            .catch(
                action(() => {
                    this.isLoading = false;
                    showReloadPageErrorToast(defaultErrorMessage);
                }),
            );
    }

    @action
    updateCollection() {
        this.isLoading = true;
        return udApi
            .patch(`/users/me/subscribed-courses-collections/${this.id}/`, {
                title: this.title,
                description: this.description,
            })
            .then(
                action(() => {
                    showSuccessToast(
                        interpolate(
                            gettext('Your list "%(title)s" has been updated.'),
                            {
                                title: this.title,
                            },
                            true,
                        ),
                    );
                    Tracker.publishEvent(
                        new LearningListEditEvent({
                            listId: this.listId,
                            uiRegion: this.uiRegion,
                        }),
                    );
                    this.isLoading = false;
                }),
            )
            .catch(
                action(() => {
                    this.isLoading = false;
                    showReloadPageErrorToast(defaultErrorMessage);
                }),
            );
    }
}
