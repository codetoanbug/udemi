import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import HighchartsWrapper from 'chart/highcharts-wrapper.react-component';

import MCQuizQuestion from '../../simple-quiz/question/mc-quiz-question.react-component';
import KnowledgeAreaFilterDropdown from './knowledge-area-filter-dropdown.react-component';
import QuestionFilterDropdown from './question-filter-dropdown.react-component';
import './detailed-result-panel.less';

@inject('practiceTestStore')
@observer
export default class DetailedResultPanel extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
    };

    render() {
        const result = this.props.practiceTestStore.detailedTestResult;
        return (
            <div styleName="detailed-result-panel" data-purpose="detailed-result-panel">
                <div styleName="panel-row top-row">
                    <div styleName="top-row-left">
                        <div styleName="chart">
                            <HighchartsWrapper
                                options={result.smallChart}
                                allowChartUpdate={false}
                            />
                        </div>
                        <div className="ud-text-xl">
                            {interpolate(
                                gettext('Attempt %(number)s'),
                                {number: result.number},
                                true,
                            )}
                        </div>
                    </div>
                    <div styleName="top-row-right">
                        <KnowledgeAreaFilterDropdown />
                        <QuestionFilterDropdown />
                    </div>
                </div>
                {result.filteredQuestions.length === 0 ? (
                    <div styleName="panel-row">
                        <div className="ud-text-xl" styleName="no-questions">
                            {gettext('No questions match this filter.')}
                        </div>
                    </div>
                ) : (
                    result.filteredQuestions.map((question) => (
                        <div key={question.id} styleName="panel-row question-container">
                            <MCQuizQuestion question={question} isReviewing={true} />
                        </div>
                    ))
                )}
            </div>
        );
    }
}
