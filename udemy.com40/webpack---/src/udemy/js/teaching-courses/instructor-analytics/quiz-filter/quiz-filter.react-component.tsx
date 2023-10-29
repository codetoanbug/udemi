import {Dropdown} from '@udemy/react-menu-components';
import React from 'react';

import './quiz-filter.less';
import {QuizMeta} from './types';

interface QuizFilterProps {
    quizzes: Array<QuizMeta>;
    handleOnClick: (quiz: QuizMeta) => void;
    selectedQuiz: QuizMeta | null;
    size?: 'xsmall' | 'small' | 'medium' | 'large' | undefined;
}

export const QuizFilter = ({
    quizzes,
    selectedQuiz,
    handleOnClick,
    size = 'xsmall',
}: QuizFilterProps) => {
    return (
        <Dropdown
            placement={'bottom-start'}
            trigger={<Dropdown.Button size={size}>{selectedQuiz?.title}</Dropdown.Button>}
        >
            <Dropdown.Menu>
                {quizzes.map((quiz: QuizMeta) => (
                    <Dropdown.MenuItem key={quiz.id} onClick={() => handleOnClick(quiz)}>
                        <div title={quiz.title} styleName={'text-ellipsis'}>
                            {quiz.title}
                        </div>
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
