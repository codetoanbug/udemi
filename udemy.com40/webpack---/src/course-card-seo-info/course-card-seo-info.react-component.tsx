import {observer} from 'mobx-react';
import React from 'react';

import {useI18n, useFormatNumber} from '@udemy/i18n';
import {getNumLecturesText, getPriceInfo} from '@udemy/react-card-components';
import {useStores} from '@udemy/store-provider';

import {CoursePriceStore, PriceStatus} from '../course-price-store/course-price-store';

interface PriceInfo {
    amount?: number;
    price_string?: string;
}

interface PriceObject {
    discount?: {price: PriceInfo} | null;
    price_detail?: PriceInfo;
}

export interface CourseCardSeoInfoProps {
    course: {
        content_info?: string;
        headline: string;
        id: number;
        instructional_level_simple?: string;
        num_published_lectures?: number;
        num_reviews: number;
        rating: number;
    } & PriceObject;
}

/**
 * Component to render hidden course detail elements for SEO. For the course price, it
 * first checks to see if the course prop has pricing info. If it does, that info is used.
 * Otherwise, it looks at the CoursePriceStore to find pricing info for the course. This scenario
 * is the most common since we typically load course prices asynchronously.
 */
export const CourseCardSeoInfo = observer(({course}: CourseCardSeoInfoProps) => {
    const {gettext, interpolate, ninterpolate} = useI18n();
    const {formatNumber} = useFormatNumber();
    const [coursePriceStore] = useStores([CoursePriceStore]);

    let priceSeoNodes: React.ReactNode[] = [];
    if (course.discount || course.price_detail) {
        priceSeoNodes = getPriceNodes(course);
    } else {
        const coursePrice = coursePriceStore.priceMap.get(course.id);
        if (coursePrice && coursePrice.status === PriceStatus.PRICE_STATUS_LOADED) {
            priceSeoNodes = getPriceNodes(coursePrice);
        }
    }

    function getNumReviewsAriaLabel(numReviews: number) {
        return ninterpolate('%(count)s review', '%(count)s reviews', numReviews, {
            count: numReviews,
        });
    }

    function getRatingAriaLabel(rating: number, total: number) {
        const label = gettext('Rating: %(rating)s out of %(total)s');
        return interpolate(
            label,
            {
                rating: formatNumber(Number(rating), {
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                }),
                total,
            },
            true,
        );
    }

    function getPriceNodes(priceObject: PriceObject) {
        const priceInfo = getPriceInfo(priceObject);
        const nodes: React.ReactNode[] = [];
        if (priceInfo.discountPrice && priceInfo.discountPriceString) {
            if (priceInfo.discountPrice === 0) {
                nodes.push(
                    <span key="current" data-testid="seo-current-price">
                        {gettext('Free')}
                    </span>,
                );
            } else {
                nodes.push(
                    <span key="current" data-testid="seo-current-price">
                        {`${gettext('Current price')}: ${priceInfo.discountPriceString}`}
                    </span>,
                );
            }

            if (
                priceInfo.listPrice &&
                priceInfo.listPriceString &&
                priceInfo.listPrice > priceInfo.discountPrice
            ) {
                nodes.push(
                    <span key="original" data-testid="seo-original-price">
                        {`${gettext('Original price')}: ${priceInfo.listPriceString}`}
                    </span>,
                );
            }
        }

        return nodes;
    }

    return (
        <div className="ud-sr-only" aria-hidden={true}>
            <span data-testid="seo-headline">{course.headline}</span>
            <span data-testid="seo-rating">{getRatingAriaLabel(course.rating, 5)}</span>
            <span data-testid="seo-num-reviews">{getNumReviewsAriaLabel(course.num_reviews)}</span>
            {!!course.content_info && (
                <span data-testid="seo-content-info">{course.content_info}</span>
            )}
            {!!course.num_published_lectures && (
                <span data-testid="seo-num-lectures">
                    {getNumLecturesText(course.num_published_lectures, {ninterpolate})}
                </span>
            )}
            {!!course.instructional_level_simple && (
                <span data-testid="seo-instructional-level">
                    {course.instructional_level_simple}
                </span>
            )}
            {priceSeoNodes}
        </div>
    );
});
