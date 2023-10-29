import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import {assetStatuses} from '../../../asset-library/constants';
import DefaultItemEditor from '../default-item-editor.react-component';
import ItemBar from '../item-bar.react-component';
import ItemIconButton, {ItemCollapseButton} from '../item-icon-button.react-component';
import AddContent from './add-content.react-component';
import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import EditContent from './edit-content.react-component';
import './lecture-editor.less';

@observer
export default class LectureEditor extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        canTogglePublishedState: PropTypes.bool.isRequired,
        editForm: PropTypes.node.isRequired,
        hasInitialFocus: PropTypes.bool,
        avoidOpenEditContentInitially: PropTypes.bool,
        isFirstPublishedVideoLecture: PropTypes.bool,
        onClickDeleteButton: PropTypes.func.isRequired,
        onClickEditButton: PropTypes.func.isRequired,
        seenCaptionManage: PropTypes.bool.isRequired,
        isPreview: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        hasInitialFocus: false,
        avoidOpenEditContentInitially: false,
        isFirstPublishedVideoLecture: false,
    };

    componentDidMount() {
        const {curriculumItem, isFirstPublishedVideoLecture} = this.props;
        const asset = curriculumItem.asset;

        if (asset && curriculumItem.assetUploaderStores[asset.asset_type]) {
            curriculumItem.assetUploaderStores[asset.asset_type].initializeAsset(asset);
            this.cancelMainRefresh = curriculumItem.refreshMainAsset();
        }

        this.cancelSupplementaryRefresh = curriculumItem.refreshSupplementaryAssets();

        this.forceFirstPublishedVideoLectureToBeFree(curriculumItem, isFirstPublishedVideoLecture);
    }

    UNSAFE_componentWillReceiveProps({curriculumItem, isFirstPublishedVideoLecture}) {
        this.forceFirstPublishedVideoLectureToBeFree(curriculumItem, isFirstPublishedVideoLecture);
    }

    componentWillUnmount() {
        this.cancelMainRefresh && this.cancelMainRefresh();
        this.cancelSupplementaryRefresh && this.cancelSupplementaryRefresh();
    }

    get shouldOpenEditContentInitially() {
        const {curriculumItem, avoidOpenEditContentInitially} = this.props;
        if (avoidOpenEditContentInitially) {
            return false;
        }
        if (curriculumItem.isAddContentOpen) {
            return false;
        }
        if (curriculumItem.asset) {
            return (
                curriculumItem.asset.status !== assetStatuses.success ||
                !curriculumItem.is_published
            );
        }
        return !curriculumItem.is_published && !curriculumItem.description;
    }

    forceFirstPublishedVideoLectureToBeFree(curriculumItem, isFirstPublishedVideoLecture) {
        if (isFirstPublishedVideoLecture && !curriculumItem.is_free) {
            curriculumItem.partialUpdate({is_free: true}).catch(handleUnexpectedAPIError);
        }
    }

    render() {
        const {
            curriculumItem,
            canTogglePublishedState,
            editForm,
            hasInitialFocus,
            isFirstPublishedVideoLecture,
            isPreview,
            onClickDeleteButton,
            onClickEditButton,
            seenCaptionManage,
        } = this.props;

        // For new courses that haven't been published yet, we auto-publish lectures, so we don't show the "Publish/Unpublish" button.
        // However, for free courses, we auto-unpublish lectures to make sure the course stays within the FREE_COURSE_CONTENT_LENGTH_LIMIT.
        // But then if these free courses become paid courses, there is no way to re-publish these lectures, so we allow "Publish/Unpublish" button for this edge case.
        const canTogglePublishedStateFTP =
            !curriculumItem.is_published &&
            !curriculumItem.course.published_time &&
            curriculumItem.course.is_paid;
        return (
            <DefaultItemEditor
                curriculumItem={curriculumItem}
                dataPurpose="lecture-editor"
                addContent={<AddContent curriculumItem={curriculumItem} />}
                editContent={
                    <EditContent
                        curriculumItem={curriculumItem}
                        canToggleIsFree={!isFirstPublishedVideoLecture}
                        canTogglePublishedState={
                            canTogglePublishedState || canTogglePublishedStateFTP
                        }
                        onClickDeleteButton={onClickDeleteButton}
                        seenCaptionManage={seenCaptionManage}
                    />
                }
                editForm={editForm}
                shouldOpenEditContentInitially={this.shouldOpenEditContentInitially}
                hasInitialFocus={hasInitialFocus}
            >
                <ItemBar
                    curriculumItem={curriculumItem}
                    publishedLabel={gettext('Lecture')}
                    unpublishedLabel={gettext('Unpublished lecture')}
                    collapseButton={
                        <ItemCollapseButton
                            isOpen={curriculumItem.isEditContentOpen}
                            onClick={curriculumItem.toggleEditContent}
                            data-purpose="lecture-collapse-btn"
                        />
                    }
                    deleteButton={
                        <ItemIconButton
                            iconType="delete"
                            item={curriculumItem}
                            onClick={onClickDeleteButton}
                            disabled={curriculumItem.isSaving}
                            data-purpose="lecture-delete-btn"
                        />
                    }
                    editButton={
                        <ItemIconButton
                            iconType="edit"
                            item={curriculumItem}
                            onClick={onClickEditButton}
                            data-purpose="lecture-edit-btn"
                        />
                    }
                >
                    {isPreview ? (
                        <span data-purpose="lecture-preview-enabled-label">
                            {`(${gettext('Preview enabled')})`}
                        </span>
                    ) : null}
                    {!curriculumItem.isAddContentOpen && !curriculumItem.asset ? (
                        <ItemBar.ButtonContainer>
                            <Button
                                udStyle="secondary"
                                size="small"
                                data-purpose="lecture-add-content-btn"
                                onClick={curriculumItem.openAddContent}
                                aria-label={gettext('Add Content')}
                            >
                                <ExpandPlusIcon label={false} size="small" />
                                {gettext('Content')}
                            </Button>
                        </ItemBar.ButtonContainer>
                    ) : null}
                </ItemBar>
            </DefaultItemEditor>
        );
    }
}
