import {Table} from '@udemy/react-structure-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CodingExerciseStore from './coding-exercise.mobx-store';

import './output.less';

@inject('codingExerciseStore')
@observer
// Note: this component currently only deals with SQL feedback
export default class ParsedFeedback extends React.Component {
    static propTypes = {
        codingExerciseStore: PropTypes.instanceOf(CodingExerciseStore).isRequired,
    };

    pre(key, text) {
        return (
            <pre key={key} data-purpose="feedback-content">
                {text}
            </pre>
        );
    }

    parsedFeedback(feedback) {
        return feedback.map((element, i) => {
            if (typeof element === 'number') {
                return this.pre(
                    i,
                    ninterpolate('%(count)s row affected', '%(count)s rows affected', element, {
                        count: element,
                    }),
                );
            } else if (!Array.isArray(element)) {
                return this.pre(i, element);
            } else if (!element[0] || typeof element[0] !== 'object') {
                return element.map((row, j) => this.pre(`${i}-${j}`, row));
            }
            return (
                <Table
                    key={i}
                    padding="xs"
                    noBackgroundColor={true}
                    noBorder={true}
                    columns={Object.keys(element[0]).map((col) => {
                        return {fieldName: col, headerName: col};
                    })}
                    rows={element}
                />
            );
        });
    }

    render() {
        try {
            const feedback = JSON.parse(this.props.codingExerciseStore.evaluatorFeedback);
            if (!Array.isArray(feedback)) {
                throw new Error('Feedback should be rendered without formatting');
            }

            if (this.props.codingExerciseStore.hasSolutionPassed) {
                // Note: feedback[0] is not an unsuccessful feedback in normal cases
                // there is a bug in sql-evaluator which sometimes fills it in as unsuccessful
                // even though it the tests pass. This is a temporary fix until evaluator is fixed

                return (
                    <div styleName="parsed-output">
                        {this.parsedFeedback(feedback[0].actual ?? feedback)}
                    </div>
                );
            }

            return (
                <div styleName="parsed-output">
                    <p data-purpose="feedback-content">{gettext('Your result:')}</p>
                    {this.parsedFeedback(feedback[0].actual)}
                    <p data-purpose="feedback-content">{gettext('Expected result:')}</p>
                    {this.parsedFeedback(feedback[0].expected)}
                </div>
            );
        } catch (e) {
            return this.pre('unparsed-feedback', this.props.codingExerciseStore.evaluatorFeedback);
        }
    }
}
