import {range} from '@udemy/shared-utils';
import classNames from 'classnames';
import React from 'react';

import {Block} from '../block/block.react-component';
import {Skeleton} from '../skeleton/skeleton.react-component';
import styles from './course-card-skeleton.module.less';

export type CourseCardSkeletonSize = 'small' | 'medium' | 'large';
export type CourseCardSkeletonWidth = 'fixed' | 'flexible';

/** React prop interfacef or the `CourseCardSkeleton` component */
export interface CourseCardSkeletonProps extends React.ComponentPropsWithoutRef<'div'> {
    /**
     * The size of the `CourseCardSkeleton`
     *
     * @see {@link CourseCardSkeletonSize}
     *
     * @defaultValue 'medium' in `CourseCardSkeleton`
     */
    size?: CourseCardSkeletonSize;
    /**
     * The width type applied to `CourseCardSkeleton`
     *
     * @see {@link CourseCardSkeletonWidth}
     *
     * @defaultValue 'flexible' in `CourseCardSkeleton`
     */
    width?: CourseCardSkeletonWidth;
    /** CSS to apply inline to the {@link Block} component serving as a placeholder for an image within `CourseCardSkeleton` */
    imageStyle?: React.CSSProperties;
    /**
     * The number of stacked {@link Block} components to render serving as a placeholder for text.
     *
     * @defaultValue 3 in `CourseCardSkeleton`
     */
    lineCount?: number;
}

/**
 * ### The CourseCardSkeleton component.
 */
export const CourseCardSkeleton = ({
    className,
    imageStyle,
    lineCount = 3,
    size = 'medium',
    width = 'flexible',
    ...htmlProps
}: CourseCardSkeletonProps) => (
    <Skeleton
        {...htmlProps}
        data-purpose="course-card-skeleton"
        className={classNames({
            className,
            [styles['skeleton-fixed']]: width === 'fixed',
            [styles['skeleton-flexible']]: width === 'flexible',
            [styles['skeleton-small']]: size === 'small',
            [styles['skeleton-medium']]: size === 'medium',
            [styles['skeleton-large']]: size === 'large',
        })}
    >
        <Block className={styles.image} style={imageStyle} />
        <div style={{flex: 1}}>
            <Block className={styles.title} />
            {range(lineCount).map((i) => (
                <Block key={i} className={styles.line} />
            ))}
        </div>
    </Skeleton>
);
