import {Button} from '@udemy/react-core-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import './question-list.less';

@inject('simpleQuizStore')
@observer
export default class QuestionList extends Component {
    static propTypes = {
        questions: PropTypes.array.isRequired,
        showRelatedLectures: PropTypes.bool,
        simpleQuizStore: PropTypes.object.isRequired,
    };

    static defaultProps = {
        showRelatedLectures: false,
    };

    render() {
        const {questions, showRelatedLectures, simpleQuizStore} = this.props;
        return (
            <ul className="ud-unstyled-list">
                {questions.map((question) => (
                    <li styleName="question-summary" key={question.id}>
                        <Button
                            udStyle="link"
                            styleName="inline"
                            typography="ud-text-md"
                            onClick={() => simpleQuizStore.revisitQuestion(question)}
                        >
                            {question.promptPlainText ? (
                                <span
                                    styleName="ellipsis question-text"
                                    {...safelySetInnerHTML({
                                        descriptionOfCaller: 'question-list:prompt-plain-text',
                                        html: question.promptPlainText,
                                    })}
                                />
                            ) : (
                                <span styleName="ellipsis question-text">
                                    {interpolate(gettext('Question %s'), [question.questionIndex])}
                                </span>
                            )}
                        </Button>
                        {showRelatedLectures &&
                            question.relatedLecture &&
                            question.relatedLecture.isPublished &&
                            !getIsMobileApp() && (
                                <div styleName="related-lecture">
                                    <a
                                        className="ud-link-neutral"
                                        styleName="inline"
                                        href={question.relatedLecture.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span styleName="ellipsis">
                                            {interpolate(gettext('Lecture %s'), [
                                                question.relatedLecture.objectIndex,
                                            ])}{' '}
                                            {question.relatedLecture.title}
                                        </span>
                                    </a>
                                </div>
                            )}
                    </li>
                ))}
            </ul>
        );
    }
}
