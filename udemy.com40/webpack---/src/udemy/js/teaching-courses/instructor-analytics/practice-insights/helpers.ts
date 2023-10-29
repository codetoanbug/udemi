import {tokens} from '@udemy/styles';

import {DATA_SCOPE_FILTERS} from '../constants';
import {DateSpan} from '../date-span-filter/types';
import {QuizMeta} from '../quiz-filter/types';
import {DataColors, QuizMetric} from './types';

export const getDataColorsByDataScope = (dataScope: string): DataColors => {
    if (dataScope === DATA_SCOPE_FILTERS.UB) {
        return {
            fillColor: tokens['color-indigo-100'],
            lineColor: tokens['color-indigo-300'],
            gridLineColor: tokens['color-gray-300'],
        };
    }
    return {
        fillColor: tokens['color-orange-100'],
        lineColor: tokens['color-orange-400'],
        gridLineColor: tokens['color-gray-300'],
    };
};

const dateSpanAndDateFilterMap: {[key: string]: string} = {
    week: 'last_7days',
    month: 'last_30days',
    year: 'last_12months',
};

export const getDateSpanFromValue = (value: string): DateSpan => {
    const dateSpan = dateSpans.find(
        (dateSpan) => dateSpan.value === dateSpanAndDateFilterMap[value],
    );
    return dateSpan ?? DEFAULT_DATE_SPAN;
};

export const defaultQuizMetrics: QuizMetric = {
    quiz_id: 0,
    quiz_type: '',
    attempted_learners: 0,
    dropped_learners: 0,
    success_rate: 0,
    successful_learners: 0,
    viewed_learners: 0,
    quiz_active_learners: 0,
    learning_material_active_learners: 0,
};

export const dateSpans: DateSpan[] = [
    {
        expression: gettext('Last 7 days'),
        value: 'last_7days',
    },
    {
        expression: gettext('Last 30 days'),
        value: 'last_30days',
    },
    {
        expression: gettext('Last 12 Months'),
        value: 'last_12months',
    },
    /* We are not supporting this for now
    {
        expression: gettext('Last 12+ Months'),
        value: 'all',
    },*/
];

export const DEFAULT_DATE_SPAN: DateSpan = {
    expression: gettext('Last 12 months'),
    value: 'last_12months',
};

export const QUIZ_TYPE_CODING_EXERCISE = 'coding-exercise';
export const QUIZ_TYPE_SIMPLE_QUIZ = 'simple-quiz';
export const QUIZ_TYPE_PRACTICE_TEST = 'practice-test';

export const ALL_CODING_EXERCISES_QUIZ_FILTER: QuizMeta = {
    id: null,
    type: QUIZ_TYPE_CODING_EXERCISE,
    title: gettext('All coding exercises'),
};
