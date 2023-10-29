/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import styles from './base-price-text.module.less';

/** Universal React Prop Interface used for public consumption of a Price Text component */
export interface PriceTextProps {
    /** className to apply to outer container `<div>` */
    className?: string;
    /** The discount price. */
    discountPrice: number;
    /** Optional className to apply to apply to the discount price rendering  */
    discountPriceClassName?: string;
    /** Discount Price string, if a string */
    discountPriceString?: string;
    /** The product listing price */
    listPrice: number;
    /** Optional className to apply to apply to the list price rendering  */
    listPriceClassName?: string;
    /** List Price string, if a string */
    listPriceString?: string;
    /**
     * Event handler to call when the `TrackImpression` wrapping the core of this component is viewed.
     *
     * @remarks
     * Use this property for any impression events you want to record.
     */
    onView?: () => void;
    /** The discount percentage */
    percentDiscount?: number;
    /** Optional className to apply to the percentDiscount rendering */
    percentDiscountClassName?: string;
    /** Flag to only display List Price */
    showListPriceOnly?: boolean;
    /** Flag to display the percent discount */
    showPercentDiscount?: boolean;
    /** Flag to display the total label */
    showTotalLabel?: boolean;
    /** Flag to display the total as "Subtotal" rather than "Total" */
    isSubtotalLabel?: boolean;
    /** Optional className to apply to the Total|Subtotal label */
    totalLabelClassName?: string;
}

export interface BasePriceTextProps extends PriceTextProps {
    /** The React component to render.  Either `StaticCurrency` or `DynamicCurrency` */
    currencyComponent: React.ElementType;
}

/**
 * ### BasePriceText
 *
 * @internal
 * This should only be used as the core component for {@link StaticPriceText}
 * and {@link DynamicPriceText}.
 */
export const BasePriceText = ({
    className = '',
    currencyComponent: CurrencyComponent,
    discountPrice,
    discountPriceClassName = '',
    discountPriceString,
    listPrice,
    listPriceClassName = '',
    listPriceString,
    percentDiscount,
    percentDiscountClassName = '',
    showListPriceOnly,
    showPercentDiscount,
    showTotalLabel,
    isSubtotalLabel,
    totalLabelClassName,
    onView,
}: BasePriceTextProps) => {
    const {gettext, interpolate} = useI18n();

    const withDefaultFontClass = (defaultFontClass: string, ...classes: string[]) => {
        const classList = classNames(...classes).split(' ');
        const hasFontClass = classList.some((cls) => {
            return cls.startsWith('ud-heading-') || cls.startsWith('ud-text-');
        });
        return classNames(classList, hasFontClass ? '' : defaultFontClass);
    };

    const onImpression = () => {
        onView?.();
    };

    const defaultDiscountPriceFontClass = 'ud-heading-md';
    const defaultListPriceFontClass = 'ud-text-sm';
    const defaultPercentDiscountFontClass = 'ud-text-sm';

    const containerStyles = withDefaultFontClass('', styles.container, className);
    const discountPriceStyles = withDefaultFontClass(
        defaultDiscountPriceFontClass,
        styles['price-part'],
        discountPriceClassName,
    );
    const originalPriceStyles = withDefaultFontClass(
        defaultListPriceFontClass,
        styles['price-part'],
        styles['original-price'],
        listPriceClassName,
    );
    const percentageStyles = withDefaultFontClass(
        defaultPercentDiscountFontClass,
        styles['price-part'],
        percentDiscountClassName,
    );
    return (
        <TrackImpression trackFunc={onImpression}>
            <div className={containerStyles} data-purpose="price-text-container">
                {showTotalLabel && (
                    <div className={totalLabelClassName} data-purpose="course-price-total-label">
                        {isSubtotalLabel ? gettext('Subtotal:') : gettext('Total:')}
                    </div>
                )}
                {(showListPriceOnly || discountPrice === 0 || discountPrice) && (
                    <div className={discountPriceStyles} data-purpose="course-price-text">
                        <span className="ud-sr-only">{gettext('Current price')}</span>
                        <span>
                            {showListPriceOnly && (
                                <CurrencyComponent value={listPriceString || listPrice} />
                            )}
                            {!showListPriceOnly && discountPrice !== 0 && (
                                <CurrencyComponent value={discountPriceString || discountPrice} />
                            )}
                            {!showListPriceOnly && discountPrice === 0 && gettext('Free')}
                        </span>
                    </div>
                )}
                {!showListPriceOnly && listPrice > discountPrice && (
                    <div className={originalPriceStyles} data-purpose="original-price-container">
                        <div data-purpose="course-old-price-text">
                            <span className="ud-sr-only">{gettext('Original Price')}</span>
                            <span>
                                <s>
                                    <CurrencyComponent value={listPriceString || listPrice} />
                                </s>
                            </span>
                        </div>
                    </div>
                )}
                {!showListPriceOnly &&
                    showPercentDiscount &&
                    percentDiscount &&
                    (percentDiscount ?? 0) && (
                        <div className={percentageStyles} data-purpose="discount-percentage">
                            <span className="ud-sr-only">{gettext('Discount')}</span>
                            <span>
                                {interpolate(
                                    gettext('%(percentDiscount)s% off'),
                                    {percentDiscount},
                                    true,
                                )}
                            </span>
                        </div>
                    )}
            </div>
        </TrackImpression>
    );
};
