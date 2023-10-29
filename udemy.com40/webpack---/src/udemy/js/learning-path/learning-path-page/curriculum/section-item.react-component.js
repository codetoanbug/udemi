import {getUniqueId, onEnterAndSpace} from '@udemy/design-system-utils';
import AssignmentIcon from '@udemy/icons/dist/assignment.ud-icon';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import LabIcon from '@udemy/icons/dist/labs.ud-icon';
import LinkIcon from '@udemy/icons/dist/link.ud-icon';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import {Badge} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import Clipboard from 'clipboard';
import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {showErrorToast, showSuccessToast, showInformationToast} from 'organization-common/toasts';
import Raven from 'utils/ud-raven';

import EditableText from '../../editable-text.react-component';
import LearningPathSectionItem from '../../learning-path-section-item.mobx-model';
import LearningPathStore from '../../learning-path.mobx-store';
import {
    getFirstItemInViewport,
    isPathItemGoingToBeRetired,
    updateScrollWithOffset,
} from '../../utils';
import {
    ASSESSMENT_CONTENT_TYPE,
    AUTO_ENROLL_INFO_MESSAGE,
    CONTENT_ITEM_TYPES,
    CONTENT_TYPE_CONFIG,
    COURSE_CONTENT_TYPE,
    COURSE_EDITABLE_CONTENT_TYPES,
    COURSE_PORTION_CONTENT_TYPE,
    DESCRIPTION_PLACEHOLDER,
    LAB_CONTENT_TYPE,
    LEARNING_PATH_ERROR_MESSAGES,
    LEARNING_PATH_SUCCESS_MESSAGES,
    LEARNING_PATH_TITLE_MAXLENGH,
    RESOURCE_CONTENT_TYPE,
    RESOURCE_DEFAULT_SCHEMA,
} from '../constants';
import pageEventTracker from '../page-event-tracker';
import ItemImage from './item-image.react-component';
import ItemMeta from './item-meta.react-component';
import OrderBar from './order-bar.react-component';
import RemovedCourseAlert from './removed-course-alert.react-component';
import styles from './section-item.less';
import ToBeRetiredCourseAlert from './to-be-retired-course-alert.react-component';

class CopyMenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.id = getUniqueId('copy-menu-item');
        this.clipboard = new Clipboard(`#${this.id}`);
        this.clipboard.on('success', this.onCopySuccess);
        this.clipboard.on('error', this.onCopyError);
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    @autobind
    onCopySuccess() {
        showSuccessToast(gettext('Copied to clipboard'));
    }

    @autobind
    onCopyError() {
        showErrorToast(gettext('Unable to copy link'));
    }

    render() {
        return <Dropdown.MenuItem {...this.props} id={this.id} />;
    }
}

@inject('learningPathStore', 'actionCallbacks')
@observer
export default class SectionItem extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        index: PropTypes.number.isRequired,
        item: PropTypes.instanceOf(LearningPathSectionItem).isRequired,
        onDeleteSuccess: PropTypes.func.isRequired,
        sectionIndex: PropTypes.number.isRequired,
        actionCallbacks: PropTypes.shape({
            handleEditClick: PropTypes.func,
        }).isRequired,
    };

    @observable isDeleteModalOpen = false;

    get textTitle() {
        const isBeta = this.props.item.content.isBeta;
        return (
            <h3 className="ud-heading-sm" styleName="title">
                {this.props.item.title}
                {isBeta && (
                    <Popover
                        canToggleOnHover={true}
                        placement="bottom-start"
                        trigger={<Badge styleName="beta-badge">{gettext('Beta')}</Badge>}
                    >
                        <div className="ud-text-md">
                            {gettext(
                                'This assessment is new. Your data will help us to continue making improvements.',
                            )}
                        </div>
                    </Popover>
                )}
            </h3>
        );
    }

    get image() {
        const {content, type} = this.props.item;
        if (type === RESOURCE_CONTENT_TYPE) {
            return content.image;
        }
        return this.props.learningPathStore.isMobileViewportSize
            ? content.imageMobile
            : content.image;
    }

    get itemUrl() {
        const {item, learningPathStore} = this.props;
        let url;
        switch (item.type) {
            case ASSESSMENT_CONTENT_TYPE:
            case COURSE_CONTENT_TYPE:
            case LAB_CONTENT_TYPE:
            case COURSE_PORTION_CONTENT_TYPE:
                url = `${item.content.url}?learning_path_id=${learningPathStore.learningPath.id}`;
                break;
            default:
                url = item.content.url;
        }
        return url;
    }

    get target() {
        const {item, learningPathStore} = this.props;
        let target;
        switch (item.type) {
            case ASSESSMENT_CONTENT_TYPE:
            case COURSE_CONTENT_TYPE:
            case LAB_CONTENT_TYPE:
            case COURSE_PORTION_CONTENT_TYPE:
                target = '_self';
                break;
            default:
                target =
                    learningPathStore.isMobileViewportSize || learningPathStore.isTabletViewportSize
                        ? '_self'
                        : '_blank';
        }
        return target;
    }

    @autobind
    async handleClick() {
        const {learningPathStore, item} = this.props;
        const {isEditModeEnabled, learningPath} = learningPathStore;
        if (isEditModeEnabled || item.isRemoved) {
            return;
        }
        const {content, complete, type} = item;
        await complete();
        const autoEnrollSuccess = await learningPathStore.learningPath.autoEnroll({
            id: item.id,
            type: LearningPathSectionItem.contentTypeToAnalyticsEnrollmentSourceMapping[type],
            isDeepLink: false,
        });
        if (autoEnrollSuccess) {
            showInformationToast(AUTO_ENROLL_INFO_MESSAGE.TEXT);
        }
        pageEventTracker.sectionItemClicked(type, content, learningPathStore.learningPath);
        this.trackContentItemClicked(type, content.id);

        if (!item.isEnrollableUdemyType) {
            return this._followItemUrl(this.itemUrl, this.target);
        }
        try {
            const response = await item.content.enroll({learning_path_id: learningPath.id});
            if (response.data.redirect_url) {
                return this._followItemUrl(response.data.redirect_url, this.target);
            }
        } catch (e) {
            showErrorToast(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_ENROLL_TO_COURSE);
            if (e.response && e.response.data && e.response.data.redirect_url) {
                return this._followItemUrl(e.response.data.redirect_url, this.target);
            }
        }
        return this._followItemUrl(this.itemUrl, this.target);
    }

    trackContentItemClicked(type, itemId) {
        let contentItemType;
        switch (type) {
            case ASSESSMENT_CONTENT_TYPE:
                contentItemType = CONTENT_ITEM_TYPES.ASSESSMENT;
                break;
            case COURSE_CONTENT_TYPE:
                contentItemType = CONTENT_ITEM_TYPES.COURSE;
                break;
            case LAB_CONTENT_TYPE:
                contentItemType = CONTENT_ITEM_TYPES.LAB;
                break;
            case COURSE_PORTION_CONTENT_TYPE:
                contentItemType = CONTENT_ITEM_TYPES.COURSE_SECTION;
                break;
            case RESOURCE_CONTENT_TYPE:
                contentItemType = CONTENT_ITEM_TYPES.LINK;
                break;
            default:
                contentItemType = '';
        }

        pageEventTracker.contentItemClicked(contentItemType, itemId);
    }

    @autobind
    async handleDelete() {
        const {item} = this.props;
        const courseIdOfItemToBeDeleted = this.props.item.content.courseId;
        if (item.isSaving) {
            // Prevent sending delete request while the other API call is in progress
            return false;
        }
        try {
            await this.props.item.delete();
            if (isPathItemGoingToBeRetired(item)) {
                pageEventTracker.deletedCourseToBeRetired(courseIdOfItemToBeDeleted);
            }
            this.props.onDeleteSuccess(this.props.index);
            !this.props.item.isRemoved &&
                showSuccessToast(LEARNING_PATH_SUCCESS_MESSAGES.DELETED_ITEM);
            this.props.learningPathStore.learningPath.resetLocalEditTimestamp();
        } catch (e) {
            Raven.captureException(e);
            !this.props.item.isRemoved &&
                showErrorToast(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_REMOVE_ITEM);
        }
        !this.props.item.isRemoved && this.closeDeleteModal();
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

    _followItemUrl(url, target) {
        if (!this.props.item.isEnrollableUdemyType && url.indexOf('://') < 0) {
            url = RESOURCE_DEFAULT_SCHEMA + url;
        }

        return window.open(url, target);
    }

    @computed
    get progressDisplay() {
        if (this.props.item.isCompleted) {
            return (
                <TickIcon
                    size="xsmall"
                    color="inherit"
                    label={false}
                    data-purpose="completed-icon"
                />
            );
        }
    }

    @autobind
    onImageLoadError() {
        this.props.item.resetImage();
    }

    @autobind
    handleItemSelected() {
        const infoPanel = document.getElementById('info-panel-desktop');
        const item = getFirstItemInViewport(infoPanel);

        if (item && (this.props.learningPathStore.isMobileViewportSize || infoPanel)) {
            const offset = item.getBoundingClientRect().top;
            // we need to wait for the edit mode to be rendered
            setTimeout(() => {
                updateScrollWithOffset(infoPanel, item.id, offset);
            });
        }
    }

    renderActionMenu() {
        const {item, learningPathStore} = this.props;
        return (
            <div styleName="actions-menu" className="no-drag">
                <Dropdown
                    data-purpose="section-item-actions"
                    placement="bottom-end"
                    trigger={
                        <IconButton
                            udStyle={learningPathStore.isMobileViewportSize ? 'ghost' : 'secondary'}
                            size="small"
                        >
                            <MoreIcon label={gettext('Item actions')} />
                        </IconButton>
                    }
                >
                    <Dropdown.Menu>
                        {learningPathStore.learningPath.isCopyItemEnabled && (
                            <CopyMenuItem
                                data-purpose="copy-link-section-item"
                                data-clipboard-text={item.content.copyLinkUrl}
                                componentClass="button"
                                icon={<LinkIcon label={false} />}
                            >
                                {gettext('Copy link')}
                            </CopyMenuItem>
                        )}
                        <Dropdown.MenuItem
                            data-purpose="section-item-delete"
                            onClick={this.openDeleteModal}
                            icon={<DeleteIcon label={false} />}
                        >
                            {gettext('Delete')}
                        </Dropdown.MenuItem>
                    </Dropdown.Menu>
                </Dropdown>
                <ConfirmModal
                    title={gettext('Delete')}
                    confirmText={gettext('Delete')}
                    isOpen={this.isDeleteModalOpen}
                    onCancel={this.closeDeleteModal}
                    onConfirm={this.handleDelete}
                >
                    {gettext('This item will be deleted from the learning path.')}
                </ConfirmModal>
            </div>
        );
    }

    renderEditMode() {
        const {id, type, title, description, setTitle, setDescription} = this.props.item;
        return (
            <>
                {COURSE_EDITABLE_CONTENT_TYPES.includes(type) ||
                type === ASSESSMENT_CONTENT_TYPE ? (
                    // Course title is not editable in learning path
                    this.textTitle
                ) : (
                    <EditableText
                        placeholder={CONTENT_TYPE_CONFIG[type].untitled}
                        className={classNames(styles.title, 'ud-heading-sm')}
                        elementType="h3"
                        value={title}
                        id={`section-item-title-${id}`}
                        onChange={setTitle}
                        shouldSavePlaceholderAsValue={true}
                        maxLength={LEARNING_PATH_TITLE_MAXLENGH}
                    />
                )}
                <EditableText
                    placeholder={DESCRIPTION_PLACEHOLDER.TEXT}
                    className={styles.description}
                    elementType="p"
                    id={`section-item-description-${id}`}
                    value={description}
                    onChange={setDescription}
                />
                {this.renderActionMenu()}
            </>
        );
    }

    renderViewMode() {
        return (
            <>
                {this.textTitle}
                {!this.props.learningPathStore.isMobileViewportSize && (
                    <p styleName="description">{this.props.item.description}</p>
                )}
            </>
        );
    }

    renderAlertRemovedCourse() {
        const {index, item, sectionIndex} = this.props;

        return (
            <div styleName="alert-wrapper">
                <OrderBar
                    index={index}
                    isUnsectioned={!item.learningPathSection.isVisible}
                    text={this.progressDisplay}
                    isCompleted={item.isCompleted}
                    size="small"
                    isInCourseRemovalAlert={true}
                />
                <div styleName="column-container">
                    <RemovedCourseAlert
                        sectionIndex={sectionIndex}
                        item={item}
                        itemIndex={index}
                        handleDeleteCallback={this.handleDelete}
                        handleAlertClickEditCallback={this.handleItemSelected}
                    />
                </div>
            </div>
        );
    }

    renderItemImage() {
        const {item} = this.props;

        if (item.type === ASSESSMENT_CONTENT_TYPE) {
            return (
                <div styleName="assessment-icon-container">
                    <AssignmentIcon label={item.title} size="xlarge" styleName="assessment-icon" />
                </div>
            );
        }
        if (item.type === LAB_CONTENT_TYPE) {
            return (
                <div styleName="lab-icon-container">
                    <LabIcon label={item.title} size="xlarge" styleName="lab-icon" />
                </div>
            );
        }
        return (
            <ItemImage
                onError={this.onImageLoadError}
                styleName="image"
                src={this.image}
                title={item.title}
            />
        );
    }

    renderSectionItem() {
        const {learningPathStore, index, item, actionCallbacks} = this.props;
        const {isEditModeEnabled, isMobileViewportSize} = learningPathStore;

        const shouldDisplayToBeRetiredCourseAlert =
            isPathItemGoingToBeRetired(item) && learningPathStore.learningPath.canUserEdit;

        const classes = classNames('section-item-container-wrapper', {
            'section-item-container-wrapper--edit-mode': learningPathStore.isEditModeEnabled,
            'section-item-container-wrapper--retired': shouldDisplayToBeRetiredCourseAlert,
        });

        return (
            <div styleName={classes}>
                <OrderBar
                    index={index}
                    isUnsectioned={!item.learningPathSection.isVisible}
                    text={this.progressDisplay}
                    isCompleted={item.isCompleted}
                    size="small"
                />
                <div styleName="column-container">
                    <div styleName="container" aria-label={gettext('Section item')}>
                        {this.renderItemImage()}

                        <div styleName="content">
                            {isEditModeEnabled ? this.renderEditMode() : this.renderViewMode()}
                            <ItemMeta
                                item={item}
                                isEditModeEnabled={isEditModeEnabled}
                                isMobileViewportSize={isMobileViewportSize}
                            />
                        </div>
                    </div>
                    {shouldDisplayToBeRetiredCourseAlert && (
                        <ToBeRetiredCourseAlert
                            item={item}
                            index={index}
                            learningPathStore={learningPathStore}
                            actionCallbacks={actionCallbacks}
                        />
                    )}
                </div>
            </div>
        );
    }

    render() {
        const {learningPathStore, item} = this.props;
        const {isEditModeEnabled} = learningPathStore;

        const shouldDisplayRemovedCourseAlert =
            item.isRemoved && learningPathStore.learningPath.canUserEdit;

        return (
            <>
                {!isEditModeEnabled && shouldDisplayRemovedCourseAlert ? (
                    this.renderAlertRemovedCourse()
                ) : (
                    <div
                        role="link"
                        tabIndex="0"
                        onClick={this.handleClick}
                        onKeyDown={onEnterAndSpace(this.handleClick)}
                        data-purpose="clickable-container"
                    >
                        {shouldDisplayRemovedCourseAlert
                            ? this.renderAlertRemovedCourse()
                            : this.renderSectionItem()}
                    </div>
                )}
            </>
        );
    }
}
