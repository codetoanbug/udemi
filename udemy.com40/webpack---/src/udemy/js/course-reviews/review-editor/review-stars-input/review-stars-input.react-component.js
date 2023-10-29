import {getUniqueId} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import InputRange from './input-range.react-component';
import ReviewStarInput from './review-star-input.react-component';
import './review-stars-input.less';

export const GuidanceText = ({rating}) => {
    const guidanceTexts = {
        1: gettext('Awful, not what I expected at all'),
        1.5: gettext('Awful / Poor'),
        2: gettext('Poor, pretty disappointed'),
        2.5: gettext('Poor / Average'),
        3: gettext('Average, could be better'),
        3.5: gettext('Average / Good'),
        4: gettext('Good, what I expected'),
        4.5: gettext('Good / Amazing'),
        5: gettext('Amazing, above expectations!'),
    };
    return (
        <h3 className="ud-heading-md" styleName="guidance-text">
            {guidanceTexts[rating] || gettext('Select Rating')}
        </h3>
    );
};

GuidanceText.propTypes = {
    rating: PropTypes.number,
};

GuidanceText.defaultProps = {
    rating: undefined,
};

@observer
export default class ReviewStarsInput extends Component {
    static propTypes = {
        onChoose: PropTypes.func,
        rating: PropTypes.number,
        size: PropTypes.oneOf(['xlarge', 'xxlarge']),
        showSlider: PropTypes.bool,
    };

    static defaultProps = {
        onChoose: noop,
        rating: null,
        size: 'xlarge',
        showSlider: isMobileBrowser,
    };

    name = getUniqueId('review-stars');
    @observable hoverRating = 0;
    @observable isFocused = false;

    @autobind
    onMouseLeave() {
        this.setHoverRating(0);
    }

    @autobind
    onHover(rating) {
        this.setHoverRating(rating);
    }

    @action
    setHoverRating(rating) {
        this.hoverRating = rating;
    }

    @autobind
    onSliderInput(event) {
        this.onHover(parseFloat(event.target.value));
    }

    @autobind
    onSliderChange(event) {
        this.props.onChoose(parseFloat(event.target.value));
    }

    @autobind
    @action
    onFocus() {
        this.isFocused = true;
    }

    @autobind
    @action
    onBlur() {
        this.isFocused = false;
    }

    renderStar(rating) {
        return (
            <ReviewStarInput
                rating={rating}
                size={this.props.showSlider ? 'xlarge' : this.props.size}
                filled={(this.hoverRating || this.props.rating) >= rating}
                chosen={this.props.rating === rating}
                onHover={this.props.showSlider ? noop : this.onHover}
                onChoose={this.props.showSlider ? noop : this.props.onChoose}
                disabled={this.props.showSlider}
                name={this.name}
            />
        );
    }

    render() {
        return (
            <div styleName="review-stars-container">
                <GuidanceText rating={this.hoverRating || this.props.rating} />
                <div id={this.name} className="ud-sr-only">
                    {gettext('Course rating')}
                </div>
                <div
                    role="group"
                    aria-labelledby={this.name}
                    styleName={classNames('review-stars', {'review-stars-focused': this.isFocused})}
                    onMouseLeave={this.onMouseLeave}
                    data-purpose="review-stars-container"
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                >
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} styleName="review-star-container">
                            {rating > 1 && this.renderStar(rating - 0.5)}
                            {this.renderStar(rating)}
                        </div>
                    ))}
                </div>
                {this.props.showSlider && (
                    <div styleName="rating-slider">
                        <InputRange
                            min={1}
                            max={5}
                            step={0.5}
                            value={this.props.rating}
                            onChange={this.onSliderChange}
                            onInput={this.onSliderInput}
                        />
                    </div>
                )}
            </div>
        );
    }
}
