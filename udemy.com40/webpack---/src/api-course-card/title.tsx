import {CourseCardTitleProps} from '../course-card';

/**
 * Props for title slot
 */
export interface APICourseCardTitleProps {
    /** Course title, from Course API */
    course: {title: string};
    /** If defined, title will be rendered as a link to this URL */
    url?: string;
    /** className passed through to the `<a>` or `<span>` used to render the title */
    titleClass?: string;
}

/**
 * Converts title slot props from deprecated course card to those for
 * `@udemy/react-card-components#CourseCardTitle`
 */
export const titlePropsFrom = ({
    course,
    titleClass,
    url,
}: APICourseCardTitleProps): CourseCardTitleProps => ({
    className: titleClass,
    title: course.title,
    url,
});
