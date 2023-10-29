import {onEnterAndSpace} from '@udemy/design-system-utils';
import {LocalizedHtml} from '@udemy/i18n';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {Link, Button} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {AlertBanner, AlertBannerContent} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ASSET_TYPE, ASSET_STATUS} from 'asset/constants';
import {
    FREE_COURSE_CONTENT_LENGTH_LIMIT,
    FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
} from 'course-manage-v2/constants';
import CurriculumEditorStore from 'course-manage-v2/curriculum/curriculum-editor.mobx-store';
import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {SelectedAssetCard} from '../../../asset-creator/selected-asset-cards.react-component';
import SingleAssetTable from '../../../asset-creator/single-asset-table.react-component';
import {assetStatuses, assetTypes} from '../../../asset-library/constants';
import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import DescriptionForm from './description-form.react-component';
import LectureSettings from './lecture-settings.react-component';
import LinkToLabForm from './link-to-lab-form.react-component';
import SupplementaryAssetsEditor from './supplementary-assets-editor.react-component';

import './lecture-editor.less';

const FreeCourseLengthRestrictionAlert = ({courseVideoLength, onClickDeleteButton}) => (
    <AlertBannerContent
        udStyle="error"
        styleName="alert"
        data-purpose="free-course-content-length-alert"
        title={ninterpolate(
            'Free courses must have less than %s hour of video content',
            'Free courses must have less than %s hours of video content',
            FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
        )}
        body={
            <LocalizedHtml
                html={gettext(
                    'Adding this video will put the course at <strong><span class="duration">%(duration)s</span></strong> of video content. ' +
                        'This exceeds the maximum video duration allowed under our free course policy.',
                )}
                interpolate={{
                    duration: (
                        <Duration
                            numSeconds={courseVideoLength}
                            precision={Duration.PRECISION.MINUTES}
                        />
                    ),
                }}
            />
        }
        ctaText={gettext('Select new price')}
        actionButtonProps={{componentClass: Link, to: '/pricing'}}
        dismissButtonText={gettext('Delete lecture')}
        onDismiss={onClickDeleteButton}
    />
);

FreeCourseLengthRestrictionAlert.propTypes = {
    courseVideoLength: PropTypes.number.isRequired,
    onClickDeleteButton: PropTypes.func.isRequired,
};

const MainAsset = observer(({curriculumItem, onEdit, onReplaceWithVideo}) => {
    if (!curriculumItem.asset) {
        return null;
    }
    const assetUploaderStore = curriculumItem.assetUploaderStores[curriculumItem.asset.asset_type];
    if (assetUploaderStore && curriculumItem.asset.status !== assetStatuses.success) {
        return (
            <div styleName="table-container">
                <SingleAssetTable store={assetUploaderStore} onReplace={onEdit} />
            </div>
        );
    }
    // Assuming data integrity, this case implies asset.status === assetStatuses.success
    // because the other assetStatuses (processing, failed, queued) only make sense for
    // uploadable asset types. If we end up with weird data, such as assetTypes.article
    // with assetTypes.failed, then `<SelectedAssetCard />` can still render "Edit Content"
    // button, which enables instructor to replace the broken content.
    return (
        <SelectedAssetCard
            asset={curriculumItem.asset}
            onEdit={onEdit}
            onReplaceWithVideo={onReplaceWithVideo}
        />
    );
});
@inject('store')
@observer
export default class EditContent extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        canToggleIsFree: PropTypes.bool.isRequired,
        canTogglePublishedState: PropTypes.bool.isRequired,
        className: PropTypes.string,
        onClickDeleteButton: PropTypes.func.isRequired,
        seenCaptionManage: PropTypes.bool.isRequired,
        store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
    };

    static defaultProps = {
        className: undefined,
    };

    constructor(props, context) {
        super(props, context);
        this.openDescriptionFormA11y = onEnterAndSpace(
            this.props.curriculumItem.openDescriptionForm,
        );
        this.validAssetTypes = [ASSET_TYPE.VIDEO, ASSET_TYPE.VIDEO_MASHUP];
    }

    @autobind
    onEditMainAsset() {
        const curriculumItem = this.props.curriculumItem;
        let contentType = curriculumItem.asset.asset_type;
        if (curriculumItem.asset.asset_type === assetTypes.importContent) {
            // We no longer allow assetTypes.importContent to be created, even for old lectures.
            // They can only be deleted.
            contentType = null;
        }
        curriculumItem.setSelectedContentType(contentType);
        curriculumItem.openAddContent();
    }

    @autobind
    onReplaceWithVideoConfirm() {
        const {curriculumItem} = this.props;
        curriculumItem.replaceWithVideo().catch(handleUnexpectedAPIError);
    }

    @autobind
    onAddSupplementaryAsset() {
        this.props.curriculumItem.setSelectedContentType(assetTypes.file);
        this.props.curriculumItem.openAddContent();
    }

    @autobind
    onToggleIsFree() {
        this.props.curriculumItem
            .partialUpdate({
                is_free: !this.props.curriculumItem.is_free,
            })
            .catch(handleUnexpectedAPIError);
    }

    @autobind
    onToggleIsDownloadable() {
        this.props.curriculumItem
            .partialUpdate({
                is_downloadable: !this.props.curriculumItem.is_downloadable,
            })
            .catch(handleUnexpectedAPIError);
    }

    @autobind
    onToggleIsPublished() {
        this.props.curriculumItem
            .partialUpdate({
                is_published: !this.props.curriculumItem.is_published,
            })
            .then(() => {
                this.props.store.pageStore.getContentLengthVideo();
            })
            .catch((error) => {
                if (error.non_field_errors && error.non_field_errors[0]) {
                    error.detail = error.non_field_errors[0];
                }
                handleUnexpectedAPIError(error);
            });
    }

    get totalCourseVideoLengthEstimation() {
        const {curriculumItem, store} = this.props;

        const curriculumItemTimeEstimation =
            curriculumItem.asset && this.validAssetTypes.includes(curriculumItem.asset.asset_type)
                ? curriculumItem.asset.time_estimation
                : 0;
        return store.pageStore.course.contentLengthVideo + curriculumItemTimeEstimation;
    }

    get isFreeContentExceedTimeLimit() {
        const {curriculumItem, store} = this.props;
        /*  Display the free course content length alert and disable publish button when the
         *  content of the video exceeds 2 hours. Keep under the experiment until 3/2/2020
         */
        return (
            !store.course.organization_id &&
            !curriculumItem.is_published &&
            !store.pageStore.course.isPaid &&
            curriculumItem.asset &&
            curriculumItem.asset.status === ASSET_STATUS.SUCCESS &&
            this.validAssetTypes.includes(curriculumItem.asset.asset_type) &&
            this.totalCourseVideoLengthEstimation > FREE_COURSE_CONTENT_LENGTH_LIMIT
        );
    }

    render() {
        const {
            curriculumItem,
            canToggleIsFree,
            canTogglePublishedState,
            className,
            seenCaptionManage,
            onClickDeleteButton,
            store,
        } = this.props;
        const showMainAsset = !!curriculumItem.asset;
        const showAddDescriptionButton =
            !curriculumItem.description && !curriculumItem.isDescriptionFormOpen;
        const showAddResourcesButton = curriculumItem.is_published || curriculumItem.asset;

        return (
            <div className={className} data-purpose="edit-content">
                {showMainAsset || curriculumItem.hasCompletedAssetContent ? (
                    <div styleName="edit-content-header edit-content-row">
                        <div styleName="edit-content-header-left">
                            {showMainAsset ? (
                                <div data-purpose="asset-info">
                                    <MainAsset
                                        curriculumItem={curriculumItem}
                                        onEdit={this.onEditMainAsset}
                                        onReplaceWithVideo={
                                            curriculumItem.openReplaceWithVideoConfirmation
                                        }
                                    />
                                </div>
                            ) : null}
                        </div>
                        {curriculumItem.hasCompletedAssetContent ? (
                            <LectureSettings
                                curriculumItem={curriculumItem}
                                canToggleIsFree={canToggleIsFree}
                                canTogglePublishedState={canTogglePublishedState}
                                onToggleIsDownloadable={this.onToggleIsDownloadable}
                                onToggleIsFree={this.onToggleIsFree}
                                onToggleIsPublished={this.onToggleIsPublished}
                                disablePublishButton={this.isFreeContentExceedTimeLimit}
                            />
                        ) : null}
                    </div>
                ) : null}
                {curriculumItem.isDescriptionFormOpen ? (
                    <div styleName="edit-content-row">
                        <DescriptionForm curriculumItem={curriculumItem} />
                    </div>
                ) : null}
                {curriculumItem.description && !curriculumItem.isDescriptionFormOpen ? (
                    <div styleName="edit-content-row">
                        <div
                            styleName="description-box"
                            onClick={curriculumItem.openDescriptionForm}
                            onKeyDown={this.openDescriptionFormA11y}
                            role="button"
                            tabIndex="0"
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'edit-content:curriculum-item-description',
                                html: curriculumItem.description,
                                dataPurpose: 'desc-box',
                            })}
                        />
                    </div>
                ) : null}
                <SupplementaryAssetsEditor curriculumItem={curriculumItem} />
                {store.showLinkToLab && (
                    <div styleName="edit-content-row">
                        <LinkToLabForm curriculumItem={curriculumItem} />
                    </div>
                )}
                {showAddDescriptionButton || showAddResourcesButton ? (
                    <div styleName="edit-content-row">
                        {showAddDescriptionButton ? (
                            <div styleName="edit-content-button-row">
                                <Button
                                    size="small"
                                    udStyle="secondary"
                                    data-purpose="add-desc-btn"
                                    onClick={curriculumItem.openDescriptionForm}
                                    aria-label={gettext('Add Description')}
                                >
                                    <ExpandPlusIcon label={false} size="small" />
                                    {gettext('Description')}
                                </Button>
                            </div>
                        ) : null}
                        {showAddResourcesButton ? (
                            <div styleName="edit-content-button-row">
                                <Button
                                    size="small"
                                    udStyle="secondary"
                                    data-purpose="add-resources-btn"
                                    onClick={this.onAddSupplementaryAsset}
                                    aria-label={gettext('Add Resources')}
                                >
                                    <ExpandPlusIcon label={false} size="small" />
                                    {gettext('Resources')}
                                </Button>
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {this.isFreeContentExceedTimeLimit && (
                    <FreeCourseLengthRestrictionAlert
                        courseVideoLength={this.totalCourseVideoLengthEstimation}
                        onClickDeleteButton={onClickDeleteButton}
                    />
                )}
                {curriculumItem.course.wasPublished && !seenCaptionManage ? (
                    <AlertBanner
                        showCta={false}
                        styleName="alert"
                        title={gettext('Captions are now managed via the Captions page.')}
                        body={
                            <LocalizedHtml
                                className="ud-text-with-links"
                                html={gettext(
                                    'You can find a link in the menu on the left or <a class="captionLink">from here</a>.',
                                )}
                                interpolate={{
                                    captionLink: <Link to="/captions" />,
                                }}
                            />
                        }
                    />
                ) : null}
                <ConfirmModal
                    title={gettext('Update this lecture to video')}
                    onClose={curriculumItem.closeReplaceWithVideoConfirmation}
                    isOpen={curriculumItem.showReplaceWithVideoConfirmation}
                    onCancel={curriculumItem.closeReplaceWithVideoConfirmation}
                    onConfirm={this.onReplaceWithVideoConfirm}
                    confirmText={
                        curriculumItem.hasTextBasedAssetContent
                            ? gettext('Replace with video')
                            : gettext('Convert to video')
                    }
                >
                    {curriculumItem.hasTextBasedAssetContent
                        ? gettext(
                              'The content of this lecture will be deleted, but the description and any downloadable resources will remain. ' +
                                  'You will be prompted to add a video file and re-publish as a video lecture.',
                          )
                        : gettext(
                              'The content of this lecture will be added as a downloadable resource, which you may choose to remove. ' +
                                  'You will be prompted to add a video file and re-publish as a video lecture.',
                          )}
                </ConfirmModal>
            </div>
        );
    }
}
