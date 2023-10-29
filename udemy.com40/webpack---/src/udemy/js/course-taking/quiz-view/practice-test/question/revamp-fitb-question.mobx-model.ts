import {action, computed, extendObservable, isObservable, set} from 'mobx';

import MCQuestion from '../../mc-question.mobx-model';
import {Answer} from '../types';

/**
 * This models ASSESSMENT_TYPES.FILL_IN_THE_BLANK
 * assessments.
 *
 * Relevant to practice tests only
 */
export class RevampFITBQuestionModel extends MCQuestion {
    buildAnswersFromAPIData(apiData: any) {
        const answers: Answer[] = [];
        const correctResponse = apiData.correct_response || [];

        correctResponse.forEach((correctAnswer: string, answerIndex: number) => {
            answers.push({
                id: String.fromCharCode(answerIndex + 'a'.charCodeAt(0)),
                text: correctAnswer,
                correct: false,
            });
        });

        return answers;
    }

    @action
    resetObservableData() {
        super.resetObservableData();

        this.answers.forEach((answer: Answer) => {
            const answerState = {
                userAnswer: '',
            };
            if (isObservable(answer)) {
                set(answer, answerState);
            } else {
                extendObservable(answer, answerState);
            }
        });
    }

    @action
    setUserAnswerFromAPIData(userAnswer: any) {
        if (!Array.isArray(userAnswer.response)) {
            return;
        }

        const answersById: Answer[] = [];
        this.answers.forEach((answer: Answer, answerIndex: number) => {
            answersById[answerIndex] = answer;
        });

        userAnswer.response.forEach((userAnswer: string, userAnswerIndex: number) => {
            answersById[userAnswerIndex].userAnswer = userAnswer;
            answersById[userAnswerIndex].selected = userAnswer !== '';

            if (answersById[userAnswerIndex].text.toLowerCase() === userAnswer.toLowerCase()) {
                answersById[userAnswerIndex].correct = true;
            }
        });

        this.isMarkedForReview = Boolean(userAnswer.is_marked_for_review);
        this.markSeen();
        if (!this.isAnswered) {
            this.markSkipped();
        }
    }

    @action
    updateUserAnswer(userAnswer: string, answerIndex: number) {
        this.answers[answerIndex].userAnswer = userAnswer;
        this.answers[answerIndex].selected = userAnswer !== '';
        this.answers[answerIndex].correct =
            this.answers[answerIndex].text.toLowerCase() === userAnswer.toLowerCase();
    }

    @computed
    get wrongAnswers() {
        return this.answers.filter((answer: Answer) => !answer.correct);
    }
}
