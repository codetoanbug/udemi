import React from 'react';

import {Block, CourseCardSkeletonGroup} from '@udemy/react-reveal-components';

import styles from './bundle-unit-skeleton.module.less';

export const BundleUnitSkeleton = () => (
    <section data-testid="bundle-unit-skeleton">
        <CourseCardSkeletonGroup cardCountPerRow={1} rowCount={2} size="large" withTitle={true} />
        <Block className={styles['footer-block']} />
    </section>
);
