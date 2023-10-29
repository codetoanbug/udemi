/**
 * Each filter config should define:
 * - `label` describing what the filter does
 * - `filter` function following the signature of the Array.prototype.filter method,
 *    i.e. it accepts args `question`, `index`, and `questions`.
 */

const ALL_QUESTIONS = {
    label: gettext('All questions'),
    filter: (question) => question,
};

const CORRECTLY_ANSWERED = {
    label: gettext('Correct'),
    filter: (question) => question.isCorrect,
};

const INCORRECTLY_ANSWERED = {
    label: gettext('Incorrect'),
    filter: (question) => question.isIncorrect,
};

const SKIPPED = {
    label: gettext('Skipped'),
    filter: (question) => !question.isAnswered && question.wasSkipped,
};

const MARKED_FOR_REVIEW = {
    label: gettext('Marked for review'),
    filter: (question) => question.isMarkedForReview,
};

export const NAV_QUESTION_FILTERS = {ALL_QUESTIONS, SKIPPED, MARKED_FOR_REVIEW};

export const RESULT_QUESTION_FILTERS = {
    ALL_QUESTIONS,
    CORRECTLY_ANSWERED,
    INCORRECTLY_ANSWERED,
    SKIPPED,
    MARKED_FOR_REVIEW,
};
