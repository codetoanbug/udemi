import React from 'react';

import {discoveryTracker} from '@udemy/browse-event-tracking';
import {TrackImpression, trackGenericCourseClick} from '@udemy/event-tracking';
import {Image} from '@udemy/react-core-components';
import {StaticPriceText} from '@udemy/react-merchandising-components';
import {ItemCard} from '@udemy/react-structure-components';
import {ShoppingItem as ShoppingItemType, trackPriceImpression} from '@udemy/shopping';
import {useUDData} from '@udemy/ud-data';

import {PURCHASE_PRICE_TYPES} from '../../constants';
import styles from './shopping-item.module.less';

interface ShoppingItemProps {
    className?: string;
    item: ShoppingItemType;
    trackingContext?: {
        trackImpressionFunc: typeof discoveryTracker.trackDiscoveryImpression;
    };
}

export const ShoppingItem = ({className, item, trackingContext}: ShoppingItemProps) => {
    const {Config} = useUDData();

    const trackImpression = () => {
        if (trackingContext && item.buyable && 'course' === item.buyable.buyable_object_type) {
            const {trackImpressionFunc, ...trackingContextRest} = trackingContext;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            trackImpressionFunc({item: item.buyable}, trackingContextRest as any);
        }
    };

    const trackClick = () => {
        if (item.buyable && 'course' === item.buyable.buyable_object_type) {
            const course = item.buyable;
            trackGenericCourseClick({
                courseId: course.id,
                courseTrackingId:
                    course.frontendTrackingId ??
                    course.tracking_id ??
                    course.trackingId ??
                    String(course.id),
                componentName: 'shoppingItem',
            });
        }
    };

    const priceProps = {
        discountPrice: item.purchase_price.amount,
        discountPriceString: item.purchase_price.price_string,
        listPrice: item.list_price.amount,
        listPriceString: item.list_price.price_string,
    };

    const trackPriceView = () => {
        trackPriceImpression({
            ...priceProps,
            currency: Config.price_country.currency,
            trackingEventContext: {
                buyableId: item.buyable.id,
                priceType: PURCHASE_PRICE_TYPES.individual_shopping_buyable,
                buyableType: item.buyable.type,
                priceServeTrackingId: item.price_serve_tracking_id,
            },
        });
    };

    return (
        <TrackImpression trackFunc={trackImpression}>
            <ItemCard className={className} onContextMenu={trackClick} data-testid="shopping-item">
                <ItemCard.ImageWrapper>
                    <Image src={item.buyable.image_100x100} alt="" width={100} height={100} />
                </ItemCard.ImageWrapper>
                <div className={styles['buyable-info']}>
                    <ItemCard.Title
                        className={`ud-heading-sm ${styles['buyable-title']}`}
                        href={item.buyable.url}
                        onClick={trackClick}
                    >
                        {item.buyable.title}
                    </ItemCard.Title>
                    <div className={`ud-text-xs ${styles['buyable-instructors']}`}>
                        {(item.buyable.visible_instructors ?? [])
                            .map((instructor) => instructor.title)
                            .join(', ')}
                    </div>
                    <StaticPriceText
                        discountPriceClassName="ud-heading-sm"
                        listPriceClassName="ud-text-xs"
                        onView={trackPriceView}
                        {...priceProps}
                    />
                </div>
            </ItemCard>
        </TrackImpression>
    );
};
