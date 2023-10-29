import React from 'react';

import styles from './course-card-badges.module.less';

/**
 * Props for `CourseCardBadges`
 */
export interface CourseCardBadgesProps {
    children?: React.ReactNode;
}

/**
 * Badges container for `CourseCard`
 *
 * Generally, include one {@link @udemy/react-messaging-components#Badge | `Badge`}
 * component as a child component.
 *
 * It will not render anything if there are no `children`.
 */
export const CourseCardBadges = ({children}: CourseCardBadgesProps) => {
    return children ? <div className={styles['course-badges']}>{children}</div> : null;
};
