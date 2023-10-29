import PropTypes from 'prop-types';
import React, {Component, ComponentType} from 'react';

import {
    BrowseCourseCard,
    BrowseCourseCardProps,
} from '../browse-course-card/browse-course-card.react-component';
import {AsyncCourseStaticPriceText} from '../price-text/async-course-static-price-text.react-component';
import {PriceTextProps} from '../price-text/with-price-text-tracking.react-component';

export class AsyncPriceCourseCard extends Component<BrowseCourseCardProps> {
    static propTypes = {
        course: PropTypes.object.isRequired,
    };

    renderWithAsyncCourseStaticPrice = (
        StaticPriceTextComponent: ComponentType<PriceTextProps>,
        priceTextProps: PriceTextProps,
    ) => {
        // AsyncCourseStaticPriceText derives these props internally from `course`, so
        // pluck them lest they overwrite AsyncCourseStaticPriceText.
        const {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            listPrice,
            discountPrice,
            listPriceString,
            discountPriceString,
            /* eslint-enable @typescript-eslint/no-unused-vars */
            ...additionalPriceTextProps
        } = priceTextProps;

        return (
            <AsyncCourseStaticPriceText
                courses={[this.props.course]}
                {...additionalPriceTextProps}
            />
        );
    };

    render() {
        return (
            <BrowseCourseCard
                renderPriceText={this.renderWithAsyncCourseStaticPrice}
                {...this.props}
            />
        );
    }
}
