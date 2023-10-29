import {Skeleton} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './discovery-units-loading-skeleton.less';

const SkeletonUnit = ({className}) => {
    const output = [1, 2].map((el) => {
        return (
            <div className={styles['skeleton-unit']} key={el}>
                <div className={styles.title} />
                <div className={styles['skeleton-card']}>
                    <div className={styles['course-image']} />
                    <div className={styles['info-container']}>
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                    </div>
                </div>
                <div className={styles['skeleton-card']}>
                    <div className={styles['course-image']} />
                    <div className={styles['info-container']}>
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                    </div>
                </div>
                <div className={styles['skeleton-card']}>
                    <div className={styles['course-image']} />
                    <div className={styles['info-container']}>
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                    </div>
                </div>
                <div className={styles['skeleton-card']}>
                    <div className={styles['course-image']} />
                    <div className={styles['info-container']}>
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                        <div className={styles['course-info']} />
                    </div>
                </div>
            </div>
        );
    });
    return (
        <Skeleton>
            <div
                data-purpose="discovery-units-loading-skeleton"
                className={classNames(className, styles['skeleton-units-container'])}
            >
                {output}
            </div>
        </Skeleton>
    );
};
SkeletonUnit.propTypes = {
    className: PropTypes.string,
};
SkeletonUnit.defaultProps = {
    className: undefined,
};
export default SkeletonUnit;
