import classNames from 'classnames';
import React, {ReactNode} from 'react';

import styles from './course-card-details.module.less';

/**
 * Props for `CourseCardDetails` component.
 */
export interface CourseCardDetailsProps {
    /** Text-based details about the course rendered in horizontal row */
    metadata?: ReactNode[];
    /** Nodes rendered below the metadata row */
    children?: ReactNode | ReactNode[];
}

/**
 * Component for supporting information, details, and metadata about a course.
 *
 * @remarks
 *
 * Nodes passed via `metadata` are rendered with small text, in a horizontal row.
 *
 * Child nodes are rendered below the metadata row.
 */
export const CourseCardDetails = ({metadata = [], children}: CourseCardDetailsProps) => {
    const metadataContent = metadata
        .filter((content) => !!content)
        .map((content, key) => (
            <span key={key} className={styles.row}>
                {content}
            </span>
        ));

    return (
        <div className={styles.row}>
            {metadataContent.length > 0 && (
                <div
                    data-purpose="course-meta-info"
                    className={classNames(styles.row, styles['course-meta-info'], 'ud-text-xs')}
                >
                    {metadataContent}
                </div>
            )}

            {children}
        </div>
    );
};
