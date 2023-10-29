import AssessmentIcon from '@udemy/icons/dist/assessment.ud-icon';
import classNames from 'classnames';
import React from 'react';

import styles from './assessment-icon.less';

interface AssessmentIconProps {
    /**
     * assessment status is not available in the assessments listing page
     */
    isCompleted?: boolean;
}

export const AssessmentsIcon = ({isCompleted = false}: AssessmentIconProps) => {
    return (
        <AssessmentIcon
            label={false}
            className={classNames([styles['assessment-icon']], {
                [styles.completed]: isCompleted,
            })}
        />
    );
};
