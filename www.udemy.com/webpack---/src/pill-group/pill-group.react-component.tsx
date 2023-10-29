import {Button, ButtonProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import styles from './pill-group.module.less';

/**
 * The PillGroup component.
 *
 * @remarks
 * This is essentially a stylized unordered list (`ul`).
 */
export const PillGroup = ({children, ...props}: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul
        {...props}
        className={classNames('ud-unstyled-list', styles['pill-group'], props.className)}
    >
        {children}
    </ul>
);

/**
 * An individual `Pill` to use within the `PillGroup` component
 *
 * @remark
 * This is an `HTMLLIElement` with a {@link Button} component within it.
 * Its `udStyle` is set to `secondary`.
 */
export const Pill = React.forwardRef<HTMLLIElement, ButtonProps>(
    ({udStyle = 'secondary', ...props}, ref) => (
        <li className={styles.pill} ref={ref}>
            <Button udStyle={udStyle} {...props} round={true} />
        </li>
    ),
);

Pill.displayName = 'Pill';

PillGroup.Pill = Pill;
