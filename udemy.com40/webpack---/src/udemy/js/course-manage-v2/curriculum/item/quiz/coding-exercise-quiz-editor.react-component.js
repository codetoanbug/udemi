import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import DefaultItemEditor from '../default-item-editor.react-component';
import ItemBar from '../item-bar.react-component';
import ItemIconButton from '../item-icon-button.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';

@observer
export default class CodingExerciseQuizEditor extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        onClickDeleteButton: PropTypes.func.isRequired,
        hasInitialFocus: PropTypes.bool,
    };

    static defaultProps = {
        hasInitialFocus: false,
    };

    render() {
        const {curriculumItem, onClickDeleteButton, hasInitialFocus} = this.props;
        return (
            <DefaultItemEditor
                curriculumItem={curriculumItem}
                dataPurpose="coding-exercise-quiz-editor"
                hasInitialFocus={hasInitialFocus}
            >
                <ItemBar
                    curriculumItem={curriculumItem}
                    publishedLabel={gettext('Coding Exercise')}
                    unpublishedLabel={gettext('Unpublished Coding Exercise')}
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
                            href={curriculumItem.editCodingExerciseUrl}
                            data-purpose="quiz-edit-btn"
                        />
                    }
                />
            </DefaultItemEditor>
        );
    }
}
