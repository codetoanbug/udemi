import React from 'react';

import {SuspenseUntilInView, Loader} from '@udemy/react-reveal-components';

import styles from './course-details-quick-view-box.module.less';
import {
    CourseDetailsQuickViewBox,
    CourseDetailsQuickViewBoxProps,
} from './course-details-quick-view-box.react-component';

/**
 * Props for the `CourseDetailsQuickViewBoxLazy` component. Accepts all the props of the
 * `CourseDetailsQuickViewBox` as well
 */
export interface CourseDetailsQuickViewBoxLazyProps extends CourseDetailsQuickViewBoxProps {
    /**
     * If false, will render `null`
     */
    showQuickViewBox?: boolean;
}

/**
 * "Lazy" wrapper around the `CourseDetailsQuickViewBox` that uses React Suspense to render a
 * `Loader` until the component is in the viewport
 */
export const CourseDetailsQuickViewBoxLazy = ({
    courseCard,
    showQuickViewBox = true,
    ...rest
}: CourseDetailsQuickViewBoxLazyProps) => {
    if (!showQuickViewBox) {
        return courseCard;
    }

    return (
        <SuspenseUntilInView className={styles['full-height']} fallback={<Loader />}>
            <CourseDetailsQuickViewBox courseCard={courseCard} {...rest} />
        </SuspenseUntilInView>
    );
};
