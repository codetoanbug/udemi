import ArticleIcon from '@udemy/icons/dist/article.ud-icon';
import AudioIcon from '@udemy/icons/dist/audio.ud-icon';
import CodeIcon from '@udemy/icons/dist/code.ud-icon';
import DownloadableResourceIcon from '@udemy/icons/dist/downloadable-resource.ud-icon';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import OpenInNewIcon from '@udemy/icons/dist/open-in-new.ud-icon';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import PresentationIcon from '@udemy/icons/dist/presentation.ud-icon';
import QuizIcon from '@udemy/icons/dist/quiz.ud-icon';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import ToolIcon from '@udemy/icons/dist/tool.ud-icon';
import VideoMashupIcon from '@udemy/icons/dist/video-mashup.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {assetStatuses, assetTypes} from '../../asset-library/constants';
import {curriculumItemTypes, curriculumItemKeyClasses, quizTypes} from './constants';
import CurriculumItemModel from './curriculum-item.mobx-model';

const itemIconPropTypes = {
    curriculumItem: PropTypes.instanceOf(CurriculumItemModel).isRequired,
};

const itemIconDefaultProps = {
    label: false,
    size: 'xsmall',
};

export const ItemStatusIcon = observer(({curriculumItem, ...props}) => {
    if (curriculumItem.keyClass === curriculumItemKeyClasses.section) {
        return null;
    }
    if (curriculumItem.is_published) {
        return <SuccessIcon data-purpose="published-icon" {...props} />;
    }
    return <WarningIcon color="warning" data-purpose="unpublished-icon" {...props} />;
});

ItemStatusIcon.propTypes = itemIconPropTypes;
ItemStatusIcon.defaultProps = itemIconDefaultProps;

export const ItemTypeIcon = observer(({curriculumItem, ...props}) => {
    if (curriculumItem._class === curriculumItemTypes.section) {
        return <ArticleIcon {...props} data-purpose="section-icon" />;
    } else if (curriculumItem._class === curriculumItemTypes.lecture) {
        if (!curriculumItem.asset) {
            return <ArticleIcon {...props} data-purpose="misc-icon" />;
        } else if (curriculumItem.asset.status === assetStatuses.processing) {
            return <ToolIcon {...props} data-purpose="processing-icon" />;
        } else if (curriculumItem.asset.status === assetStatuses.failed) {
            return <ErrorIcon color="negative" {...props} data-purpose="failed-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.video) {
            return <PlayIcon {...props} data-purpose="video-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.videoMashup) {
            return <VideoMashupIcon {...props} data-purpose="video-mashup-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.audio) {
            return <AudioIcon {...props} data-purpose="audio-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.article) {
            return <ArticleIcon {...props} data-purpose="article-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.presentation) {
            return <PresentationIcon {...props} data-purpose="presentation-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.ebook) {
            return <DownloadableResourceIcon {...props} data-purpose="ebook-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.file) {
            return <DownloadableResourceIcon {...props} data-purpose="file-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.iFrame) {
            return <OpenInNewIcon {...props} data-purpose="i-frame-icon" />;
        } else if (curriculumItem.asset.asset_type === assetTypes.importContent) {
            return <OpenInNewIcon {...props} data-purpose="import-content-icon" />;
        }
    } else if (curriculumItem._class === curriculumItemTypes.quiz) {
        if (curriculumItem.type === quizTypes.codingExercise) {
            return <CodeIcon {...props} data-purpose="quiz-icon" />;
        }
        return <QuizIcon {...props} data-purpose="quiz-icon" />;
    } else if (curriculumItem._class === curriculumItemTypes.assignment) {
        return <ArticleIcon {...props} data-purpose="assignment-icon" />;
    }

    return null;
});

ItemTypeIcon.propTypes = itemIconPropTypes;
ItemTypeIcon.defaultProps = itemIconDefaultProps;
