import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import ThreadedMobxMixin from 'instructor/common/thread-mobx-mixin';
import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import udMe from 'utils/ud-me';
import userSettings, {SETTINGS} from 'utils/user-settings';

import {DirectMessageSent} from '../events';
import {
    SHOW_AUTOMATED_MESSAGES_SETTING,
    FILTER_UNREAD,
    FILTER_UNRESPONDED,
    FILTER_STARRED,
    FILTER_AUTOMATED,
    API_SETTINGS,
} from './constants';

export default class MessagingStore extends ThreadedMobxMixin {
    @observable instructorInfoLoaded = false;
    @observable loadedInitialThreads = false;
    @observable noThreads = false;
    @observable isThreadCreateDisabled = false;
    @observable numUnreadThreads = 0;
    @observable directMessagingDisabled = false;
    @observable showMessagesOptOutScreen = false;

    _instructorStore;
    @observable isUserInstructor;
    @observable.ref me = udMe;

    constructor(baseUrl, instructorStore, twoPaneStore) {
        super(API_SETTINGS, {baseUrl, twoPaneStore});
        this._instructorStore = instructorStore;
    }

    @action
    refreshDirectMessagingSettings() {
        this.directMessagingDisabled = !userSettings.get(SETTINGS.directMessagingEnabled);
        this.showMessagesOptOutScreen = this.directMessagingDisabled;
    }

    @action
    showOldMessages() {
        this.loadInitialThreads();
        this.showMessagesOptOutScreen = false;
    }

    fetchThreadParams() {
        const params = super.fetchThreadParams();
        if (this.isUserInstructor) {
            params['fields[message_thread]'] += ',enrolled_courses';
        }
        return params;
    }

    applyFilters() {
        const params = super.applyFilters();
        if (!this.filters[FILTER_AUTOMATED] && !this.filters[FILTER_UNREAD]) {
            params.not_automated = 1;
        }
        if (this.filters[FILTER_UNREAD]) {
            params.is_read = 0;
        }
        if (this.filters[FILTER_STARRED]) {
            params.is_starred = 1;
        }
        if (this.filters[FILTER_UNRESPONDED]) {
            params.is_unreplied = 1;
        }
        return params;
    }

    async _loadThreads(apiUrl = API_SETTINGS.apiUrl, extraParams = {}) {
        const response = await super._loadThreads(apiUrl, extraParams);
        if (response) {
            this.setNumUnreadThreads(response.data.unread_count || this.numUnreadThreads);
        }
        return response;
    }

    setFilter(filter, value) {
        if (filter === FILTER_AUTOMATED) {
            udApi.post('/users/me/settings/', [
                {
                    setting: SHOW_AUTOMATED_MESSAGES_SETTING,
                    value: value ? 'on' : 'off',
                },
            ]);
        }
        super.setFilter(filter, value);
    }

    setShowAutomatedMessages(newValue) {
        this.setFilter(FILTER_AUTOMATED, newValue);
        udApi.post('/users/me/settings/', [
            {
                setting: SHOW_AUTOMATED_MESSAGES_SETTING,
                value: newValue ? 'on' : 'off',
            },
        ]);
    }

    @computed
    get filteredThreads() {
        return this._threads.filter((thread) => !thread.is_deleted && !thread.is_muted);
    }

    @action
    setThreadDetails(requestedThread, threadData, detailData) {
        requestedThread.enrolled_courses = threadData.enrolled_courses || [];
        requestedThread.messages = detailData.results.reverse();
        if (this.loadedInitialThreadDetails) {
            this.markAsRead(requestedThread);
        } else {
            this.loadedInitialThreadDetails = true;
        }
    }

    /**
     *
     * In order for MobX to be able to track below properties, we need to make sure initial objects
     * have them from get go.
     * https://mobxjs.github.io/mobx/best/pitfalls.html#-object-somenewprop-value-is-not-picked-up
     * Unfortunately even using `extendObservable` later on won't help us,
     * since the `observer` block is running before `extendObservable`.
     * https://mobxjs.github.io/mobx/best/react.html#incorrect-using-not-yet-existing-observable-object-properties
     * Alternatively one could use `observable.map` to avoid this problem, yet that would mean explicit
     * `set()` and `get()` calls, which is unintuitive.
     * https://mobxjs.github.io/mobx/best/react.html#correct-using-not-yet-existing-map-entries
     *
     * @param thread
     * @returns {*}
     * @private
     */
    makeObservableThread(thread) {
        thread.is_deleted = false;
        thread.is_muted = false;
        thread.messages = [];
        if (!thread.enrolled_courses) {
            thread.enrolled_courses = [];
        }
    }

    // End ThreadedModelMixin overrides //

    @computed
    get ready() {
        return this.instructorInfoLoaded && this.loadedInitialThreads;
    }

    get isPublishedInstructor() {
        return this._instructorStore.isPublishedInstructor;
    }

    get showMuteMessage() {
        return this.isUserInstructor;
    }

    @action async loadInitialThreads() {
        if (this.ready) {
            return new Promise((resolve) => resolve(this._threads));
        }

        try {
            const getCountsPromise = udApi.get(API_SETTINGS.apiUrl, {params: {total_count: 1}});
            const getThreadsPromise = this._reloadThreads();
            const [countsResponse, threadsResponse] = await Promise.all([
                getCountsPromise,
                getThreadsPromise,
            ]);
            runInAction(() => {
                this.noThreads = countsResponse.data.total_count === 0;
            });
            return threadsResponse;
        } finally {
            runInAction(() => {
                this.loadedInitialThreads = true;
            });
        }
    }

    @action async getInstructorInfo() {
        try {
            const response = await udApi.get('/users/me/', {
                params: {
                    'fields[user]':
                        'is_user_instructor,show_automated_messages,is_thread_create_disabled,url',
                },
            });
            runInAction(() => {
                this.isUserInstructor = response.data.is_user_instructor;
                this.me = {...udMe, url: response.data.url};
                this.filters[FILTER_AUTOMATED] = response.data.show_automated_messages;
                this.isThreadCreateDisabled = response.data.is_thread_create_disabled;
                this.instructorInfoLoaded = true;
            });
            return response;
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    @action
    fetchThreadForUser(userId) {
        return udApi.get(API_SETTINGS.apiUrl, {
            params: {
                'fields[message_thread]': 'id',
                other_user: userId,
                limit: 1,
            },
        });
    }

    @autobind // important to autobind so that `this` refers to the store
    async sendMessageToUser(userId, content) {
        const response = await udApi.post('messages/', {
            content,
            user_id: userId,
        });
        // Restore thread if it's deleted
        const thread = this._findThreadById(response.data.message_thread_id);
        // Important analytics event!
        Tracker.publishEvent(
            new DirectMessageSent(
                this.isUserInstructor ? 'instructor' : 'student',
                userId,
                thread ? thread.id : null,
            ),
        );
        if (thread && thread.is_deleted) {
            this._undeleteThread(thread);
        }
        return response;
    }

    @autobind // important to autobind so that `this` refers to the store
    async replyToThread(thread, content) {
        const lastMessage = thread.last_message,
            newMessage = {
                class: '_message',
                id: lastMessage.id + 1,
                content,
                created: new Date().toISOString(),
                is_outgoing: true,
                message_thread_id: thread.id,
            };
        const wasMuted = thread.is_muted;
        thread.is_muted = false;

        thread.messages.push(newMessage);
        thread.last_message = newMessage;
        const lastMessageIndex = thread.messages.length - 1;

        try {
            const response = await udApi.post(`message-threads/${thread.id}/messages/`, {content});
            runInAction(() => {
                thread.last_message = response.data;
                thread.messages[lastMessageIndex] = thread.last_message;
            });
            // Important analytics event!
            Tracker.publishEvent(
                new DirectMessageSent(
                    this.isUserInstructor ? 'instructor' : 'student',
                    thread.other_user.id,
                    thread.id,
                ),
            );
            return response.data;
        } catch (error) {
            runInAction(() => {
                thread.is_muted = wasMuted;
                thread.last_message = lastMessage;
                thread.messages.splice(lastMessageIndex, 1);
            });
            throw error;
        }
    }

    @action
    toggleStarred(thread) {
        return this._toggleBoolAttr(thread, 'is_starred');
    }

    @action
    setMuted(thread) {
        return this._updateAttr(thread, 'is_muted', true, false);
    }

    @action
    setNumUnreadThreads(count) {
        this.numUnreadThreads = count;
        if (this._instructorStore) {
            this._instructorStore.setUnreadMessages(count);
        }
    }

    @action
    toggleRead(thread) {
        thread = this._getThreadOrFromId(thread);
        // Increase/decrease numUnreadThreads based on current is_read value.
        this.setNumUnreadThreads(
            Math.max(thread.is_read ? this.numUnreadThreads + 1 : this.numUnreadThreads - 1, 0),
        );
        return this._toggleBoolAttr(thread, 'is_read');
    }

    @action
    markAsRead(thread) {
        // Do not decrease numUnreadThreads if thread is already read.
        if (!thread.is_read) {
            this.setNumUnreadThreads(Math.max(this.numUnreadThreads - 1, 0));
        }
        return this._updateAttr(thread, 'is_read', true);
    }

    @action
    deleteThread(thread) {
        return this._updateAttr(thread, 'is_deleted', true, false);
    }

    @action
    _undeleteThread(thread) {
        return this._toggleBoolAttr(thread, 'is_deleted');
    }
}
