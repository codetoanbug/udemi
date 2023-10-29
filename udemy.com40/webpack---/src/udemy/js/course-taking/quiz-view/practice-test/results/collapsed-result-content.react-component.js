import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import HighchartsWrapper from 'chart/highcharts-wrapper.react-component';
import {toLocaleDateString} from 'utils/date';

import {QUIZ_STATUS_OPTIONS} from '../../constants';
import TimeSummary from '../time-summary.react-component';
import ResultStatus from './result-status.react-component';
import TestResultModel from './test-result.mobx-model';
import './collapsed-result-content.less';

@observer
export default class CollapsedResultContent extends Component {
    static propTypes = {
        result: PropTypes.instanceOf(TestResultModel).isRequired,
    };

    render() {
        const {result} = this.props;
        return (
            <div styleName="flex-align-center container">
                <div styleName="flex-align-center">
                    <div styleName="chart">
                        <HighchartsWrapper options={result.smallChart} />
                    </div>
                    <div styleName="chart-details">
                        <ResultStatus
                            className="ud-text-lg"
                            status={
                                result.passed
                                    ? QUIZ_STATUS_OPTIONS.CORRECT
                                    : QUIZ_STATUS_OPTIONS.INCORRECT
                            }
                        >
                            {result.passed ? gettext('Passed!') : gettext('Failed')}
                        </ResultStatus>
                        <div className="ud-text-sm" styleName="small-screen-only">
                            {toLocaleDateString(new Date(result.created), {
                                month: 'numeric',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </div>
                    </div>
                </div>
                <div className="ud-text-bold ud-text-md" styleName="flex-align-center score">
                    <span styleName="large-screen-only">
                        {interpolate(
                            gettext('%(percent)s% correct'),
                            {percent: result.correctPercent},
                            true,
                        )}
                    </span>
                    <span styleName="small-screen-only">
                        {interpolate(
                            gettext('%(percent)s%'),
                            {percent: result.correctPercent},
                            true,
                        )}
                    </span>
                </div>
                <div styleName="flex-align-center large-screen-only">
                    <TimeSummary
                        hours={result.elapsedHours}
                        minutes={result.elapsedMinutes}
                        seconds={result.elapsedSeconds}
                    />
                </div>
                <div styleName="flex-align-center large-screen-only">
                    {toLocaleDateString(new Date(result.created), {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </div>
                <div>{/* Spacer */}</div>
            </div>
        );
    }
}
