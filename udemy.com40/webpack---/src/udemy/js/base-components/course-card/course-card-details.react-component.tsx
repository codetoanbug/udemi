import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React, {ReactNode} from 'react';

import {BrowseCourse} from 'browse/types/course';

import styles from './course-card.less';
import {getNumLecturesText} from './course-card.react-component';

export interface CourseCardDetailsProps {
    showMetadata: boolean;
    metadata?: ReactNode[];
    children: ReactNode | ReactNode[];
}

export const CourseCardDetails = ({showMetadata, metadata, children}: CourseCardDetailsProps) => {
    const metadataContent =
        metadata?.map((content, key) =>
            content ? (
                <span key={key} className={styles.row}>
                    {content}
                </span>
            ) : null,
        ) ?? [];

    return (
        <div className={styles.row}>
            {showMetadata && (
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

CourseCardDetails.defaultProps = {
    showMetadata: true,
    children: null,
};

const NumLectureText = ({numLectures}: {numLectures: number}) => {
    const {ninterpolate} = useI18n();
    return <>{getNumLecturesText(numLectures, {ninterpolate})}</>;
};

export const CourseCardDetailMetadata = {
    contentInfo: (course: BrowseCourse) =>
        course.content_info ? <>{course.content_info}</> : null,
    publishedLectures: (course: BrowseCourse) =>
        course.num_published_lectures > 0 ? (
            <NumLectureText numLectures={course.num_published_lectures} />
        ) : null,
    instructorLevel: (course: BrowseCourse) =>
        course.instructional_level_simple ? <>{course.instructional_level_simple}</> : null,
};

export const getDefaultCourseCardMetadata = (course: BrowseCourse) => {
    return [
        CourseCardDetailMetadata.contentInfo(course),
        CourseCardDetailMetadata.publishedLectures(course),
        CourseCardDetailMetadata.instructorLevel(course),
    ];
};
