import React from 'react';

import styles from './quiz-metrics-funnel-step.less';

interface QuizMetricsFunnelStepProps {
    title?: string;
    subtitle?: string;
}

export const QuizMetricsFunnelStep = ({title = '', subtitle = ''}: QuizMetricsFunnelStepProps) => {
    if (!title) {
        return <div className={styles.step}>&nbsp;</div>;
    }
    return (
        <div className={styles.step}>
            <div className="ud-heading-md" data-purpose="quiz-metrics-funnel-step-label">
                <div className={styles.text} data-purpose="quiz-metrics-funnel-step-title">
                    {title}
                </div>
                <div
                    className={styles['subtitle-text']}
                    data-purpose="quiz-metrics-funnel-step-subtitle"
                >
                    {subtitle}
                </div>
            </div>
        </div>
    );
};
