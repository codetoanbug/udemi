import {FormGroup} from '@udemy/react-form-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {quizTypes} from '../constants';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import MultipleChoiceAnswer from './multiple-choice-answer.react-component';
import MultipleChoiceAssessmentFormModel, {
    maxNumOfAnswers,
} from './multiple-choice-assessment-form.mobx-model';

@observer
export default class MultipleChoiceAnswersFormGroup extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        form: PropTypes.instanceOf(MultipleChoiceAssessmentFormModel).isRequired,
    };

    render() {
        const isSimpleQuiz = this.props.curriculumItem.type === quizTypes.simpleQuiz;
        return (
            <FormGroup
                udStyle="fieldset"
                label={gettext('Answers')}
                data-purpose="answers-form-group"
                note={interpolate(
                    gettext(
                        'Write up to %(maxNumber)s possible answers and indicate which one is the best.',
                    ),
                    {maxNumber: maxNumOfAnswers},
                    true,
                )}
            >
                {this.props.form.data.answerOptions.map((option, i) => {
                    return (
                        <MultipleChoiceAnswer
                            key={i}
                            form={this.props.form}
                            index={i}
                            option={option}
                            showFeedback={isSimpleQuiz}
                        />
                    );
                })}
            </FormGroup>
        );
    }
}
