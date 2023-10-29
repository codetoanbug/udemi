import autobind from 'autobind-decorator';
import {runInAction, action, computed, observable, reaction} from 'mobx';

import {PERMISSION_CODES, ONE_PANE_MODE} from 'instructor/common/constants';
import ThreadedMobxMixin from 'instructor/common/thread-mobx-mixin';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {API_SETTINGS, FEEDBACK_USER_TYPE} from './constants';

export default class AssignmentsStore extends ThreadedMobxMixin {
    @observable loadedInitialThreads = false;
    @observable noThreads = false;
    @observable numUnreadThreads = 0;
    @observable _taughtCourses = [];
    @observable courseIdFilter = null;
    @observable filterCounts = {
        feedback: 0,
        permission: 0,
        unread: 0,
    };

    @observable totalThreadCount;
    @observable.ref editingReply = null;

    constructor({baseUrl, instructorStore = null, twoPaneStore, courseId = null}) {
        super(API_SETTINGS, {baseUrl, twoPaneStore});
        this.instructorStore = instructorStore;
        this.latchedCourseId = courseId;
        reaction(
            () => this.courseIdFilter,
            () => this._reloadThreads(),
        );
    }

    @action
    init() {
        super.init();
        this.viewModeType = ONE_PANE_MODE;
        this.filters = this.API_SETTINGS.VALID_FILTERS.reduce((obj, name) => {
            if (name === 'unread') {
                obj[name] = false;
            } else {
                obj[name] = 'all';
            }
            return obj;
        }, {});
        this.ordering = '-submission_time';
    }

    makeObservableThread(thread) {
        thread.responses = thread.owner_feedback_question_user_answers || [];
    }

    makeObservableResponse(response) {
        return response;
    }

    _fetchThreadDetails(thread) {
        const params = this.API_SETTINGS.detailParams;
        params.attempt_id_in = thread.id;
        return udApi.get(this.API_SETTINGS.apiDetailUrl(thread), {
            params,
        });
    }

    @action
    setThreadDetails(requestedThread, threadData, detailData) {
        requestedThread.responses = detailData.results.map(this.makeObservableResponse);
        if (this.loadedInitialThreadDetails) {
            this.markAsRead(requestedThread);
        } else {
            this.loadedInitialThreadDetails = true;
        }
    }

    applyFilters() {
        const params = super.applyFilters();
        if (this.viewModeType === ONE_PANE_MODE) {
            params['fields[user_attempted_practice]'] =
                'submission_time,is_private,user,practice,last_feedback,is_read,question_user_answers,owner_feedback_question_user_answers';
        }
        Object.assign(params, this.filters);
        return params;
    }
    // End ThreadedMobxMixin overrides //

    @computed
    get ready() {
        return this.loadedInitialThreads && this._taughtCourses !== null;
    }

    @action
    setCourseFilter(courseId) {
        this.setFilter('course', courseId);
        this.courseIdFilter = courseId;
    }

    @action
    setFilter(filter, value) {
        super.setFilter(filter, value);
        if (filter === 'course') {
            this.filters[filter] = value;
        }
    }

    @action
    clearErrorMessage() {
        this.errorMessage = null;
    }

    _setErrorMessage(apiResponse) {
        const body = apiResponse && apiResponse.data.body;
        if (body && body.length && body[0].messages && body[0].messages.length) {
            this.errorMessage = body[0];
        }
    }

    @action
    toggleRead(thread) {
        thread = this._getThreadOrFromId(thread);
        // Increase/decrease numUnreadThreads based on current is_read value.
        this.setNumUnreadThreads(
            Math.max(thread.is_read ? this.numUnreadThreads + 1 : this.numUnreadThreads - 1, 0),
        );
        this.filterCounts.unread = Math.max(
            thread.is_read ? this.filterCounts.unread + 1 : this.filterCounts.unread - 1,
            0,
        );
        return this._toggleBoolAttr(thread, 'is_read');
    }

    @action
    markAsRead(thread) {
        // Do not decrease numUnreadThreads if thread is already read.
        if (!thread.is_read) {
            this.setNumUnreadThreads(Math.max(this.numUnreadThreads - 1, 0));
            this.filterCounts.unread = Math.max(this.filterCounts.unread - 1, 0);
        }
        return this._updateAttr(thread, 'is_read', true);
    }

    @action
    selectThread(thread) {
        // intentionally not returning super.selectThread(thread). Threading for assignments works
        // via comment threads, not objects related to assignments (the way super.selectThread expects)
        if (!thread.practice) {
            return udApi
                .get(`practices/user-attempted-practices/${thread.id}/`, {
                    params: {
                        'fields[user_attempted_practice]': 'practice',
                        'fields[practice]': 'id',
                    },
                })
                .then((response) => {
                    thread.practice = response.data.practice;
                    this._selectedThreadId = thread.id;
                });
        }
        this._selectedThreadId = thread.id;
    }

    @autobind
    @action
    updateReply(update) {
        const oldEditingReply = Object.assign({}, this.editingReply);
        const oldEditingReplyShallow = this.editingReply;
        const selectedThread = this.selectedThread;
        Object.assign(this.editingReply, update);
        this.editingReply = null;
        const urlPath = `${API_SETTINGS.apiDetailUrl(this.selectedThread)}${oldEditingReply.id}/`;
        return udApi.patch(urlPath, update).catch(
            action((error) => {
                if (selectedThread === this.selectedThread) {
                    this.editingReply = oldEditingReplyShallow;
                }
                this._setErrorMessage(error.response);
                Object.assign(oldEditingReplyShallow, oldEditingReply);
            }),
        );
    }

    @autobind
    @action
    replyToThread(thread, body) {
        const lastFeedback = thread.last_feedback,
            now = new Date().toISOString(),
            newFeedback = {
                _class: 'practice_feedback_question_user_answer',
                id: lastFeedback ? lastFeedback.id + 1 : 1,
                isPlaceholderFeedback: true,
                body,
                created: now,
                last_activity: now,
                user: udMe,
            };

        thread.responses.push(newFeedback);
        thread.last_feedback = newFeedback;
        const lastFeedbackIndex = thread.responses.length - 1;
        const feedbackQuestionType =
            udMe.id === thread.user.id ? FEEDBACK_USER_TYPE.self : FEEDBACK_USER_TYPE.peer;
        this.errorMessage = null;
        return udApi
            .post(
                API_SETTINGS.apiDetailUrl(thread),
                [
                    {
                        body,
                        user_attempted_practice: thread.id,
                        feedback_question: feedbackQuestionType,
                    },
                ],
                {params: API_SETTINGS.detailParams},
            )
            .then(
                action((response) => {
                    thread.last_feedback = response.data.results[0];
                    thread.responses[lastFeedbackIndex] = thread.last_feedback;
                    return thread.last_feedback;
                }),
            )
            .catch(
                action((error) => {
                    thread.last_feedback = lastFeedback;
                    thread.responses.splice(lastFeedbackIndex, 1);
                    this._setErrorMessage(error.response);
                    throw error;
                }),
            );
    }

    @action
    loadInitialThreads() {
        if (this.ready) {
            return new Promise((resolve) => resolve(this._threads));
        }
        return this._loadThreads(API_SETTINGS.apiUrl, {total_count: 1, unread_count: 1})
            .then(
                action((response) => {
                    if (response) {
                        this.noThreads = response.data.total_count === 0;
                        this.setNumUnreadThreads(response.data.unread_count);
                    }
                }),
            )
            .finally(
                action(() => {
                    this.loadedInitialThreads = true;
                }),
            );
    }

    loadInitialTaughtCourses(isTaughtCoursesApiSlimVersionEnabled) {
        return this.instructorStore.loadTaughtCourses(isTaughtCoursesApiSlimVersionEnabled).then(
            action((courses) => {
                this._taughtCourses = courses.filter((course) =>
                    course.permissions.find(
                        (permission) =>
                            permission.permission === PERMISSION_CODES.MANAGE_COURSE_ASSIGNMENTS,
                    ),
                );
                if (this.latchedCourseId) {
                    this.setCourseFilter(this.latchedCourseId);
                    this.latchedCourseId = null;
                }
            }),
        );
    }

    @action
    setNumUnreadThreads(count) {
        if (count === undefined) {
            return;
        }
        this.numUnreadThreads = count;
        if (this.instructorStore) {
            this.instructorStore.setUnreadAssignments(count);
        }
    }

    @action
    setFilterCounts(data) {
        this.filterCounts = {
            feedback: data.feedback_filter_counts,
            permission: data.permission_filter_counts,
            unread: data.unread_count,
        };
    }

    @autobind
    @action
    deleteResponse(thread, response) {
        const arrIndex = thread.responses.findIndex((r) => r.id == response.id);
        thread.responses.remove(response);

        return udApi
            .delete(`${API_SETTINGS.apiDetailUrl(thread)}${response.id}/`)
            .then(
                action(() => {
                    return response;
                }),
            )
            .catch(
                action(() => {
                    thread.responses.splice(arrIndex, 0, response);
                    return response;
                }),
            );
    }

    @action
    deleteThread(thread) {
        const arrIndex = this._threads.findIndex((t) => t.id == thread.id);
        this._threads.remove(thread);

        return udApi
            .delete(API_SETTINGS.fetchUrl(thread))
            .then(
                action(() => {
                    return thread;
                }),
            )
            .catch(
                action(() => {
                    this._threads.splice(arrIndex, 0, thread);
                    return thread;
                }),
            );
    }

    @computed
    get pageCount() {
        return Math.ceil(this.totalThreadCount / this.THREAD_PAGE_SIZE);
    }

    async _loadThreads(
        apiUrl = API_SETTINGS.apiUrl,
        extraParams = {unread_count: 1, page: this.page},
    ) {
        try {
            const response = await super._loadThreads(apiUrl, extraParams);
            runInAction(() => {
                if (response) {
                    const data = response.data;
                    this.totalThreadCount = data.count;
                    this.setFilterCounts(data);
                }
            });
            return response;
        } finally {
            runInAction(() => {
                this.loadingNextPage = false;
            });
        }
    }
}
