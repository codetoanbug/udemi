import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import HighchartsWrapper from 'chart/highcharts-wrapper.react-component';
import {toLocaleDateString} from 'utils/date';
import escapeHtml from 'utils/escape/escape-html';

import requires from '../../../registry/requires';
import {QUIZ_STATUS_OPTIONS} from '../../constants';
import {isPracticeTestExperimentEnabled} from '../../utils.ts';
import TimeSummary from '../time-summary.react-component';
import ChartLegend from './chart-legend.react-component';
import KnowledgeAreaBarChart from './knowledge-area-bar-chart.react-component';
import ResultStatus from './result-status.react-component';
import TestResultModel from './test-result.mobx-model';
import './expanded-result-content.less';

@inject('practiceTestStore')
@requires('courseTakingStore')
@observer
export default class ExpandedResultContent extends Component {
    static propTypes = {
        result: PropTypes.instanceOf(TestResultModel).isRequired,
        practiceTestStore: PropTypes.object.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        const revampedPTEnabled = isPracticeTestExperimentEnabled();
        this.reviewButtonProps = revampedPTEnabled
            ? {udStyle: 'primary', text: gettext('View instructor feedback')}
            : {udStyle: 'secondary', text: gettext('Review questions')};
        this.knowledgeAreaHeaderProps = revampedPTEnabled
            ? {text: gettext('Domains')}
            : {text: gettext('Knowledge areas')};
    }

    @computed
    get isReviewButtonVisible() {
        const quiz = this.props.practiceTestStore.quizViewStore.quiz;
        return !quiz.isCpeFinalExam;
    }

    @autobind
    onClickReview() {
        this.props.practiceTestStore.goToDetailedResultPage(this.props.result.id);
    }

    renderStatus() {
        const {result} = this.props;
        if (result.passed) {
            return (
                <ResultStatus status={QUIZ_STATUS_OPTIONS.CORRECT}>
                    {interpolate(
                        gettext('Passed! (%(percent)s% required to pass)'),
                        {percent: result.passPercent},
                        true,
                    )}
                </ResultStatus>
            );
        }
        if (result.overtimeMinutes > 0 || result.overtimeSeconds > 0) {
            return (
                <ResultStatus status={QUIZ_STATUS_OPTIONS.INCORRECT}>
                    {gettext('Failed (exceeded time limit)')}
                </ResultStatus>
            );
        }
        return (
            <ResultStatus status={QUIZ_STATUS_OPTIONS.INCORRECT}>
                {interpolate(
                    gettext('Failed (%(percent)s% required to pass)'),
                    {percent: result.passPercent},
                    true,
                )}
            </ResultStatus>
        );
    }

    renderResultStats() {
        const {result} = this.props;
        return (
            <div styleName="stats">
                <div>
                    <div styleName="chart">
                        {this.props.courseTakingStore.isMobileViewportSize ? (
                            <HighchartsWrapper options={result.smallChart} />
                        ) : (
                            <HighchartsWrapper options={result.bigChart} />
                        )}
                    </div>
                    <ChartLegend className="ud-text-xs" styleName="pie-chart-legend" />
                </div>
                <div styleName="summary">
                    <div className="ud-text-lg" styleName="status">
                        {interpolate(gettext('Attempt %(number)s:'), {number: result.number}, true)}{' '}
                        {this.renderStatus()}
                    </div>
                    <LocalizedHtml
                        styleName="score"
                        html={interpolate(
                            pgettext(
                                'e.g. 75% correct (3/4)',
                                '<span class="percent">%(percent)s%</span> correct ' +
                                    '<span class="fraction">(%(numCorrect)s/%(total)s)</span>',
                            ),
                            {
                                percent: escapeHtml(result.correctPercent),
                                numCorrect: escapeHtml(result.numCorrect),
                                total: escapeHtml(result.numAssessments),
                            },
                            true,
                        )}
                        interpolate={{percent: <span styleName="percent-correct" />}}
                    />
                    <div className="ud-text-md" styleName="time">
                        <div>
                            <TimeSummary
                                hours={result.elapsedHours}
                                minutes={result.elapsedMinutes}
                                seconds={result.elapsedSeconds}
                                overtimeMinutes={result.overtimeMinutes}
                                overtimeSeconds={result.overtimeSeconds}
                            />
                        </div>
                        <div>
                            {toLocaleDateString(new Date(result.created), {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                    </div>
                    {this.isReviewButtonVisible && (
                        <div styleName="large-screen-only">
                            <Button
                                data-purpose="review-questions-button"
                                udStyle={this.reviewButtonProps.udStyle}
                                onClick={this.onClickReview}
                                styleName="review-questions"
                            >
                                {this.reviewButtonProps.text}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    render() {
        const {result} = this.props;
        return (
            <div styleName="container">
                {this.renderResultStats()}
                {this.isReviewButtonVisible && (
                    <div styleName="small-screen-only">
                        <Button
                            data-purpose="review-questions-button"
                            udStyle={this.reviewButtonProps.udStyle}
                            onClick={this.onClickReview}
                            styleName="review-questions"
                        >
                            {this.reviewButtonProps.text}
                        </Button>
                    </div>
                )}
                {result.knowledgeAreas.length > 0 ? (
                    <div>
                        <h2 className="ud-heading-lg">{this.knowledgeAreaHeaderProps.text}</h2>
                        {result.knowledgeAreas.map((knowledgeArea) => (
                            <KnowledgeAreaBarChart
                                key={knowledgeArea.name}
                                knowledgeArea={knowledgeArea}
                            />
                        ))}
                        <ChartLegend className="ud-text-xs" styleName="knowledge-chart-legend" />
                    </div>
                ) : null}
            </div>
        );
    }
}
