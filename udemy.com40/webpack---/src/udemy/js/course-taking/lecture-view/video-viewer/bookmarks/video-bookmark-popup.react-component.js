import {getUniqueId, onEnterAndSpace} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import autosize from 'autosize';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import './video-bookmark.less';

import {TRACKING_CATEGORIES} from '../../../constants';
import LectureBookmarkDuration from '../../../dashboard/bookmarks/lecture-bookmark-duration.react-component';
import LectureBookmarkForm from '../../../dashboard/bookmarks/lecture-bookmark-form.react-component';
import requires from '../../../registry/requires';
import {TRACKING_ACTIONS, TRACKING_LOCATIONS, BOOKMARK_PORTAL_ID} from './constants';

@requires('courseTakingStore', 'videoBookmarksStore')
@observer
export default class VideoBookmarkPopup extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        videoBookmarksStore: PropTypes.object.isRequired,
        bookmark: PropTypes.object.isRequired,
        isActive: PropTypes.bool.isRequired,
        isHovering: PropTypes.bool.isRequired,
        isClosed: PropTypes.bool.isRequired,
        setIsClosed: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.bookmarkInputId = getUniqueId('bookmark-title');
        this.handleButtonKeyPress = onEnterAndSpace(this.handleButtonClick);
    }

    componentDidMount() {
        autosize(this.inputRef);
        if (this.props.isActive) {
            this.focusInput();
        }
    }

    componentDidUpdate() {
        autosize.update(this.inputRef);
        if (this.props.isActive && !this.isAnimating) {
            this.focusInput();
        }
    }

    @observable isClosing = false;
    @observable isSaving = false;
    @observable isDeleting = false;
    @observable isEmpty = false;

    @computed
    get isAnimating() {
        return this.isClosing || this.props.videoBookmarksStore.isSaving || this.isDeleting;
    }

    @computed
    get activeOnHover() {
        return this.props.isHovering && !this.isAnimating && !this.props.isClosed;
    }

    @autobind
    setInputRef(ref) {
        // Sometimes is an input in this level and sometimes is
        // TextareaCompositionFilter component
        this.inputRef = (ref && ref.textarea) || ref;
    }

    focusInput() {
        this.inputRef && this.inputRef.focus();
    }

    blurInput() {
        this.inputRef && this.inputRef.blur();
    }

    @autobind
    @action
    closeInput() {
        this.isClosing = true;
        // Explicitly blur the input early so that our save/close-on-blur behaviour doesn't kick in redundantly.
        this.blurInput();
        setTimeout(
            action(() => {
                this.finaliseClose();
            }),
            500,
        );
    }

    @autobind
    @action
    finaliseClose() {
        if (this.props.isHovering) {
            // Only need to explicitly mark closed to override the hover state.
            // If not hovering, then the default state is already 'closed'.
            this.props.setIsClosed(true);
        }
        this.isClosing = false;
        this.props.videoBookmarksStore.isSaving = false;
        this.isEmpty = false;
        this.isDeleting = false;
        this.props.videoBookmarksStore.setActive(null);
    }

    @autobind
    @action
    save(keepPopupOpen = false) {
        const shouldClosePopup = typeof keepPopupOpen === 'boolean' ? !keepPopupOpen : true;
        if (!this.props.bookmark.isDirty && shouldClosePopup) {
            this.closeInput();
            return;
        }
        if (!this.props.bookmark.hasBodyText) {
            this.isEmpty = true;
            this.props.bookmark.body = this.props.bookmark.originalBody;
        }

        if (shouldClosePopup) {
            this.props.videoBookmarksStore.isSaving = true;
        }

        setTimeout(
            action(() => {
                if (shouldClosePopup) {
                    this.props.videoBookmarksStore.save(this.props.bookmark).then(this.closeInput);
                } else {
                    this.props.videoBookmarksStore.save(this.props.bookmark);
                }
            }),
            500,
        );

        let trackingAction;
        if (this.props.bookmark.id === -1) {
            trackingAction = TRACKING_ACTIONS.CREATE;
        } else {
            trackingAction = TRACKING_ACTIONS.UPDATE;
        }
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.BOOKMARK_ACTION, trackingAction, {
            location: TRACKING_LOCATIONS.VIDEO_PLAYER_CONTROLS,
        });
    }

    @autobind
    @action
    cancelBookmark() {
        const {bookmark} = this.props;
        if (bookmark.id > 0) {
            this.finaliseClose();
            return;
        }
        this.delete();
    }

    @autobind
    @action
    delete() {
        this.isDeleting = true;
        // Explicitly blur the input early so that our save/close-on-blur behaviour doesn't kick in redundantly.
        this.blurInput();
        setTimeout(() => {
            this.props.videoBookmarksStore.delete(this.props.bookmark).then(this.finaliseClose);
        }, 500);

        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.BOOKMARK_ACTION,
            TRACKING_ACTIONS.DELETE,
            {location: TRACKING_LOCATIONS.VIDEO_PLAYER_CONTROLS},
        );
    }

    @autobind
    handleInputKeyDown(event) {
        if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            this.save();
            return true;
        } else if (event.key === 'Escape') {
            this.props.bookmark.reset();
            if (this.props.bookmark.id === -1) {
                this.delete();
            } else {
                this.closeInput();
            }
        }
    }

    @autobind
    handleInputChange(event) {
        this.props.bookmark.changeBody(event.target.value);
    }

    @autobind
    @action
    handleButtonClick() {
        this.blurTimeout && clearTimeout(this.blurTimeout);
        this.props.videoBookmarksStore.player.currentTime(this.props.bookmark.position);
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.BOOKMARK_ACTION,
            TRACKING_ACTIONS.OPEN,
            {location: TRACKING_LOCATIONS.VIDEO_PROGRESS_BAR},
        );
        this.props.setIsClosed(false);
        this.props.videoBookmarksStore.setActive(this.props.bookmark.id);
        this.focusInput();
    }

    @autobind
    @action
    handleInputBlur() {
        // Don't want to save/close the input if the user is clicking multiple times on the button,
        // so delay until the click handler has a chance to fire.
        // This also gives us a chance to handle explicit saves/closes etc.
        this.blurTimeout = setTimeout(() => {
            if (!this.isAnimating) {
                this.save(true);
            }
        }, 100);
    }

    get placeholderText() {
        if (this.props.isActive) {
            return gettext("Add a comment or hit 'Enter'.");
        }
        return gettext('Click to add a comment.');
    }

    get personalBookmarkInput() {
        const {bookmark} = this.props;
        if (this.props.videoBookmarksStore.isSaving) {
            return null;
        }

        return (
            <div styleName="video-add-bookmark-container">
                <LectureBookmarkDuration position={bookmark.position} />
                <div styleName="video-create-form-container">
                    <LectureBookmarkForm
                        bookmark={bookmark}
                        onCancelClick={this.cancelBookmark}
                        onSaveClick={this.save}
                        onKeyDown={this.handleInputKeyDown}
                        setFocusRef={this.setInputRef}
                        onBlur={this.handleInputBlur}
                        onKeyPress={this.handleButtonKeyPress}
                    />
                </div>
            </div>
        );
    }

    get socialBookmarkInput() {
        const {bookmark} = this.props;
        const dynamicNotesContentUpdate = ninterpolate(
            '%(count)s person has written a note here.',
            '%(count)s people have written a note here.',
            bookmark.numNotes,
            {count: bookmark.numNotes},
        );
        return (
            <textarea
                className="ud-text-sm"
                id={this.bookmarkInputId}
                disabled={true}
                rows="1"
                value={dynamicNotesContentUpdate}
                ref={this.setInputRef}
            />
        );
    }

    render() {
        const {videoBookmarksStore, bookmark, isActive} = this.props;
        // Position the bookmark at the correct time on the seekbar.
        // Left position percentage matches videojs.SeekBar.prototype.getPercent.
        // From Video.js player.duration() doc:
        // The video must have started loading before the duration can be known.
        const duration = videoBookmarksStore.player.duration() || 0;
        const positionPercentage = ((bookmark.position / duration) * 100).toFixed(2);

        const contentContainerRight = !this.props.bookmark.isSocialBookmark
            ? 'content-container-right-dynamic-notes'
            : 'content-container-right';
        const contentContainerClass =
            positionPercentage > 50 ? contentContainerRight : 'content-container-left';
        const contentClasses = classNames({
            'content-left': positionPercentage <= 50,
            'content-right': positionPercentage > 50,
            active: isActive || this.activeOnHover,
            closing: this.isClosing,
            deleting: this.isDeleting,
            closed: this.props.isClosed,
        });

        return ReactDOM.createPortal(
            <div styleName={contentContainerClass} data-purpose="content-container">
                <div styleName={contentClasses} data-purpose="content">
                    <label className="ud-sr-only" htmlFor={this.bookmarkInputId}>
                        {gettext('Bookmark title')}
                    </label>
                    {bookmark.isSocialBookmark
                        ? this.socialBookmarkInput
                        : this.personalBookmarkInput}
                    {this.props.videoBookmarksStore.isSaving &&
                    !this.props.bookmark.isSocialBookmark &&
                    !this.isEmpty ? (
                        <span className="ud-heading-lg" styleName="bookmark-added">
                            {gettext('Note added')}
                        </span>
                    ) : null}
                    {this.props.videoBookmarksStore.isSaving &&
                    this.isEmpty &&
                    !this.props.bookmark.isSocialBookmark ? (
                        <span
                            className="ud-heading-lg"
                            styleName="ellipsis bookmark-added"
                            title={gettext("You can't save an empty note")}
                        >
                            {gettext("You can't save an empty note")}
                        </span>
                    ) : null}
                </div>
            </div>,
            document.getElementById(BOOKMARK_PORTAL_ID),
        );
    }
}
