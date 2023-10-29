import {Popover} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {quizTypes} from '../constants';
import ItemIconButton from '../item-icon-button.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';

const QuizDeleteButton = ({curriculumItem, onClick}) => {
    const isPracticeTest = curriculumItem.type === quizTypes.practiceTest;
    const isDisabledForPracticeTest =
        isPracticeTest && curriculumItem.isPublishedAndCourseWasPublished;
    const button = (
        <ItemIconButton
            iconType="delete"
            item={curriculumItem}
            onClick={isDisabledForPracticeTest ? undefined : onClick}
            disabled={curriculumItem.isSaving}
            aria-disabled={isDisabledForPracticeTest}
            data-purpose="quiz-delete-btn"
        />
    );
    if (!isDisabledForPracticeTest) {
        return button;
    }
    return (
        <Popover
            placement="top"
            canToggleOnHover={true}
            a11yRole="description"
            detachFromTarget={true}
            trigger={button}
        >
            {gettext(
                'This practice test can only be unpublished. This allows students' +
                    ' to continue to review their scores. Unpublishing the practice test will prevent' +
                    ' any new students from accessing it.',
            )}
        </Popover>
    );
};

QuizDeleteButton.propTypes = {
    curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default observer(QuizDeleteButton);
