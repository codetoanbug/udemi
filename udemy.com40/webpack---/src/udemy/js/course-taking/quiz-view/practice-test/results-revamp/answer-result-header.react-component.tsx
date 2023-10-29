import {observer} from 'mobx-react';
import React from 'react';

import {getAnswerStatus} from './helpers';
import styles from './result-pane.less';

const AnswerResultHeaderComponent: React.FC<{
    answer: any;
    answerIndex: number;
    isAnswerIndexVisible?: boolean;
}> = ({answer, answerIndex, isAnswerIndexVisible = true}) => {
    const ANSWER_STATUS = getAnswerStatus(answer.correct, false);
    return (
        <div>
            <span className={`${styles['pane-title']} ud-heading-md`}>
                {answer.selected && (
                    <span
                        data-purpose="answer-result-header-user-label"
                        styleName="answer-by-user-label"
                        style={{background: ANSWER_STATUS.COLOR, color: ANSWER_STATUS.ICON_COLOR}}
                    >
                        {gettext('Your answer')}
                    </span>
                )}
                {isAnswerIndexVisible ? (
                    <span>
                        {interpolate(gettext('Answer %(index)s'), {index: answerIndex}, true)}
                    </span>
                ) : (
                    <span>{gettext('Answer')}</span>
                )}
                <span
                    data-purpose="answer-result-header-status-label"
                    className={styles['answer-status-label']}
                >
                    {ANSWER_STATUS.label}
                </span>
            </span>
        </div>
    );
};

export const AnswerResultHeader = observer(AnswerResultHeaderComponent);
