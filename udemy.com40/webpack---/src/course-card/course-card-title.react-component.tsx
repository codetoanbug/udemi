import classNames from 'classnames';
import React, {ReactNode, createContext, useContext} from 'react';

import styles from './course-card-title.module.less';

/**
 * Context props for `CourseCardTitle`.
 */
export interface CourseCardTitleContextType {
    /** Corresponds to `size` prop. Prop takes precedent over context in `CourseCardTitle`. */
    size?: 'small' | 'medium';
}

/**
 * Context for `CourseCardTitle`. Optionally provide this context in a card to
 * signal layout to `CourseCardTitle` instances rendered by consumers.
 */
export const CourseCardTitleContext = createContext<CourseCardTitleContextType>({
    size: undefined,
});

/**
 * Props for `CourseCardTitle`.
 */
export interface CourseCardTitleProps {
    /** CSS class applied to containing heading */
    className?: string;
    /** Text size. Defaults to 'medium' in `CourseCardTitle`. */
    size?: 'small' | 'medium';
    children?: ReactNode;
    /** Title text */
    title?: string;
    /** URL for course */
    url?: string;
}

/**
 * Title component for `CourseCard`. Renders title text in heading.
 * If `url` is included, will render as anchor link.
 *
 * @remarks
 *
 * Override default rendering of either title text or link by providing
 * `children`, e.g., rendering a `Link`.
 */
export const CourseCardTitle = ({
    className,
    url,
    title,
    children,
    ...props
}: CourseCardTitleProps) => {
    const {size: contextSize} = useContext(CourseCardTitleContext);
    const size = props.size ?? contextSize ?? 'medium';

    let content: ReactNode;
    if (children) {
        content = children;
    } else if (title) {
        content = url ? <a href={url}>{title}</a> : <span>{title}</span>;
    }

    return (
        <div className={styles.title}>
            <h3
                data-purpose="course-title-url"
                className={classNames(
                    className,
                    size === 'small' ? 'ud-heading-sm' : 'ud-heading-md',
                    styles['course-title'],
                )}
            >
                {content}
            </h3>
        </div>
    );
};
