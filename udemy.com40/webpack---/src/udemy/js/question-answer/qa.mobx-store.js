import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';

import {ONE_PANE_MODE, PERMISSION_CODES} from 'instructor/common/constants';
import {showReloadPageErrorToast} from 'instructor/toasts';
import {defaultErrorMessage} from 'utils/ud-api';
import SystemMessage from 'utils/ud-system-message';
import userSettings, {SETTINGS_BY_CODE} from 'utils/user-settings';

import {
    API_SETTINGS,
    QA_MAIN_ROUTE,
    ONE_PANE_MODE_SETTINGS,
    ONE_PANE_CD_FIELDS,
    UNREAD,
    AI_ELIGIBLE_COURSE_LANGUAGES,
    AI_ELIGIBLE_COURSE_CATEGORIES,
} from './constants';
import QaMobxMixin from './qa-mobx-mixin';

export default class QAStore extends QaMobxMixin {
    @observable isThreadCreateDisabled = false;
    @observable numUnreadThreads = 0;
    @observable primaryCategory = null;
    @observable _taughtCourses = null;
    @observable courseIdFilter = null;
    @observable enableOnePaneMode = false;
    @observable errorMessage = null;
    @observable filterCounts = {
        unread: 0,
        unanswered: 0,
        unresponded: 0,
        noInstructorResponse: 0,
    };

    dismissedLinkMessage = false;

    constructor(API_SETTINGS, {baseUrl, instructorStore = null, twoPaneStore}) {
        super(API_SETTINGS, {baseUrl, instructorStore, twoPaneStore});
        reaction(
            () => this.courseIdFilter,
            () => this._reloadThreads(),
        );
    }

    @action
    init() {
        super.init();
        this.setFilter(UNREAD, true);
        SystemMessage.hasSeen(SystemMessage.ids.linksWarningQA).then(
            action((response) => {
                this.dismissedLinkMessage = response.data;
            }),
        );
    }

    @action
    loadInitialThreads() {
        return super.loadInitialThreads(
            action((response) => {
                if (response) {
                    this.setNumUnreadThreads(response.data.unread_count);
                }
            }),
        );
    }

    applyFilters() {
        const params = super.applyFilters();
        if (this.viewModeType === ONE_PANE_MODE) {
            params['fields[course_discussion]'] = ONE_PANE_CD_FIELDS;
        }
        return params;
    }
    // End ThreadedModelMixin overrides //

    @computed
    get ready() {
        return this.loadedInitialThreads && this._taughtCourses !== null;
    }

    @computed
    get pageCount() {
        return Math.ceil(this.totalThreadCount / this.THREAD_PAGE_SIZE);
    }

    get isPublishedInstructor() {
        return this.instructorStore.isPublishedInstructor;
    }

    isCourseCategorySuitableForGenerateWithAI(thread) {
        if (thread) {
            const primaryCategory = thread.course.primary_category.title_cleaned;
            return AI_ELIGIBLE_COURSE_CATEGORIES.includes(primaryCategory);
        }
        return false;
    }

    isCourseLanguageSuitableForGenerateWithAI(thread) {
        if (thread) {
            const courseLanguage = thread.course.locale.locale;
            return AI_ELIGIBLE_COURSE_LANGUAGES.includes(courseLanguage);
        }
        return false;
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
    setFilterCounts(data) {
        this.filterCounts.unread = data.unread_count;
        this.filterCounts.unanswered = data.unanswered_count;
        this.filterCounts.unresponded = data.unresponded_count;
        this.filterCounts.noInstructorResponse = data.no_instructor_response_count;
    }

    @action
    loadViewModeSettings() {
        this.viewModeType = userSettings.get(SETTINGS_BY_CODE[ONE_PANE_MODE_SETTINGS])
            ? ONE_PANE_MODE
            : this.DEFAULT_VIEW_MODE_TYPE;
    }

    @autobind
    @action
    updateUserViewModeType(setting, value = true) {
        if (this.viewModeType === setting) {
            return;
        }
        this.viewModeType = setting;
        if (setting !== ONE_PANE_MODE) {
            value = false;
        }
        userSettings
            .set(SETTINGS_BY_CODE[ONE_PANE_MODE_SETTINGS], value)
            .then(
                action(() => {
                    window.location.href = QA_MAIN_ROUTE;
                }),
            )
            .catch(
                action(() => {
                    showReloadPageErrorToast(defaultErrorMessage);
                }),
            );
    }

    @action
    loadInitialTaughtCourses(params) {
        return this.instructorStore.loadTaughtCoursesWithParams(params).then(
            action((courses) => {
                this._taughtCourses = courses.filter((course) =>
                    course.permissions.find(
                        (permission) => permission.permission === PERMISSION_CODES.MANAGE_COURSE_QA,
                    ),
                );
            }),
        );
    }

    @autobind
    @action
    replyToThread(thread, body) {
        return super.replyToThread(
            thread,
            body,
            action((thread) => {
                if (thread) {
                    if (thread.responses.length === 1) {
                        this.filterCounts.unresponded = Math.max(
                            this.filterCounts.unresponded - 1,
                            0,
                        );
                    }
                    if (!this.hasInstructorReply(thread)) {
                        this.filterCounts.noInstructorResponse = Math.max(
                            this.filterCounts.noInstructorResponse - 1,
                            0,
                        );
                    }
                }
            }),
        );
    }

    @autobind
    hasInstructorReply(thread) {
        return (
            thread.responses.filter((reply) => {
                return reply.is_instructor === true;
            }).length > 0
        );
    }

    @action
    setNumUnreadThreads(count) {
        this.numUnreadThreads = count;
    }

    @action
    _toggleRead(threadId) {
        const thread = this._findThreadById(threadId);
        // Increase/decrease numUnreadThreads based on current is_read value.
        if (thread) {
            this.setNumUnreadThreads(
                Math.max(thread.is_read ? this.numUnreadThreads + 1 : this.numUnreadThreads - 1, 0),
            );
            this.filterCounts.unread = Math.max(
                thread.is_read ? this.filterCounts.unread + 1 : this.filterCounts.unread - 1,
                0,
            );
            thread.is_read = !thread.is_read;
        }
    }

    @action
    _toggleFeatured(threadId) {
        const thread = this._findThreadById(threadId);
        if (thread) {
            thread.is_featured = !thread.is_featured;
        }
    }

    @action
    markAsRead(thread) {
        // Do not decrease numUnreadThreads if thread is already read.
        if (!thread.is_read) {
            this.setNumUnreadThreads(Math.max(this.numUnreadThreads - 1, 0));
            this.filterCounts.unread = Math.max(this.filterCounts.unread - 1, 0);
        }
        return super.markAsRead(thread);
    }

    @autobind
    @action
    markAsTopAnswer(thread, response, newValue = true) {
        const attrName = 'is_top_answer';
        let noPreviousTopAnswer = true;
        thread.responses.forEach((r) => {
            if (r[attrName]) {
                noPreviousTopAnswer = false;
            }
        });
        return super.markAsTopAnswer(
            thread,
            response,
            newValue,
            action(() => {
                if (noPreviousTopAnswer) {
                    this.filterCounts.unanswered = Math.max(this.filterCounts.unanswered - 1, 0);
                }
            }),
        );
    }

    @autobind
    @action
    deleteResponse(thread, response) {
        return super.deleteResponse(
            thread,
            response,
            action(() => {
                if (thread.responses.length === 0) {
                    this.filterCounts.unresponded = Math.max(this.filterCounts.unresponded + 1, 0);
                }
                if (!this.hasInstructorReply(thread) && response.is_instructor) {
                    this.filterCounts.noInstructorResponse = Math.max(
                        this.filterCounts.noInstructorResponse + 1,
                        0,
                    );
                }
                if (response.is_top_answer) {
                    this.filterCounts.unanswered = Math.max(this.filterCounts.unanswered + 1, 0);
                }
                return response;
            }),
        );
    }

    _loadThreads(
        apiUrl = this._searchQuery ? API_SETTINGS.searchableApiUrl : API_SETTINGS.apiUrl,
        extraParams = {
            page: this.page,
            update_last_instructor_viewed_time: this.viewModeType === ONE_PANE_MODE,
        },
    ) {
        return super._loadThreads(apiUrl, extraParams).then(
            action((response) => {
                if (response) {
                    this.setFilterCounts(response.data);
                }
                return response;
            }),
        );
    }

    @action
    clearErrorMessage() {
        if (
            this.errorMessage &&
            ['external_url_forbidden', 'coupon_forbidden'].indexOf(this.errorMessage.error_type) !=
                -1
        ) {
            SystemMessage.seen(SystemMessage.ids.linksWarningQA);
            this.dismissedLinkMessage = true;
        }
        super.clearErrorMessage();
    }
}
