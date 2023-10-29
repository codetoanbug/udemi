import classNames from 'classnames';
import React from 'react';

// Note: Badge CSS is served up via the react-form-components.global.css file;

/**
 * ### The Badge component.
 *
 * @remarks
 * Very little styling or custom TypeScript interface required.
 * This is basically a `div` with child content.
 *
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-messaging-components/dist/react-messaging-components.global.css';`
 */
export const Badge = ({
    children = null,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className={classNames('ud-badge', 'ud-heading-xs', className)}>
        {children}
    </div>
);
