import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import {isExperimentEnabled} from 'course-manage-v2/utils';

import CurriculumEditorStore from './curriculum-editor.mobx-store';
import AssignmentEditor from './item/assignment/assignment-editor.react-component';
import {curriculumItemKeyClasses} from './item/constants';
import CurriculumItemModel from './item/curriculum-item.mobx-model';
import LectureEditor from './item/lecture/lecture-editor.react-component';
import LectureForm from './item/lecture/lecture-form.react-component';
import CodingExerciseQuizEditor from './item/quiz/coding-exercise-quiz-editor.react-component';
import {PracticeTestQuizEditor} from './item/quiz/practice-test-quiz-editor.react-component.tsx';
import PracticeTestQuizForm from './item/quiz/practice-test-quiz-form.react-component';
import QuizEditor from './item/quiz/quiz-editor.react-component';
import SimpleQuizForm from './item/quiz/simple-quiz-form.react-component';
import SectionEditor from './item/section/section-editor.react-component';
import SectionForm from './item/section/section-form.react-component';

@inject('store')
@observer
export default class Editor extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumItemModel).isRequired,
        store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
    };

    @autobind
    onClickDeleteButton() {
        this.props.store.openDeleteCurriculumItemConfirmation(this.props.curriculumItem);
    }

    @autobind
    onClickEditButton() {
        this.props.store.openEditFormForItem(this.props.curriculumItem);
    }

    @autobind
    onSubmitEditForm(postData) {
        this.props.store
            .editItem(this.props.curriculumItem, postData)
            .catch(handleUnexpectedAPIError);
    }

    get hasInitialFocus() {
        const target = this.props.store.curriculumItemWithInitialFocus;
        return !!target && target.key === this.props.curriculumItem.key;
    }

    get avoidOpenEditContentInitially() {
        return !!this.props.store.curriculumItemWithInitialFocus;
    }

    get isFirstPublishedVideoLecture() {
        const target = this.props.store.firstPublishedVideoLecture;
        return !!target && target.key === this.props.curriculumItem.key;
    }

    get isPreview() {
        const {curriculumItem, store} = this.props;
        return store.course.isPaid && !curriculumItem.isAddContentOpen && curriculumItem.is_free;
    }

    render() {
        const {curriculumItem, store} = this.props;
        switch (curriculumItem.keyClass) {
            case curriculumItemKeyClasses.section:
                return (
                    <SectionEditor
                        curriculumItem={curriculumItem}
                        editForm={
                            <SectionForm
                                curriculumItem={curriculumItem}
                                form={store.editForms[curriculumItemKeyClasses.section]}
                                onCancel={curriculumItem.closeEditForm}
                                onSubmit={this.onSubmitEditForm}
                                hasSectionTopicsEnabled={store.isSectionTaggingEnabled}
                            />
                        }
                        onClickDeleteButton={this.onClickDeleteButton}
                        onClickEditButton={this.onClickEditButton}
                        onSubmitEditForm={this.onSubmitEditForm}
                    />
                );
            case curriculumItemKeyClasses.lecture:
                return (
                    <LectureEditor
                        curriculumItem={curriculumItem}
                        canTogglePublishedState={store.course.can_toggle_curriculum_published_state}
                        editForm={
                            <LectureForm
                                curriculumItem={curriculumItem}
                                form={store.editForms[curriculumItemKeyClasses.lecture]}
                                onCancel={curriculumItem.closeEditForm}
                                onSubmit={this.onSubmitEditForm}
                            />
                        }
                        hasInitialFocus={this.hasInitialFocus}
                        avoidOpenEditContentInitially={this.avoidOpenEditContentInitially}
                        isFirstPublishedVideoLecture={this.isFirstPublishedVideoLecture}
                        onClickDeleteButton={this.onClickDeleteButton}
                        onClickEditButton={this.onClickEditButton}
                        seenCaptionManage={store.seenCaptionManage}
                        isPreview={this.isPreview}
                    />
                );
            case curriculumItemKeyClasses.simpleQuiz:
                return (
                    <QuizEditor
                        curriculumItem={curriculumItem}
                        canTogglePublishedState={store.course.can_toggle_curriculum_published_state}
                        editForm={
                            <SimpleQuizForm
                                curriculumItem={curriculumItem}
                                form={store.editForms[curriculumItemKeyClasses.simpleQuiz]}
                                onCancel={curriculumItem.closeEditForm}
                                onSubmit={this.onSubmitEditForm}
                            />
                        }
                        hasInitialFocus={this.hasInitialFocus}
                        avoidOpenEditContentInitially={this.avoidOpenEditContentInitially}
                        onClickDeleteButton={this.onClickDeleteButton}
                        onClickEditButton={this.onClickEditButton}
                    />
                );
            case curriculumItemKeyClasses.practiceTest:
                return isExperimentEnabled('is_new_practice_test_creation_ui_enabled') ? (
                    <PracticeTestQuizEditor
                        hasInitialFocus={this.hasInitialFocus}
                        curriculumItem={curriculumItem}
                        onClickDeleteButton={this.onClickDeleteButton}
                    />
                ) : (
                    <QuizEditor
                        curriculumItem={curriculumItem}
                        canTogglePublishedState={store.course.can_toggle_curriculum_published_state}
                        editForm={
                            <PracticeTestQuizForm
                                curriculumItem={curriculumItem}
                                form={store.editForms[curriculumItemKeyClasses.practiceTest]}
                                onCancel={curriculumItem.closeEditForm}
                                onSubmit={this.onSubmitEditForm}
                            />
                        }
                        hasInitialFocus={this.hasInitialFocus}
                        avoidOpenEditContentInitially={this.avoidOpenEditContentInitially}
                        onClickDeleteButton={this.onClickDeleteButton}
                        onClickEditButton={this.onClickEditButton}
                    />
                );
            case curriculumItemKeyClasses.codingExercise:
                return (
                    <CodingExerciseQuizEditor
                        hasInitialFocus={this.hasInitialFocus}
                        curriculumItem={curriculumItem}
                        onClickDeleteButton={this.onClickDeleteButton}
                    />
                );
            case curriculumItemKeyClasses.assignment:
                return (
                    <AssignmentEditor
                        hasInitialFocus={this.hasInitialFocus}
                        curriculumItem={curriculumItem}
                        onClickDeleteButton={this.onClickDeleteButton}
                    />
                );
            default:
                throw new Error(`Editor for type ${curriculumItem.keyClass} is not implemented`);
        }
    }
}
