import RatingStarOutlineIcon from '@udemy/icons/dist/rating-star-outline.ud-icon';
import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import './review-stars-input.less';

export default class ReviewStarInput extends Component {
    static propTypes = {
        disabled: PropTypes.bool.isRequired,
        onHover: PropTypes.func.isRequired,
        onChoose: PropTypes.func.isRequired,
        rating: PropTypes.number.isRequired,
        filled: PropTypes.bool.isRequired,
        chosen: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,
        maxRatingValue: PropTypes.number,
    };

    static defaultProps = {
        maxRatingValue: 5,
    };

    @autobind
    onHover() {
        this.props.onHover(this.props.rating);
    }

    @autobind
    onTouchStart(event) {
        event.stopPropagation();
        this.props.onChoose(this.props.rating);
    }

    @autobind
    onChoose(event) {
        if (event.target.checked) {
            this.props.onChoose(this.props.rating);
        }
    }

    render() {
        const isHalf = this.props.rating % 1 !== 0;
        const styleName = classNames('review-star', {
            'review-star-half': isHalf,
            'review-star-filled': this.props.filled,
        });
        const purpose = `review-star-input-${this.props.rating}-label`;
        const iconProps = {label: false, color: 'inherit', size: this.props.size};
        if (this.props.disabled) {
            return (
                <div styleName={styleName} data-purpose={purpose}>
                    {!isHalf && <RatingStarOutlineIcon {...iconProps} />}
                    <RatingStarIcon {...iconProps} styleName="star-filled" />
                </div>
            );
        }

        const id = `${this.props.name}-input-${this.props.rating}`;
        return (
            <label
                htmlFor={id}
                onMouseEnter={this.onHover}
                onTouchStart={this.onTouchStart}
                styleName={styleName}
                data-purpose={purpose}
            >
                {!isHalf && <RatingStarOutlineIcon {...iconProps} />}
                <RatingStarIcon {...iconProps} styleName="star-filled" />
                <span className="ud-sr-only">
                    {interpolate(
                        gettext('%(rating)s out of %(maxValue)s'),
                        {rating: this.props.rating, maxValue: this.props.maxRatingValue},
                        true,
                    )}
                </span>
                <input
                    type="radio"
                    className="ud-sr-only"
                    name={this.props.name}
                    id={id}
                    value={this.props.rating}
                    checked={this.props.chosen}
                    onClick={this.onChoose}
                    // react requires onChange to be specified when the 'checked' prop is specified.
                    // we want this component to call the 'onChoose' prop even when the same
                    // input is selected again, so we have to use onClick (not onChange)
                    onChange={noop}
                    data-purpose={`review-star-${this.props.rating}-input`}
                />
            </label>
        );
    }
}
