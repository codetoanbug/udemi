import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import {Button} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ReviewModal from './review-modal.react-component';

@observer
export default class AltLeaveRating extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        numStars: PropTypes.number,
        udStyle: PropTypes.string,
    };

    static defaultProps = {
        numStars: undefined,
        udStyle: 'ghost',
    };

    @autobind
    onMouseEnter() {
        this.props.store.setIsFocused(true);
    }

    @autobind
    onMouseLeave() {
        this.props.store.setIsFocused(false);
    }

    @autobind
    onRatingClick(e) {
        this.props.store.onStartReview();
        e.preventDefault();
    }

    render() {
        const {store, numStars, ...props} = this.props;

        let starRating = null;
        if (numStars === 1) {
            starRating = <RatingStarIcon label={false} />;
        } else if (numStars !== 0) {
            starRating = (
                <StarRating
                    rating={store.review ? store.review.rating : 0}
                    data-purpose="star-rating"
                />
            );
        }

        return (
            <>
                {store.showInitiator() && (
                    <Button
                        data-purpose="review-button"
                        {...props}
                        onClick={this.onRatingClick}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                    >
                        {starRating}
                        <span data-purpose="helper-text">{store.helperText}</span>
                    </Button>
                )}
                <ReviewModal leaveRatingStore={store} />
            </>
        );
    }
}
