import {useI18n} from '@udemy/i18n';
import {safelySetInnerHTML} from '@udemy/shared-utils';
import React, {createContext, useContext} from 'react';

import styles from './course-card-instructors.module.less';

/**
 * Context props for `CourseCardInstructors`.
 */
export interface CourseCardInstructorsContextType {
    /** Corresponds to the `size` prop. Prop takes precedent over context in `CourseCardInstructors`. */
    size?: 'xsmall' | 'small';
}

/**
 * Context for `CourseCardInstructors`. Optionally provide this context in a card to
 * signal layout to `CourseCardInstructors` instances rendered by consumers.
 */
export const CourseCardInstructorsContext = createContext<CourseCardInstructorsContextType>({
    size: undefined,
});

/**
 * Props for `CourseCardInstructors` component.
 */
export interface CourseCardInstructorsProps {
    /** Array of instructor names. Names can include HTML. */
    displayNames: Array<string>;
    /** Text size */
    size?: 'xsmall' | 'small';
}

/**
 * Instructors component for `CourseCard`. Renders names in a comma-separated list.
 *
 * @remarks
 *
 * If there are no names, this component will render `null`.
 */
export const CourseCardInstructors = ({displayNames, ...props}: CourseCardInstructorsProps) => {
    const {ngettext} = useI18n();
    const context = useContext(CourseCardInstructorsContext);
    const size = props.size ?? context.size ?? 'xsmall';

    return !displayNames.length ? null : (
        <div className={size === 'small' ? 'ud-text-sm' : 'ud-text-xs'}>
            <span className="ud-sr-only">
                {ngettext('Instructor:', 'Instructors:', displayNames.length)}
            </span>
            <div
                className={styles['instructor-list']}
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'course-card:visible-instructors',
                    html: displayNames.join(', '),
                })}
            />
        </div>
    );
};
