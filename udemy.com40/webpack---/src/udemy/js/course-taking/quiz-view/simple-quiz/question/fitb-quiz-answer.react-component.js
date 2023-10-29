import {getUniqueId} from '@udemy/design-system-utils';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './fitb-quiz-answer.less';

@inject('simpleQuizStore')
@observer
export default class FITBQuizAnswer extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        order: PropTypes.number.isRequired,
        simpleQuizStore: PropTypes.object.isRequired,
    };

    id = getUniqueId('fitb-quiz-answer');

    @computed
    get answer() {
        return this.props.question.answers[this.props.order];
    }

    @autobind
    handleChange(event) {
        this.answer.setFill(event.target.value);
    }

    render() {
        const {question, order, simpleQuizStore} = this.props;
        let showWrongState = false;
        let showCorrectState = false;
        if (simpleQuizStore.checkedAnswer && !simpleQuizStore.isRevisitingQuestionPage) {
            const thisCheckedAnswer = simpleQuizStore.checkedAnswer.answers[order];
            const isThisCheckedAnswerCorrect = this.answer.getIsCorrect(thisCheckedAnswer);
            showWrongState = !isThisCheckedAnswerCorrect && !question.isCorrectAnswerShown;
            showCorrectState = isThisCheckedAnswerCorrect;
        }
        const onlyCorrectAnswerShown =
            question.isCorrectAnswerShown || simpleQuizStore.isCheckedAnswerCorrect;

        return onlyCorrectAnswerShown ? (
            <span
                styleName={classNames('correct-answer-blank', {
                    'blank-wrong': showWrongState,
                    'blank-correct': showCorrectState,
                })}
            >
                <span
                    styleName={classNames({
                        'correct-answer': showCorrectState,
                        'display-answer': !showCorrectState,
                    })}
                    className="ud-text-lg"
                >
                    {this.answer.fill}
                    {showCorrectState && (
                        <TickIcon
                            styleName={classNames('correct-answer-icon')}
                            label={gettext('Correct')}
                        />
                    )}
                </span>
            </span>
        ) : (
            <span
                styleName={classNames('blank', {
                    'blank-wrong': showWrongState,
                    'blank-correct': showCorrectState,
                })}
            >
                <label htmlFor={this.id} className="ud-sr-only">
                    {gettext('blank')}
                </label>
                <input
                    id={this.id}
                    type="text"
                    placeholder={gettext('blank')}
                    className="ud-text-lg"
                    disabled={
                        question.isCorrectAnswerShown ||
                        simpleQuizStore.isCheckedAnswerCorrect ||
                        simpleQuizStore.isRevisitingQuestionPage
                    }
                    value={this.answer.fill}
                    onChange={this.handleChange}
                />
                {showWrongState && <CloseIcon label={gettext('Incorrect')} />}
                {showCorrectState && <TickIcon label={gettext('Correct')} />}
            </span>
        );
    }
}
