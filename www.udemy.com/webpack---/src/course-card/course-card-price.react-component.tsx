import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React, {createContext, ReactNode, useContext} from 'react';

import styles from './course-card-price.module.less';

/**
 * Context props for `CourseCardPrice`.
 */
export interface CourseCardPriceContextType {
    /** Corresponds to `layoutDirection` prop. Prop takes precedent over context in `CourseCardPrice`. */
    layoutDirection?: 'horizontal' | 'vertical';
}

/**
 * Context for `CourseCardPrice`. Optionally provide this context in a card to
 * signal layout to `CourseCardPrice` instances rendered by consumers.
 */
export const CourseCardPriceContext = createContext<CourseCardPriceContextType>({
    layoutDirection: undefined,
});

/**
 * Props for `CourseCardPrice` component.
 */
export interface CourseCardPriceProps {
    /**
     * Flag to set whether multiple prices are listed horizontally or
     * vertically. Defaults to 'horizontal' in `CourseCardPrice`.
     */
    layoutDirection?: 'horizontal' | 'vertical';
    /** The current price, with currency */
    priceText?: string;
    /** The former price, with currency */
    formerPriceText?: string;
    /** Placeholder for common price text components */
    children?: ReactNode;
}

/**
 * Price content for `CourseCard`.
 *
 * @remarks
 *
 * For simple rendering, use `priceText` and `formerPriceText` props.
 *
 * `children` can also be used to render common price text components,
 * {@link @udemy/react-merchandising-components#StaticPriceText} and
 * {@link @udemy/react-merchandising-components#DynamicPriceText}.
 * `priceTextStyleProps` is exported to make it easier to use those two price
 * text components within this slot. It will apply extra style definitions
 * needed for different card sizes.
 */
export const CourseCardPrice = ({
    priceText,
    children,
    formerPriceText,
    layoutDirection,
}: CourseCardPriceProps) => {
    const {gettext} = useI18n();

    // Layout direction prop takes precedence over context
    const {layoutDirection: layoutDirectionContext} = useContext(CourseCardPriceContext);
    const isDirectionVertical = (layoutDirection ?? layoutDirectionContext) === 'vertical';

    return (
        <div
            className={classNames(styles.container, {
                [styles['layout-vertical']]: isDirectionVertical,
            })}
        >
            {priceText && (
                <div
                    className={classNames(
                        'ud-heading-md',
                        styles['price-text-amount'],
                        styles['price-text-amount-current'],
                    )}
                >
                    <span className="ud-sr-only">{gettext('Current Price')}</span>
                    <strong>{priceText}</strong>
                </div>
            )}
            {formerPriceText && (
                <div
                    className={classNames(
                        'ud-text-sm',
                        styles['price-text-amount'],
                        styles['price-text-amount-former'],
                    )}
                >
                    <span className="ud-sr-only">{gettext('Original Price')}</span>
                    <s>{formerPriceText}</s>
                </div>
            )}
            {children}
        </div>
    );
};
