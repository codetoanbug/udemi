import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import {isExperimentEnabled} from 'course-manage-v2/utils';

import {
    AddLectureButton,
    AddSimpleQuizButton,
    AddCodingExerciseQuizButton,
    AddPracticeTestQuizButton,
    AddAssignmentButton,
    AddSectionButton,
} from './add-item-buttons.react-component';
import CurriculumEditorStore from './curriculum-editor.mobx-store';
import AssignmentForm from './item/assignment/assignment-form.react-component';
import {curriculumItemKeyClasses} from './item/constants';
import LectureForm from './item/lecture/lecture-form.react-component';
import CodingExerciseQuizForm from './item/quiz/coding-exercise-quiz-form.react-component';
import {PracticeTestQuizFormRevamped} from './item/quiz/practice-test-quiz-form-revamped.react-component';
import PracticeTestQuizForm from './item/quiz/practice-test-quiz-form.react-component';
import SimpleQuizForm from './item/quiz/simple-quiz-form.react-component';
import SectionForm from './item/section/section-form.react-component';
import './add-item-forms.less';

@inject('store')
@observer
export default class AddItemForms extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
        onlySectionForm: PropTypes.bool,
    };

    static defaultProps = {
        onlySectionForm: false,
    };

    constructor(props, context) {
        super(props, context);
        this.cancelHandlers = {};
        this.submitHandlers = {};
        Object.keys(this.props.store.addForms).forEach((itemKeyClass) => {
            this.cancelHandlers[itemKeyClass] = () => {
                this.onCancel(itemKeyClass);
            };
            this.submitHandlers[itemKeyClass] = (postData) => {
                this.onSubmit(itemKeyClass, postData);
            };
        });
    }

    @autobind
    onCancel(itemKeyClass) {
        this.props.store.closeAddFormForItem(itemKeyClass);
    }

    @autobind
    onSubmit(itemKeyClass, postData) {
        this.props.store.addItem(itemKeyClass, postData).catch(handleUnexpectedAPIError);
    }

    renderForTestOnlyCourse() {
        const {store} = this.props;
        switch (store.addItemButtonsUi.selectedNonSectionType) {
            case curriculumItemKeyClasses.practiceTest:
                if (isExperimentEnabled('is_new_practice_test_creation_ui_enabled')) {
                    return (
                        <PracticeTestQuizFormRevamped
                            key="practice-test-quiz-form"
                            form={store.addForms[curriculumItemKeyClasses.practiceTest]}
                            onCancel={this.cancelHandlers[curriculumItemKeyClasses.practiceTest]}
                            onSubmit={this.submitHandlers[curriculumItemKeyClasses.practiceTest]}
                        />
                    );
                }
                return (
                    <PracticeTestQuizForm
                        key="practice-test-quiz-form"
                        form={store.addForms[curriculumItemKeyClasses.practiceTest]}
                        onCancel={this.cancelHandlers[curriculumItemKeyClasses.practiceTest]}
                        onSubmit={this.submitHandlers[curriculumItemKeyClasses.practiceTest]}
                    />
                );
            default:
                if (!store.inlineInsertEnabled) {
                    return (
                        <div styleName="block-btns-row">
                            <AddPracticeTestQuizButton />
                        </div>
                    );
                }
                return (
                    <div styleName="inline-btns-row">
                        <AddPracticeTestQuizButton />
                    </div>
                );
        }
    }

    renderForStandardCourse() {
        const {store} = this.props;
        if (store.numOfNonSectionItems >= store.course.max_num_of_non_section_items) {
            return (
                <AlertBanner
                    udStyle="warning"
                    showCta={false}
                    title={gettext('The maximum number of curriculum items has been reached.')}
                    data-purpose="max-curriculum-items-alert"
                />
            );
        }
        const components = [];
        switch (store.addItemButtonsUi.selectedNonSectionType) {
            case curriculumItemKeyClasses.lecture:
                components.push(
                    <LectureForm
                        key="lecture-form"
                        form={store.addForms[curriculumItemKeyClasses.lecture]}
                        onCancel={this.cancelHandlers[curriculumItemKeyClasses.lecture]}
                        onSubmit={this.submitHandlers[curriculumItemKeyClasses.lecture]}
                    />,
                );
                break;
            case curriculumItemKeyClasses.simpleQuiz:
                components.push(
                    <SimpleQuizForm
                        key="simple-quiz-form"
                        form={store.addForms[curriculumItemKeyClasses.simpleQuiz]}
                        onCancel={this.cancelHandlers[curriculumItemKeyClasses.simpleQuiz]}
                        onSubmit={this.submitHandlers[curriculumItemKeyClasses.simpleQuiz]}
                    />,
                );
                break;
            case curriculumItemKeyClasses.practiceTest:
                if (isExperimentEnabled('is_new_practice_test_creation_ui_enabled')) {
                    components.push(
                        <PracticeTestQuizFormRevamped
                            key="practice-test-quiz-form"
                            form={store.addForms[curriculumItemKeyClasses.practiceTest]}
                            onCancel={this.cancelHandlers[curriculumItemKeyClasses.practiceTest]}
                            onSubmit={this.submitHandlers[curriculumItemKeyClasses.practiceTest]}
                        />,
                    );
                    break;
                }
                components.push(
                    <PracticeTestQuizForm
                        key="practice-test-quiz-form"
                        form={store.addForms[curriculumItemKeyClasses.practiceTest]}
                        onCancel={this.cancelHandlers[curriculumItemKeyClasses.practiceTest]}
                        onSubmit={this.submitHandlers[curriculumItemKeyClasses.practiceTest]}
                    />,
                );
                break;
            case curriculumItemKeyClasses.codingExercise:
                components.push(
                    <CodingExerciseQuizForm
                        key="coding-exercise-quiz-form"
                        form={store.addForms[curriculumItemKeyClasses.codingExercise]}
                        onCancel={this.cancelHandlers[curriculumItemKeyClasses.codingExercise]}
                        onSubmit={this.submitHandlers[curriculumItemKeyClasses.codingExercise]}
                    />,
                );
                break;
            case curriculumItemKeyClasses.assignment:
                components.push(
                    <AssignmentForm
                        key="assignment-form"
                        form={store.addForms[curriculumItemKeyClasses.assignment]}
                        onCancel={this.cancelHandlers[curriculumItemKeyClasses.assignment]}
                        onSubmit={this.submitHandlers[curriculumItemKeyClasses.assignment]}
                    />,
                );
                break;
            default:
                if (!store.inlineInsertEnabled) {
                    components.push(
                        <div key="non-section-row-1" styleName="block-btns-row">
                            <AddLectureButton />
                            <AddSimpleQuizButton />
                        </div>,
                    );
                    components.push(
                        <div key="non-section-row-2" styleName="block-btns-row">
                            <AddCodingExerciseQuizButton />
                            <AddPracticeTestQuizButton />
                            <AddAssignmentButton />
                        </div>,
                    );
                } else {
                    components.push(
                        <div styleName="inline-btns-row" key="inline-sections">
                            <AddLectureButton />
                            <AddSimpleQuizButton />
                            <AddCodingExerciseQuizButton />
                            <AddPracticeTestQuizButton />
                            <AddAssignmentButton />
                        </div>,
                    );
                }
                break;
        }
        if (!store.inlineInsertEnabled) {
            components.push(
                <div key="section-row" styleName="section-row">
                    {store.addItemButtonsUi.isSectionFormOpen ? (
                        <SectionForm
                            form={store.addForms[curriculumItemKeyClasses.section]}
                            onCancel={this.cancelHandlers[curriculumItemKeyClasses.section]}
                            onSubmit={this.submitHandlers[curriculumItemKeyClasses.section]}
                        />
                    ) : (
                        <div styleName="block-btns-row">
                            <AddSectionButton />
                        </div>
                    )}
                </div>,
            );
        }
        return components;
    }

    renderSectionForm() {
        const {store} = this.props;
        return (
            <SectionForm
                form={store.addForms[curriculumItemKeyClasses.section]}
                onCancel={this.cancelHandlers[curriculumItemKeyClasses.section]}
                onSubmit={this.submitHandlers[curriculumItemKeyClasses.section]}
            />
        );
    }

    render() {
        const {store, onlySectionForm} = this.props;
        if (onlySectionForm) {
            return this.renderSectionForm();
        } else if (store.course.isPracticeTestCourse) {
            return this.renderForTestOnlyCourse();
        }
        return this.renderForStandardCourse();
    }
}
