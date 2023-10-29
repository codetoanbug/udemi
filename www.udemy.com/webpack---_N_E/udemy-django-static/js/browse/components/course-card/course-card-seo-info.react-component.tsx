import {useI18n, useFormatNumber} from '@udemy/i18n';
import {observer} from 'mobx-react';
import React from 'react';

import {
    getNumLecturesText,
    getNumReviewsAriaLabel,
    getPriceInfo,
} from 'udemy-django-static/js/base-components/course-card/course-card.react-component';
import coursePriceStore, {PRICE_STATUS_LOADED} from 'udemy-django-static/js/course-price-store//course-price-store';

interface PriceInfo {
    amount?: number;
    price_string?: string;
}

interface PriceObject {
    discount?: {price: PriceInfo};
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

    let priceSeoNodes: React.ReactNode[] = [];
    if (course.discount || course.price_detail) {
        priceSeoNodes = getPriceNodes(course);
    } else {
        const coursePrice = coursePriceStore.priceMap.get(course.id);
        if (coursePrice && coursePrice.status === PRICE_STATUS_LOADED) {
            priceSeoNodes = getPriceNodes(coursePrice);
        }
    }

    const getRatingAriaLabel = (rating: number, total: number) => {
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
    };

    function getPriceNodes(priceObject: PriceObject) {
        const priceInfo = getPriceInfo(priceObject);
        const nodes: React.ReactNode[] = [];
        if (priceInfo.discountPrice && priceInfo.discountPriceString) {
            if (priceInfo.discountPrice === 0) {
                nodes.push(
                    <span key="current" data-purpose="seo-current-price">
                        {gettext('Free')}
                    </span>,
                );
            } else {
                nodes.push(
                    <span key="current" data-purpose="seo-current-price">
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
                    <span key="original" data-purpose="seo-original-price">
                        {`${gettext('Original price')}: ${priceInfo.listPriceString}`}
                    </span>,
                );
            }
        }

        return nodes;
    }

    return (
        <div className="ud-sr-only" aria-hidden={true}>
            <span data-purpose="seo-headline">{course.headline}</span>
            <span data-purpose="seo-rating">{getRatingAriaLabel(course.rating, 5)}</span>
            <span data-purpose="seo-num-reviews">
                {getNumReviewsAriaLabel(course.num_reviews, {ninterpolate})}
            </span>
            {!!course.content_info && (
                <span data-purpose="seo-content-info">{course.content_info}</span>
            )}
            {!!course.num_published_lectures && (
                <span data-purpose="seo-num-lectures">
                    {getNumLecturesText(course.num_published_lectures, {ninterpolate})}
                </span>
            )}
            {!!course.instructional_level_simple && (
                <span data-purpose="seo-instructional-level">
                    {course.instructional_level_simple}
                </span>
            )}
            {priceSeoNodes}
        </div>
    );
});
