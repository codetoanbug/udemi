import classNames from 'classnames';
import React from 'react';

import styles from './item-card.module.less';

type ItemCardProps = React.HTMLAttributes<HTMLDivElement>;
type ItemCardTitleProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

/** The ItemCardImageWrapper component. */
export const ItemCardImageWrapper = ({className, children, ...divProps}: ItemCardProps) => (
    <div
        {...divProps}
        className={classNames(className, 'ud-custom-focus-target', styles['image-wrapper'])}
    >
        {children}
    </div>
);

/** The ItemCardTitle component. */
export const ItemCardTitle = ({className, children, ...anchorProps}: ItemCardTitleProps) => {
    return (
        <a
            {...anchorProps}
            className={classNames(className, 'ud-focus-visible-target', styles['item-card-title'])}
        >
            {children}
        </a>
    );
};

/**
 * The ItemCard component.
 *
 * @privateRemarks
 * This component uses Object.assign to skirt around TypeScript type errors regarding the
 * two components it exposes:
 *
 * - ItemCard.Title the {@link ItemCardTitle} component
 * - ItemCard.ImageWrapper the {@link ItemCardImageWrapper} component
 */
export const ItemCard = Object.assign(
    React.forwardRef<HTMLDivElement, ItemCardProps>(({className, children, ...divProps}, ref) => (
        <div
            {...divProps}
            ref={ref}
            className={classNames(className, 'ud-custom-focus-visible', styles['item-card'])}
        >
            {children}
        </div>
    )),
    {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Title: ItemCardTitle,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ImageWrapper: ItemCardImageWrapper,
    },
);
