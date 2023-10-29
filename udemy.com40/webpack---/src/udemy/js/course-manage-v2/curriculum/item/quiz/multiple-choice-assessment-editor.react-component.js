import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import {showErrorToast} from 'instructor/toasts';

import {quizTypes, assessmentTypes} from '../constants';
import AssessmentModel from './assessment.mobx-model';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import KnowledgeAreaFormGroup from './knowledge-area-form-group.react-component';
import MultipleChoiceAnswersFormGroup from './multiple-choice-answers-form-group.react-component';
import {parseMultipleChoiceOptionsAsAnswers} from './parsers';
import RelatedLectureFormGroup from './related-lecture-form-group.react-component';
import './assessment-editor.less';

@observer
export default class MultipleChoiceAssessmentEditor extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        assessment: PropTypes.instanceOf(AssessmentModel),
        assessmentType: PropTypes.oneOf([
            assessmentTypes.multipleChoice,
            assessmentTypes.multipleSelect,
        ]).isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        assessment: null,
    };

    constructor(props, context) {
        super(props, context);
        const knowledgeAreaFormField = this.props.curriculumItem.knowledgeAreaFormField;
        knowledgeAreaFormField.reset();

        // Do not convert null to [] here, as it can hide problems when
        // options have not been set yet. The form has an error check for this. This component
        // assumes options are always set when editing an assessment.
        const knowledgeAreas = knowledgeAreaFormField.options
            ? knowledgeAreaFormField.options.map((option) => option.value)
            : null;
        this.form.reset(this.props.assessment, knowledgeAreas);
    }

    get form() {
        return this.props.curriculumItem.assessmentForms[this.props.assessmentType];
    }

    @autobind
    onQuestionChange(value) {
        this.form.setField('question', value);
    }

    @autobind
    onExplanationChange(value) {
        this.form.setField('explanation', value);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        const {question, selectedKnowledgeAreaIndex} = this.form.data;
        const nonEmptyAnswerOptions = this.form.data.answerOptions.filter(
            (option) => !!this.form.decodeAndTrim(option.value),
        );
        const knowledgeAreaFormField = this.props.curriculumItem.knowledgeAreaFormField;
        const knowledgeAreas = (knowledgeAreaFormField.options || []).map((option) => option.value);
        const selectedKnowledgeArea = knowledgeAreas[selectedKnowledgeAreaIndex] || '';
        this.form.validate(question, nonEmptyAnswerOptions, selectedKnowledgeArea);
        if (this.form.error.detail) {
            showErrorToast(this.form.error.detail);
            return;
        }
        const {answers, feedbacks, correctResponse} = parseMultipleChoiceOptionsAsAnswers(
            nonEmptyAnswerOptions,
        );
        const data = Object.assign({}, this.form.data, {
            answerOptions: undefined,
            answers: JSON.stringify(answers),
            feedbacks: JSON.stringify(feedbacks),
            correct_response: JSON.stringify(correctResponse),
            selectedKnowledgeAreaIndex: undefined,
            section: selectedKnowledgeArea,
            section_name_map: JSON.stringify(knowledgeAreaFormField.nameMap),
        });
        this.props.onSubmit(data);
    }

    render() {
        const form = this.form;
        const isSimpleQuiz = this.props.curriculumItem.type === quizTypes.simpleQuiz;
        const isPracticeTest = this.props.curriculumItem.type === quizTypes.practiceTest;
        const isPracticeTestCourse = this.props.curriculumItem.course.is_practice_test_course;
        return (
            <form
                data-purpose="multiple-choice-assessment-editor"
                onSubmit={this.onSubmit}
                styleName="editor"
            >
                <FormGroup label={gettext('Question')} data-purpose="question-form-group">
                    <RichTextEditor
                        theme={
                            isPracticeTest
                                ? RichTextEditor.THEMES.PRACTICE_TEST_QUESTION
                                : RichTextEditor.THEMES.QUIZ_QUESTION
                        }
                        autoFocus={true}
                        value={form.data.question}
                        onValueChange={this.onQuestionChange}
                    />
                </FormGroup>
                <MultipleChoiceAnswersFormGroup
                    curriculumItem={this.props.curriculumItem}
                    form={form}
                />
                {isPracticeTest ? (
                    <FormGroup
                        label={gettext('Explanation')}
                        data-purpose="explanation-form-group"
                        note={gettext('Explain why the correct answer is the best choice.')}
                    >
                        <RichTextEditor
                            theme={RichTextEditor.THEMES.PRACTICE_TEST_QUESTION_EXPLANATION}
                            value={form.data.explanation}
                            onValueChange={this.onExplanationChange}
                        />
                    </FormGroup>
                ) : null}
                {isSimpleQuiz || (isPracticeTest && !isPracticeTestCourse) ? (
                    <RelatedLectureFormGroup
                        curriculumItem={this.props.curriculumItem}
                        form={form}
                    />
                ) : null}
                {isPracticeTest ? (
                    <KnowledgeAreaFormGroup
                        curriculumItem={this.props.curriculumItem}
                        form={form}
                    />
                ) : null}
                <div styleName="submit-row">
                    <Button
                        type="submit"
                        size="small"
                        disabled={this.props.curriculumItem.isSaving}
                    >
                        {gettext('Save')}
                    </Button>
                </div>
            </form>
        );
    }
}
