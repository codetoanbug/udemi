import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button} from '@udemy/react-core-components';
import {StarRating, StarRatingSizes} from '@udemy/react-merchandising-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import './review-summary-widget.less';

@observer
export default class ReviewSummaryRatingGauge extends Component {
    // TODO: When converted to TypeScript, switch to using `type StarRatingSize`
    static propTypes = {
        ariaLabel: PropTypes.string.isRequired,
        selectedRating: PropTypes.number,
        onRatingSelected: PropTypes.func,
        rating: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired,
        size: PropTypes.oneOf(StarRatingSizes),
    };

    static defaultProps = {
        selectedRating: undefined,
        onRatingSelected: noop,
        size: 'large',
    };

    @autobind
    onRatingSelected() {
        if (this.props.percent > 0) {
            const rating =
                this.props.selectedRating === this.props.rating ? null : this.props.rating;
            this.props.onRatingSelected(rating);
        }
    }

    renderFilterApplied(filter) {
        const filterApplied = `${filter} star filter applied. ${this.props.percent} percent of reviews fit criteria `;
        return (
            <div role={'status'}>
                <span className="ud-sr-only">{filterApplied}</span>
            </div>
        );
    }

    render() {
        const {percent, rating, size, selectedRating, ariaLabel} = this.props;
        const roundedPercent = Math.round(percent).toFixed(0);
        let percentLabel;
        if (percent > 0 && roundedPercent === '0') {
            percentLabel = gettext('< 1%');
        } else {
            percentLabel = interpolate(gettext('%(percent)s%'), {percent: roundedPercent}, true);
        }
        const isRatingSelected = selectedRating === rating;
        const disabled = percent <= 0;
        const gaugeStyle = classNames({
            'rates-row': true,
            disabled,
            inactive: !!selectedRating && !isRatingSelected,
        });

        return (
            <Button
                udStyle="link"
                size="small"
                typography="ud-heading-xs"
                data-purpose={`rate-gauge-${rating}`}
                disabled={disabled}
                key={rating}
                onClick={this.onRatingSelected}
                styleName={gaugeStyle}
                aria-pressed={isRatingSelected}
            >
                <span styleName="rate-gauge">
                    <span styleName="rate-gauge--bg">
                        <span styleName="rate-gauge--fill" style={{width: `${roundedPercent}%`}} />
                    </span>
                </span>
                <StarRating ariaLabel={ariaLabel} rating={rating} size={size} />
                <span styleName="rate-percent" className="ud-text-sm">
                    <span data-purpose="percent-label">{percentLabel}</span>
                </span>
                {isRatingSelected ? this.renderFilterApplied(rating) : null}
                <span styleName="rate-clear">
                    {isRatingSelected ? <CloseIcon label={false} size="xsmall" /> : null}
                </span>
            </Button>
        );
    }
}
