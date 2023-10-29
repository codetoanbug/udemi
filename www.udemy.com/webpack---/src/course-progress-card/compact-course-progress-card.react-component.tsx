import classNames from 'classnames';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {Meter} from '@udemy/react-messaging-components';
import {ItemCard} from '@udemy/react-structure-components';

import styles from './compact-course-progress-card.module.less';

export interface CompactCourseProgressCardProps {
    className?: string;
    course: {
        id: number;
        image_240x135: string;
        title: string;
        completion_ratio?: number;
    };
}

export const CompactCourseProgressCard = ({className, course}: CompactCourseProgressCardProps) => {
    const {gettext} = useI18n();

    return (
        <ItemCard className={className}>
            <ItemCard.ImageWrapper>
                <Image
                    src={course.image_240x135}
                    className={styles['course-image']}
                    alt=""
                    width={240}
                    height={135}
                />
            </ItemCard.ImageWrapper>
            <div className={styles['course-info']}>
                <ItemCard.Title
                    className={classNames('ud-heading-sm', styles['course-title'], {
                        [styles['course-title-condensed']]: course.completion_ratio === 0,
                    })}
                    data-purpose="course-title"
                    href={`/course-dashboard-redirect/?course_id=${course.id}`}
                >
                    {course.title}
                </ItemCard.Title>
                {!!course.completion_ratio && course.completion_ratio > 0 && (
                    <Meter
                        value={course.completion_ratio}
                        min={0}
                        max={100}
                        label={gettext('%(percent)s% complete')}
                    />
                )}
                {course.completion_ratio === 0 && (
                    <span className={classNames('ud-heading-sm', styles['start-learning'])}>
                        {gettext('Start learning')}
                    </span>
                )}
            </div>
        </ItemCard>
    );
};
