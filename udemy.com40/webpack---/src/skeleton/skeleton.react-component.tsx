import classNames from 'classnames';
import React from 'react';

import styles from './skeleton.module.less';

export type SkeletonProps = React.ComponentPropsWithoutRef<'div'>;
/** The Skeleton component. Used to mimic the scaffolding of a piece of content while it loads. */
export const Skeleton = ({className, children, ...htmlProps}: SkeletonProps) => (
    <div {...htmlProps} className={classNames(styles.skeleton, className)}>
        {children}
        <div className={styles.shine} />
    </div>
);
