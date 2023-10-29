import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Measure from 'react-measure';

import {ordinal} from 'utils/ordinal';

/* eslint-disable no-unused-vars,import/order */
import baseStyles from './insights.less';
import styles from './percentile-chart.less';
/* eslint-enable no-unused-vars,import/order */

const NUM_BOXES = 10;

// What percentage of box width should the gaps between the boxes be?
// This function increases the percentage linearly depending on width.
function computeRelativeGapWidth(width) {
    return 0.14 + width / 420;
}

// eslint-disable-next-line react/prop-types
const Box = ({idx, percentile, width}) => {
    const relativeGapWidth = computeRelativeGapWidth(width);
    const valueCoverage = 100 / NUM_BOXES;
    const selected =
        (percentile >= idx * valueCoverage && percentile < (idx + 1) * valueCoverage) ||
        (idx === NUM_BOXES - 1 && percentile === 100);
    const boxWidth = Math.floor(width / (NUM_BOXES + (NUM_BOXES - 1) * relativeGapWidth));
    const outerBoxStyle = {
        width: `${pxToRem(boxWidth)}rem`,
    };
    const innerBoxStyle = {
        width: `${pxToRem(boxWidth)}rem`,
        height: `${pxToRem(boxWidth)}rem`,
    };

    if (!selected) {
        return (
            <div key={idx} styleName="styles.box" style={outerBoxStyle} data-purpose="box">
                <div styleName="styles.inner-box" style={innerBoxStyle} />
            </div>
        );
    }

    // Scale the 0-100 range to 0-88 so that the vertical line doesn't go outside its corresponsing box.
    const marginLeft = ((percentile - idx * valueCoverage) / valueCoverage) * 88;
    const verticalBarStyle = {
        marginLeft: `${marginLeft}%`,
    };
    const percentileStyle = {};
    if (idx > NUM_BOXES / 2) {
        percentileStyle.right = `${pxToRem(10)}rem`;
    } else {
        percentileStyle.left = `${pxToRem(10)}rem`;
    }

    const label = ordinal(Math.round(percentile));

    return (
        <div
            key={idx}
            styleName="styles.percentile-box"
            style={outerBoxStyle}
            data-purpose="percentile-box"
        >
            <div
                styleName="styles.vertical-bar"
                style={verticalBarStyle}
                data-purpose="vertical-bar"
            >
                <div
                    className="ud-text-xl"
                    styleName="baseStyles.text-xxl styles.percentile"
                    style={percentileStyle}
                    data-purpose="percentile"
                >
                    {label}
                </div>
            </div>
            <div styleName="styles.inner-box" style={innerBoxStyle} />
        </div>
    );
};

@observer
export default class PercentileChart extends Component {
    static propTypes = {
        percentile: PropTypes.number.isRequired,
    };

    @observable dimensions = null;

    @autobind
    @action
    setDimensions(dimensions) {
        this.dimensions = dimensions;
    }

    render() {
        return (
            <div styleName="styles.wrapper">
                <Measure onMeasure={this.setDimensions}>
                    <div styleName="styles.box-wrapper" data-purpose="box-wrapper">
                        {this.dimensions &&
                            [...Array(NUM_BOXES).keys()].map((idx) => (
                                <Box
                                    idx={idx}
                                    percentile={this.props.percentile}
                                    width={this.dimensions.width}
                                    key={idx}
                                />
                            ))}
                    </div>
                </Measure>
                <div styleName="styles.labels">
                    <div styleName="styles.label" className="ud-text-xs">
                        {gettext('Least')}
                    </div>
                    <div styleName="styles.label" className="ud-text-xs">
                        {gettext('Most')}
                    </div>
                </div>
            </div>
        );
    }
}
