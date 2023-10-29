import autobind from 'autobind-decorator';
import {action, computed, isObservableArray, observable} from 'mobx';

import udApi from 'utils/ud-api';

export default class SurveyStore {
    constructor(
        surveyCode,
        courseId,
        organizationId,
        relatedObjectType,
        relatedObjectId,
        useAPICache = false,
        noOverwrite = false,
    ) {
        this.surveyCode = surveyCode;
        this.courseId = courseId;
        this.organizationId = organizationId;
        this.relatedObjectType = relatedObjectType;
        this.relatedObjectId = relatedObjectId;
        this.useAPICache = useAPICache;
        this.noOverwrite = noOverwrite;
    }

    @observable id = '';
    @observable headline = '';
    @observable description = '';
    @observable questionSets = [];
    @observable userAnswers = {};

    _getSurvey() {
        return udApi.get(`surveys/${this.surveyCode}/`, {
            params: {
                'fields[survey]': '@default,headline,description',
            },
            useCache: this.useAPICache,
        });
    }

    _getUserAnswers() {
        let url;
        if (this.courseId) {
            url = `users/me/courses/${this.courseId}/surveys/${this.id}/answers/`;
        } else {
            url = `users/me/surveys/${this.id}/answers/`;
        }
        return udApi.get(url);
    }

    _putUserAnswers(data) {
        let url;
        let hasQueryParam = false;
        if (this.courseId) {
            url = `users/me/courses/${this.courseId}/surveys/${this.id}/answers/`;
        } else {
            url = `users/me/surveys/${this.id}/answers/`;
            if (this.organizationId) {
                url += `?organization_id=${this.organizationId}`;
                hasQueryParam = true;
            }
        }
        if (this.noOverwrite) {
            url += `${hasQueryParam ? '&' : '?'}no_overwrite=1`;
        }
        return udApi.put(url, data);
    }

    @autobind
    _sortByOrder(a, b) {
        return a.order - b.order;
    }

    @autobind
    _sortQuestionSet(a, b) {
        for (const questionSet of [a, b]) {
            if (!questionSet._questionsSorted) {
                if (questionSet.questions) {
                    questionSet.questions.sort(this._sortByOrder);
                }
                questionSet._questionsSorted = true;
            }
        }
        return this._sortByOrder(a, b);
    }

    _sortQuestionSets(questionSets) {
        if (questionSets.length === 1 && questionSets[0].questions) {
            questionSets[0].questions.sort(this._sortByOrder);
        } else {
            questionSets.sort(this._sortQuestionSet);
        }
    }

    @action
    getSurvey() {
        return this._getSurvey().then((response) => {
            this.setSurvey({
                id: response.data.id,
                headline: response.data.headline,
                description: response.data.description,
                questionSets: response.data.question_sets,
            });
        });
    }

    @action
    setSurvey(survey) {
        if (survey.questionSets) {
            this._sortQuestionSets(survey.questionSets);
        }
        this.id = survey.id;
        this.headline = survey.headline;
        this.description = survey.description;
        this.questionSets = survey.questionSets;
    }

    getInitialValue(questionType) {
        if (questionType === 'choice__multi_select') {
            return [];
        }
        return null;
    }

    @action
    setUserAnswers(userAnswers) {
        for (const questionSet of this.questionSets) {
            for (const question of questionSet.questions) {
                if (!(question.id in userAnswers)) {
                    userAnswers[question.id] = this.getInitialValue(question.question_type);
                }
            }
        }
        this.userAnswers = userAnswers;
    }

    @action
    clearUserAnswers() {
        this.userAnswers = {};
    }

    @action
    updateUserAnswer(questionId, answer) {
        this.userAnswers[questionId] = answer;
    }

    @action
    addUserAnswerOption(questionId, answer) {
        this.userAnswers[questionId].push(answer);
    }

    @action
    removeUserAnswerOption(questionId, answer) {
        this.userAnswers[questionId].remove(answer);
    }

    getUserAnswers() {
        if (this.id) {
            return this._getUserAnswers()
                .then((response) => {
                    const userAnswers = {};
                    for (const answer of response.data.results) {
                        if (answer.answer_option_id) {
                            userAnswers[answer.question_id] = answer.answer_option_id;
                        } else {
                            userAnswers[answer.question_id] = answer.answer_freeform;
                        }
                    }
                    this.setUserAnswers(userAnswers);
                })
                .catch((exception) => {
                    if (!exception.response || exception.response.status !== 404) {
                        throw exception;
                    }
                    this.setUserAnswers({});
                });
        }
    }

    saveUserAnswers() {
        if (!this.id) {
            return Promise.reject('No survey ID.');
        }
        const answersPayload = [];
        for (const questionId of Object.keys(this.userAnswers)) {
            const answer = {
                question_id: parseInt(questionId, 10),
                data: this.userAnswerData,
                related_object_type: this.relatedObjectType,
                related_object_id: this.relatedObjectId,
            };

            if (isObservableArray(this.userAnswers[questionId])) {
                this.userAnswers[questionId].forEach((option) => {
                    const selectedAnswer = Object.assign({}, answer);
                    selectedAnswer.answer_option_id = parseInt(option, 10);
                    answersPayload.push(selectedAnswer);
                });
                continue;
            }

            if (typeof this.userAnswers[questionId] === 'number') {
                answer.answer_option_id = this.userAnswers[questionId];
            } else if (typeof this.userAnswers[questionId] === 'string') {
                answer.answer_freeform = this.userAnswers[questionId];
            }
            answersPayload.push(answer);
        }
        return this._putUserAnswers(answersPayload);
    }

    @action
    updateCourseId(id) {
        this.courseId = id;
    }

    setUserAnswerData(userAnswerData) {
        this.userAnswerData = userAnswerData;
    }

    @computed
    get isLoaded() {
        return !!this.id;
    }

    @computed
    get answerIdToCode() {
        const answerIdToCode = {};
        for (const questionSet of this.questionSets) {
            for (const question of questionSet.questions) {
                for (const answerOption of question.answer_options) {
                    answerIdToCode[answerOption.id] = answerOption.text_code;
                }
            }
        }
        return answerIdToCode;
    }

    @computed
    get questionCodeToId() {
        const questionCodeToId = {};
        for (const questionSet of this.questionSets) {
            for (const question of questionSet.questions) {
                questionCodeToId[question.text_code] = question.id;
            }
        }
        return questionCodeToId;
    }
}
