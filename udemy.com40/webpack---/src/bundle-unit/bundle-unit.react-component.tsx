import classNames from 'classnames';
import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import React, {ComponentType, ReactNode} from 'react';

import {
    AsyncCourseDynamicPriceText,
    AsyncPriceCourseCard,
    BrowseCourse,
    BrowseCourseCard,
    BrowseCourseCardContext,
} from '@udemy/browse-course';
import {discoveryTracker} from '@udemy/browse-event-tracking';
import {DiscoveryUnit, DiscoveryUnitItem} from '@udemy/discovery-api';
import {TrackingContextProvider} from '@udemy/event-tracking';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import OfferIcon from '@udemy/icons/dist/offer.ud-icon';
import {AlertBanner} from '@udemy/react-messaging-components';
import {PURCHASE_PRICE_TYPES} from '@udemy/shopping';
import {withUDData, WithUDDataProps} from '@udemy/ud-data';

import {AddToCart} from '../add-to-cart/add-to-cart.react-component';
import {UnitTitle} from '../unit-title/unit-title.react-component';
import {BundleUnitSkeleton} from './bundle-unit-skeleton.react-component';
import {BundleUnitStore} from './bundle-unit.mobx-store';
import styles from './bundle-unit.module.less';

export interface BundleUnitProps extends WithI18nProps, WithUDDataProps {
    titleTypography?: string;
    unit?: DiscoveryUnit;
    context?: {
        fbt_add_to_cart: boolean;
    };
    allowAddToCartSuccessModal?: boolean;
    forceGoToCart?: boolean;
    pageType: string;
    pageObjectId: number | string;
    applyBorder?: boolean;
}

@observer
export class InternalBundleUnit extends React.Component<BundleUnitProps> {
    static defaultProps = {
        titleTypography: undefined,
        unit: undefined,
        applyBorder: true,
        context: {
            fbt_add_to_cart: true,
        },
        allowAddToCartSuccessModal: true,
        forceGoToCart: false,
    };

    bundleUnitStore: BundleUnitStore;

    constructor(props: BundleUnitProps) {
        super(props);
        const {pageType, pageObjectId, udData, unit} = props;
        this.bundleUnitStore = new BundleUnitStore(pageType, pageObjectId, udData, unit);
    }

    componentDidMount() {
        this.bundleUnitStore.fetchData();
    }

    renderInContainer(content: ReactNode) {
        if (!this.props.applyBorder) {
            return content;
        }
        return (
            <div className={styles['bundle-border']} data-testid="bundle-border">
                {content}
            </div>
        );
    }

    getCartButtonTextAdd() {
        const {gettext} = this.props;
        if (this.getForceGoToCart()) {
            return gettext('Add all and go to cart');
        }
        return gettext('Add all to cart');
    }

    getCartButtonTextGoToCart() {
        const {gettext} = this.props;
        if (this.getForceGoToCart()) {
            return gettext('Going to cart');
        }
        return gettext('Go to cart');
    }

    getForceGoToCart() {
        if (this.bundleUnitStore.unit?.fbt_go_direct_to_cart) {
            return this.props.forceGoToCart;
        }
        return false;
    }

    renderCourseCardImage = <TProps extends {className?: string}>(
        ImageComponent: ComponentType<TProps>,
        props: TProps,
    ) => {
        return (
            <ImageComponent
                {...props}
                className={classNames(props.className, styles['course-unit-image'])}
            />
        );
    };

    renderUnit() {
        const {gettext, interpolate} = this.props;

        if (!this.bundleUnitStore.unit) {
            return null;
        }
        return (
            <>
                <UnitTitle
                    typography={this.props.titleTypography}
                    unit={this.bundleUnitStore?.unit}
                />
                <div className={styles['course-container']}>
                    {this.bundleUnitStore.unit?.items.map(
                        (course: DiscoveryUnitItem, i: number) => {
                            const plusIcon = i > 0 && (
                                <div className={styles['plus-icon-wrapper']}>
                                    <ExpandPlusIcon size="large" label={false} />
                                </div>
                            );
                            return (
                                <TrackingContextProvider
                                    key={course.id}
                                    trackingContext={{
                                        trackImpressionFunc:
                                            discoveryTracker.trackDiscoveryImpression,
                                        backendSource: this.bundleUnitStore.backendSource,
                                        index: i,
                                    }}
                                >
                                    <div className={styles['course-unit-container']}>
                                        <BrowseCourseCardContext.Provider
                                            value={{
                                                cardComponent:
                                                    BrowseCourseCard.defaultCardComponent,
                                            }}
                                        >
                                            <AsyncPriceCourseCard
                                                // WARNING: this type assertion could hide bugs:
                                                course={course as BrowseCourse}
                                                size="large"
                                                className={styles['bundle-course-card']}
                                                priceProps={{
                                                    showListPriceOnly: false,
                                                    listPriceClassName: 'bundle-course-price',
                                                }}
                                                showDetails={false}
                                                renderCourseImage={this.renderCourseCardImage}
                                            />
                                        </BrowseCourseCardContext.Provider>
                                        {plusIcon}
                                    </div>
                                </TrackingContextProvider>
                            );
                        },
                    )}
                </div>
                {this.bundleUnitStore.unit?.fbt_discount_savings_percent && (
                    <AlertBanner
                        className={styles['fbt-discount-banner']}
                        title={interpolate(
                            gettext('Save an extra %(rate)s% in cart when you buy these together'),
                            {rate: this.bundleUnitStore.unit.fbt_discount_savings_percent},
                            true,
                        )}
                        icon={<OfferIcon label={false} />}
                        showCta={false}
                    />
                )}
                <div className={styles['footer-container']}>
                    <div className={styles['price-text-container']}>
                        <span className={classNames('ud-text-lg', styles['price-text-prefix'])}>
                            {gettext('Total:')}{' '}
                        </span>
                        <AsyncCourseDynamicPriceText
                            courses={this.bundleUnitStore.unit.items}
                            listPriceClassName="ud-text-md"
                            discountPriceClassName="ud-heading-lg"
                            trackingEventContext={{
                                priceType: PURCHASE_PRICE_TYPES.bundle,
                            }}
                        />
                    </div>
                    <AddToCart
                        buyables={toJS(this.bundleUnitStore.unit?.items)}
                        addToCartContext={this.props.context}
                        cartButtonTextAdd={this.getCartButtonTextAdd()}
                        className={styles['add-to-cart']}
                        allowAddToCartSuccessModal={this.props.allowAddToCartSuccessModal}
                        forceGoToCart={this.getForceGoToCart()}
                        cartButtonTextGoToCart={this.getCartButtonTextGoToCart()}
                    />
                </div>
            </>
        );
    }

    render() {
        if (this.bundleUnitStore.loading) {
            return this.renderInContainer(<BundleUnitSkeleton />);
        }

        if (!this.bundleUnitStore.unit?.items?.length) {
            return null;
        }

        return <div data-purpose="bundle-wrapper">{this.renderInContainer(this.renderUnit())}</div>;
    }
}

export const BundleUnit = withI18n(withUDData(InternalBundleUnit));
