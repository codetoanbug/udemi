import {observer} from 'mobx-react';
import React from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import {AnswerResultHeader} from './answer-result-header.react-component';
import styles from './result-pane.less';

const AnswerResultPaneComponent: React.FC<{
    answer: any;
    answerIndex: number;
    isAnswerIndexVisible?: boolean;
}> = ({answer, answerIndex, isAnswerIndexVisible = true}) => {
    return (
        <div className={styles['answer-result-pane']}>
            <AnswerResultHeader
                answer={answer}
                answerIndex={answerIndex}
                isAnswerIndexVisible={isAnswerIndexVisible}
            />

            <RichTextViewer
                prettify={{preventClick: true}}
                wrapImages={true}
                className="ud-text-md"
                id="answer-text"
                unsafeHTML={answer.text}
            />

            {answer.feedback && (
                <div className={styles['answer-feedback']}>
                    <h4 className="ud-heading-sm">{gettext('Explanation')}</h4>
                    <RichTextViewer
                        id="question-explanation"
                        className="ud-text-md"
                        unsafeHTML={answer.feedback}
                    />
                </div>
            )}
        </div>
    );
};

export const AnswerResultPane = observer(AnswerResultPaneComponent);
