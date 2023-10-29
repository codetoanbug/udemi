import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ItemBar from '../item-bar.react-component';
import ItemIconButton from '../item-icon-button.react-component';
import CurriculumSectionModel from './curriculum-section.mobx-model';
import './section-editor.less';

@observer
export default class SectionEditor extends Component {
    static propTypes = {
        className: PropTypes.string,
        curriculumItem: PropTypes.instanceOf(CurriculumSectionModel).isRequired,
        editForm: PropTypes.node.isRequired,
        onClickDeleteButton: PropTypes.func.isRequired,
        onClickEditButton: PropTypes.func.isRequired,
    };

    static defaultProps = {
        className: '',
    };

    render() {
        const {
            className,
            curriculumItem,
            editForm,
            onClickDeleteButton,
            onClickEditButton,
        } = this.props;
        return (
            <div data-purpose="section-editor">
                {editForm && curriculumItem.isEditFormOpen ? (
                    <div styleName="section-edit-form">{editForm}</div>
                ) : null}
                <ItemBar
                    className={className}
                    styleName={classNames({hidden: curriculumItem.isEditFormOpen})}
                    curriculumItem={curriculumItem}
                    deleteButton={
                        <ItemIconButton
                            iconType="delete"
                            item={curriculumItem}
                            onClick={onClickDeleteButton}
                            disabled={curriculumItem.isSaving}
                            data-purpose="section-delete-btn"
                        />
                    }
                    editButton={
                        <ItemIconButton
                            iconType="edit"
                            item={curriculumItem}
                            onClick={onClickEditButton}
                            data-purpose="section-edit-btn"
                        />
                    }
                    publishedLabel={gettext('Section')}
                    unpublishedLabel={gettext('Unpublished Section')}
                />
            </div>
        );
    }
}
