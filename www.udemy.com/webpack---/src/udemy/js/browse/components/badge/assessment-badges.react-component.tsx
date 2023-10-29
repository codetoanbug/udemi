import {useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import React from 'react';

import {
    ASSESSMENT_BADGE_IN_PROGRESS,
    ASSESSMENT_BADGE_COMPLETED,
    ASSESSMENT_BADGE_EXPIRED,
} from 'browse/components/badge/constants';

import './assessment-badges.global.less';

interface BadgeProps {
    className?: string;
}

export const InProgressBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return (
        <Badge className={classNames('ud-badge-in-progress', className)}>
            {gettext('In Progress')}
        </Badge>
    );
};

export const CompletedBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return (
        <Badge className={classNames('ud-badge-completed', className)}>
            {gettext('Completed')}
        </Badge>
    );
};

export const ExpiredBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return (
        <Badge className={classNames('ud-badge-expired', className)}>{gettext('Expired')}</Badge>
    );
};

export function assessmentFromBadgeType(type: string) {
    switch (type) {
        case ASSESSMENT_BADGE_IN_PROGRESS:
            return InProgressBadge;
        case ASSESSMENT_BADGE_COMPLETED:
            return CompletedBadge;
        case ASSESSMENT_BADGE_EXPIRED:
            return ExpiredBadge;
        default:
            return undefined;
    }
}
