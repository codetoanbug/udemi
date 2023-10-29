import {StarRating} from '@udemy/react-merchandising-components';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';
import {formatNumber} from 'utils/numeral';

import './styles.less';

interface RatingProps {
    hasDarkBackground: boolean;
    num_reviews: number;
    rating: number;
    showRatingsCount: boolean;
    showStars: boolean;
    clickableRatingsEnabled: boolean;
}

@isomorphic
export class Rating extends React.Component<RatingProps> {
    static defaultProps = {
        hasDarkBackground: false,
        showRatingsCount: true,
        showStars: true,
        clickableRatingsEnabled: false,
    };

    get reviewCount() {
        return ninterpolate(
            '(%(numReviews)s rating)',
            '(%(numReviews)s ratings)',
            this.props.num_reviews,
            {numReviews: formatNumber(this.props.num_reviews)},
        );
    }

    render() {
        const {showStars, showRatingsCount, clickableRatingsEnabled} = this.props;
        const ratings = (
            <>
                <StarRating
                    showNumber={true}
                    rating={this.props.rating}
                    numeric={!showStars}
                    hasDarkBackground={this.props.hasDarkBackground}
                />{' '}
                {showRatingsCount && <span>{this.reviewCount}</span>}
            </>
        );
        return clickableRatingsEnabled ? (
            <a href="#reviews" styleName="rating-wrapper" data-purpose="rating">
                {ratings}
            </a>
        ) : (
            <div styleName="rating-wrapper" data-purpose="rating">
                {ratings}
            </div>
        );
    }
}

export {Rating as default};
