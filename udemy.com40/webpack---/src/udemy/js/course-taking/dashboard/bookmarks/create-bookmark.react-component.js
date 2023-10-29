import {LocalizedHtml} from '@udemy/i18n';
import AddCircleSolidIcon from '@udemy/icons/dist/add-circle-solid.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {TRACKING_CATEGORIES} from '../../constants';
import requires from '../../registry/requires';
import Bookmark from './bookmark.mobx-model';
import {TRACKING_ACTIONS, TRACKING_LOCATIONS} from './constants';
import LectureBookmarkDuration from './lecture-bookmark-duration.react-component';
import LectureBookmarkForm from './lecture-bookmark-form.react-component';
import './create-bookmark.less';

@requires('courseTakingStore', 'bookmarksStore', {name: 'videoViewerStore', optional: true})
@observer
export default class CreateBookmark extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        bookmarksStore: PropTypes.object.isRequired,
        videoViewerStore: PropTypes.shape({
            player: PropTypes.object,
            resume: PropTypes.func,
            pause: PropTypes.func,
            lectureViewStore: PropTypes.object,
        }),
    };

    static defaultProps = {
        videoViewerStore: null,
    };

    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('keypress', this.onKeyPress);
        const {isCreateBookmarkButtonActive} = this.props.bookmarksStore;
        if (isCreateBookmarkButtonActive && this.props.videoViewerStore) {
            this.props.videoViewerStore.pause();
        }
        this._initNewBookmark();
        this.reactionDisposer = reaction(
            () => this.props.bookmarksStore.isCreateBookmarkButtonActive,
            this.onCreateButtonBookmarkChange,
        );
    }

    componentWillUnmount() {
        this.reactionDisposer && this.reactionDisposer();
        document.removeEventListener('keypress', this.onKeyPress);
    }

    @observable.ref bookmark = new Bookmark({id: -1});
    @observable containerRef = null;

    @computed
    get currentTime() {
        const player = this.props.videoViewerStore?.player;
        return player ? Math.floor(player.currentTime()) : null;
    }

    @computed
    get currentBookmark() {
        return this.props.bookmarksStore.getBookmarkByTime(this.lastWatchedSecond);
    }

    @autobind
    onCreateButtonClick() {
        this.props.bookmarksStore.setIsCreateBookmarkButtonActive(true);
    }

    @autobind
    onKeyPress(event) {
        if (
            !this.isPlayerLoaded ||
            this.props.bookmarksStore.isCreateBookmarkButtonActive ||
            this.props.videoViewerStore.player.isFullscreen_
        ) {
            return;
        }
        if (!event.target.isContentEditable && (event.key === 'N' || event.key === '+')) {
            this.props.bookmarksStore.setIsCreateBookmarkButtonActive(true);
        }
    }

    @autobind
    onCreateButtonBookmarkChange() {
        this.props.bookmarksStore.isCreateBookmarkButtonActive && this.openCreateForm();
    }

    @autobind
    @action
    openCreateForm() {
        this.props.videoViewerStore.pause();
        this._initNewBookmark();
    }

    @autobind
    scrollToRef() {
        // ScrollIntoView is not supported in some browsers.
        // Created a custom implementation.
        // TODO: Create utility functions to replace scrollIntoView.
        if (!this.containerRef.current) {
            return;
        }
        const {top, height} = this.containerRef.current.getBoundingClientRect();
        const delta = parseInt(window.innerHeight, 10);
        const yScrollPosition = parseInt(top + height - delta + window.scrollY, 10);
        if (top + height > delta) {
            window.scrollTo({top: yScrollPosition, left: 0, behavior: 'smooth'});
        }
    }

    @autobind
    onCancelBookmark() {
        this.props.videoViewerStore.resume();
        this.props.bookmarksStore.setIsCreateBookmarkButtonActive(false);
    }

    @autobind
    onSaveBookmark(bookmark) {
        if (this.bookmark.id > -1) {
            this.props.courseTakingStore.track(
                TRACKING_CATEGORIES.BOOKMARK_ACTION,
                TRACKING_ACTIONS.UPDATE,
                {location: TRACKING_LOCATIONS.DASHBOARD},
            );
            return this.props.bookmarksStore.update(bookmark).then(() => {
                this.bookmark.syncOriginalBody();
                this.props.videoViewerStore.resume();

                this.props.bookmarksStore.setIsCreateBookmarkButtonActive(false);
            });
        }
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.BOOKMARK_ACTION,
            TRACKING_ACTIONS.CREATE,
            {location: TRACKING_LOCATIONS.DASHBOARD},
        );
        return this.props.bookmarksStore.create(bookmark).then(() => {
            this.props.videoViewerStore.resume();
            this.props.bookmarksStore.setIsCreateBookmarkButtonActive(false);
        });
    }

    @computed
    get lastWatchedSecond() {
        const {videoViewerStore} = this.props;
        return videoViewerStore ? videoViewerStore.currentTime : 0;
    }

    @computed
    get isPlayerLoaded() {
        const {videoViewerStore} = this.props;
        return videoViewerStore && videoViewerStore.player;
    }

    @action
    _initNewBookmark() {
        const currentCurriculumItem = this.props.courseTakingStore.currentCurriculumItem;
        if (currentCurriculumItem) {
            this.bookmark =
                this.currentBookmark ||
                new Bookmark({
                    id: -1,
                    position: this.lastWatchedSecond,
                    body: '',
                    lecture: {
                        id: currentCurriculumItem.id,
                        object_index: currentCurriculumItem.objectIndex,
                        title: currentCurriculumItem.title,
                    },
                });
        }
        setTimeout(this.scrollToRef); // timeout to allow ref to set properly
    }

    renderOpenCreateButton() {
        return (
            <Button
                udStyle="secondary"
                styleName="create-bookmark-button"
                typography="ud-text-md"
                data-purpose="create-bookmark-button"
                onClick={this.onCreateButtonClick}
                disabled={!this.isPlayerLoaded}
            >
                <LocalizedHtml
                    styleName="create-button-left"
                    html={
                        this.currentBookmark
                            ? gettext(
                                  'Edit your note at <span class="duration">%(duration)s</span>',
                              )
                            : gettext(
                                  'Create a new note at <span class="duration">%(duration)s</span>',
                              )
                    }
                    interpolate={{
                        duration: (
                            <Duration
                                data-purpose="create-bookmark-current-time"
                                numSeconds={this.lastWatchedSecond}
                                presentationStyle={Duration.STYLE.TIMESTAMP}
                            />
                        ),
                    }}
                />
                {this.currentBookmark ? (
                    <EditIcon label={false} color="neutral" />
                ) : (
                    <AddCircleSolidIcon label={false} color="neutral" />
                )}
            </Button>
        );
    }

    renderEditForm() {
        return (
            <>
                <LectureBookmarkDuration position={this.lastWatchedSecond} />
                <div styleName="create-form-container">
                    <LectureBookmarkForm
                        autoFocus={true}
                        bookmark={this.bookmark}
                        onCancelClick={this.onCancelBookmark}
                        onSaveClick={this.onSaveBookmark}
                    />
                </div>
            </>
        );
    }

    render() {
        const {isCreateBookmarkButtonActive} = this.props.bookmarksStore;
        return (
            <div
                styleName="create-bookmark-container"
                ref={isCreateBookmarkButtonActive && this.containerRef}
            >
                {isCreateBookmarkButtonActive
                    ? this.renderEditForm()
                    : this.renderOpenCreateButton()}
            </div>
        );
    }
}
