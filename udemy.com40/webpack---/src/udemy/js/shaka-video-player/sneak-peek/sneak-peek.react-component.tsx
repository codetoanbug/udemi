import {Image} from '@udemy/react-core-components';
import axios from 'axios';
import {toJS, reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {WebVTTParser} from 'webvtt-parser/parser';

import {ShakaProgressBarStore} from 'shaka-video-player/progress-bar/shaka-progress-bar.mobx-store';
import udApiStat from 'utils/ud-api-stat';

import {parseSpriteImageLink} from '../utils';
import {MP4_TIME_CHANGE_EVENT, HLS_TIME_CHANGE_EVENT} from './constants';
import sneakPeekStyles from './sneak-peek.less';
import {SneakPeekStore} from './sneak-peek.mobx-store';

// move it to types file
interface SneakPeekProps {
    progressBarStore: ShakaProgressBarStore;
}

@inject('progressBarStore')
@observer
export class SneakPeek extends React.Component<SneakPeekProps> {
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
    };

    constructor(props: any) {
        super(props);
        this.sneakPeekStore = new SneakPeekStore(props.progressBarStore);
        this.addSneakPeekCues();
        this.setReactions();
    }

    sneakPeekStore: any;

    setReactions() {
        reaction(
            () => this.sneakPeekStore.player,
            () => this.sneakPeekStore.setProgressBarStore(this.props.progressBarStore),
        );

        reaction(() => this.sneakPeekStore.sneakPeekCues, this.setDurationEvents, {
            fireImmediately: true,
        });
    }

    addSneakPeekCues() {
        axios
            .get(this.sneakPeekStore.thumbnailsVTTUrl)
            .then((response) => {
                const webVTTFile = response.data;
                const parser = new WebVTTParser(this.sneakPeekStore.videoElement, 'thumbnails');
                const cues = parser.parse(webVTTFile).cues;

                for (let i = 0; i < cues.length; i++) {
                    const cue = cues[i];
                    const vttCue = new VTTCue(cue.startTime, cue.endTime, cue.text);
                    this.sneakPeekStore.sneakPeekCues.push(vttCue);
                }
            })
            .catch((error) => {
                udApiStat.increment('thumbnails_vtt_error', error);
            });
    }

    setDurationEvents = () => {
        [MP4_TIME_CHANGE_EVENT, HLS_TIME_CHANGE_EVENT].forEach((event) => {
            if (this.sneakPeekStore.videoElement) {
                this.sneakPeekStore.videoElement.addEventListener(
                    event,
                    this.sneakPeekStore.setDuration,
                );
            }
        });
        this.sneakPeekStore.setDuration();
    };

    get imgStyles() {
        const clipOffsets = [
            this.imageSettings.y,
            this.imageSettings.w + this.imageSettings.x,
            this.imageSettings.y + this.imageSettings.h,
            this.imageSettings.x,
        ];

        return {
            left: `${-this.imageSettings.x}px`,
            top: `${-this.imageSettings.y}px`,
            clip: `rect(${clipOffsets.join('px,')}px)`,
        };
    }

    get containerLeft() {
        const clientRect = this.sneakPeekStore.portalElement.getBoundingClientRect();

        const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;

        // Find the page offset of the mouse
        const right = (clientRect.width || clientRect.right) + pageXOffset;

        let containerLeft = this.mouseLeftPosition;
        const halfWidth = this.imageSettings.w / 2;
        // make sure that the sneak peek doesn't fall off the right side of the left side of the player
        if (containerLeft + halfWidth > right) {
            containerLeft = right - this.imageSettings.w;
        } else if (containerLeft < halfWidth) {
            containerLeft = 0;
        } else {
            containerLeft = containerLeft - halfWidth;
        }

        return containerLeft;
    }

    get containerStyles() {
        const containerStyles = {
            width: '0',
            height: '0',
            left: '0',
            right: '0',
        };

        // None found, so show nothing
        if (this.imageSettings && this.imageSettings.w !== 0) {
            containerStyles.width = `${this.imageSettings.w}px`;
            containerStyles.height = `${this.imageSettings.h}px`;

            if (this.sneakPeekStore.isHovering) {
                containerStyles.left = `${this.containerLeft}px`;
            } else {
                containerStyles.left = '-1000px';
            }
        }

        return containerStyles;
    }

    get imgSrc() {
        let baseUrl = '';

        if (this.imageSettings.src[0] === '/') {
            baseUrl = this.sneakPeekStore.videoElement.currentSrc();
            baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
        }

        return baseUrl + this.imageSettings.src + this.sneakPeekStore.thumbSpriteUrl.search;
    }

    get mouseLeftPosition() {
        if (!this.sneakPeekStore.moveEvent) {
            return null;
        }

        const pageX = this.sneakPeekStore.moveEvent.changedTouches
            ? this.sneakPeekStore.moveEvent.changedTouches[0].pageX
            : this.sneakPeekStore.moveEvent.pageX;

        const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;

        let left =
            pageX ||
            this.sneakPeekStore.moveEvent.clientX +
                document.body.scrollLeft +
                document.documentElement.scrollLeft;
        left -= this.sneakPeekStore.portalElement.getBoundingClientRect().left + pageXOffset;
        return left;
    }

    get imageSettings() {
        let i = 0;
        let imageSettings = {w: 0, h: 0, x: 0, y: 0, src: ''};

        const offsetWidth =
            this.sneakPeekStore.portalElement.offsetWidth > 0
                ? this.sneakPeekStore.portalElement.offsetWidth
                : 1;

        const mouseTime = Math.floor(
            (this.mouseLeftPosition / offsetWidth) * this.sneakPeekStore.duration,
        );

        // The API returns us the full file URL, but we need the path up until the file as it's inside the .vtt already
        const baseUrl = this.sneakPeekStore.thumbSpriteUrl.toString().split('?')[0];
        const basePath = `${baseUrl.slice(0, baseUrl.lastIndexOf('/'))}/`;

        while (i < this.sneakPeekStore.sneakPeekCues.length) {
            const cue = this.sneakPeekStore.sneakPeekCues[i];
            if (cue.startTime <= mouseTime && cue.endTime >= mouseTime) {
                imageSettings = parseSpriteImageLink(cue.text, basePath);
                break;
            }
            i++;
        }

        // Fall back to plugin defaults in case no height/width is specified
        if (imageSettings) {
            imageSettings.w = imageSettings.w ? imageSettings.w : 0;
            imageSettings.h = imageSettings.h ? imageSettings.h : 0;
        }

        return imageSettings;
    }

    get shouldRender() {
        if (
            !this.props.progressBarStore ||
            !this.props.progressBarStore.thumbnailSprite ||
            !this.props.progressBarStore.ref ||
            !this.sneakPeekStore.thumbnailsVTTUrl ||
            !this.sneakPeekStore.sneakPeekCues ||
            this.sneakPeekStore.sneakPeekCues.length == 0
        ) {
            return false;
        }
        return true;
    }

    render() {
        return this.shouldRender ? (
            <div
                className={sneakPeekStyles['sneak-peek-holder']}
                data-purpose="video-sneak-peek-container"
                style={this.containerStyles}
                ref={React.createRef()}
            >
                <Image
                    lazy={false}
                    data-purpose="video-sneak-peek-image"
                    alt={gettext('Lecture thumbnail')}
                    className={sneakPeekStyles['sneak-peek']}
                    src={this.imgSrc}
                    height={'unset'}
                    width={'unset'}
                    style={toJS(this.imgStyles)}
                />
            </div>
        ) : null;
    }
}
