import React, {PropsWithChildren, ComponentType} from 'react';

import {CourseCardBadgesProps} from '../course-card';

/** Props for badges slot (subset of Course API type) */
export type APICourseCardBadgesProps = PropsWithChildren<{
    course: {badges: {badge_family: string}[] | null};
    /** Function to map `badge_family` to a badge component */
    badges?: (badges: string[]) => ComponentType | null | undefined;
}>;

/**
 * Converts Course API badges to `CourseCard` badges props
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export const badgesPropsFrom = ({
    course,
    badges,
    children,
}: APICourseCardBadgesProps): CourseCardBadgesProps => {
    const badgeTypes = course.badges ? course.badges.map((badge) => badge.badge_family) : [];
    const Badge = badges?.(badgeTypes);

    const content = (
        <>
            {Badge && <Badge />}
            {children}
        </>
    );

    return {children: content};
};
