import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {KnowledgeAreaResultModel} from './test-result.mobx-model';
import './knowledge-area-bar-chart.less';

export default class KnowledgeAreaBarChart extends Component {
    static propTypes = {
        knowledgeArea: PropTypes.instanceOf(KnowledgeAreaResultModel).isRequired,
    };

    renderBar(percent, styleName, purpose) {
        if (percent === 0) {
            return null;
        }
        return (
            <div styleName={styleName} style={{width: `${percent}%`}} data-purpose={purpose}>
                {interpolate(gettext('%(percent)s%'), {percent}, true)}
            </div>
        );
    }

    render() {
        const {knowledgeArea} = this.props;
        return (
            <>
                <h3 className="ud-heading-md" styleName="title" data-purpose="title">
                    {ninterpolate(
                        '%(title)s (%(count)s question)',
                        '%(title)s (%(count)s questions)',
                        knowledgeArea.numAssessments,
                        {title: knowledgeArea.name, count: knowledgeArea.numAssessments},
                    )}
                </h3>
                <div className="ud-text-xs" styleName="bar-chart">
                    {this.renderBar(knowledgeArea.correctPercent, 'bar-correct', 'correct')}
                    {this.renderBar(knowledgeArea.incorrectPercent, 'bar-incorrect', 'incorrect')}
                    {this.renderBar(
                        knowledgeArea.skippedPercent + knowledgeArea.unansweredPercent,
                        'bar-skipped-unanswered',
                        'skipped-unanswered',
                    )}
                </div>
            </>
        );
    }
}
