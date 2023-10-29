import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import dashToCamelCase from 'utils/case-change/dash-to-camel-case';

import FITBQuestion from '../../fitb-question.mobx-model';
import FITBQuizAnswer from './fitb-quiz-answer.react-component';

import './fitb-quiz-question.less';

const TEXT_NODE_TYPE = 3; // The node contains text

export const replaceUBlanks = (node, question, key = 0) => {
    if (node.nodeType === TEXT_NODE_TYPE) {
        return <React.Fragment key={key}>{node.textContent}</React.Fragment>;
    }
    const tag = node.tagName.toLowerCase();

    if (tag === 'u-blank') {
        return (
            <FITBQuizAnswer
                key={`${question.id}:${key}`}
                order={parseInt(node.getAttribute('data-order'), 10)}
                question={question}
            />
        );
    }

    let children = Array.from(node.childNodes).map((child, i) => {
        return replaceUBlanks(child, question, key + i);
    });

    if (children.length === 0) {
        // React complains about passing children={ [] } for "void elements" such as <img />.
        children = null;
    }
    // Convert HTML attribute names to React prop names.

    const props = {key};

    Array.from(node.attributes).forEach((attr) => {
        if (attr.name === 'class') {
            props.className = attr.value;
        } else if (attr.name.startsWith('data-')) {
            props[attr.name] = attr.value;
        } else if (attr.name === 'style') {
            const styles = {};
            (attr.value || '').split(';').forEach((declaration) => {
                const [name, value] = declaration.split(':');
                styles[name] = value;
            });
            props[attr.name] = styles;
        } else {
            props[dashToCamelCase(attr.name)] = attr.value;
        }
    });

    return React.createElement(tag, props, children);
};

@inject('simpleQuizStore')
@observer
export default class FITBQuizQuestion extends Component {
    static propTypes = {
        question: PropTypes.instanceOf(FITBQuestion).isRequired,
        simpleQuizStore: PropTypes.object.isRequired,
    };

    @autobind
    onClickShowAnswer() {
        this.props.question.showCorrectAnswer();
        this.props.simpleQuizStore.resetCheckedAnswer();
    }

    renderFITBQuestion() {
        const question = this.props.question;
        // Use a detached doc so that innerHTML doesn't execute script tags.
        const detachedDoc = document.implementation.createHTMLDocument('title');
        const wrapperNode = detachedDoc.createElement('div');
        wrapperNode.innerHTML = question.promptRichText;
        return replaceUBlanks(wrapperNode, question);
    }

    render() {
        const {question, simpleQuizStore} = this.props;
        const isShowAnswerButtonHidden =
            simpleQuizStore.isCheckedAnswerCorrect ||
            question.isCorrectAnswerShown ||
            question.numAttempts < 1;
        return (
            <div>
                {this.renderFITBQuestion()}
                {!isShowAnswerButtonHidden && (
                    <div styleName="answer-row">
                        <Button
                            udStyle="secondary"
                            onClick={this.onClickShowAnswer}
                            data-purpose="show-answer"
                        >
                            {ngettext('Show answer', 'Show answers', question.answers.length)}
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}
