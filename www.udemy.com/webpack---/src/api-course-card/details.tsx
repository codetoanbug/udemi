import {useI18n, I18nApi} from '@udemy/i18n';
import React from 'react';

/* see 'browse/types/course' */
interface CourseDetails {
    /** Detailed info about the course's content */
    content_info: string;
    /** Count of course published lectures */
    num_published_lectures: number;
    /** Short instructional_level, e.g 'Beginner' */
    instructional_level_simple: string;
}

/**
 * Props for details slot (subset of Course API type)
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export interface APICourseCardDetailsProps {
    course: CourseDetails;
}

/**
 * Interpolate number of lectures
 *
 * @param numLectures - number of lectures to interpolate
 * @param i18n - `ninterpolate` function from @udemy/i18n
 */
export function getNumLecturesText(
    numLectures: number,
    {ninterpolate}: {ninterpolate: I18nApi['ninterpolate']},
) {
    return ninterpolate('%s lecture', '%s lectures', numLectures);
}

const NumLectureText = ({numLectures}: {numLectures: number}) => {
    const {ninterpolate} = useI18n();
    return <>{getNumLecturesText(numLectures, {ninterpolate})}</>;
};

/**
 * Definitions of default course card details sub-components.
 *
 * @remarks
 *
 * Use this object to access and render _individual_ details nodes.
 * If you want to render them all, use the convenience function
 * `getDefaultCourseMetadata`
 */
export const apiCourseCardDetailMetadata = {
    contentInfo: (course: CourseDetails) =>
        course.content_info ? <>{course.content_info}</> : null,
    publishedLectures: (course: CourseDetails) =>
        course.num_published_lectures > 0 ? (
            <NumLectureText numLectures={course.num_published_lectures} />
        ) : null,
    instructorLevel: (course: CourseDetails) =>
        course.instructional_level_simple ? <>{course.instructional_level_simple}</> : null,
};

/**
 * Convenience function to render default course card details sub-component nodes.
 *
 * @remarks
 *
 * The array of nodes can be passed directly as the `metadata` prop to
 * {@link @udemy/react-card-components#CourseCardDetails}, or you can re-order them,
 * or insert custom nodes to be rendered among the metadata in the details component.
 *
 * @param course - object including all props required by default metadata components
 * @returns array of course details metadata nodes
 */
export const getDefaultCourseCardMetadata = (course: CourseDetails) => {
    return [
        apiCourseCardDetailMetadata.contentInfo(course),
        apiCourseCardDetailMetadata.publishedLectures(course),
        apiCourseCardDetailMetadata.instructorLevel(course),
    ];
};

/**
 * Converts Course API fields for default metadata components into
 * `CourseCard` details props.
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export const detailsPropsFrom = ({course}: APICourseCardDetailsProps) => ({
    metadata: getDefaultCourseCardMetadata(course),
});
