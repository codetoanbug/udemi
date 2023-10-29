import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {assessmentTypes} from '../constants';
import AssessmentModel from './assessment.mobx-model';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import {parseFITBAssessmentAsQuestionAndResponse} from './parsers';
import RelatedLectureFormGroup from './related-lecture-form-group.react-component';
import './assessment-editor.less';

@observer
export default class FITBAssessmentEditor extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        assessment: PropTypes.instanceOf(AssessmentModel),
        onSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        assessment: null,
    };

    constructor(props, context) {
        super(props, context);
        this.form.reset(this.props.assessment);
    }

    get form() {
        return this.props.curriculumItem.assessmentForms[assessmentTypes.fitb];
    }

    @autobind
    onQuestionChange(value) {
        this.form.setField('question', value);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        const {question, correctResponse} = parseFITBAssessmentAsQuestionAndResponse(
            this.form.data.question,
        );
        this.form.validate(question, correctResponse);
        if (this.form.error.detail) {
            return;
        }
        const data = Object.assign({}, this.form.data, {
            question,
            correct_response: JSON.stringify(correctResponse),
        });
        this.props.onSubmit(data);
    }

    render() {
        const form = this.form;
        return (
            <form data-purpose="fitb-assessment-editor" onSubmit={this.onSubmit} styleName="editor">
                <div
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'fitb-assessment-editor:statement-help',
                        html: gettext(
                            'Type in your statement. To enter a blank field, simply add two (2) underscore ' +
                                'symbols (__) before and after your selected word.<br/><br/>' +
                                "<b>For example:</b> The planet Jupiter's four largest moons are called " +
                                '__Io__, __Europa__, __Ganymede__, and __Callisto__.',
                        ),
                    })}
                />
                <FormGroup
                    label={gettext('Statement')}
                    data-purpose="question-form-group"
                    styleName="fitb-question-form-group"
                    note={form.error.detail || null}
                    validationState={form.error.detail ? 'error' : 'neutral'}
                >
                    <RichTextEditor
                        theme={RichTextEditor.THEMES.QUIZ_QUESTION}
                        autoFocus={true}
                        value={form.data.question}
                        onValueChange={this.onQuestionChange}
                    />
                </FormGroup>
                <RelatedLectureFormGroup curriculumItem={this.props.curriculumItem} form={form} />
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
