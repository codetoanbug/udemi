import Observer from '@researchgate/react-intersection-observer';
import {StarRating, StarRatingSizes} from '@udemy/react-merchandising-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer, PropTypes as mobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import './review-summary-widget.less';
import ReviewSummaryRatingGauge from './review-summary-rating-gauge.react-component';

@observer
export default class ReviewSummaryWidget extends Component {
    // TODO: When converted to TypeScript, switch to using `type StarRatingSize`
    static propTypes = {
        isFreeSEOExp: PropTypes.bool,
        showAverageRating: PropTypes.bool,
        averageRating: PropTypes.number.isRequired,
        totalDistributionCount: PropTypes.number.isRequired,
        ratingDistribution: mobxPropTypes.arrayOrObservableArray.isRequired,
        selectedRating: PropTypes.number,
        onRatingSelected: PropTypes.func,
        onSeen: PropTypes.func,
        ratingText: PropTypes.string,
        ratingSize: PropTypes.oneOf(StarRatingSizes),
        averageContainerProps: PropTypes.object,
    };

    static defaultProps = {
        isFreeSEOExp: false,
        showAverageRating: true,
        selectedRating: undefined,
        onRatingSelected: noop,
        onSeen: noop,
        ratingText: '',
        ratingSize: 'large',
        averageContainerProps: {},
    };

    getAriaTextForRating(rating) {
        return interpolate(gettext('Rating: %(rating)s out of 5'), {rating}, true);
    }

    renderAverageRating() {
        const {className, ...props} = this.props.averageContainerProps;
        const averageRatingClass = classNames('ud-text-md', className);

        if (!this.props.showAverageRating) {
            return;
        }

        return (
            <div styleName="average-container" className={averageRatingClass} {...props}>
                <div
                    data-purpose="average-rating"
                    className="ud-heading-xxxl"
                    styleName="average-number"
                >
                    {this.props.averageRating.toFixed(1)}
                </div>

                <div styleName="average-stars">
                    <StarRating
                        data-purpose="star-rating-average"
                        ariaLabel={this.getAriaTextForRating(this.props.averageRating)}
                        rating={this.props.averageRating}
                        size={this.props.ratingSize}
                    />
                    {/*
                        TODO: render the following text in a Tooltip:
                            Course Ratings are calculated from individual
                            students’ ratings and a variety of other signals,
                            like age of rating and reliability, to ensure that
                            they reflect course quality fairly and accurately.
                     */}
                </div>

                <p className="ud-heading-lg" styleName="average-rating-text">
                    {this.props.ratingText
                        ? this.props.ratingText
                        : this.props.isFreeSEOExp
                        ? gettext('Tutorial rating')
                        : gettext('Course Rating')}
                </p>
            </div>
        );
    }

    renderRatingGauges() {
        // Calculates percentage for each rating
        const ratingDistributionWithPercentage = this.props.ratingDistribution.map((range) => ({
            rating: range.rating,
            count: range.count,
            percentage:
                this.props.ratingDistribution !== 0
                    ? (range.count / this.props.totalDistributionCount) * 100
                    : 0,
        }));
        // Find the calculated total percentage among all ratings
        const totalPercentage = ratingDistributionWithPercentage.reduce(
            (total, range) => total + Math.round(range.percentage),
            0,
        );
        // If total percentage isn't 100%, updates highest percentage with missing/exceeding,
        if (totalPercentage !== 100) {
            let highestRangeIndex;
            let highestPercentage = 0;
            ratingDistributionWithPercentage.forEach((range, index) => {
                if (range.percentage > highestPercentage) {
                    highestPercentage = range.percentage;
                    highestRangeIndex = index;
                }
            });
            ratingDistributionWithPercentage[highestRangeIndex].percentage += 100 - totalPercentage;
        }
        const gauges = ratingDistributionWithPercentage
            .map((range) => this.renderRatingGauge(range.rating, range.percentage))
            .reverse();

        return (
            <div
                styleName={classNames('rates', {
                    'with-average-rating': this.props.showAverageRating,
                })}
            >
                {gauges}
            </div>
        );
    }

    renderRatingGauge(rating, percent) {
        const ariaLabel = this.getAriaTextForRating(rating);
        return (
            <ReviewSummaryRatingGauge
                ariaLabel={ariaLabel}
                selectedRating={this.props.selectedRating}
                key={rating}
                rating={rating}
                percent={percent}
                size={this.props.ratingSize}
                onRatingSelected={this.props.onRatingSelected}
            />
        );
    }

    @autobind
    onSeen({isIntersecting}) {
        if (isIntersecting) {
            return this.props.onSeen();
        }
    }

    render() {
        if (this.props.averageRating === 0) {
            return (
                <div data-purpose="no-ratings-message">
                    {gettext("This course doesn't have any reviews yet.")}
                </div>
            );
        }

        return (
            <Observer onChange={this.onSeen}>
                <div data-purpose="ratings-and-reviews">
                    <div styleName="stats-container">
                        {this.renderAverageRating()}
                        {this.renderRatingGauges()}
                    </div>
                </div>
            </Observer>
        );
    }
}
