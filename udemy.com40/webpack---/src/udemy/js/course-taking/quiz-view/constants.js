import {QUIZ_TYPES} from '../curriculum/constants';

export const QUIZ_ERROR_CODES = Object.freeze({
    ALREADY_CREATING_ATTEMPT: 'ERROR_ALREADY_CREATING_ATTEMPT',
    COULD_NOT_CREATE_ATTEMPT: 'ERROR_COULD_NOT_CREATE_ATTEMPT',
    COULD_NOT_DELETE_ATTEMPT: 'ERROR_COULD_NOT_DELETE_ATTEMPT',
    COULD_NOT_LOAD_ATTEMPT_STATS: 'ERROR_COULD_NOT_LOAD_ATTEMPT_STATS',
    COULD_NOT_LOAD_QUESTIONS: 'ERROR_COULD_NOT_LOAD_QUESTIONS',
    COULD_NOT_LOAD_QUIZ: 'ERROR_COULD_NOT_LOAD_QUIZ',
    COULD_NOT_SAVE_ANSWER: 'ERROR_COULD_NOT_SAVE_ANSWER',
    NO_TEST_RESULT: 'ERROR_NO_TEST_RESULT',
    NO_TEST_RESULT_QUESTIONS: 'ERROR_NO_TEST_RESULT_QUESTIONS',
});

export const QUIZ_ERROR_VALUES = Object.freeze(new Set(Object.values(QUIZ_ERROR_CODES)));

export const QUIZ_STATUS_OPTIONS = Object.freeze({
    CORRECT: 0,
    INCORRECT: 1,
    SKIPPED_UNANSWERED: 2,
});

export const ASSESSMENT_TYPES = Object.freeze({
    CODING_PROBLEM: 'coding-problem',
    FILL_IN_THE_BLANK: 'fill-in-the-blanks',
    MULTIPLE_CHOICE: 'multiple-choice',
    MULTIPLE_SELECT: 'multi-select',
});

export const API_QUIZ_QUESTION_FIELDS = {
    DEFAULT: [
        'id',
        'assessment_type',
        'prompt',
        'correct_response',
        'section',
        'question_plain',
        'related_lectures',
    ],
    [QUIZ_TYPES.CODING_EXERCISE]: [
        'id',
        'assessment_type',
        'prompt',
        'correct_response',
        'related_lectures',
    ],
};

export const API_QUIZ_ANSWER_FIELDS = {
    DEFAULT: ['id', 'response', 'assessment', 'is_marked_for_review'],
};

export const API_QUIZ_ATTEMPT_FIELDS = {
    DEFAULT: [
        'id',
        'created',
        'viewed_time',
        'completion_time',
        'version',
        'completed_assessments',
        'results_summary',
    ],
    [QUIZ_TYPES.PRACTICE_TEST]: [
        'id',
        'created',
        'viewed_time',
        'completion_time',
        'version',
        'completed_assessments',
        'current_assessment_id',
        'is_paused',
        'elapsed_time',
        'results_summary',
        'ignore_time_limit',
        'is_passed',
    ],
};

export const API_QUIZ_FIELDS = [
    'id',
    'type',
    'title',
    'description',
    'object_index',
    'num_assessments',
    'version',
    'duration',
    'is_draft',
    'pass_percent',
    'changelog',
];

export const HOTKEYS = Object.freeze({
    SHOW_HOTKEYS: '?',
    SELECT_ANSWER_1_TO_9: '1-9',
    NEXT_QUESTION: 'right',
    SKIP_QUESTION: 'shift+right',
});

export const attemptApi = (courseId, quizId) => {
    return `/users/me/subscribed-courses/${courseId}/quizzes/${quizId}/user-attempted-quizzes/`;
};
