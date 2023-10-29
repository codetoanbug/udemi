import ArticleIcon from '@udemy/icons/dist/article.ud-icon';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import PresentationIcon from '@udemy/icons/dist/presentation.ud-icon';
import VideoMashupIcon from '@udemy/icons/dist/video-mashup.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {FREE_COURSE_CONTENT_LENGTH_LIMIT} from 'course-manage-v2/constants';
import CurriculumEditorStore from 'course-manage-v2/curriculum/curriculum-editor.mobx-store';
import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import ArticleAssetCreator from '../../../asset-creator/article-asset-creator.react-component';
import IFrameAssetCreator from '../../../asset-creator/i-frame-asset-creator.react-component';
import MediaAssetCreator from '../../../asset-creator/media-asset-creator.react-component';
import SupplementaryAssetCreator from '../../../asset-creator/supplementary-asset-creator/supplementary-asset-creator.react-component';
import VideoMashupAssetCreator from '../../../asset-creator/video-mashup-asset-creator/video-mashup-asset-creator.react-component';
import {assetLabels, assetTypes} from '../../../asset-library/constants';
import ContentTab from '../content-tab.react-component';
import ContentTypeSelector, {optionStyles} from '../content-type-selector.react-component';
import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import './lecture-editor.less';

const udConfig = getConfigData();

const learnMoreAboutContentTypesLink = udConfig.brand.has_organization
    ? udLink.to('support', '115005527628')
    : udLink.to('support', '229606188');

@inject('store')
@observer
export default class AddContent extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
    };

    componentWillUnmount() {
        this.cancelMainRefresh && this.cancelMainRefresh();
        this.cancelSupplementaryRefresh && this.cancelSupplementaryRefresh();
    }

    get availableContentTypes() {
        const {video, videoMashup, article, presentation} = assetTypes;
        const types = [
            {label: assetLabels[video], type: video, icon: PlayIcon},
            {label: assetLabels[videoMashup], type: videoMashup, icon: VideoMashupIcon},
            {label: assetLabels[article], type: article, icon: ArticleIcon},
        ];
        if (this.props.curriculumItem.course.isOrganizationOnly) {
            return types.concat({
                label: assetLabels[presentation],
                type: presentation,
                icon: PresentationIcon,
            });
        }
        return types;
    }

    get tabTitle() {
        const type = this.props.curriculumItem.selectedContentType;
        if (!type) {
            return gettext('Select content type');
        }
        if (type === assetTypes.file) {
            return gettext('Add Resources');
        }
        return interpolate(gettext('Add %(type)s'), {type: assetLabels[type]}, true);
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

    @autobind
    onSaveMainAsset(assetId) {
        const {curriculumItem, store} = this.props;
        curriculumItem
            .attachMainAsset(assetId)
            .then(() => {
                this.cancelMainRefresh = this.props.curriculumItem.refreshMainAsset();
                this.props.curriculumItem.openEditContent();
            })
            .then(() => {
                store.pageStore.getContentLengthVideo().then((contentLengthVideo) => {
                    if (
                        !store.course.organization_id &&
                        curriculumItem.is_published &&
                        !store.pageStore.course.isPaid &&
                        contentLengthVideo > FREE_COURSE_CONTENT_LENGTH_LIMIT
                    ) {
                        this.onToggleIsPublished();
                        return contentLengthVideo;
                    }
                });
            })
            .catch(handleUnexpectedAPIError);
    }

    @autobind
    onSaveSupplementaryAsset(assetId) {
        this.props.curriculumItem
            .attachSupplementaryAsset(assetId)
            .then(() => {
                this.cancelSupplementaryRefresh = this.props.curriculumItem.refreshSupplementaryAssets();
                this.props.curriculumItem.openEditContent();
            })
            .catch(handleUnexpectedAPIError);
    }

    renderContent() {
        const {curriculumItem} = this.props;
        const {assetLibraryStores, assetUploaderStores, selectedContentType} = curriculumItem;
        switch (selectedContentType) {
            case assetTypes.audio:
            case assetTypes.ebook:
            case assetTypes.presentation:
            case assetTypes.video:
                return (
                    <div styleName="tabs-container">
                        <MediaAssetCreator
                            type={selectedContentType}
                            onAssetSelected={this.onSaveMainAsset}
                            libraryStore={assetLibraryStores[selectedContentType]}
                            uploaderStore={assetUploaderStores[selectedContentType]}
                        />
                    </div>
                );
            case assetTypes.videoMashup:
                return (
                    <VideoMashupAssetCreator
                        curriculumItem={curriculumItem}
                        onAssetSelected={this.onSaveMainAsset}
                    />
                );
            case assetTypes.article:
                return (
                    <ArticleAssetCreator
                        curriculumItem={curriculumItem}
                        onSave={this.onSaveMainAsset}
                    />
                );
            case assetTypes.iFrame:
                // This case is only possible by clicking "Edit Content" on an old iFrame lecture.
                return (
                    <IFrameAssetCreator
                        curriculumItem={curriculumItem}
                        onSave={this.onSaveMainAsset}
                    />
                );
            case assetTypes.externalLink:
            case assetTypes.file:
                // The normal way to trigger this case is by clicking "Add Resources".
                // It can also be triggered by clicking "Edit Content" on an old lecture which has
                // assetTypes.file or assetTypes.externalLink as the *main* asset type. In the latter case,
                // it is not possible to edit the main asset, since this case only handles supplementary
                // assets. This is probably a bug, but given it only affects old lectures, we didn't
                // bother fixing it.
                return (
                    <div styleName="tabs-container">
                        <SupplementaryAssetCreator
                            curriculumItem={curriculumItem}
                            onAssetSelected={this.onSaveSupplementaryAsset}
                        />
                    </div>
                );
            case null:
                return (
                    <div>
                        <p className="ud-text-sm" styleName="select-content-type">
                            {gettext('Select the main type of content.')}{' '}
                            {gettext('Files and links can be added as resources.')}{' '}
                            <a
                                className="ud-link-underline"
                                href={learnMoreAboutContentTypesLink}
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                {gettext('Learn about content types.')}
                            </a>
                        </p>
                        <ContentTypeSelector
                            onSelect={curriculumItem.setSelectedContentType}
                            optionStyle={optionStyles.assetType}
                            options={this.availableContentTypes}
                        />
                    </div>
                );
            default:
                throw new Error(`Unknown content type: ${curriculumItem.selectedContentType}`);
        }
    }

    render() {
        return (
            <ContentTab
                purpose="add-content"
                title={this.tabTitle}
                onClose={this.props.curriculumItem.closeAddContent}
            >
                {this.renderContent()}
            </ContentTab>
        );
    }
}
