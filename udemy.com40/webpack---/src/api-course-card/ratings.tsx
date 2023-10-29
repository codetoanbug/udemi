import {CourseCardRatingsProps} from '../course-card';

/**
 * Props for ratings slot (including a subset of Course API type)
 *
 * @remarks
 *
 * @see `browse/types/course` for `course`
 */
export interface APICourseCardRatingsProps {
    course: {
        rating: number;
        num_reviews: number;
    };
    /**
     * Number of reviews for this course as text. If defined as a non-empty
     * string, then it will be rendered instead of `course.num_reviews`.
     */
    numReviewsText?: string;
}

/**
 * Converts Course API fields to `CourseCard` ratings props.
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export const ratingsPropsFrom = ({
    course,
    numReviewsText,
}: APICourseCardRatingsProps): CourseCardRatingsProps => ({
    rating: course.rating,
    reviewsCount: course.num_reviews,
    reviewsCountText: numReviewsText,
});
