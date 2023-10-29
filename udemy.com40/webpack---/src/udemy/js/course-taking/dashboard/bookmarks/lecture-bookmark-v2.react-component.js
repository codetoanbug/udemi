import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {Button} from '@udemy/react-core-components';
import {formatDuration} from '@udemy/react-date-time-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import {TRACKING_CATEGORIES} from '../../constants';
import {ITEM_TYPES} from '../../curriculum/constants';
import ItemLink from '../../curriculum/item-link.react-component';
import requires from '../../registry/requires';
import Bookmark from './bookmark.mobx-model';
import {TRACKING_ACTIONS, TRACKING_LOCATIONS} from './constants';
import LectureBookmarkDuration from './lecture-bookmark-duration.react-component';
import LectureBookmarkForm from './lecture-bookmark-form.react-component';

import './lecture-bookmark-v2.less';

function getAriaLabelforNotes(sectionTitle, lectureTitle, time) {
    const notesPosition = formatDuration(
        {
            numSeconds: time,
            presentationStyle: 'humanCompact',
            precision: 'seconds',
        },
        {gettext, interpolate},
    );
    return interpolate(
        gettext('Go to bookmark Section %(sectionTitle)s %(lectureTitle)s at %(notesPosition)s'),
        {sectionTitle, lectureTitle, notesPosition},
        true,
    );
}

@requires('courseTakingStore', 'bookmarksStore', {name: 'videoViewerStore', optional: true})
@observer
export default class LectureBookmark extends Component {
    static propTypes = {
        bookmark: PropTypes.instanceOf(Bookmark).isRequired,
        courseTakingStore: PropTypes.shape({
            currentCurriculumItemId: PropTypes.number.isRequired,
            track: PropTypes.func.isRequired,
        }).isRequired,
        bookmarksStore: PropTypes.shape({
            delete: PropTypes.func.isRequired,
            update: PropTypes.func.isRequired,
        }).isRequired,
        videoViewerStore: PropTypes.shape({
            seekTo: PropTypes.func.isRequired,
        }),
        section: PropTypes.any.isRequired,
    };

    static defaultProps = {
        videoViewerStore: undefined,
    };

    @observable isEditingBookmark = false;
    @observable isDeletingBookmark = false;

    @autobind
    @action
    onDeleteBookmark(event, onClose) {
        event.stopPropagation();
        onClose();
        this.isDeletingBookmark = true;
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.BOOKMARK_ACTION,
            TRACKING_ACTIONS.DELETE,
            {location: TRACKING_LOCATIONS.DASHBOARD},
        );
        this.props.bookmarksStore
            .delete(this.props.bookmark)
            .then(action(() => (this.isDeletingBookmark = false)));
    }

    @autobind
    @action
    onToggleEditing(event) {
        if (event) {
            event.stopPropagation();
        }
        this.isEditingBookmark = !this.isEditingBookmark;
    }

    @autobind
    onClick() {
        const {bookmark, courseTakingStore, videoViewerStore} = this.props;
        if (videoViewerStore && courseTakingStore.currentCurriculumItemId === bookmark.lectureId) {
            videoViewerStore.seekTo(bookmark.position);
        }
        courseTakingStore.track(TRACKING_CATEGORIES.BOOKMARK_ACTION, TRACKING_ACTIONS.OPEN, {
            location: TRACKING_LOCATIONS.DASHBOARD,
        });
    }

    @autobind
    onSaveClick(bookmark) {
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.BOOKMARK_ACTION,
            TRACKING_ACTIONS.UPDATE,
            {location: TRACKING_LOCATIONS.DASHBOARD},
        );
        return this.props.bookmarksStore.update(bookmark).then(() => {
            this.props.bookmark.syncOriginalBody();
            this.onToggleEditing();
        });
    }

    get sectionDisplayTitle() {
        const {section} = this.props;
        return interpolate(
            gettext('%(itemNumber)s. %(itemName)s'),
            {itemNumber: section.objectIndex, itemName: section.title},
            true,
        );
    }

    renderBookmarkHeader(lectureId, position, lectureDisplayTitle) {
        return (
            <div styleName="bookmark-header">
                <ItemLink
                    itemType={ITEM_TYPES.LECTURE}
                    itemId={lectureId}
                    startAt={position}
                    onClick={this.onClick}
                    className="ud-heading-md"
                    styleName="section-and-lecture"
                    aria-label={getAriaLabelforNotes(
                        this.sectionDisplayTitle,
                        lectureDisplayTitle,
                        position,
                    )}
                >
                    <div styleName="section">{this.sectionDisplayTitle}</div>
                    <div className="ud-text-sm">{lectureDisplayTitle}</div>
                </ItemLink>
                <div styleName="spacer" />
                <Button
                    onClick={this.onToggleEditing}
                    disabled={this.isDeletingBookmark}
                    className="ud-link-neutral"
                    styleName="bookmark-action"
                    udStyle="link"
                    aria-labelledby={`edit-bookmark-${position} bookmark-${position}`}
                >
                    <EditIcon id={`edit-bookmark-${position}`} label={gettext('Edit bookmark')} />
                </Button>
                <ModalTrigger
                    trigger={
                        <Button
                            disabled={this.isDeletingBookmark}
                            className="ud-link-neutral"
                            styleName="bookmark-action"
                            udStyle="link"
                            aria-labelledby={`delete-bookmark-${position} bookmark-${position}`}
                        >
                            <DeleteIcon
                                id={`delete-bookmark-${position}`}
                                label={gettext('Delete bookmark')}
                            />
                        </Button>
                    }
                    renderModal={({isOpen, onClose}) => (
                        <ConfirmModal
                            isOpen={isOpen}
                            onCancel={onClose}
                            onConfirm={(event) => this.onDeleteBookmark(event, onClose)}
                        >
                            {gettext('Are you sure you want to delete your note?')}
                        </ConfirmModal>
                    )}
                />
            </div>
        );
    }

    renderBookmarkBody(body) {
        return (
            <div styleName="content-container" data-purpose="bookmark-body">
                <RichTextViewer unsafeHTML={body} />
            </div>
        );
    }

    render() {
        const {position, body, lectureId, lectureDisplayTitle} = this.props.bookmark;

        return (
            <div styleName="row">
                <div styleName="duration">
                    <ItemLink
                        itemType={ITEM_TYPES.LECTURE}
                        itemId={lectureId}
                        startAt={position}
                        onClick={this.onClick}
                        tabIndex={-1}
                        aria-hidden={true}
                    >
                        <LectureBookmarkDuration position={position} />
                    </ItemLink>
                </div>
                <div styleName="bookmark-container">
                    {this.renderBookmarkHeader(lectureId, position, lectureDisplayTitle)}
                    {this.isEditingBookmark ? (
                        <div styleName="editor-container">
                            <LectureBookmarkForm
                                autoFocus={true}
                                bookmark={this.props.bookmark}
                                onCancelClick={this.onToggleEditing}
                                onSaveClick={this.onSaveClick}
                            />
                        </div>
                    ) : (
                        this.renderBookmarkBody(body)
                    )}
                </div>
            </div>
        );
    }
}
