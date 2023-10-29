import {CourseCardImageProps} from '../course-card';

/**
 * Props for image slot (subset of Course API type)
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export interface APICourseCardImageProps {
    course: {
        /** Course image (50x50) */
        image_50x50: string;
        /** Course image (100x100) */
        image_100x100: string;
        /** Course image (240x135) */
        image_240x135: string;
        /** Course image (480x270) */
        image_480x270: string;
    };
}

/**
 * Converts Course API fields to `CourseCard` image props.
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export const imagePropsFrom = ({course}: APICourseCardImageProps): CourseCardImageProps => ({
    srcSmallSquare: course.image_50x50,
    srcSmallSquare2x: course.image_100x100,
    srcDefault: course.image_240x135,
    srcDefault2x: course.image_480x270,
});
