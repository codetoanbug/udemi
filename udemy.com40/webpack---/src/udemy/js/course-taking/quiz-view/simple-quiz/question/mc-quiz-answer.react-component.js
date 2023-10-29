import {CheckboxBlock, RadioBlock} from '@udemy/react-form-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import {noop} from 'utils/noop';

import './mc-quiz-answer.less';

@observer
export default class MCQuizAnswer extends Component {
    static propTypes = {
        answer: PropTypes.object.isRequired,
        answerIndex: PropTypes.number.isRequired,
        inputType: PropTypes.string,
        isReviewing: PropTypes.bool,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        inputType: 'radio',
        isReviewing: false,
        onChange: noop,
    };

    render() {
        const {answer, answerIndex, inputType, isReviewing, onChange} = this.props,
            ChoiceElement = inputType === 'checkbox' ? CheckboxBlock : RadioBlock;
        let correctnessClass = '',
            correctnessText = '';
        if (isReviewing) {
            if (answer.correct) {
                correctnessClass = 'correct';
                correctnessText = gettext('(Correct)');
            } else if (answer.selected) {
                correctnessClass = 'incorrect';
                correctnessText = gettext('(Incorrect)');
            }
        }
        const answerInner = (
            <div styleName="answer-inner">
                <RichTextViewer
                    prettify={{preventClick: true}}
                    wrapImages={true}
                    styleName="answer-body"
                    unsafeHTML={answer.text}
                />
                {correctnessText && (
                    <div className="ud-heading-sm" styleName="correctness">
                        {correctnessText}
                    </div>
                )}
            </div>
        );

        return (
            <ChoiceElement
                name="answer"
                styleName={classNames('answer', correctnessClass, {reviewing: isReviewing})}
                onChange={onChange}
                disabled={isReviewing || answer.disabled}
                data-index={answerIndex}
                checked={answer.selected}
            >
                {answerInner}
            </ChoiceElement>
        );
    }
}
