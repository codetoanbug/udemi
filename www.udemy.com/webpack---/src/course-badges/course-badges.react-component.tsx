import classNames from 'classnames';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';

import {
    COURSE_BADGE_BESTSELLER,
    COURSE_BADGE_CODING_EXERCISES,
    COURSE_BADGE_FREE,
    COURSE_BADGE_HIGHEST_RATED,
    COURSE_BADGE_HOT_AND_NEW,
    COURSE_BADGE_NEW,
    COURSE_BADGE_UPDATED_RECENTLY,
} from './constants';
import styles from './course-badges.module.less';

/** The possible types that a Course Badge can be  */
export type CourseBadgeFamily =
    | typeof COURSE_BADGE_BESTSELLER
    | typeof COURSE_BADGE_HIGHEST_RATED
    | typeof COURSE_BADGE_NEW
    | typeof COURSE_BADGE_HOT_AND_NEW
    | typeof COURSE_BADGE_FREE
    | typeof COURSE_BADGE_UPDATED_RECENTLY
    | typeof COURSE_BADGE_CODING_EXERCISES;

/**
 * ### Bestseller Badge
 */
export const BestsellerBadge = ({className}: React.HTMLAttributes<HTMLDivElement>) => {
    const {gettext} = useI18n();
    return (
        <Badge className={classNames(styles.bestseller, className)}>{gettext('Bestseller')}</Badge>
    );
};

/**
 * ### Highest Rated Badge
 */
export const HighestRatedBadge = ({className}: React.HTMLAttributes<HTMLDivElement>) => {
    const {gettext} = useI18n();
    return (
        <Badge className={classNames(styles['highest-rated'], className)}>
            {gettext('Highest rated')}
        </Badge>
    );
};

/**
 * ### Hot and New Badge
 */
export const HotAndNewBadge = ({className}: React.HTMLAttributes<HTMLDivElement>) => {
    const {gettext} = useI18n();
    return (
        <Badge className={classNames(styles['hot-and-new'], className)}>
            {gettext('Hot & new')}
        </Badge>
    );
};

/**
 * ### New Badge
 */
export const NewBadge = ({className}: React.HTMLAttributes<HTMLDivElement>) => {
    const {gettext} = useI18n();
    return <Badge className={classNames(styles.new, className)}>{gettext('New')}</Badge>;
};

/**
 * ### Free Badge
 */
export const FreeBadge = ({className}: React.HTMLAttributes<HTMLDivElement>) => {
    const {gettext} = useI18n();
    return <Badge className={classNames(styles.free, className)}>{gettext('Free tutorial')}</Badge>;
};

/**
 * ### Updated Recently Badge
 */
export const UpdatedRecentlyBadge = ({className}: React.HTMLAttributes<HTMLDivElement>) => {
    const {gettext} = useI18n();
    return (
        <Badge className={classNames(styles['updated-recently'], className)}>
            {gettext('Updated Recently')}
        </Badge>
    );
};

/**
 * ### Coding Exercises Badge
 */
export const CodingExercisesBadge = ({className}: React.HTMLAttributes<HTMLDivElement>) => {
    const {gettext} = useI18n();
    return (
        <Badge className={classNames(styles['coding-exercises'], className)}>
            {gettext('Coding Exercises')}
        </Badge>
    );
};

/** An array of badges used for a Course Card */
interface CourseApiBadges {
    badges: Array<{badge_family: string}> | null;
}

/**
 * A utility to return the correct Badge component but looking up the bageType and returning the corresponding component.
 *
 * @param course a CourseApiBadges object
 * @returns the correct Badge course component unless not specified, then null otherwise
 */
export const getCourseBadge = (course: CourseApiBadges) => {
    const badgeType = getCourseBadgeType(course);
    return badgeType ? getCourseBadgeFromType(badgeType) : null;
};

/**
 * A utility to get the course badge based on its type.
 *
 * @param course a CourseApiBadges object
 * @returns the badge type string or undefined if not found
 */
export const getCourseBadgeType = (course: CourseApiBadges) => {
    // Include course.badges in left side of the conditional operator as guard for TypeScript
    return courseHasBadge(course) && course.badges ? course.badges[0].badge_family : undefined;
};

/**
 * Utility to help determine if there are badges for a course
 *
 * @param course a CourseApiBadges object
 * @returns boolean true if course has a badge, false otherwise
 */
export const courseHasBadge = (course: CourseApiBadges) => {
    return !!(course.badges && course.badges.length > 0 && course.badges[0]);
};

/**
 * Return a badge from an array of strings corresponding to `badge_family`.
 *
 * @param badges - array of values from course badges `badge_family`
 * @returns the Badge component matching the first badge family in the array; null if the array is empty
 *
 * @remarks
 *
 * Corresponds to the interface for the `badges` function in `@udemy/react-card-components#badgesPropsFrom`
 */
export const getCourseBadgeFromBadgesFamily = (badges: string[]) =>
    badges.length > 0 ? getCourseBadgeFromType(badges[0]) : null;

/**
 * A utility to return the correct Badge component to return based on the constant type.
 *
 * @param type string from the constants
 * @returns The corresponding Course Badge component
 */
export function getCourseBadgeFromType(type: string) {
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
