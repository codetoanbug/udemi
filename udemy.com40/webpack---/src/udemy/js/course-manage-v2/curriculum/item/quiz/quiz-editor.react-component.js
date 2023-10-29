import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import {quizTypes} from '../constants';
import DefaultItemEditor from '../default-item-editor.react-component';
import ItemBar from '../item-bar.react-component';
import ItemIconButton, {ItemCollapseButton} from '../item-icon-button.react-component';
import AddContent from './add-content.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import DraftAlert from './draft-alert.react-component';
import EditContent from './edit-content.react-component';
import QuizDeleteButton from './quiz-delete-button.react-component';
import QuizIsSavingBackdrop from './quiz-is-saving-backdrop.react-component';
import './quiz-editor.less';

@observer
export default class QuizEditor extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        canTogglePublishedState: PropTypes.bool.isRequired,
        editForm: PropTypes.node.isRequired,
        hasInitialFocus: PropTypes.bool,
        avoidOpenEditContentInitially: PropTypes.bool,
        onClickDeleteButton: PropTypes.func.isRequired,
        onClickEditButton: PropTypes.func.isRequired,
    };

    static defaultProps = {
        hasInitialFocus: false,
        avoidOpenEditContentInitially: false,
    };

    constructor(props, context) {
        super(props, context);
        if (this.props.curriculumItem.type === quizTypes.codingExercise) {
            throw new Error(
                '<QuizEditor /> cannot edit coding exercises. Use <CodingExerciseQuizEditor /> instead.',
            );
        }
    }

    componentDidMount() {
        this.props.curriculumItem.refresh().catch(handleUnexpectedAPIError);
    }

    get shouldOpenEditContentInitially() {
        const {curriculumItem, avoidOpenEditContentInitially} = this.props;
        if (avoidOpenEditContentInitially) {
            return false;
        }
        if (curriculumItem.isAddContentOpen) {
            return false;
        }
        return curriculumItem.hasAssessmentContent && !curriculumItem.is_published;
    }

    get dataPurpose() {
        return {
            [quizTypes.simpleQuiz]: 'quiz-editor',
            [quizTypes.practiceTest]: 'practice-test-quiz-editor',
        }[this.props.curriculumItem.type];
    }

    get labels() {
        let publishedLabel = gettext('Quiz');
        let unpublishedLabel = gettext('Unpublished Quiz');
        if (this.props.curriculumItem.type === quizTypes.practiceTest) {
            publishedLabel = gettext('Practice Test');
            unpublishedLabel = gettext('Unpublished Practice Test');
        }
        return {publishedLabel, unpublishedLabel};
    }

    @autobind
    setRef(ref) {
        this.element = ref;
    }

    @autobind
    getContainer() {
        return this.element;
    }

    render() {
        const {
            curriculumItem,
            canTogglePublishedState,
            editForm,
            hasInitialFocus,
            onClickDeleteButton,
            onClickEditButton,
        } = this.props;
        const {publishedLabel, unpublishedLabel} = this.labels;
        return (
            <DefaultItemEditor
                styleName="quiz-editor"
                curriculumItem={curriculumItem}
                dataPurpose={this.dataPurpose}
                addContent={<AddContent curriculumItem={curriculumItem} />}
                editContent={
                    <EditContent
                        curriculumItem={curriculumItem}
                        canTogglePublishedState={canTogglePublishedState}
                    />
                }
                editForm={editForm}
                onSetRef={this.setRef}
                shouldOpenEditContentInitially={this.shouldOpenEditContentInitially}
                hasInitialFocus={hasInitialFocus}
            >
                {curriculumItem.type === quizTypes.practiceTest && curriculumItem.is_draft && (
                    <DraftAlert
                        curriculumItem={curriculumItem}
                        getContainer={this.getContainer}
                        styleName="draft-alert-editor-wrapper"
                    />
                )}
                <ItemBar
                    curriculumItem={curriculumItem}
                    styleName="item-bar"
                    publishedLabel={publishedLabel}
                    unpublishedLabel={unpublishedLabel}
                    collapseButton={
                        curriculumItem.hasAssessmentContent ? (
                            <ItemCollapseButton
                                isOpen={curriculumItem.isEditContentOpen}
                                onClick={curriculumItem.toggleEditContent}
                                data-purpose="quiz-collapse-btn"
                            />
                        ) : null
                    }
                    deleteButton={
                        <QuizDeleteButton
                            curriculumItem={curriculumItem}
                            onClick={onClickDeleteButton}
                        />
                    }
                    editButton={
                        <ItemIconButton
                            iconType="edit"
                            item={curriculumItem}
                            onClick={onClickEditButton}
                            data-purpose="quiz-edit-btn"
                        />
                    }
                >
                    {!curriculumItem.isAddContentOpen && !curriculumItem.hasAssessmentContent ? (
                        <ItemBar.ButtonContainer>
                            <Button
                                udStyle="secondary"
                                size="small"
                                data-purpose="quiz-add-content-btn"
                                onClick={curriculumItem.openAddContent}
                                aria-label={gettext('Add Questions')}
                            >
                                <ExpandPlusIcon label={false} size="small" />
                                {gettext('Questions')}
                            </Button>
                        </ItemBar.ButtonContainer>
                    ) : null}
                </ItemBar>
                {curriculumItem.isSaving && <QuizIsSavingBackdrop />}
            </DefaultItemEditor>
        );
    }
}
