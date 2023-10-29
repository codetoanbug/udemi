import {useI18n} from '@udemy/i18n';
import {observer} from 'mobx-react';
import React from 'react';

import {
    defaultQuizMetrics,
    QUIZ_TYPE_CODING_EXERCISE,
    QUIZ_TYPE_PRACTICE_TEST,
    QUIZ_TYPE_SIMPLE_QUIZ,
} from '../../practice-insights/helpers';
import {QuizMetric} from '../../practice-insights/types';
import styles from './quiz-metrics-funnel-group.less';
import {QuizMetricsFunnelStep} from './quiz-metrics-funnel-steps/quiz-metrics-funnel-step.react-component';
import {QuizMetricsFunnel} from './quiz-metrics-funnel/quiz-metrics-funnel.react-component';
import {TitleAndSubtitle} from './types';

const CHART_HEIGHT = 100;

interface QuizMetricsFunnelGroupProps {
    quizMetrics: QuizMetric;
    fillColor: string;
    lineColor: string;
    gridLineColor: string;
}

export const QuizMetricsFunnelGroup = observer(
    ({
        quizMetrics = defaultQuizMetrics,
        fillColor,
        lineColor,
        gridLineColor,
    }: QuizMetricsFunnelGroupProps) => {
        const {gettext} = useI18n();

        function getTitleAndSubtitleForQuizType(
            quizType: string,
            step: string,
            value: string,
            percentage: string,
        ): TitleAndSubtitle {
            const titleAndSubtitle: TitleAndSubtitle = {title: '', subtitle: ''};
            switch (step.toLowerCase()) {
                case 'viewed':
                    switch (quizType.toLowerCase()) {
                        case QUIZ_TYPE_CODING_EXERCISE:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners viewed'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = interpolate(
                                gettext(
                                    '%(num)s% of your active learners opened this coding exercise.',
                                ),
                                {num: percentage},
                                true,
                            );
                            return titleAndSubtitle;
                        case QUIZ_TYPE_SIMPLE_QUIZ:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners viewed'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = gettext(
                                'Number of learners who opened this simple quiz.',
                            );
                            return titleAndSubtitle;
                        case QUIZ_TYPE_PRACTICE_TEST:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners viewed'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = gettext(
                                'Number of learners who opened this practice test',
                            );
                            return titleAndSubtitle;
                        default:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners viewed'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = interpolate(
                                gettext(
                                    '%(num)s% of your active learners opened this coding exercise.',
                                ),
                                {num: percentage},
                                true,
                            );
                            return titleAndSubtitle;
                    }
                case 'submitted':
                    switch (quizType.toLowerCase()) {
                        case QUIZ_TYPE_CODING_EXERCISE:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners ran tests'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = interpolate(
                                gettext(
                                    '%(num)s% of your learners who viewed this coding exercise clicked "Run tests".',
                                ),
                                {num: percentage},
                                true,
                            );
                            return titleAndSubtitle;
                        case QUIZ_TYPE_SIMPLE_QUIZ:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners submitted this simple quiz'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = gettext(
                                'Number of learners who opened this simple quiz and submitted.',
                            );
                            return titleAndSubtitle;
                        case QUIZ_TYPE_PRACTICE_TEST:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners who submitted this practice test'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = gettext(
                                'Number of learners who opened this practice test and submitted.',
                            );
                            return titleAndSubtitle;
                        default:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners who submitted this quiz'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = interpolate(
                                gettext(
                                    '%(num)s% of your learners who viewed this quiz completed successfully.',
                                ),
                                {num: percentage},
                                true,
                            );
                            return titleAndSubtitle;
                    }
                case 'completed':
                    switch (quizType.toLowerCase()) {
                        case QUIZ_TYPE_CODING_EXERCISE:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners completed'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = interpolate(
                                gettext(
                                    '%(num)s% of your learners who clicked "Run tests" completed it successfully.',
                                ),
                                {num: percentage},
                                true,
                            );
                            return titleAndSubtitle;
                        case QUIZ_TYPE_SIMPLE_QUIZ:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners completed'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = gettext(
                                'Number of learners who opened this simple quiz and completed successfully.',
                            );
                            return titleAndSubtitle;
                        case QUIZ_TYPE_PRACTICE_TEST:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners completed'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = gettext(
                                'Number of learners who opened this practice test and completed successfully.',
                            );
                            return titleAndSubtitle;
                        default:
                            titleAndSubtitle.title = interpolate(
                                gettext('%(value)s learners completed'),
                                {value},
                                true,
                            );
                            titleAndSubtitle.subtitle = interpolate(
                                gettext(
                                    '%(num)s% of your learners who viewed this quiz completed it successfully.',
                                ),
                                {num: percentage},
                                true,
                            );
                            return titleAndSubtitle;
                    }
                default:
                    titleAndSubtitle.title = '';
                    titleAndSubtitle.subtitle = '';
                    return titleAndSubtitle;
            }
        }

        function renderStep(quizType: string, step: string, value: number, percentage: number) {
            const titleAndSubtitle = getTitleAndSubtitleForQuizType(
                quizType,
                step,
                value.toString(),
                percentage.toString(),
            );
            return (
                <QuizMetricsFunnelStep
                    title={titleAndSubtitle.title}
                    subtitle={titleAndSubtitle.subtitle}
                />
            );
        }

        function createSeriesForChart() {
            const offsetFromTop = 10;

            let series = [
                quizMetrics.viewed_learners,
                quizMetrics.attempted_learners,
                quizMetrics.successful_learners,
                // Repeated in order to draw a straight line in the last column.
                quizMetrics.successful_learners,
            ];

            const firstElement = series[0];
            series = series.map((elem) => {
                if (!elem) {
                    return 0;
                }
                // Scale values proportionally to the first (largest) element.
                return ((CHART_HEIGHT - offsetFromTop) * elem) / firstElement;
            });
            return series;
        }

        function getPercentageForFunnelStep(numerator: number, denominator: number) {
            if (!denominator) {
                return 0;
            }
            return Math.round((numerator / denominator) * 100);
        }

        return (
            <div className={styles['quiz-metrics']}>
                <div className={styles.steps} data-purpose="quiz-metrics-funnel-steps">
                    {renderStep(
                        quizMetrics.quiz_type,
                        'viewed',
                        quizMetrics.viewed_learners,
                        getPercentageForFunnelStep(
                            quizMetrics.viewed_learners,
                            quizMetrics.learning_material_active_learners,
                        ),
                    )}
                    {renderStep(
                        quizMetrics.quiz_type,
                        'submitted',
                        quizMetrics.attempted_learners,
                        getPercentageForFunnelStep(
                            quizMetrics.attempted_learners,
                            quizMetrics.viewed_learners,
                        ),
                    )}
                    {renderStep(
                        quizMetrics.quiz_type,
                        'completed',
                        quizMetrics.successful_learners,
                        getPercentageForFunnelStep(
                            quizMetrics.successful_learners,
                            quizMetrics.attempted_learners,
                        ),
                    )}
                </div>
                <QuizMetricsFunnel
                    series={createSeriesForChart()}
                    fillColor={fillColor}
                    lineColor={lineColor}
                    gridLineColor={gridLineColor}
                />
            </div>
        );
    },
);
