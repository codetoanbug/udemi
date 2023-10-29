import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {QUIZ_STATUS_OPTIONS} from '../../constants';
import './result-status.less';

export default class ResultStatus extends Component {
    static propTypes = {
        status: PropTypes.oneOf(Object.values(QUIZ_STATUS_OPTIONS)).isRequired,
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: null,
    };

    render() {
        const {status, children, className} = this.props;
        const styleName = classNames({
            correct: status === QUIZ_STATUS_OPTIONS.CORRECT,
            incorrect: status === QUIZ_STATUS_OPTIONS.INCORRECT,
            skipped: status === QUIZ_STATUS_OPTIONS.SKIPPED,
        });
        return (
            <span styleName={styleName} className={className}>
                {children}
            </span>
        );
    }
}
