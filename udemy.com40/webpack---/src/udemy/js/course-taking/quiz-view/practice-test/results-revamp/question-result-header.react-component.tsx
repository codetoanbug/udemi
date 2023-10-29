import {observer} from 'mobx-react';
import React from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import {ASSESSMENT_TYPES} from '../../constants';
import MCQuestion from '../../mc-question.mobx-model';
import {getAnswerStatus} from './helpers';
import styles from './result-pane.less';

const QuestionResultHeaderComponent: React.FC<{question: MCQuestion}> = ({question}) => {
    const {isAnswered, questionIndex} = question;
    const isCorrect = (question.isCorrect as unknown) as boolean;
    const ANSWER_STATUS = getAnswerStatus(isCorrect, !isAnswered);
    const AnswerStatusIcon = ANSWER_STATUS.ICON;
    const FITB_QUESTION_HEADER = gettext(
        'Please fill the blank field(s) in the statement with the right words.',
    );

    const questionHeaderContent =
        question.assessmentType === ASSESSMENT_TYPES.FILL_IN_THE_BLANK
            ? `<p>${FITB_QUESTION_HEADER}</p><p>${question.promptPlainText}</p>`
            : question.promptRichText;
    return (
        <>
            <span
                data-purpose="question-result-header-status-icon"
                className={styles['answer-status-icon']}
                style={{background: ANSWER_STATUS.COLOR}}
            >
                <AnswerStatusIcon
                    color="inherit"
                    size="xsmall"
                    label={false}
                    style={{color: ANSWER_STATUS.ICON_COLOR}}
                />
            </span>
            <span className={`${styles['question-header-collapsed-text']}`}>
                <span className={`${styles['pane-title']} ud-heading-md`}>
                    <span>
                        {interpolate(gettext('Question %(index)s'), {index: questionIndex}, true)}
                    </span>
                    <span
                        data-purpose="question-result-header-status-label"
                        styleName="answer-status-label"
                    >
                        {ANSWER_STATUS.label}
                    </span>
                </span>
                <RichTextViewer
                    className={`${styles['question-format']} ud-text-md`}
                    prettify={{preventClick: true}}
                    wrapImages={true}
                    id="question-prompt"
                    unsafeHTML={questionHeaderContent}
                />
            </span>
        </>
    );
};

export const QuestionResultHeader = observer(QuestionResultHeaderComponent);
