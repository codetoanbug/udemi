import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AsyncCourseStaticPriceText from 'base-components/price-text/async-course-static-price-text.react-component';
import BrowseCourseCard from 'browse/components/course-card/browse-course-card.react-component';

export default class AsyncPriceCourseCard extends Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
    };

    renderWithAsyncCourseStaticPrice = (StaticPriceTextComponent, priceTextProps) => {
        // AsyncCourseStaticPriceText derives these props internally from `course`, so
        // pluck them lest they overwrite AsyncCourseStaticPriceText.
        const {
            listPrice,
            discountPrice,
            listPriceString,
            discountPriceString,
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
