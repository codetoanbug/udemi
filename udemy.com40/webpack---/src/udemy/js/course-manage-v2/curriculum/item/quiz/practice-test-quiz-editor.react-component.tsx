import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {quizTypes} from 'course-manage-v2/curriculum/item/constants';
import DraftAlert from 'course-manage-v2/curriculum/item/quiz/draft-alert.react-component';
import QuizIsSavingBackdrop from 'course-manage-v2/curriculum/item/quiz/quiz-is-saving-backdrop.react-component';

import DefaultItemEditor from '../default-item-editor.react-component';
import ItemBar from '../item-bar.react-component';
import ItemIconButton from '../item-icon-button.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import './quiz-editor.less';

@observer
export class PracticeTestQuizEditor extends Component<{
    curriculumItem: CurriculumQuizModel;
    onClickDeleteButton: VoidFunction;
    hasInitialFocus: boolean;
}> {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        onClickDeleteButton: PropTypes.func.isRequired,
        hasInitialFocus: PropTypes.bool,
    };

    static defaultProps = {
        hasInitialFocus: false,
    };

    private element: React.RefObject<HTMLElement> | undefined;

    @autobind
    setRef(ref: React.RefObject<HTMLElement>) {
        this.element = ref;
    }

    @autobind
    getContainer() {
        return this.element;
    }

    render() {
        const {curriculumItem, onClickDeleteButton, hasInitialFocus} = this.props;
        return (
            <DefaultItemEditor
                curriculumItem={curriculumItem}
                dataPurpose="practice-test-quiz-editor"
                hasInitialFocus={hasInitialFocus}
                onSetRef={this.setRef}
                styleName="quiz-editor"
            >
                {
                    // @ts-expect-error curriculumItem is not typed
                    curriculumItem.type === quizTypes.practiceTest && curriculumItem.is_draft && (
                        <DraftAlert
                            curriculumItem={curriculumItem}
                            getContainer={this.getContainer}
                            styleName="draft-alert-editor-wrapper"
                        />
                    )
                }
                <ItemBar
                    curriculumItem={curriculumItem}
                    publishedLabel={gettext('Practice Test')}
                    unpublishedLabel={gettext('Unpublished Practice Test')}
                    deleteButton={
                        <ItemIconButton
                            iconType="delete"
                            item={curriculumItem}
                            onClick={onClickDeleteButton}
                            disabled={curriculumItem.isSaving}
                            data-purpose="quiz-delete-btn"
                        />
                    }
                    editButton={
                        <ItemIconButton
                            iconType="edit"
                            item={curriculumItem}
                            href={curriculumItem.editPracticeTestUrl}
                            data-purpose="quiz-edit-btn"
                        />
                    }
                />
                {curriculumItem.isSaving && <QuizIsSavingBackdrop />}
            </DefaultItemEditor>
        );
    }
}
