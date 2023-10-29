import {Button} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import {pxToRem} from '@udemy/styles';
import {observer} from 'mobx-react';
import React from 'react';

import dashToCamelCase from '../../../../utils/case-change/dash-to-camel-case';
import mcStyles from '../../simple-quiz/question/mc-quiz-question.less';
import ReviewStar from '../../simple-quiz/question/review-star.react-component';
import styles from './revamp-fitb-question.less';

const RevampFITBQuestionComponent: React.FC<{
    question: any;
    onToggleMarkForReview: any;
}> = ({question, onToggleMarkForReview}) => {
    const TEXT_NODE_TYPE = 3; // The node contains text
    const DEFAULT_BLANK_LENGTH = 10;
    const PX_TO_REM_FACTOR = 10;
    const BUFFER_LENGTH = 4;

    const renderFITBQuestion = () => {
        const promptRichText = question.promptRichText;

        // Use a detached doc so that innerHTML doesn't execute script tags.
        const detachedDoc = document.implementation.createHTMLDocument('title');
        const wrapperNode = detachedDoc.createElement('div');
        wrapperNode.innerHTML = promptRichText;

        return replaceUBlanks(wrapperNode, question);
    };

    const replaceUBlanks = (node: any, question: any, key = 0): any => {
        if (node.nodeType === TEXT_NODE_TYPE) {
            return <React.Fragment key={key}>{node.textContent}</React.Fragment>;
        }
        const tag = node.tagName.toLowerCase();

        if (tag === 'u-blank') {
            const dataOrder = parseInt(node.getAttribute('data-order'), 10);
            return (
                <input
                    className={`${styles['question-creation']} ud-text-input ud-text-input-large ud-text-md`}
                    style={{
                        width: `${
                            pxToRem(
                                question.answers[dataOrder]?.text.length + BUFFER_LENGTH ||
                                    DEFAULT_BLANK_LENGTH,
                            ) * PX_TO_REM_FACTOR
                        }rem`,
                    }}
                    key={`${question.id}:${dataOrder}`}
                    data-purpose="fitb-answer"
                    value={question.answers[dataOrder].userAnswer || ''}
                    onChange={(event) => question.updateUserAnswer(event.target.value, dataOrder)}
                />
            );
        }

        let children: any = Array.from(node.childNodes).map((child, i) => {
            return replaceUBlanks(child, question, key + i);
        });

        if (children.length === 0) {
            // React complains about passing children={ [] } for "void elements" such as <img />.
            children = null;
        }
        // Convert HTML attribute names to React prop names.

        const props: any = {key};

        Array.from(node.attributes).forEach((attr: any) => {
            if (attr.name === 'class') {
                props.className = attr.value;
            } else if (attr.name.startsWith('data-')) {
                props[attr.name] = attr.value;
            } else if (attr.name === 'style') {
                const styles: any = {};
                (attr.value || '').split(';').forEach((declaration: any) => {
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

    return (
        <form className={mcStyles.container}>
            {question.isMarkedForReview && (
                <div className={mcStyles.star}>
                    <ReviewStar udStyle="accented" label={gettext('Marked for review')} />
                </div>
            )}
            <Tooltip
                placement="right"
                className={mcStyles['toggle-mark-for-review']}
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
            <span>
                {interpolate(
                    gettext('Question %(index)s: '),
                    {index: question.questionIndex},
                    true,
                )}
            </span>
            <p className={`${styles['question-header']} ud-heading-md`}>
                {gettext(
                    'Please fill the blank field(s) in the statement by writing the appropriate word.',
                )}
            </p>
            {renderFITBQuestion()}
        </form>
    );
};

export const RevampFITBQuestion = observer(RevampFITBQuestionComponent);
