import {Button} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import {Tooltip} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import hotkeyRegistry from 'utils/hotkeys';

import {ASSESSMENT_TYPES} from '../../constants';
import RelatedLecture from '../related-lecture.react-component';
import MCQuizAnswer from './mc-quiz-answer.react-component';
import ReviewStar from './review-star.react-component';
import './mc-quiz-question.less';

@observer
export default class MCQuizQuestion extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        isReviewing: PropTypes.bool,
        onToggleMarkForReview: PropTypes.func,
    };

    static defaultProps = {
        isReviewing: false,
        onToggleMarkForReview: undefined,
    };

    constructor(props) {
        super(props);
        // Add in the keys 1-9.
        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((digit) => {
            this.hotkeys.push({
                key: digit.toString(),
                fn: this.handleAnswerChanged,
            });
        });
    }

    componentDidMount() {
        hotkeyRegistry.registerMap(this.hotkeys);
    }

    componentWillUnmount() {
        hotkeyRegistry.unregisterMap(this.hotkeys);
    }

    hotkeys = [];

    @autobind
    handleAnswerChanged(event) {
        // handle onClick and hotkeys
        const index = event.target.dataset.index || event.key - 1;
        this.props.question.selectAnswerAtIndex(parseInt(index, 10));
    }

    render() {
        const {question, isReviewing, onToggleMarkForReview} = this.props;

        let headerCorrectness = '';
        if (isReviewing) {
            if (question.isCorrect) {
                headerCorrectness = (
                    <span className="ud-text-bold" styleName="correct">
                        {gettext('Correct')}
                    </span>
                );
            } else if (question.isIncorrect) {
                headerCorrectness = (
                    <span className="ud-text-bold" styleName="incorrect">
                        {gettext('Incorrect')}
                    </span>
                );
            } else if (!question.isAnswered) {
                headerCorrectness = <Badge styleName="skipped">{gettext('Skipped')}</Badge>;
            }
        }

        const inputType =
            question.assessmentType === ASSESSMENT_TYPES.MULTIPLE_SELECT ? 'checkbox' : 'radio';

        return (
            <form styleName="container">
                {isReviewing && question.isMarkedForReview && (
                    <div styleName="star">
                        <ReviewStar udStyle="accented" label={gettext('Marked for review')} />
                    </div>
                )}
                {!isReviewing && !!onToggleMarkForReview && (
                    <Tooltip
                        placement="right"
                        styleName="toggle-mark-for-review"
                        trigger={
                            <Button
                                udStyle="link"
                                data-purpose="toggle-mark-for-review"
                                onClick={onToggleMarkForReview}
                            >
                                <ReviewStar
                                    udStyle={question.isMarkedForReview ? 'accented' : 'subdued'}
                                    label={false}
                                />
                            </Button>
                        }
                    >
                        {question.isMarkedForReview
                            ? gettext('Unmark for review')
                            : gettext('Mark for review')}
                    </Tooltip>
                )}
                <span>
                    {interpolate(
                        gettext('Question %(index)s: '),
                        {index: question.questionIndex},
                        true,
                    )}
                </span>
                {headerCorrectness}
                <RichTextViewer
                    prettify={{preventClick: true}}
                    wrapImages={true}
                    className="ud-text-bold"
                    styleName="question-prompt"
                    id="question-prompt"
                    unsafeHTML={question.promptRichText}
                />
                <ul role="group" aria-labelledby="question-prompt" className="ud-unstyled-list">
                    {question.answers.map((answer, answerIndex) => (
                        <li key={`${question.id}_${answerIndex}`} styleName="answer">
                            <MCQuizAnswer
                                inputType={inputType}
                                answer={answer}
                                answerIndex={answerIndex}
                                isReviewing={isReviewing}
                                onChange={this.handleAnswerChanged}
                            />
                        </li>
                    ))}
                </ul>
                {isReviewing && question.explanation && (
                    <div styleName="explanation">
                        <h4 className="ud-heading-md">{gettext('Explanation')}</h4>
                        <RichTextViewer
                            id="question-explanation"
                            unsafeHTML={question.explanation}
                        />
                    </div>
                )}
                {isReviewing && question.relatedLecture && <RelatedLecture question={question} />}
            </form>
        );
    }
}
