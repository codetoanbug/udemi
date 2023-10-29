import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {QUIZ_STATUS_OPTIONS} from '../../constants';
import ResultStatus from './result-status.react-component';
import './chart-legend.less';

export default class ChartLegend extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    static defaultProps = {
        className: null,
    };

    render() {
        return (
            <div className={this.props.className} styleName="chart-legend">
                <ResultStatus status={QUIZ_STATUS_OPTIONS.CORRECT}>
                    <span styleName="correct square" />
                    {gettext('Correct')}
                </ResultStatus>
                <ResultStatus status={QUIZ_STATUS_OPTIONS.INCORRECT}>
                    <span styleName="incorrect square" />
                    {gettext('Wrong')}
                </ResultStatus>
                <ResultStatus status={QUIZ_STATUS_OPTIONS.SKIPPED_UNANSWERED}>
                    <span styleName="skipped square" />
                    {gettext('Skipped/Unanswered')}
                </ResultStatus>
            </div>
        );
    }
}
