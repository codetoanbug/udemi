import {CourseCardInstructorsProps} from '../course-card';

/**
 * Props for instructors slot (subset of Course API type)
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export interface APICourseCardInstructorsProps {
    course: {
        /** Instructor's name for display */
        visible_instructors?: Array<{display_name: string}>;
    };
}

/**
 * Converts Course API fields to `CourseCard` instructors props.
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export const instructorsPropsFrom = ({
    course,
}: APICourseCardInstructorsProps): CourseCardInstructorsProps => ({
    displayNames: (course.visible_instructors ?? []).map(
        ({display_name: displayName}) => displayName,
    ),
});
