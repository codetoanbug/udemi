import {range} from '@udemy/shared-utils';
import classNames from 'classnames';
import React from 'react';

import {Block} from '../block/block.react-component';
import styles from './course-card-skeleton-group.module.less';
import {CourseCardSkeleton, CourseCardSkeletonProps} from './course-card-skeleton.react-component';

/** React props interface for the `CourseCardSkeletonGroup` component */
export interface CourseCardSkeletonGroupProps extends CourseCardSkeletonProps {
    /** The number of cards to display per row */
    cardCountPerRow?: number;
    /**
     * The component to wrap child `CourseCardSkeleton` components
     *
     * @defaultValue React.Fragment in `CourseCardSkeletonGroup`
     * */
    cardWrapper?: React.ElementType;
    /** The number of rows of course cards to render */
    rowCount?: number;
    /** Optional flag to turn on a `{@link Block} component signifying a title. */
    withTitle?: boolean;
}

/**
 * ### The CourseCardSkeletonGroup component.
 *
 * @remarks
 * Renders several {@link CourseCardSkeleton} components.
 */
export const CourseCardSkeletonGroup = ({
    className,
    cardCountPerRow: givenCardCountPerRow,
    cardWrapper: CardWrapper = React.Fragment,
    rowCount = 1,
    withTitle = false,
    ...cardSkeletonProps
}: CourseCardSkeletonGroupProps) => {
    let cardCountPerRow = givenCardCountPerRow;
    if (!givenCardCountPerRow) {
        cardCountPerRow = cardSkeletonProps.size === 'small' ? 3 : 5;
    }
    return (
        <div className={classNames(className, styles.skeleton)}>
            {withTitle && <Block className={styles.title} />}
            {range(rowCount).map((i) => (
                <div key={i} className={styles.row}>
                    {range(cardCountPerRow as number).map((j) => (
                        <CardWrapper key={j}>
                            <CourseCardSkeleton {...cardSkeletonProps} />
                        </CardWrapper>
                    ))}
                </div>
            ))}
        </div>
    );
};
