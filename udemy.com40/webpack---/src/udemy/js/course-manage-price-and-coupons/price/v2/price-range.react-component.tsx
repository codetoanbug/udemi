import {inject, observer} from 'mobx-react';
import React from 'react';

import {
    PRICE_RANGE_ERROR_TEXT,
    PRICE_RANGE_NON_FREE_LINE_ONE,
    PRICE_RANGE_NON_FREE_LINE_TWO,
    PRICE_RANGE_TEXT,
    PRICE_RANGE_TO_BE_COMPUTED_YET_TEXT,
    PURCHASE_PRICE_RANGE_HEADING_TEXT,
} from './messages';
import {PriceStoreAwareProps} from './opted-in-deals.react-component';

import './price.less';

export const PriceRangeContainer = inject('priceStore')(
    observer(({priceStore}: PriceStoreAwareProps) => {
        if (!priceStore.course.is_published) {
            return <></>;
        }
        if (priceStore.form.priceRange.isPriceRangeCallSuccess) {
            const minListPrice = priceStore.form.priceRange.minListPrice;
            const maxListPrice = priceStore.form.priceRange.maxListPrice;
            if (minListPrice == undefined && maxListPrice == undefined) {
                return (
                    <>
                        <div styleName="course-pricing-deals-panel-bottom">
                            <div>{PURCHASE_PRICE_RANGE_HEADING_TEXT}</div>
                            <p styleName="price-range-to-be-computed">
                                {PRICE_RANGE_TO_BE_COMPUTED_YET_TEXT}
                            </p>
                        </div>
                    </>
                );
            } else if (
                minListPrice.price_string.toLowerCase() != 'free' &&
                maxListPrice.price_string.toLowerCase() != 'free'
            ) {
                return (
                    <>
                        <div styleName="course-pricing-deals-panel-bottom">
                            <div>{PURCHASE_PRICE_RANGE_HEADING_TEXT}</div>
                            <div styleName="price-range">
                                {interpolate(PRICE_RANGE_TEXT, [
                                    minListPrice.price_string,
                                    maxListPrice.price_string,
                                ])}
                            </div>
                            <p styleName="price-range-non-free">{PRICE_RANGE_NON_FREE_LINE_ONE}</p>
                            <p styleName="price-range-non-free">{PRICE_RANGE_NON_FREE_LINE_TWO}</p>
                        </div>
                    </>
                );
            }

            return <></>;
        }
        return (
            <>
                <div styleName="course-pricing-deals-panel-bottom">
                    <div>{PURCHASE_PRICE_RANGE_HEADING_TEXT}</div>
                    <p styleName="price-range-error">{PRICE_RANGE_ERROR_TEXT}</p>
                </div>
            </>
        );
    }),
);
