import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import DefaultItemEditor from '../default-item-editor.react-component';
import ItemBar from '../item-bar.react-component';
import ItemIconButton from '../item-icon-button.react-component';
import CurriculumAssignmentModel from './curriculum-assignment.mobx-model';

@observer
export default class AssignmentEditor extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumAssignmentModel).isRequired,
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
                data-purpose="assignment-editor"
                hasInitialFocus={hasInitialFocus}
            >
                <ItemBar
                    curriculumItem={curriculumItem}
                    publishedLabel={gettext('Assignment')}
                    unpublishedLabel={gettext('Unpublished Assignment')}
                    deleteButton={
                        <ItemIconButton
                            iconType="delete"
                            item={curriculumItem}
                            onClick={onClickDeleteButton}
                            disabled={curriculumItem.isSaving}
                            data-purpose="assignment-delete-btn"
                        />
                    }
                    editButton={
                        <ItemIconButton
                            iconType="edit"
                            item={curriculumItem}
                            href={curriculumItem.editUrl}
                            data-purpose="assignment-edit-btn"
                        />
                    }
                />
            </DefaultItemEditor>
        );
    }
}
