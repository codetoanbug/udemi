/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {FunnelLogContextStore} from '@udemy/funnel-tracking';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import classNames from 'classnames';
import {when} from 'mobx';
import {inject} from 'mobx-react';
import React from 'react';

import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

import {PriceImpressionEvent, PriceImpressionEventContext} from './price-impression-event';
import styles from './price-text.less';

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
    /** Event handler to call when the `TrackImpression` wrapping the core of this component is viewed. */
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
    /** Event context to pass on to the PriceImpression event */
    trackingEventContext?: Omit<
        PriceImpressionEventContext,
        'listPrice' | 'discountPrice' | 'displayedPrice'
    >;
    /** Optional className to apply to the Total|Subtotal label */
    totalLabelClassName?: string;
}

export interface BasePriceTextProps extends PriceTextProps {
    /**
     * The context for the FunnelLog
     *
     * @deprecated
     * This is due for a refactor as FunnelLog has been deprecated.
     */
    funnelLogContextStore?: FunnelLogContextStore;
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
@inject(({funnelLogContextStore}) => ({funnelLogContextStore}))
class BasePriceText extends React.Component<BasePriceTextProps & WithI18nProps> {
    static defaultDiscountPriceFontClass = 'ud-heading-md';
    static defaultListPriceFontClass = 'ud-text-sm';
    static defaultPercentDiscountFontClass = 'ud-text-sm';

    withDefaultFontClass(defaultFontClass: string, ...classes: string[]) {
        const classList = classNames(...classes).split(' ');
        const hasFontClass = classList.some((cls) => {
            return cls.startsWith('ud-heading-') || cls.startsWith('ud-text-');
        });
        return classNames(classList, hasFontClass ? '' : defaultFontClass);
    }

    properRoundPriceToString(n: number) {
        return (Math.round((n + Number.EPSILON || 0) * 100) / 100).toFixed(2);
    }

    onView = async () => {
        this.props.onView?.();

        await when(() => !udMe.isLoading);

        if (this.props.trackingEventContext) {
            const listPrice = this.properRoundPriceToString(this.props.listPrice);
            const discountPrice = this.properRoundPriceToString(this.props.discountPrice);
            const displayedPrice =
                (!this.props.showListPriceOnly &&
                    (this.props.discountPriceString || discountPrice || '0')) ||
                this.props.listPriceString ||
                listPrice;

            const context = {
                priceServeTrackingId: this.props.trackingEventContext.priceServeTrackingId,
                context: this.props.funnelLogContextStore?.context,
                listPrice,
                discountPrice,
                displayedPrice,
                buyableType: this.props.trackingEventContext.buyableType,
                buyableId: this.props.trackingEventContext.buyableId,
                priceType: this.props.trackingEventContext.priceType,
                buyableTrackingId: this.props.trackingEventContext.buyableTrackingId,
                currency: getConfigData().price_country.currency,
            };
            const priceEvent = new PriceImpressionEvent({context});
            Tracker.publishEvent(priceEvent);
        }
    };

    render() {
        const {
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
        } = this.props;
        const containerStyles = this.withDefaultFontClass('', styles.container, className);
        const discountPriceStyles = this.withDefaultFontClass(
            BasePriceText.defaultDiscountPriceFontClass,
            styles['price-part'],
            discountPriceClassName,
        );
        const originalPriceStyles = this.withDefaultFontClass(
            BasePriceText.defaultListPriceFontClass,
            styles['price-part'],
            styles['original-price'],
            listPriceClassName,
        );
        const percentageStyles = this.withDefaultFontClass(
            BasePriceText.defaultPercentDiscountFontClass,
            styles['price-part'],
            percentDiscountClassName,
        );
        return (
            <TrackImpression trackFunc={this.onView}>
                <div className={containerStyles} data-purpose="price-text-container">
                    {showTotalLabel && (
                        <div
                            className={totalLabelClassName}
                            data-purpose="course-price-total-label"
                        >
                            {isSubtotalLabel
                                ? this.props.gettext('Subtotal:')
                                : this.props.gettext('Total:')}
                        </div>
                    )}
                    {(showListPriceOnly || discountPrice === 0 || discountPrice) && (
                        <div className={discountPriceStyles} data-purpose="course-price-text">
                            <span className="ud-sr-only">
                                {this.props.gettext('Current price')}
                            </span>
                            <span>
                                {showListPriceOnly && (
                                    <CurrencyComponent value={listPriceString || listPrice} />
                                )}
                                {!showListPriceOnly && discountPrice !== 0 && (
                                    <CurrencyComponent
                                        value={discountPriceString || discountPrice}
                                    />
                                )}
                                {!showListPriceOnly &&
                                    discountPrice === 0 &&
                                    this.props.gettext('Free')}
                            </span>
                        </div>
                    )}
                    {!showListPriceOnly && listPrice > discountPrice && (
                        <div
                            className={originalPriceStyles}
                            data-purpose="original-price-container"
                        >
                            <div data-purpose="course-old-price-text">
                                <span className="ud-sr-only">
                                    {this.props.gettext('Original Price')}
                                </span>
                                <span>
                                    <s>
                                        <CurrencyComponent value={listPriceString || listPrice} />
                                    </s>
                                </span>
                            </div>
                        </div>
                    )}
                    {!showListPriceOnly && showPercentDiscount && (percentDiscount ?? 0) > 0 && (
                        <div className={percentageStyles} data-purpose="discount-percentage">
                            <span className="ud-sr-only">{this.props.gettext('Discount')}</span>
                            <span>
                                {this.props.interpolate(
                                    this.props.gettext('%(percentDiscount)s% off'),
                                    {percentDiscount},
                                    true,
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </TrackImpression>
        );
    }
}

// eslint-disable-next-line import/no-default-export
export default withI18n(BasePriceText);
