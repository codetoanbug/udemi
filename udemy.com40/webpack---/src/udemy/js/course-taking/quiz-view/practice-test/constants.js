export const PAGE_TYPES = Object.freeze({
    START: 'START',
    QUESTION: 'QUESTION',
    RESULTS: 'RESULTS',
    DETAILED_RESULT: 'DETAILED_RESULT',
});

export const MAX_IDLE_SECONDS = 5 * 60;
export const TIMER_INTERVAL = 200;

export const API_TEST_RESULT_FIELDS = [
    'id',
    'created',
    'viewed_time',
    'completion_time',
    'version',
    'elapsed_time',
    'results_summary',
];
