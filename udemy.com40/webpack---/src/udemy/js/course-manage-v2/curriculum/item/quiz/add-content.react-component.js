import QuizIcon from '@udemy/icons/dist/quiz.ud-icon';
import {ConfirmModal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import Loader from 'course-manage-v2/loader.react-component';
import {showErrorToast} from 'instructor/toasts';

import {quizTypes, assessmentCreationTypes, assessmentLabels, assessmentTypes} from '../constants';
import ContentTab from '../content-tab.react-component';
import ContentTypeSelector, {optionStyles} from '../content-type-selector.react-component';
import BulkQuestionUploader from './bulk-question-uploader.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import FITBAssessmentEditor from './fitb-assessment-editor.react-component';
import MultipleChoiceAssessmentEditor from './multiple-choice-assessment-editor.react-component';
import './quiz-editor.less';

@observer
export default class AddContent extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
    };

    getTabTitleForAssessmentType(assessmentType) {
        return interpolate(gettext('Add %(type)s'), {type: assessmentLabels[assessmentType]}, true);
    }

    get tabConfigForSelectingAssessmentCreationType() {
        const assessmentCreationTypeOptions = [
            {label: gettext('Add Single Question'), type: assessmentCreationTypes.single},
            {label: gettext('Batch Question Uploader'), type: assessmentCreationTypes.batch},
        ];
        return {
            title: gettext('Add Question(s)'),
            content: (
                <ContentTypeSelector
                    onSelect={this.onSelectAssessmentCreationType}
                    optionStyle={optionStyles.assessmentCreationType}
                    options={assessmentCreationTypeOptions}
                />
            ),
        };
    }

    get tabConfigForSelectingAssessmentType() {
        const {multipleChoice, multipleSelect, fitb} = assessmentTypes;
        const assessmentTypeOptions = [
            {label: assessmentLabels[multipleChoice], type: multipleChoice, icon: QuizIcon},
        ];
        if (this.props.curriculumItem.type === quizTypes.practiceTest) {
            assessmentTypeOptions.push({
                label: assessmentLabels[multipleSelect],
                type: multipleSelect,
                icon: QuizIcon,
            });
        } else if (this.props.curriculumItem.course.isOrganizationOnly) {
            assessmentTypeOptions.push({
                label: assessmentLabels[fitb],
                type: fitb,
                icon: QuizIcon,
            });
        }
        return {
            title: gettext('Select question type'),
            content: (
                <ContentTypeSelector
                    onSelect={this.props.curriculumItem.setSelectedContentType}
                    optionStyle={optionStyles.assessmentType}
                    options={assessmentTypeOptions}
                />
            ),
        };
    }

    get tabConfig() {
        const {curriculumItem} = this.props;
        switch (curriculumItem.selectedContentType) {
            case null:
                if (curriculumItem.type === quizTypes.practiceTest) {
                    return this.tabConfigForSelectingAssessmentCreationType;
                }
                return this.tabConfigForSelectingAssessmentType;
            case assessmentCreationTypes.single:
                return this.tabConfigForSelectingAssessmentType;
            case assessmentCreationTypes.batch:
                return {
                    title: gettext('Add Question(s)'),
                    content: (
                        <BulkQuestionUploader
                            curriculumItem={curriculumItem}
                            onUploadComplete={this.onBulkSubmit}
                        />
                    ),
                };
            case assessmentTypes.multipleChoice:
            case assessmentTypes.multipleSelect:
                return {
                    title: this.getTabTitleForAssessmentType(curriculumItem.selectedContentType),
                    content: this.getEditorWithLoader(
                        <MultipleChoiceAssessmentEditor
                            curriculumItem={curriculumItem}
                            assessment={curriculumItem.addContentAssessment}
                            assessmentType={curriculumItem.selectedContentType}
                            onSubmit={this.onSubmit}
                        />,
                    ),
                };
            case assessmentTypes.fitb:
                return {
                    title: this.getTabTitleForAssessmentType(assessmentTypes.fitb),
                    content: this.getEditorWithLoader(
                        <FITBAssessmentEditor
                            curriculumItem={curriculumItem}
                            assessment={curriculumItem.addContentAssessment}
                            onSubmit={this.onSubmit}
                        />,
                    ),
                };
            default:
                throw new Error(`Unknown content type: ${curriculumItem.selectedContentType}`);
        }
    }

    getEditorWithLoader(editorComponent) {
        const loading = this.props.curriculumItem.assessments === null;
        return loading ? <Loader size="xlarge" /> : editorComponent;
    }

    @autobind
    onSelectAssessmentCreationType(type) {
        if (
            type === assessmentCreationTypes.batch &&
            this.props.curriculumItem.hasAssessmentContent &&
            !this.props.curriculumItem.isPublishedAndCourseWasPublished
        ) {
            this.props.curriculumItem.openBatchAssessmentCreationConfirmation();
        } else {
            this.props.curriculumItem.setSelectedContentType(type);
        }
    }

    @autobind
    onSubmit(postData) {
        this.props.curriculumItem
            .updateOrCreateAssessment(postData)
            .then(() => {
                this.props.curriculumItem.openEditContent();
            })
            .catch((error) => {
                if (error.prompt && error.prompt.length > 0) {
                    // Display prompt errors. See AssessmentSerializer.validate().
                    showErrorToast(error.prompt[0]);
                } else {
                    handleUnexpectedAPIError(error);
                }
            });
    }

    @autobind
    onBulkSubmit(uploadData) {
        this.props.curriculumItem
            .bulkCreateAssessments(uploadData)
            .then(() => {
                this.props.curriculumItem.openEditContent();
            })
            .catch((error) => {
                handleUnexpectedAPIError(error);
            });
    }

    render() {
        const tabConfig = this.tabConfig;
        const {curriculumItem} = this.props;
        return (
            <ContentTab
                purpose="add-content"
                title={tabConfig.title}
                onClose={curriculumItem.closeAddContent}
            >
                {tabConfig.content}
                <ConfirmModal
                    onCancel={curriculumItem.closeBatchAssessmentCreationConfirmation}
                    onConfirm={curriculumItem.confirmBatchAssessmentCreationConfirmation}
                    isOpen={curriculumItem.showBatchAssessmentCreationConfirmation}
                >
                    {gettext(
                        'Questions attached to this practice test will be deleted. Do you want to continue?',
                    )}
                </ConfirmModal>
            </ContentTab>
        );
    }
}
