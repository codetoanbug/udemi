import autobind from 'autobind-decorator';
import {action, extendObservable} from 'mobx';

import udApi from 'utils/ud-api';

import {DEFAULT_DATA_SCOPE_FILTER} from '../instructor-analytics/constants';

const ANSWER_OPTIONS_TO_SHOW = ['yes', 'no'];

export default class ReviewSummaryStore {
    constructor(course, dataScope) {
        extendObservable(this, {
            course,
            isLoading: true,
            surveyAggs: [],
        });
        this._fetchReviews(dataScope);
    }

    @autobind
    @action
    _fetchReviews(dataScope) {
        this.isLoading = true;
        dataScope = dataScope || DEFAULT_DATA_SCOPE_FILTER;
        udApi
            .get(`/courses/${this.course.id}/survey-stats/`, {
                params: {data_scope: dataScope},
            })
            .then((response) => {
                const results = response.data.results;
                if (Array.isArray(results) && results.length && results[0].question_sets) {
                    this._processSurveyAggs(results[0].question_sets[0].questions);
                }
            })
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    }

    @autobind
    @action
    _processSurveyAggs(questions) {
        this.surveyAggs = [];
        questions.forEach((question) => {
            const q = {
                id: question.id,
                text: question.text,
                totalCount: 0,
                yes: 0,
                no: 0,
                yesPercentage: 50,
                noPercentage: 50,
            };
            question.answer_options.forEach((answerOption) => {
                const count = answerOption.answers_count;
                const textCode = answerOption.text_code;

                if (ANSWER_OPTIONS_TO_SHOW.indexOf(textCode) >= 0) {
                    q[textCode] = count;
                    q.totalCount += count;
                }
            });
            if (q.yes || q.no) {
                q.yesPercentage = ((100 * q.yes) / (q.yes + q.no)).toFixed(2);
                q.noPercentage = 100 - q.yesPercentage;
            }
            this.surveyAggs.push(q);
        });
    }
}
