import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from '../../../registry/requires';
import {BOOKMARK_PORTAL_ID} from './constants';
import VideoBookmark from './video-bookmark.react-component';

const generatePortalElement = (id) => (WrappedComponent) => (props) => (
    <>
        <div id={id} />
        <WrappedComponent {...props} />
    </>
);

@generatePortalElement(BOOKMARK_PORTAL_ID)
@requires('videoBookmarksStore')
@observer
export default class VideoBookmarks extends React.Component {
    static propTypes = {
        videoBookmarksStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.videoBookmarksStore.loadBookmarks();
    }

    get bookmarks() {
        return this.props.videoBookmarksStore.normalisedBookmarks.map((bookmark) => (
            <VideoBookmark
                key={bookmark.key}
                bookmark={bookmark}
                isActive={this.props.videoBookmarksStore.activeBookmarkId === bookmark.id}
            />
        ));
    }

    render() {
        if (!this.props.videoBookmarksStore.player) {
            return null;
        }
        return <div>{this.bookmarks}</div>;
    }
}
