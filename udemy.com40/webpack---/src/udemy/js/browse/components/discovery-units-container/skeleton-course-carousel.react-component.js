import {Skeleton} from '@udemy/react-reveal-components';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './skeleton-course-carousel.less';

export const SkeletonTitle = () => {
    return (
        <div className={styles['skeleton-title']} data-purpose="discovery-units-skeleton-title" />
    );
};

export const SkeletonCourseCarousel = ({courseCount}) => {
    const courseInfoClassName = styles['course-info'];
    return (
        <Skeleton>
            <div
                className={styles['skeleton-unit skeleton-spacing']}
                data-purpose="discovery-units-skeleton-course-carousel"
            >
                <SkeletonTitle />
                <div className={styles.carousel}>
                    {[...Array(courseCount).keys()].map((key) => (
                        <div key={key} className={styles['course-container']}>
                            <div className={styles['course-image-lg']} />
                            <div className={styles['info-container']}>
                                <div className={courseInfoClassName} />
                                <div className={courseInfoClassName} />
                                <div className={courseInfoClassName} />
                                <div className={courseInfoClassName} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Skeleton>
    );
};

SkeletonCourseCarousel.propTypes = {
    courseCount: PropTypes.number.isRequired,
};
