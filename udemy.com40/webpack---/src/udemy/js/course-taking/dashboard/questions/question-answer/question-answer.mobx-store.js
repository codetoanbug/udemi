import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable, reaction, when} from 'mobx';

import debounce from 'utils/debounce';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {TRACKING_CATEGORIES} from '../../../constants';
import {
    LECTURE_FILTER,
    PAGE_SIZE,
    QUESTION_API_PARAMS,
    API_DEBOUNCE_INTERVAL,
    SORT_BY,
    SORT_PARAMS,
    TRACKING_ACTIONS,
    TRACKING_PREFIX,
} from './constants';
import {sanitizeUserGeneratedContent} from './helpers';
import NewQuestionStore from './new-question/new-question.mobx-store';
import Question from './question.mobx-model';
import UpvoteCTEventFactory, {ActionTypesEnum, ItemTypesEnum} from './tracking-events';

class QuestionsHolder {
    @observable questionsById = new Map();
    @observable totalCount = 0;
    @observable isLoading = true;
    @observable isFullyLoaded = false;
    @observable pageNumber = 1;
    @observable questionRefIndex = 0;
}

export default class QuestionAnswerStore {
    @observable questionsHolder = new QuestionsHolder();
    @observable featuredQuestionsHolder = new QuestionsHolder();
    @observable activeQuestionId = null;
    @observable searchQuery = '';
    @observable sortBy = SORT_BY.RECENCY;
    @observable filterFollowed = false;
    @observable filterSelfAsked = false;
    @observable filterNoAnswers = false;
    @observable lectureFilter = LECTURE_FILTER.ALL;
    @observable isNewQuestionFormVisible = false;
    @observable isNewQuestionConfirmationVisible = false;
    @observable hasTrackedTextSearch = false;

    newQuestion = null;
    newQuestionStore = null;

    constructor(courseTakingStore) {
        this.courseTakingStore = courseTakingStore;
        this.canManageCourseQA = courseTakingStore.canManageCourseQA;
        this.sortBy = SORT_BY.POPULARITY;

        when(
            () => courseTakingStore.course,
            () => this.setAttributesFromCourse(courseTakingStore.course),
        );

        reaction(
            () => this.activeQuestion,
            () => {
                if (!this.activeQuestion) {
                    return;
                }
                this.activeQuestion.loadAnswers();
            },
        );

        reaction(
            () => [
                this.searchQuery,
                this.sortBy,
                this.filterFollowed,
                this.filterSelfAsked,
                this.filterNoAnswers,
                this.lectureFilter,
            ],
            debounce(this.reset, API_DEBOUNCE_INTERVAL),
        );

        reaction(
            () => courseTakingStore.currentCurriculumItem,
            () => this.lectureFilter === LECTURE_FILTER.CURRENT && this.reset(),
        );
    }

    @action
    setRefIndex(param) {
        this.questionRefIndex = param;
    }

    getSearchQueryData() {
        const filters = [];
        if (this.filterFollowed) {
            filters.push('following');
        }
        if (this.filterSelfAsked) {
            filters.push('asked');
        }
        if (this.filterNoAnswers) {
            filters.push('noanswers');
        }
        return {
            queryText: this.searchQuery,
            selectedLecture: this.lectureFilter,
            sortBy: this.sortBy,
            filterCriteria: filters,
        };
    }

    @action
    setAttributesFromCourse(course) {
        this.courseId = course.id;
        this.areNewQuestionsDisabled = !course.features.discussions_create;
        this.areNewAnswersDisabled = !course.features.discussions_replies_create;
        this.isInstructorInactive = course.isOwnerTermsBanned;
    }

    @autobind
    @action
    loadQuestions() {
        const questionsHolder = this.questionsHolder;
        questionsHolder.isLoading = true;
        const apiQueryParams = this.getQueryParams(questionsHolder.pageNumber);
        apiQueryParams.is_featured = false;

        return this.callDiscussionsAPI(this.discussionsAPIName, apiQueryParams).then(
            action((response) => {
                this.addQuestionsToMap(response.data.results, questionsHolder.questionsById);
                questionsHolder.isFullyLoaded = !response.data.next;
                questionsHolder.isLoading = false;
                questionsHolder.totalCount = response.data.count;
            }),
        );
    }

    @autobind
    @action
    loadFeaturedQuestions() {
        const questionsHolder = this.featuredQuestionsHolder;
        questionsHolder.isLoading = true;
        const apiQueryParams = this.getQueryParams(questionsHolder.pageNumber);
        apiQueryParams.is_featured = true;
        return this.callDiscussionsAPI(this.discussionsAPIName, apiQueryParams).then(
            action((response) => {
                this.addQuestionsToMap(response.data.results, questionsHolder.questionsById);
                questionsHolder.isFullyLoaded = !response.data.next;
                questionsHolder.isLoading = false;
                questionsHolder.totalCount = response.data.count;
            }),
        );
    }

    get discussionsAPIName() {
        return this.searchQuery ? 'searchable-discussions' : 'discussions';
    }

    getQueryParams(pageNumber) {
        const queryParams = {
            ...QUESTION_API_PARAMS,
            page: pageNumber,
            page_size: PAGE_SIZE,
            ordering: SORT_PARAMS[this.sortBy],
        };
        if (this.searchQuery) {
            queryParams.search = this.searchQuery;
        }
        if (this.filterFollowed) {
            queryParams.followed = udMe.id;
        }
        if (this.filterSelfAsked) {
            queryParams.user_id = udMe.id;
        }
        if (this.filterNoAnswers) {
            queryParams.num_replies = 0;
        }
        if (this.lectureFilter === LECTURE_FILTER.CURRENT) {
            queryParams.related_object_id = this.courseTakingStore.currentCurriculumItem.id;
            queryParams.related_object_type = this.courseTakingStore.currentCurriculumItem.type;
        }
        return queryParams;
    }

    callDiscussionsAPI(discussionAPI, queryParams) {
        return udApi.get(`/courses/${this.courseId}/${discussionAPI}/`, {
            params: queryParams,
        });
    }

    addQuestionsToMap(questionResults, questionsById) {
        questionResults.forEach((questionData) => {
            if (!questionsById.has(questionData.id)) {
                questionsById.set(questionData.id, new Question(questionData, this.courseId));
            }
        });
    }

    @autobind
    @action
    async reset() {
        this.trackAction('questions-view.search-questions', undefined, {
            searchQuery: this.getSearchQueryData(),
        });
        const question = this.activeQuestion;
        this.questionsHolder.questionsById.clear();

        this.featuredQuestionsHolder.questionsById.clear();

        if (question && this.singleQuestionSelected) {
            if (question.isFeatured) {
                this.featuredQuestionsHolder.questionsById.set(question.id, question);
            } else {
                this.questionsHolder.questionsById.set(question.id, question);
            }
        }
        this.questionsHolder.pageNumber = 1;
        this.featuredQuestionsHolder.pageNumber = 1;

        await this.loadFeaturedQuestions();

        const questions = await this.loadQuestions();
        this.trackAction('questions-view.load-search-response', undefined, {
            searchQuery: this.getSearchQueryData(),
            featuredQAResultCount: this.featuredQuestionsHolder.totalCount,
            qaResultCount: this.questionsHolder.totalCount,
        });
        return questions;
    }

    @action
    loadQuestion(questionId) {
        if (this.questionsHolder.questionsById.has(questionId)) {
            return Promise.resolve();
        }
        if (this.featuredQuestionsHolder.questionsById.has(questionId)) {
            return Promise.resolve();
        }
        this.questionsHolder.isLoading = true;

        this.featuredQuestionsHolder.isLoading = true;

        return udApi
            .get(`/courses/${this.courseId}/discussions/${questionId}/`, {
                params: QUESTION_API_PARAMS,
            })
            .then(
                action((response) => {
                    if (response.data.is_featured) {
                        if (!this.featuredQuestionsHolder.questionsById.has(response.data.id)) {
                            this.featuredQuestionsHolder.questionsById.set(
                                response.data.id,
                                new Question(response.data, this.courseId),
                            );
                        }
                    } else if (!this.questionsHolder.questionsById.has(response.data.id)) {
                        this.questionsHolder.questionsById.set(
                            response.data.id,
                            new Question(response.data, this.courseId),
                        );
                    }
                    this.questionsHolder.isLoading = false;

                    this.featuredQuestionsHolder.isLoading = false;
                }),
            );
    }

    @autobind
    @action
    loadMore() {
        this.questionsHolder.pageNumber++;
        this.trackAction('questions-view.load-more-question');
        return this.loadQuestions();
    }

    @autobind
    @action
    featuredLoadMore() {
        this.featuredQuestionsHolder.pageNumber++;
        this.trackAction('questions-view.featured-load-more-question');
        return this.loadFeaturedQuestions();
    }

    @autobind
    @action
    showNewQuestionForm() {
        this.isNewQuestionFormVisible = true;
        this.newQuestion = new Question(
            {
                title: this.searchQuery,
            },
            this.courseTakingStore.courseId,
        );
        this.newQuestionStore = new NewQuestionStore(this.trackAction);
        this.trackAction('questions-view.show-new-question-form');
    }

    @autobind
    trackBackToAllQuestions() {
        if (this.activeQuestion) {
            this.trackAction('detail-view.back-to-all-questions', this.activeQuestion);
        }
    }

    @autobind
    @action
    hideNewQuestionForm() {
        this.isNewQuestionFormVisible = false;
        this.newQuestion = null;
        this.newQuestionStore = null;
    }

    @autobind
    @action
    backtoAllQuestions() {
        this.hideNewQuestionForm();
        this.trackAction('new-question.back-to-all-questions');
    }

    // This function is called on every character change.
    // We only want to track the initial change.
    @action
    trackAllQuestionsTextSearch() {
        if (!this.hasTrackedTextSearch) {
            this.hasTrackedTextSearch = true;
            this.trackAction('questions-view.text-search-all-questions');
        }
    }

    @action
    setSearchQuery(searchQuery) {
        this.searchQuery = searchQuery;
    }

    @autobind
    @action
    updateSortingKey(sortBy) {
        this.sortBy = sortBy;
        this.trackAction(`sort-by-${sortBy}`);
    }

    @autobind
    @action
    toggleFollowingFilter() {
        const willFilter = !this.filterFollowed;
        this.filterFollowed = willFilter;
        this.trackAction(`filter-${willFilter ? '' : 'undo-'}followed`);
    }

    @autobind
    @action
    toggleSelfAskedFilter() {
        const willFilter = !this.filterSelfAsked;
        this.filterSelfAsked = willFilter;
        this.trackAction(`filter-${willFilter ? '' : 'undo-'}user_id`);
    }

    @autobind
    @action
    toggleResponsesFilter() {
        const willFilter = !this.filterNoAnswers;
        this.filterNoAnswers = willFilter;
        this.trackAction(`filter-${willFilter ? '' : 'undo-'}num_replies`);
    }

    @autobind
    @action
    updateLectureFilter(lectureFilter) {
        this.lectureFilter = lectureFilter;
        this.trackAction(`filter-by-${lectureFilter}`);
    }

    @autobind
    trackAction(action, question, extraData = {}) {
        if (question) {
            Object.assign(extraData, {
                objectType: 'question',
                objectId: question.id,
                isFeatured: question.isFeatured,
                serveTrackingId: question.trackingId,
            });
        }
        const actionWithPrefix = `${TRACKING_PREFIX}.${action}`;
        this.courseTakingStore.track(TRACKING_CATEGORIES.QUESTION, actionWithPrefix, extraData);
    }

    trackReportAbuse(category) {
        this.courseTakingStore.track(category, TRACKING_ACTIONS.REPORT_ABUSE);
    }

    @action
    selectQuestion(questionId) {
        this.activeQuestionId = questionId;
    }

    @action
    saveQuestion(question, ignoreWarnings = false) {
        if (question.isNew) {
            const requestBody = {
                title: question.title,
                body: sanitizeUserGeneratedContent(question.body),
                ignore_warnings: ignoreWarnings,
            };
            if (this.courseTakingStore.currentCurriculumItem) {
                requestBody.related_object_id = this.courseTakingStore.currentCurriculumItem.id;
                requestBody.related_object_type = this.courseTakingStore.currentCurriculumItem.type;
            }
            return udApi
                .post(`/courses/${this.courseId}/discussions/`, requestBody, {
                    params: QUESTION_API_PARAMS,
                })
                .then(
                    action((response) => {
                        const question = new Question(response.data, this.courseId);
                        this.showNewQuestionConfirmation();
                        this.questionsHolder.questionsById.set(response.data.id, question);
                        this.trackAction('detail-view.add-question', question);
                    }),
                );
        }

        this.trackAction('detail-view.edit-question', question);
        return udApi.patch(`/courses/${this.courseId}/discussions/${question.id}/`, {
            title: question.title,
            body: question.body,
            ignore_warnings: ignoreWarnings,
        });
    }

    @action
    deleteQuestion(question) {
        this.trackAction('detail-view.delete-question', question);
        return udApi.delete(`/courses/${this.courseId}/discussions/${question.id}/`).then(
            action(() => {
                this.questionsHolder.questionsById.delete(question.id);
                this.featuredQuestionsHolder.questionsById.delete(question.id);
            }),
        );
    }

    @action
    showNewQuestionConfirmation() {
        this.isNewQuestionConfirmationVisible = true;
    }

    @autobind
    @action
    hideNewQuestionConfirmation() {
        this.isNewQuestionConfirmationVisible = false;
    }

    @action
    followQuestion(question, willFollow) {
        const action = willFollow ? 'follow' : 'unfollow';
        this.trackAction(`detail-view.${action}`, question);
        question.isFollowing = willFollow;
        if (willFollow) {
            return udApi.post(`courses/${this.courseId}/discussions/${question.id}/followers/`);
        }
        return udApi.delete(
            `courses/${this.courseId}/discussions/${question.id}/followers/${udMe.id}/`,
        );
    }

    @action
    upvoteAnswer(question, answer, willUpvote) {
        const action = willUpvote ? 'add-upvote' : 'remove-upvote';
        this.courseTakingStore.track(
            TRACKING_CATEGORIES.QUESTION,
            `${TRACKING_PREFIX}.detail-view.${action}`,
            {
                objectType: 'question_reply',
                objectId: answer.id,
            },
        );
        if (willUpvote) {
            return udApi
                .post(
                    `courses/${this.courseId}/discussions/${question.id}/replies/${answer.id}/upvoters/`,
                    {
                        userId: udMe.id,
                    },
                )
                .then(() => {
                    this.publishEvent(ActionTypesEnum.GIVEUPVOTE, question.id, answer.id);
                    answer.upVote();
                });
        }
        return udApi
            .delete(
                `courses/${this.courseId}/discussions/${question.id}/replies/${answer.id}/upvoters/${udMe.id}/`,
            )
            .then(() => {
                this.publishEvent(ActionTypesEnum.REMOVEUPVOTE, question.id, answer.id);
                answer.downVote();
            });
    }

    @autobind
    publishEvent(action, questionId, answerId) {
        const event = UpvoteCTEventFactory.create(
            ItemTypesEnum.ANSWER,
            action,
            this.courseId,
            questionId,
            answerId,
        );
        event && Tracker.publishEvent(event);
    }

    @action
    markTopAnswer(question, answer, willBeTopAnswer) {
        return udApi
            .patch(`courses/${this.courseId}/discussions/${question.id}/replies/${answer.id}/`, {
                is_top_answer: willBeTopAnswer,
            })
            .then(() => {
                if (willBeTopAnswer) {
                    answer.markTop();
                } else {
                    answer.unmarkTop();
                }
            });
    }

    @computed
    get questions() {
        const newQuestions = [];
        const questions = Array.from(this.questionsHolder.questionsById.values()).filter(
            (question) => {
                if (question.isNewlyAdded) {
                    newQuestions.push(question);
                    return false;
                }
                return this.filterQuestion(question);
            },
        );
        return [...newQuestions, ...questions];
    }

    filterQuestion(question) {
        return (
            (!this.filterFollowed || question.isFollowing) &&
            (!this.filterSelfAsked || question.user.id === udMe.id) &&
            (!this.filterNoAnswers || !question.numAnswers)
        );
    }

    @computed
    get featuredQuestions() {
        return Array.from(this.featuredQuestionsHolder.questionsById.values()).filter(
            (question) => {
                return this.filterQuestion(question);
            },
        );
    }

    @computed
    get activeQuestion() {
        const questionId = this.activeQuestionId;
        if (this.featuredQuestionsHolder.questionsById.has(questionId)) {
            return this.featuredQuestionsHolder.questionsById.get(questionId);
        }
        return this.questionsHolder.questionsById.get(questionId);
    }

    @computed
    get showCollapsedView() {
        return this.courseTakingStore.isMobileViewportSize;
    }
}
