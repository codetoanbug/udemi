import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import assetModelMap from 'asset/asset-model-map';
import AssetModel from 'asset/asset.mobx-model';
import {Assignment, Course} from 'course-manage-v2/events-v2';
import {showErrorToast, showReloadPageErrorToast, showSuccessToast} from 'course-taking/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

import {AssignmentCompleted} from '../events-v2';
import {
    API_PRACTICE_FIELDS,
    API_PRACTICE_COMPONENT_FIELDS,
    API_PRACTICE_QUESTION_FIELDS,
    DEFAULT_ASSIGNED_SUBMISSION_FIELDS,
    COMPONENT_TYPES,
    PAGE_DATA,
    PEER_QUESTION_TYPE,
} from './constants';
import PracticeComponentModel from './practice-component.mobx-model';
import PracticeQuestionModel from './practice-question.mobx-model';
import SubmissionModel from './submission.mobx-model';

export default class PracticeViewStore {
    @observable isPracticeLoaded = false;
    @observable solutionDownloadableAssets = [];
    @observable solutionVideoComponent;
    @observable userSubmission;
    @observable instructorSubmission;
    @observable questionsAreLoaded = false;
    @observable publishAttempt = false;
    @observable sendingSave = false;
    @observable assignedSubmissions = [];
    @observable submissionsLoaded = false;
    @observable currentPage = null;
    @observable summaryListLoaded = false;
    @observable submissionDetail;
    @observable.ref scrollContainerRef;

    constructor(courseTakingStore, baseUrl) {
        this.courseTakingStore = courseTakingStore;
        this.baseUrl = baseUrl;
        this.practice = this.courseTakingStore.currentCurriculumItem;
    }

    @computed
    get isPracticeDataInitialized() {
        return this.isPracticeLoaded && !!this.userSubmission;
    }

    @computed
    get shouldShowProgressBar() {
        if (this.shouldShowAlertEndPractice) {
            return false;
        }
        return this.currentPage && PAGE_DATA[this.currentPage].shouldShowProgressBar;
    }

    @computed
    get shouldShowAlertEndPractice() {
        return this.currentPage && PAGE_DATA[this.currentPage].shouldShowAlertEndPractice;
    }

    @computed
    get isWizardComplete() {
        if (!this.userSubmission) {
            return false;
        }
        return this.userSubmission.isComplete;
    }

    _getPracticeBasics() {
        const params = {
            ...API_PRACTICE_FIELDS,
            course_id: this.courseTakingStore.courseId,
            use_remote_version: true,
        };

        return udApi
            .get(`/practices/${this.practice.id}/`, {
                params,
            })
            .then(
                action((response) => {
                    this.practice.setDataFromAPI(response.data);
                }),
            );
    }

    _getPracticeComponents() {
        return udApi
            .get(`/practices/${this.practice.id}/components/`, {
                params: {
                    type: 'instruction',
                    ...API_PRACTICE_COMPONENT_FIELDS,
                    course_id: this.courseTakingStore.courseId,
                    use_remote_version: true,
                },
            })
            .then(
                action((response) => {
                    const components = response.data.results;
                    components.forEach((componentData) => {
                        const component = new PracticeComponentModel(componentData);
                        if (component.displayType === COMPONENT_TYPES.VIDEO) {
                            this.practice.setVideoComponent(component);
                        } else if (component.displayType === COMPONENT_TYPES.TEXT) {
                            this.practice.setTextComponent(component);
                        } else if (component.displayType === COMPONENT_TYPES.DOWNLOAD) {
                            this.practice.setDownloadableAssets([component.asset]);
                        }
                    });
                }),
            );
    }

    _getPracticeQuestions() {
        const params = {
            ...API_PRACTICE_QUESTION_FIELDS,
            course_id: this.courseTakingStore.courseId,
            use_remote_version: true,
        };

        return udApi
            .get(`/practices/${this.practice.id}/questions/`, {
                params,
            })
            .then(
                action((response) => {
                    const questions = response.data.results.map(
                        (questionData) => new PracticeQuestionModel(questionData),
                    );
                    this.practice.setQuestions(questions);
                }),
            );
    }

    @autobind
    @action
    loadPractice() {
        const practicePromise = this._getPracticeBasics();
        const componentsPromise = this._getPracticeComponents();
        const questionsPromise = this._getPracticeQuestions();

        this.practiceInitializationPromise = Promise.all([
            practicePromise,
            componentsPromise,
            questionsPromise,
        ])
            .then(
                action(() => {
                    this.isPracticeLoaded = true;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
        return this.practiceInitializationPromise;
    }

    @autobind
    completePracticeSubmission() {
        return udApi
            .patch(
                `/practices/${this.practice.id}/user-attempted-practices/${this.userSubmission.id}/`,
                {is_complete: true},
            )
            .then(() => {
                this.userSubmission.setAsComplete();
                this.practice.setComplete();
            });
    }

    @autobind
    getOrCreateUserSubmission() {
        return udApi.post(`/practices/${this.practice.id}/user-attempted-practices/`).then(
            action((response) => {
                this.userSubmission = new SubmissionModel(response.data, {
                    practiceId: this.practice.id,
                    questions: this.practice.questions,
                });
            }),
        );
    }

    @action
    initializePracticeData() {
        return this.practiceInitializationPromise.then(() =>
            !this.userSubmission ? this.getOrCreateUserSubmission() : Promise.resolve(),
        );
    }

    @autobind
    @action
    getSubmissionPageAnswers() {
        return this.userSubmission.getPracticeQuestionUserAnswers();
    }

    @action
    getInstructorSubmission() {
        const instructor = this.courseTakingStore.course.visibleInstructors[0];
        return udApi
            .get(`/practices/${this.practice.id}/components/`, {
                params: {
                    type: 'solution',
                    'fields[practice_component]': ['body', 'asset', 'display_type'].join(','),
                    'fields[asset]': ['asset_type', 'title', 'external_url'].join(','),
                    course_id: this.courseTakingStore.courseId,
                    use_remote_version: true,
                },
            })
            .then(
                action((response) => {
                    const apiData = {
                        user: {
                            ...instructor,
                            isInstructor: true,
                            image_50x50: instructor.image50x50,
                        },
                    };
                    const questions = this.practice.questions.map((question) => {
                        return Object.assign({}, question, {userAnswer: {body: question.answer}});
                    });
                    this.instructorSubmission = new SubmissionModel(apiData, {questions});

                    const components = response.data.results;
                    this.solutionVideoComponent = components.find(
                        (component) => component.display_type === COMPONENT_TYPES.VIDEO,
                    );
                    this.solutionDownloadableAssets = components
                        .filter((component) => component.display_type === COMPONENT_TYPES.DOWNLOAD)
                        .map((component) => {
                            const AssetClass =
                                assetModelMap[component.asset.asset_type] || AssetModel;
                            return new AssetClass(component.asset);
                        });
                }),
            );
    }

    @action
    setAssignedSubmissions(apiData) {
        this.assignedSubmissions = [];
        apiData.forEach((submission) => {
            const {practice} = this;
            const assignedSubmission = new SubmissionModel(submission.user_attempted_practice, {
                questions: practice.questions,
                practiceId: practice.id,
            });
            this.assignedSubmissions.push(assignedSubmission);
        });
    }

    @autobind
    @action
    getAssignedSubmissions() {
        const params = {
            page_size: 3,
            ...DEFAULT_ASSIGNED_SUBMISSION_FIELDS,
        };
        return udApi
            .get(`/practices/${this.practice.id}/user-assigned-submissions/`, {params})
            .then(
                action((response) => {
                    this.setAssignedSubmissions(response.data.results);

                    // The first time submissions were assigned, there may have not been 3 submissions
                    // in total. In this case we need to assign and retrieve additional submissions.
                    if (response.data.results.length < 3) {
                        udApi
                            .post(
                                `/practices/${this.practice.id}/user-assigned-submissions/`,
                                {num_to_assign: 3 - response.data.results.length},
                                {params: DEFAULT_ASSIGNED_SUBMISSION_FIELDS},
                            )
                            .then(
                                action((response) => {
                                    // Since the sort_order of the existing items may have changed, we need to
                                    // replace everything (this endpoint returns the existing and created items)
                                    this.setAssignedSubmissions(response.data.results);
                                    this.submissionsLoaded = true;
                                }),
                            );
                    } else {
                        this.submissionsLoaded = true;
                    }
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    _ensurePracticeQuestionAnswersLoaded() {
        return !this.userSubmission.questionsAreLoaded
            ? this.userSubmission.getPracticeQuestionUserAnswers()
            : Promise.resolve();
    }

    _ensurePeerFeedbacksLoaded() {
        return !this.userSubmission.peerFeedbacksAreLoaded
            ? this.userSubmission.getFeedbackOfType(PEER_QUESTION_TYPE)
            : Promise.resolve();
    }

    _ensureAssignedSubmissionLoaded() {
        return !this.assignedSubmissions.length ? this.getAssignedSubmissions() : Promise.resolve();
    }

    @autobind
    setSubmissionDetail(submissionId) {
        if (submissionId === this.userSubmission.id) {
            return this._ensurePracticeQuestionAnswersLoaded().then(() => {
                this._ensurePeerFeedbacksLoaded().then(
                    action(() => {
                        this.submissionDetail = this.userSubmission;
                    }),
                );
            });
        }
        return this._ensureAssignedSubmissionLoaded().then(
            action(() => {
                this.submissionDetail = this.assignedSubmissions.filter(
                    (submission) => submission.id === submissionId,
                )[0];
            }),
        );
    }

    @action
    resetSubmissionDetail() {
        this.submissionDetail = null;
    }

    @action
    getSummaryPageData() {
        return this._ensureAssignedSubmissionLoaded().then(() => {
            return this._ensurePeerFeedbacksLoaded().then(
                action(() => {
                    this.summaryListLoaded = true;
                }),
            );
        });
    }

    @action
    getLatestComments() {
        let attemptedPracticeIds = [this.userSubmission.id];
        attemptedPracticeIds = attemptedPracticeIds.concat(
            this.assignedSubmissions.map((submission) => submission.id),
        );
        const params = {
            attempt_id_in: attemptedPracticeIds.join(','),
            has_comment_thread: true,
            'fields[practice_feedback_question_user_answer]':
                'feedback_question,comment_thread,user_attempted_practice',
            'fields[comment_thread]': 'latest_comment',
            'fields[practice_feedback_question]': 'id',
            'fields[user_attempted_practice]': 'id',
        };
        return udApi
            .get(`/practices/${this.practice.id}/feedback-user-answers/`, {params})
            .then((response) => {
                response.data.results.forEach((feedbackAnswer) => {
                    if (feedbackAnswer.user_attempted_practice.id === this.userSubmission.id) {
                        return this.userSubmission.updateFeedbackCommentThread(feedbackAnswer);
                    }
                    this.assignedSubmissions
                        .filter(
                            (submission) =>
                                submission.id === feedbackAnswer.user_attempted_practice.id,
                        )[0]
                        .updateFeedbackCommentThread(feedbackAnswer);
                });
            });
    }

    @action
    saveDraft() {
        this.userSubmission.hasError = false;
        this.sendingSave = true;
        const answeredQuestions = this.userSubmission.questions.filter(
            (question) => question.userAnswer.body,
        );

        if (this.userSubmission.isEmpty) {
            this.userSubmission.hasError = true;
            showErrorToast(gettext('You cannot save a draft of an empty assignment.'));
            this.sendingSave = false;
            return Promise.resolve(null);
        }

        answeredQuestions.forEach(
            // check for whitespaces
            (question) => {
                if (question.userAnswer.body.replace(/(<([^>]+)>)|(&nbsp;)|\s/g, '').length === 0) {
                    this.userSubmission.hasError = true;
                    showErrorToast(gettext('Assignment cannot contain only whitespace'));
                    this.sendingSave = false;
                    return Promise.resolve(null);
                }
            },
        );

        // only POST questions that don't have a userAnswer.id
        const saveBody = answeredQuestions
            .filter((question) => !question.userAnswer.id)
            .map((question) => ({
                practice_question: question.id,
                body: question.userAnswer.body,
            }));
        const practiceSubAnswerSavePromise = udApi.post(
            `practices/${this.practice.id}/user-attempted-practices/${this.userSubmission.id}/user-answers/`,
            saveBody,
        );

        // only PATCH questions that have an userAnswer.id
        const updateBody = answeredQuestions
            .filter((question) => question.userAnswer.id)
            .map((question) => ({
                id: question.userAnswer.id,
                practice_question: question.id,
                body: question.userAnswer.body,
            }));
        const practiceSubAnswerUpdatePromise = udApi.patch(
            `practices/${this.practice.id}/user-attempted-practices/${this.userSubmission.id}/user-answers/`,
            updateBody,
        );

        return Promise.all([practiceSubAnswerSavePromise, practiceSubAnswerUpdatePromise])
            .then(this.getSubmissionPageAnswers)
            .then(
                action(() => {
                    return udApi.patch(
                        `practices/${this.practice.id}/user-attempted-practices/${this.userSubmission.id}/`,
                        {
                            is_private: this.userSubmission.isPrivate,
                            marked_submitted: this.publishAttempt,
                        },
                    );
                }),
            )
            .then(
                action((response) => {
                    this.userSubmission.submissionTime = response.data.submission_time;
                    // V2 Events - Completed
                    if (this.publishAttempt) {
                        const assignment = new Assignment(this.practice.id, this.practice.title);
                        const course = new Course(this.courseTakingStore.courseId);
                        Tracker.publishEvent(
                            new AssignmentCompleted({
                                assignment,
                                course,
                                attemptId: this.userSubmission.id,
                            }),
                        );
                    }
                    showSuccessToast(
                        this.publishAttempt
                            ? gettext('Your answer has been successfully submitted.')
                            : gettext('Your draft has been successfully saved.'),
                    );
                }),
            )
            .catch(
                action(() => {
                    this.userSubmission.hasError = true;
                    showErrorToast(gettext('There was a problem saving. Please try again.'));
                }),
            )
            .finally(
                action(() => {
                    this.questionsAreLoaded = true;
                    this.sendingSave = false;
                    this.publishAttempt = false;
                }),
            );
    }

    @action
    setCurrentPage(page) {
        this.currentPage = page;
    }

    @autobind
    @action
    setScrollContainer(ref) {
        this.scrollContainerRef = ref;
    }

    @computed
    get hasCompletedPractice() {
        return !!this.userSubmission && this.userSubmission.isComplete;
    }

    @computed
    get nextUrl() {
        return this.currentPage && PAGE_DATA[this.currentPage].nextUrl;
    }

    @computed
    get prevUrl() {
        return this.currentPage && PAGE_DATA[this.currentPage].prevUrl;
    }
}
