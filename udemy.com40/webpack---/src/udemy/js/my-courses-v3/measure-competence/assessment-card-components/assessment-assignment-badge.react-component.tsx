import {useI18n} from '@udemy/i18n';
import AccessTimeIcon from '@udemy/icons/dist/access-time.ud-icon';
import {Badge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import React from 'react';

import styles from './assessment-assignment-badge.less';

interface AssessmentAssignmentBadgeProps {
    dueDate: string;
}

export const AssessmentAssignmentBadge = ({dueDate}: AssessmentAssignmentBadgeProps) => {
    const {gettext, interpolate, locale} = useI18n();
    const userLocale = locale.replace('_', '-') || 'en-US';
    let dueDateText;
    if (dueDate) {
        dueDateText = new Date(dueDate).toLocaleDateString(userLocale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    return (
        <>
            <Badge className={styles['assignment-badge']}>{gettext('Assigned')}</Badge>

            {dueDate && (
                <div className={classNames('ud-text-xs', styles['info-container'])}>
                    <AccessTimeIcon label={false} className={styles['info-icon']} size="xsmall" />
                    <span className={styles['info-content']}>
                        {interpolate(gettext('Due %(dueDateText)s'), {dueDateText}, true)}
                    </span>
                </div>
            )}
        </>
    );
};
