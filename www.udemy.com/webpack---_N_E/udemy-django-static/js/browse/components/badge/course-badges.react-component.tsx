import {useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';
import React from 'react';

import {
    COURSE_BADGE_BESTSELLER,
    COURSE_BADGE_FREE,
    COURSE_BADGE_HIGHEST_RATED,
    COURSE_BADGE_HOT_AND_NEW,
    COURSE_BADGE_NEW,
    COURSE_BADGE_UPDATED_RECENTLY,
    COURSE_BADGE_CODING_EXERCISES,
} from 'udemy-django-static/js/browse/components/badge/constants';

interface BadgeProps {
    className?: string;
}

export const BestsellerBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return <Badge className={`ud-badge-bestseller ${className}`}>{gettext('Bestseller')}</Badge>;
};

export const HighestRatedBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return (
        <Badge className={`ud-badge-highest-rated ${className}`}>{gettext('Highest rated')}</Badge>
    );
};

export const HotAndNewBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return <Badge className={`ud-badge-hot-and-new ${className}`}>{gettext('Hot & new')}</Badge>;
};

export const NewBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return <Badge className={`ud-badge-new ${className}`}>{gettext('New')}</Badge>;
};

export const FreeBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return <Badge className={`ud-badge-free ${className}`}>{gettext('Free tutorial')}</Badge>;
};
export const UpdatedRecentlyBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return (
        <Badge className={`ud-badge-updated-recently ${className}`}>
            {gettext('Updated Recently')}
        </Badge>
    );
};

export const CodingExercisesBadge = ({className = ''}: BadgeProps) => {
    const {gettext} = useI18n();
    return (
        <Badge className={`ud-badge-coding-exercises ${className}`}>
            {gettext('Coding Exercises')}
        </Badge>
    );
};

export function courseBadgeFromType(type: string) {
    switch (type) {
        case COURSE_BADGE_BESTSELLER:
            return BestsellerBadge;
        case COURSE_BADGE_FREE:
            return FreeBadge;
        case COURSE_BADGE_HOT_AND_NEW:
            return HotAndNewBadge;
        case COURSE_BADGE_HIGHEST_RATED:
            return HighestRatedBadge;
        case COURSE_BADGE_NEW:
            return NewBadge;
        case COURSE_BADGE_UPDATED_RECENTLY:
            return UpdatedRecentlyBadge;
        case COURSE_BADGE_CODING_EXERCISES:
            return CodingExercisesBadge;
        default:
            return undefined;
    }
}
