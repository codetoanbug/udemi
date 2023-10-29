import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {discoveryTracker, DiscoveryItemImpressionEvent} from '@udemy/browse-event-tracking';
import {GenericAddToCart} from '@udemy/cart';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {DynamicPriceText} from '@udemy/react-merchandising-components';
import {CourseCardSkeletonGroup, Loader} from '@udemy/react-reveal-components';
import {formatCurrency, serverOrClient} from '@udemy/shared-utils';
import {
    shoppingItemTypes,
    ShoppingList,
    ShoppingItem as ShoppingItemType,
    trackPriceImpression,
    ShoppingClientStore,
} from '@udemy/shopping';
import {useUDData} from '@udemy/ud-data';

import {PURCHASE_PRICE_TYPES} from '../../constants';
import menuStyles from '../panel-menu.module.less';
import {ShoppingItem} from './shopping-item.react-component';
import styles from './shopping-items.module.less';

export interface ShoppingItemsProps {
    shoppingClient: ShoppingClientStore;
    shoppingList?: ShoppingList;
    cta: {
        text: string;
        url: string;
    };
    scroll: {
        itemCount: number;
        maxHeight: string;
    };
    zeroState: {
        text: string;
        cta: {
            text: string;
            url: string;
        };
    };
    showAddToCart?: boolean;
    showTotal?: boolean;
}

export const ShoppingItems = observer(
    ({
        shoppingClient,
        shoppingList,
        cta,
        scroll,
        zeroState,
        showAddToCart,
        showTotal = true,
    }: ShoppingItemsProps) => {
        const {gettext} = useI18n();
        const {Config} = useUDData();

        const totalDue = Math.max(
            (shoppingList?.purchasePriceAmount ?? 0) - shoppingClient.credit.amount,
            0,
        );

        const priceProps = {
            discountPrice: totalDue,
            listPrice: shoppingList?.listPriceAmount ?? 0,
        };

        const trackPriceView = () => {
            trackPriceImpression({
                ...priceProps,
                currency: Config.price_country.currency,
                trackingEventContext: {
                    priceType: PURCHASE_PRICE_TYPES.total,
                },
            });
        };

        const renderSkeleton = () => {
            return (
                <div className={menuStyles['panel']}>
                    <CourseCardSkeletonGroup
                        size="small"
                        style={{width: '25.6rem', maxWidth: '25.6rem', minWidth: '25.6rem'}}
                        imageStyle={{width: '6.4rem', height: '6.4rem'}}
                        lineCount={3}
                        cardCountPerRow={1}
                        rowCount={2}
                        data-testid="skeleton"
                    />
                </div>
            );
        };

        const renderZeroItems = () => {
            const {cta, text} = zeroState;
            return (
                <div className={menuStyles['panel']}>
                    <div
                        className={`ud-text-md ${menuStyles['gap-bottom']} ${menuStyles['no-items']}`}
                    >
                        {text}
                    </div>
                    <a className="ud-heading-sm" data-testid="header-shopping-cta" href={cta.url}>
                        {cta.text}
                    </a>
                </div>
            );
        };

        const renderItemsOfType = (itemsOfType: ShoppingItemType[], key: number) => {
            return (
                <React.Fragment key={key}>
                    {itemsOfType.map((item, i) => {
                        const trackingContext = {
                            trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                            index: i,
                            backendSource:
                                DiscoveryItemImpressionEvent.backendSourceOptions.SHOPPING_CARTS,
                        };
                        if (showAddToCart && item.list_price.amount > 0) {
                            return (
                                <div
                                    key={i}
                                    className={`${menuStyles['item']} ${styles['item-wrapper']}`}
                                >
                                    <ShoppingItem item={item} trackingContext={trackingContext} />
                                    <GenericAddToCart
                                        allowAddToCartSuccessModal={false}
                                        buttonClass={Button}
                                        buttonStyleProps={{udStyle: 'secondary', size: 'medium'}}
                                        buyables={[item.buyable]}
                                        cartButtonTextAdd={gettext('Add to cart')}
                                        loader={<Loader color="inherit" size="medium" />}
                                        notificationStyle="ud-heading-sm"
                                        shoppingClient={shoppingClient}
                                    />
                                </div>
                            );
                        }
                        return (
                            <ShoppingItem
                                key={i}
                                item={item}
                                className={menuStyles['item']}
                                trackingContext={trackingContext}
                            />
                        );
                    })}
                </React.Fragment>
            );
        };

        const renderFooter = (scrollable: boolean) => {
            const showAction = serverOrClient.global.location.pathname !== cta.url;
            if (!showTotal && !showAction) {
                return null;
            }
            return (
                <div
                    className={classNames(menuStyles['footer'], {
                        [styles['sticky-footer']]: scrollable,
                    })}
                >
                    {showTotal && shoppingList && (
                        <div
                            className={`ud-heading-lg ${styles['total']}`}
                            data-testid="header-shopping-total"
                        >
                            <div>{gettext('Total:')}&nbsp;</div>
                            <DynamicPriceText
                                discountPriceClassName="ud-heading-lg"
                                listPriceClassName="ud-text-md"
                                onView={trackPriceView}
                                {...priceProps}
                            />
                        </div>
                    )}
                    {showAction && (
                        <Button
                            componentClass="a"
                            data-testid="header-shopping-cta"
                            href={cta.url}
                            udStyle="primary"
                            className={menuStyles['cta']}
                        >
                            {cta.text}
                        </Button>
                    )}
                </div>
            );
        };

        const renderCredit = () => {
            return (
                shoppingClient.credit.amount > 0 && (
                    <div className={styles['credit']}>
                        <span>{gettext('Credit balance')}</span>
                        <span>{formatCurrency(shoppingClient.credit.amount)}</span>
                    </div>
                )
            );
        };

        if (!shoppingList) {
            return renderSkeleton();
        }
        if (shoppingList.isEmpty) {
            return (
                <>
                    {renderZeroItems()}
                    {renderCredit()}
                </>
            );
        }

        const allItems: ShoppingItemType[][] = [];
        let allItemsCount = 0;
        shoppingItemTypes.forEach((itemType) => {
            const itemsOfType: ShoppingItemType[] = [];
            shoppingList?.items.forEach((item) => {
                if (item.buyable.buyable_object_type === itemType.type) {
                    itemsOfType.push(...itemType.buildShoppingItems(item));
                }
            });
            allItems.push(itemsOfType);
            allItemsCount += itemsOfType.length;
        });

        const scrollable = allItemsCount > scroll.itemCount;

        return (
            <>
                <div
                    className={classNames({[styles['scrollable']]: scrollable})}
                    style={{maxHeight: scroll.maxHeight}}
                >
                    {allItems.map((itemsOfType, i) => renderItemsOfType(itemsOfType, i))}
                </div>
                {renderFooter(scrollable)}
                {renderCredit()}
            </>
        );
    },
);
