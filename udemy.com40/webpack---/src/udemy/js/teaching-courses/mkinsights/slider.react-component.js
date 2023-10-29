import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './slider.less';

export default class Slider extends Component {
    static propTypes = {
        percentage: PropTypes.number.isRequired,
        increasingGradient: PropTypes.bool,
    };

    static defaultProps = {
        increasingGradient: true,
    };

    render() {
        const {percentage, increasingGradient} = this.props;
        const left = `${Math.min(Math.max(percentage, 5), 95)}%`;
        return (
            <div styleName={classNames('slider', {'slider-decreasing': !increasingGradient})}>
                <div style={{left}} styleName="slider-value" />
            </div>
        );
    }
}
