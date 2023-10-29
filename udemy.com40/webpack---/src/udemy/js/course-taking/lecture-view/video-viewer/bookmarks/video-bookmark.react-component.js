import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {TRACKING_CATEGORIES} from '../../../constants';
import requires from '../../../registry/requires';
import {TRACKING_ACTIONS, TRACKING_LOCATIONS} from './constants';
import VideoBookmarkPopup from './video-bookmark-popup.react-component';

import './video-bookmark.less';

@requires('courseTakingStore', 'videoBookmarksStore', 'progressBarStore')
@observer
export default class VideoBookmark extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        videoBookmarksStore: PropTypes.object.isRequired,
        progressBarStore: PropTypes.object.isRequired,
        bookmark: PropTypes.object.isRequired,
        isActive: PropTypes.bool.isRequired,
    };

    @observable isHovering = false;
    @observable isClosed = false;

    focusInput() {
        this.inputRef && this.inputRef.focus();
    }

    @autobind
    @action
    handleButtonMouseOver() {
        if (this.props.videoBookmarksStore.isSaving) {
            return;
        }

        this.isHovering = true;
        if (!this.props.isActive) {
            // If another bookmark is active, close it.
            this.props.videoBookmarksStore.setActive(null, false);
        }
    }

    @autobind
    @action
    handleButtonMouseOut() {
        this.isHovering = false;
        this.isClosed = false;
    }

    @autobind
    @action
    setIsClosed(value) {
        this.isClosed = value;
    }

    @autobind
    @action
    handleButtonClick() {
        // prevent open social bookmark
        if (this.props.bookmark.isSocialBookmark) {
            return;
        }
        if (this.props.videoBookmarksStore.isSaving) {
            return;
        }
        this.blurTimeout && clearTimeout(this.blurTimeout);
        this.props.videoBookmarksStore.player.currentTime(this.props.bookmark.position);
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.BOOKMARK_ACTION,
            TRACKING_ACTIONS.OPEN,
            {location: TRACKING_LOCATIONS.VIDEO_PROGRESS_BAR},
        );
        this.isClosed = false;
        this.props.videoBookmarksStore.setActive(this.props.bookmark.id);
        this.focusInput();
    }

    render() {
        const {
            videoBookmarksStore: {videoDuration},
            progressBarStore,
            bookmark,
        } = this.props;
        // Position the bookmark at the correct time on the seekbar.
        // Left position percentage matches videojs.SeekBar.prototype.getPercent.
        const positionPercentage = ((bookmark.position / videoDuration) * 100).toFixed(2);

        if (!progressBarStore.ref || videoDuration === 0) {
            return null;
        }

        return ReactDOM.createPortal(
            <div>
                <div
                    styleName="wrapper"
                    style={{left: `${positionPercentage}%`}}
                    data-purpose="video-bookmark-item"
                >
                    <Button
                        udStyle="link"
                        aria-label={gettext('Bookmark')}
                        styleName={bookmark.isSocialBookmark ? 'label-social' : 'label'}
                        onMouseOver={this.handleButtonMouseOver}
                        onFocus={this.handleButtonMouseOver}
                        onMouseOut={this.handleButtonMouseOut}
                        onBlur={this.handleButtonMouseOut}
                        onClick={this.handleButtonClick}
                    />

                    <VideoBookmarkPopup
                        setIsClosed={this.setIsClosed}
                        isClosed={this.isClosed}
                        isHovering={this.isHovering}
                        {...this.props}
                    />
                </div>
            </div>,
            progressBarStore.ref,
        );
    }
}
