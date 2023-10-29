import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Link, UdemyLinkProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

// Note: Breadcrumb CSS is served up via the react-reveal-components.global.css file;

/**
 * ### Breadcrumb
 *
 * @remarks
 * Very little styling or custom TypeScript interface required.
 * This is basically a `div` with child content.
 *
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-navigation-components/dist/react-navigation-components.global.css';`
 */
export const Breadcrumb = ({
    children,
    className,
    ...htmlProps
}: React.HTMLAttributes<HTMLDivElement>) => {
    const items = React.Children.toArray(children);

    if (items.length === 0) {
        return null;
    }

    return (
        <div {...htmlProps} className={classNames(className, 'ud-breadcrumb')}>
            {items.map((child, i) => (
                <React.Fragment key={i}>
                    {child}
                    {i < items.length - 1 && (
                        <NextIcon className="ud-breadcrumb-icon" label={false} size="xsmall" />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

/** The interface to implement when a Breadcrumb item is not a {@link Link} component. */
interface BreadCrumbItemHtmlProps {
    componentClass?: 'a' | React.ReactNode;
    /** The URL to link to */
    href?: string;
}

/** The interface to implement when a Breadcrumb item is a {@link Link} component. */
interface BreadCrumbItemLinkProps extends UdemyLinkProps {
    componentClass?: typeof Link;
    /** `react-router` `to` property */
    to: UdemyLinkProps['to'];
}

// Discrimination Union
/** The React props interface for BreadcrumbItem */
type BreadcrumbItemProps = BreadCrumbItemHtmlProps | BreadCrumbItemLinkProps;

/** The Breadcrumb.Item (child) component */
export const BreadcrumbItem = ({componentClass = 'a', ...htmlProps}: BreadcrumbItemProps) => {
    const LinkComponent = componentClass as React.ElementType;

    return <LinkComponent className="ud-heading-sm" {...htmlProps} />;
};

Breadcrumb.Item = BreadcrumbItem;
