import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';
import range from 'utils/range';

import './input-range.less';

const isInRange = (props, propName) => {
    if (props[propName] !== null && (props[propName] < props.min || props[propName] > props.max)) {
        return new Error('Provided value is not in range');
    }
    return null;
};

export default class InputRange extends Component {
    static propTypes = {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        value: isInRange,
        onChange: PropTypes.func,
        onInput: PropTypes.func,
    };

    static defaultProps = {
        value: null,
        onChange: noop,
        onInput: noop,
    };

    isTouching = false;

    get numberOfSteps() {
        return (this.props.max - this.props.min) / this.props.step;
    }

    @autobind
    onChange(event) {
        this.props.onInput(event);
        !this.isTouching && this.props.onChange(event);
    }

    @autobind
    onTouchEnd(e) {
        this.isTouching = false;
        this.onChange(e);
    }

    @autobind
    onTouchStart() {
        this.isTouching = true;
    }

    render() {
        const {value, onInput, ...props} = this.props;
        return (
            <div>
                <input
                    type="range"
                    {...props}
                    onChange={this.onChange}
                    onTouchEnd={this.onTouchEnd}
                    onTouchStart={this.onTouchStart}
                    defaultValue={value !== null ? value : props.min + (props.max - props.min) / 2}
                    styleName="input-range"
                    data-purpose="input-range"
                />
                <div styleName="step-container">
                    {range(this.numberOfSteps + 1).map((i) => (
                        <div key={i} styleName="step-line" data-purpose="step-line" />
                    ))}
                </div>
            </div>
        );
    }
}
