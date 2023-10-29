import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable, toJS} from 'mobx';
import React from 'react';
import UAParser from 'ua-parser-js';

import {FullscreenStore} from 'utils/fullscreen';
import {AnyObject} from 'utils/types';
import {getIsSafariOrIOS} from 'utils/user-agent/get-is-safari-or-ios';

import {PreviewVideoPlayEvent, PreviewVideoViewEvent} from './events';
import {Asset} from './types/asset';
import {PreviewableCourse} from './types/previewable-course';

export class PreviewsStore {
    readonly uaParser = new UAParser();
    isFirstPreview = true;
    @observable.ref currentPreview: Asset;
    @observable isMiniPlayerOn = false;

    constructor(
        readonly course: PreviewableCourse,
        readonly previews: Asset[],
        private readonly startPreviewId?: number,
        protected readonly fullscreenStore?: FullscreenStore,
        private readonly overrideSetupData: AnyObject = {},
    ) {
        this.currentPreview =
            this.previews.find((p) => p.id === this.startPreviewId) ?? this.previews[0];
    }

    getConfig(asset: Asset) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config: any = {
            assetId: asset.id,
            playerId: `playerId__${asset.id}`,
            trackingTag: 'course_preview_asset',
            mediaLicenseToken: asset.media_license_token,
            mediaSources: asset.media_sources,
            duration: asset.time_estimation,
            captions: toJS(asset.captions),
            thumbnailSprite: asset.thumbnail_sprite,
            isDefaultPlaying: true,
            hotkeysEnabled: true,
            muxMetadata: {
                playerName: 'Preview Player',
                assetId: asset.id,
                duration: asset.time_estimation,
                courseId: this.course.id,
                isPaid: this.course.is_paid,
            },
            onPlayPauseToggled: this.onPlayPauseToggled,
            onVideoEnd: this.loadNextPreview,
        };

        if (getIsSafariOrIOS(this.uaParser)) {
            // Only start the first preview muted. After that, we can autoplay with audio
            config.isDefaultMuted = this.isFirstPreview;
            config.prioritizeDefaultMuted = this.isFirstPreview;
            config.extraVideoAttributes = {
                playsInline: true,
            };
        }

        return {...config, ...this.overrideSetupData};
    }

    playPreview(preview: Asset, videoRef: React.RefObject<HTMLDivElement>) {
        return () => {
            if (preview.id === this.currentPreview.id) {
                return;
            }

            this.setCurrentPreview(preview);

            if (videoRef) {
                videoRef.current?.scrollIntoView({behavior: 'smooth'});
            }
        };
    }

    @action
    setCurrentPreview(preview: Asset) {
        this.currentPreview = preview;
        this.isFirstPreview = false;
        this.isMiniPlayerOn = true;
        this.publishPreviewViewEvent();
    }

    @autobind
    loadNextPreview() {
        if (this.currentPreview.id === this.previews[this.previews.length - 1].id) {
            return;
        }

        if (this.fullscreenStore?.isFullscreen) {
            this.fullscreenStore.exitFullscreen();
        }

        const nextPreviewIndex =
            this.previews.findIndex((p) => p.id === this.currentPreview.id) + 1;
        this.setCurrentPreview(this.previews[nextPreviewIndex]);
    }

    @autobind
    publishPreviewViewEvent() {
        Tracker.publishEvent(
            new PreviewVideoViewEvent(
                this.course.id,
                this.course.trackingId,
                this.currentPreview.id,
            ),
        );
    }

    @autobind
    private onPlayPauseToggled(isPlaying: boolean, currentTime: number) {
        if (isPlaying) {
            // Even if the video is played from the beginning, the currentTime is a small fraction of a
            // second (e.g. 0.10573). For easier analysis, round it down to 0.
            const adjustedOffset = currentTime < 0.2 ? 0 : currentTime;
            // If the video is being played from the beginning, we can assume this was an autoplay event.
            const nonInteraction = adjustedOffset === 0;
            Tracker.publishEvent(
                new PreviewVideoPlayEvent(
                    this.course.id,
                    this.course.trackingId,
                    this.currentPreview.id,
                    adjustedOffset,
                    nonInteraction,
                ),
            );
        }
    }
}
