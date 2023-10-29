import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ASSET_TYPE} from 'asset/constants';
import VideoMashupAsset from 'asset/video/mashup/video-mashup-asset.react-component';
import VideoAsset from 'asset/video/video-asset.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import requires from '../../registry/requires';
import BaseQuizQuestion from '../base-quiz-question.mobx-model';
import './related-lecture.less';

@requires('quizViewStore')
@observer
export default class RelatedLecture extends React.Component {
    static propTypes = {
        quizViewStore: PropTypes.object.isRequired,
        question: PropTypes.instanceOf(BaseQuizQuestion).isRequired,
    };

    @observable isVideoShowing = false;

    get lecture() {
        return this.props.question.relatedLecture;
    }

    @autobind
    @action
    toggleVideoShowing() {
        this.isVideoShowing = !this.isVideoShowing;
        if (this.isVideoShowing) {
            this.trackSeenRelatedLecture();
        }
    }

    @autobind
    trackSeenRelatedLecture() {
        this.props.quizViewStore.track('seen-related-lecture', {
            assessment: this.props.question.id,
        });
    }

    get linkContent() {
        const title = interpolate(
            gettext('This was discussed in Lecture %(lectureNumber)s: <b>%(lectureTitle)s</b>'),
            {lectureNumber: this.lecture.objectIndex, lectureTitle: this.lecture.title},
            true,
        );
        return [
            <span
                key="title"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'related-lecture:title',
                    html: title,
                })}
            />,
            <ExpandIcon
                key="icon"
                label={this.isVideoShowing ? gettext('Close lecture') : gettext('Open lecture')}
                styleName={!this.isVideoShowing ? 'icon icon-collapsed' : 'icon'}
            />,
        ];
    }

    get videoLink() {
        return (
            <Button udStyle="link" typography="ud-text-md" onClick={this.toggleVideoShowing}>
                {this.linkContent}
            </Button>
        );
    }

    get nonVideoLink() {
        return (
            <Button
                udStyle="link"
                typography="ud-text-md"
                componentClass="a"
                href={this.lecture.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={this.trackSeenRelatedLecture}
            >
                {this.linkContent}
            </Button>
        );
    }

    get videoPlayer() {
        if (!this.lecture.isVideo || !this.isVideoShowing) {
            return null;
        }

        let AssetComponent;
        if (this.lecture.assetType === ASSET_TYPE.VIDEO_MASHUP) {
            AssetComponent = VideoMashupAsset;
        } else {
            AssetComponent = VideoAsset;
        }

        return (
            <div styleName="video">
                <AssetComponent
                    id={this.lecture.asset.id}
                    playerOptions={{
                        trackingTag: 'quiz_related_lecture',
                    }}
                />
            </div>
        );
    }

    render() {
        if (!this.lecture || !this.lecture.isPublished || getIsMobileApp()) {
            return null;
        }
        return (
            <div styleName="related-lecture">
                {this.lecture.isVideo ? this.videoLink : this.nonVideoLink}
                {this.videoPlayer}
            </div>
        );
    }
}
