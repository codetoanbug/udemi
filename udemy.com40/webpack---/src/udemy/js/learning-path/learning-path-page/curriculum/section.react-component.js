import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Sortable from 'base-components/ungraduated/sortable/sortable.react-component';
import {showErrorToast, showSuccessToast} from 'organization-common/toasts';
import Raven from 'utils/ud-raven';

import LearningPathSection from '../../learning-path-section.mobx-model';
import LearningPathStore from '../../learning-path.mobx-store';
import AddContentButton from '../add-content/add-content-button.react-component';
import {
    LEARNING_PATH_ERROR_MESSAGES,
    LEARNING_PATH_SUCCESS_MESSAGES,
    SORTABLE_ANIMATION_TIME,
    SORTABLE_SCROLL_SENSITIVITY,
    SORTABLE_SCROLL_SPEED,
} from '../constants';
import OrderBar from './order-bar.react-component';
import SectionCard from './section-card.react-component';
import SectionItem from './section-item.react-component';

import './section.less';

@inject('learningPathStore')
@observer
export default class Section extends React.Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        section: PropTypes.instanceOf(LearningPathSection).isRequired,
        isLastSection: PropTypes.bool.isRequired,
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        handleSortStart: PropTypes.func.isRequired,
        handleItemReorder: PropTypes.func.isRequired,
    };

    @observable isDeleteModalOpen = false;

    @autobind
    async handleDelete() {
        const {index, section, learningPathStore} = this.props;
        if (section.isSaving) {
            // Prevent sending delete request while the other API call is in progress
            return false;
        }
        try {
            await section.delete();
            learningPathStore.learningPath.deleteSectionAt(index);
            showSuccessToast(LEARNING_PATH_SUCCESS_MESSAGES.DELETED_ITEM);
        } catch (e) {
            Raven.captureException(e);
            showErrorToast(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_REMOVE_ITEM);
        }
        this.closeDeleteModal();
    }

    @autobind
    @action
    openDeleteModal() {
        this.isDeleteModalOpen = true;
    }

    @autobind
    @action
    closeDeleteModal() {
        this.isDeleteModalOpen = false;
    }

    renderItems() {
        const {section} = this.props;
        return section.items.map((item, index) => {
            const id = `section-${section.id}-item-${item.id}`;
            return (
                <li id={id} key={id}>
                    <SectionItem
                        index={index}
                        item={item}
                        onDeleteSuccess={section.deleteItemAt}
                        sectionIndex={this.props.index}
                    />
                </li>
            );
        });
    }

    renderAddButton() {
        const {index, section, isLastSection, learningPathStore} = this.props;

        return (
            <div className="no-drag" styleName="section-add-content-row">
                {!isLastSection && (
                    <>
                        {learningPathStore.isMobileViewportSize ? (
                            <div styleName="order-bar-spacer" />
                        ) : (
                            <OrderBar index={index} isDraggable={false} />
                        )}
                        <div styleName="add-content">
                            <AddContentButton
                                section={section}
                                sectionIndex={index}
                                id={`section-add-content-${section.id}`}
                                size="xsmall"
                                udStyle="ghost"
                                context="section"
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }

    renderActionMenu() {
        const {learningPathStore} = this.props;
        return (
            <div styleName="actions-menu" className="no-drag">
                <Dropdown
                    placement="bottom-end"
                    trigger={
                        <IconButton
                            udStyle={learningPathStore.isMobileViewportSize ? 'ghost' : 'secondary'}
                            size="small"
                            data-purpose="section-actions"
                        >
                            <MoreIcon label={gettext('Section actions')} />
                        </IconButton>
                    }
                >
                    <Dropdown.Menu>
                        <Dropdown.MenuItem
                            data-purpose="section-delete"
                            onClick={this.openDeleteModal}
                            icon={<DeleteIcon label={false} />}
                        >
                            {gettext('Delete')}
                        </Dropdown.MenuItem>
                    </Dropdown.Menu>
                </Dropdown>
                <ConfirmModal
                    data-purpose="section-delete-confirm"
                    title={gettext('Delete')}
                    confirmText={gettext('Delete')}
                    isOpen={this.isDeleteModalOpen}
                    onCancel={this.closeDeleteModal}
                    onConfirm={this.handleDelete}
                >
                    {gettext('This section heading will be deleted from the learning path.')}
                </ConfirmModal>
            </div>
        );
    }

    renderEditMode() {
        const {isTabletViewportSize} = this.props.learningPathStore;
        const {isExpanded} = this.props.section;
        return (
            <>
                <SectionCard index={this.props.index} section={this.props.section} />
                <div data-purpose="collapse" styleName={!isExpanded ? 'collapsed' : ''}>
                    <div data-container-index={this.props.index}>
                        <Sortable
                            options={{
                                animation: SORTABLE_ANIMATION_TIME,
                                forceFallback: true,
                                group: {
                                    name: 'path-section',
                                    put: ['path-section', 'path-section-invisible'],
                                },
                                onStart: this.props.handleSortStart,
                                onEnd: this.props.handleItemReorder,
                                filter: '.no-drag',
                                preventOnFilter: false,
                                scrollSpeed: SORTABLE_SCROLL_SPEED,
                                scrollSensitivity: SORTABLE_SCROLL_SENSITIVITY,
                                handle: isTabletViewportSize ? '.drag-bar' : '',
                            }}
                            id={`section-${this.props.index}`}
                            tag="ul"
                            className="ud-unstyled-list"
                        >
                            {this.renderItems()}
                        </Sortable>
                        {this.renderAddButton()}
                    </div>
                </div>
                {this.renderActionMenu()}
            </>
        );
    }

    renderViewMode() {
        const {isExpanded} = this.props.section;
        return (
            <>
                <SectionCard index={this.props.index} section={this.props.section} />
                <div data-purpose="collapse" styleName={!isExpanded ? 'collapsed' : ''}>
                    <div>
                        <ul id={`section-${this.props.index}`} className="ud-unstyled-list">
                            {this.renderItems()}
                        </ul>
                    </div>
                </div>
            </>
        );
    }

    render() {
        const {isEditModeEnabled} = this.props.learningPathStore;
        return (
            <div styleName="container" data-purpose="section">
                {isEditModeEnabled ? this.renderEditMode() : this.renderViewMode()}
            </div>
        );
    }
}
