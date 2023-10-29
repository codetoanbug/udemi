import {CourseCard, withCourseCardUBGuard} from '@udemy/react-card-components';

/**
 * `CourseCard` wrapped in logic to omit price and badges when rendered in UB context.
 *
 * @internal
 *
 * @privateRemarks
 *
 * This is defined in its own module rather than inside `BrowseCourseCard` merely
 * so that it may be mocked more easily in `BrowseCourseCard` specs.
 */
export const CourseCardWithUBGuard = withCourseCardUBGuard(CourseCard);
