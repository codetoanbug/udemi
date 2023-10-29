import {observer} from 'mobx-react';
import React from 'react';

import {ASSESSMENT_TYPES} from '../../constants';
import MCQuizQuestion from '../../simple-quiz/question/mc-quiz-question.react-component';
import {RevampFITBQuestion} from './revamp-fitb-question.react-component';

const RevampQuestionComponent: React.FC<{
    question: any;
    onToggleMarkForReview: any;
}> = ({question, onToggleMarkForReview}) => {
    return question.assessmentType === ASSESSMENT_TYPES.FILL_IN_THE_BLANK ? (
        <RevampFITBQuestion question={question} onToggleMarkForReview={onToggleMarkForReview} />
    ) : (
        <MCQuizQuestion question={question} onToggleMarkForReview={onToggleMarkForReview} />
    );
};

export const RevampQuestion = observer(RevampQuestionComponent);
