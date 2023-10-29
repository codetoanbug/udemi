import {action, computed, extendObservable} from 'mobx';

import {RESULT_QUESTION_FILTERS} from '../question/question-filters';
import getPieChartForAttempt from './get-pie-chart-for-attempt';

/**
 * This model is used on practice test results page.
 * It's derived from user_attempted_quiz API data.
 * Note that user_attempted_quiz is applicable to all types of quizzes, but this model
 * has several properties specific to the practice test results page, e.g. chart data.
 */
export default class TestResultModel {
    constructor(attempt) {
        const results = attempt.results_summary;

        this.completionTime = attempt.completion_time;
        this.created = attempt.created;
        this.durationMinutes = Math.floor(results.duration / 60) % 60;
        this.durationHours = Math.floor(results.duration / 3600);
        this.elapsedSeconds = Math.round(attempt.elapsed_time % 60);
        this.elapsedMinutes = Math.floor(attempt.elapsed_time / 60) % 60;
        this.elapsedHours = Math.floor(attempt.elapsed_time / 3600);
        this.id = attempt.id;
        this.isRandomized = results.is_randomized;
        if (results.total) {
            this.numAssessments = results.total;
            this.numCorrect = results.correct;
            this.correctPercent = Math.floor((100 * results.correct) / results.total);
            this.numIncorrect = results.incorrect;
            this.numSkipped = results.skipped;
            this.unanswered = results.total - results.correct - results.skipped - results.incorrect;
        } else {
            this.numAssessments = 0;
            this.numCorrect = 0;
            this.correctPercent = 0;
        }
        // The first result is number 1, according to ascending `created` order.
        this.number = results.index;
        const overtime = attempt.elapsed_time - results.duration;
        this.overtimeSeconds = Math.max(0, Math.round(overtime % 60));
        this.overtimeMinutes = Math.max(0, Math.floor(overtime / 60));
        this.passed = results.passed;
        this.passPercent = results.pass_percent;
        this.version = attempt.version;
        this.bigChart = getPieChartForAttempt(attempt, {
            width: 250,
            height: 250,
            allowPointSelect: true,
        });
        this.smallChart = getPieChartForAttempt(attempt, {
            width: 80,
            height: 80,
            allowPointSelect: false,
        });
        this.knowledgeAreas = (results.sections || []).map((section) => {
            return new KnowledgeAreaResultModel(section);
        });

        extendObservable(this, {
            isExpanded: false,

            // Name of the knowledge area to filter against.
            activeKnowledgeAreaFilter: null,

            // One of the keys in the RESULT_QUESTION_FILTERS object.
            activeQuestionFilterKey: 'ALL_QUESTIONS',

            // Array of MCQuestion models.
            questions: [],

            areQuestionsSet: false,
        });
    }

    @computed
    get filteredQuestions() {
        return this.questions
            .filter((question) => {
                if (this.activeKnowledgeAreaFilter) {
                    return question.knowledgeArea === this.activeKnowledgeAreaFilter;
                }
                return true;
            })
            .filter(RESULT_QUESTION_FILTERS[this.activeQuestionFilterKey].filter);
    }

    @action
    setIsExpanded(value) {
        this.isExpanded = value;
    }

    @action
    setActiveKnowledgeAreaFilter(value) {
        this.activeKnowledgeAreaFilter = value;
    }

    @action
    setActiveQuestionFilterKey(value) {
        this.activeQuestionFilterKey = value;
    }

    @action
    setQuestions(questions) {
        this.questions = questions;
        this.areQuestionsSet = true;
    }
}

export class KnowledgeAreaResultModel {
    constructor(section) {
        this.name = section.name;
        this.numAssessments = section.results.total;
        this.numCorrect = section.results.correct;
        this.numIncorrect = section.results.incorrect;
        this.numSkipped = section.results.skipped;
        this.numUnanswered = section.results.unanswered;
        if (this.numAssessments > 0) {
            this.correctPercent = Math.round((100 * this.numCorrect) / this.numAssessments);
            this.incorrectPercent = Math.round((100 * this.numIncorrect) / this.numAssessments);
            this.skippedPercent = Math.round((100 * this.numSkipped) / this.numAssessments);
            this.unansweredPercent =
                100 - this.correctPercent - this.incorrectPercent - this.skippedPercent;
        } else {
            this.correctPercent = 0;
            this.incorrectPercent = 0;
            this.skippedPercent = 0;
            this.unansweredPercent = 0;
        }
    }
}
