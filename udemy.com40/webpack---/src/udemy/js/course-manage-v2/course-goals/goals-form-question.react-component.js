import PlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import Question from './question.mobx-model.js';
import SortableAnswers from './sortable-answers.react-component.js';

import './goals-form.less';

export default class GoalsFormQuestion extends React.Component {
    static propTypes = {
        questionId: PropTypes.string.isRequired,
        errors: mobxTypes.arrayOrObservableArray,
        label: PropTypes.string,
        explanation: PropTypes.object,
        placeholders: PropTypes.arrayOf(PropTypes.string),
        question: PropTypes.instanceOf(Question).isRequired,
        shouldSendPerfMetric: PropTypes.bool,
        store: PropTypes.object.isRequired,
        deleteButtonDisabled: PropTypes.bool,
        maxLength: PropTypes.number,
        withCounter: PropTypes.bool,
        labelHeadingSize: PropTypes.oneOf(['small', 'medium']),
    };

    static defaultProps = {
        errors: [],
        label: '',
        explanation: null,
        placeholders: null,
        shouldSendPerfMetric: false,
        deleteButtonDisabled: false,
        maxLength: -1,
        withCounter: false,
        labelHeadingSize: 'medium',
    };

    render() {
        let label;
        if (this.props.label) {
            label = (
                <div
                    className={classNames({
                        'ud-heading-sm': this.props.labelHeadingSize === 'small',
                        'ud-heading-md': this.props.labelHeadingSize === 'medium',
                    })}
                    styleName="question-label"
                >
                    {this.props.label}
                </div>
            );
        }
        const hasErrors = this.props.errors.length > 0;
        return (
            <div styleName="goal-form-question-container">
                <div>
                    {label}
                    {this.props.explanation}
                    <br />
                    <SortableAnswers
                        store={this.props.store}
                        questionId={this.props.questionId}
                        placeholders={this.props.placeholders}
                        question={this.props.question}
                        shouldSendPerfMetric={this.props.shouldSendPerfMetric}
                        deleteButtonDisabled={this.props.deleteButtonDisabled}
                        maxLength={this.props.maxLength}
                        withCounter={this.props.withCounter}
                    />
                </div>
                {hasErrors ? (
                    <AlertBanner
                        styleName="form-error"
                        udStyle="error"
                        showCta={false}
                        title={
                            <span
                                className="ud-text-with-links"
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'goals-form-question:error',
                                    domPurifyConfig: {ADD_ATTR: ['target']},
                                    html: this.props.errors.join(' '),
                                })}
                            />
                        }
                    />
                ) : null}

                <Button
                    data-purpose={`add-${this.props.questionId}`}
                    udStyle="ghost"
                    onClick={this.props.question.pushEmptyAnswer}
                >
                    <PlusIcon size="medium" label={false} />
                    {gettext('Add more to your response')}
                </Button>
            </div>
        );
    }
}
