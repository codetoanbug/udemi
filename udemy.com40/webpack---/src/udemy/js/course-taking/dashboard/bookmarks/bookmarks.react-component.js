import {Dropdown} from '@udemy/react-menu-components';
import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import requires from '../../registry/requires';
import {LECTURE_FILTER, LECTURE_FILTER_LABELS, SORT_BY, SORT_LABELS} from './constants';
import CreateBookmark from './create-bookmark.react-component';
import LectureBookmark from './lecture-bookmark-v2.react-component';

import './bookmarks.less';

@requires('courseTakingStore', 'bookmarksStore')
@observer
export default class Bookmarks extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        bookmarksStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.bookmarksStore.loadBookmarks();
    }

    get lectureFilterDropdown() {
        const {bookmarksStore} = this.props;
        return (
            <Dropdown
                placement="bottom-start"
                trigger={
                    <Dropdown.Button>
                        {LECTURE_FILTER_LABELS[bookmarksStore.lectureFilter]}
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem
                        onClick={() => bookmarksStore.updateLectureFilter(LECTURE_FILTER.ALL)}
                        data-purpose="filter-by-all-lectures"
                    >
                        {LECTURE_FILTER_LABELS[LECTURE_FILTER.ALL]}
                    </Dropdown.MenuItem>
                    <Dropdown.MenuItem
                        onClick={() => bookmarksStore.updateLectureFilter(LECTURE_FILTER.CURRENT)}
                        data-purpose="filter-by-current-lecture"
                    >
                        {LECTURE_FILTER_LABELS[LECTURE_FILTER.CURRENT]}
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    get sortOptionsDropdown() {
        const {bookmarksStore} = this.props;
        return (
            <Dropdown
                placement="bottom-start"
                trigger={<Dropdown.Button>{SORT_LABELS[bookmarksStore.sortBy]}</Dropdown.Button>}
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem
                        onClick={() => bookmarksStore.updateSortingKey(SORT_BY.RECENCY)}
                        data-purpose="sort-by-most-recent"
                    >
                        {SORT_LABELS[SORT_BY.RECENCY]}
                    </Dropdown.MenuItem>
                    <Dropdown.MenuItem
                        onClick={() => bookmarksStore.updateSortingKey(SORT_BY.OLDEST)}
                        data-purpose="sort-by-oldest"
                    >
                        {SORT_LABELS[SORT_BY.OLDEST]}
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    renderFilters() {
        return (
            <div styleName="sort-filter-container">
                {this.lectureFilterDropdown}
                {this.sortOptionsDropdown}
            </div>
        );
    }

    renderContent() {
        const {bookmarksStore} = this.props;
        if (!bookmarksStore.hasLoaded) {
            return <Loader block={true} size="xxlarge" />;
        }
        if (
            !bookmarksStore.bookmarks.length &&
            bookmarksStore.lectureFilter === LECTURE_FILTER.ALL
        ) {
            return (
                <div styleName="no-bookmarks-created">
                    {gettext(
                        'Click the "Create a new note" box, the "+" button, ' +
                            'or press "B" to make your first note.',
                    )}
                </div>
            );
        }
        return (
            <div data-purpose="bookmarks-container" styleName="bookmarks">
                {bookmarksStore.allBookmarksWithSection.map((bookmarkWithSection) => (
                    <LectureBookmark
                        key={bookmarkWithSection.bookmark.key}
                        bookmark={bookmarkWithSection.bookmark}
                        section={bookmarkWithSection.section}
                    />
                ))}
            </div>
        );
    }

    render() {
        return (
            <>
                <CreateBookmark data-purpose="create-bookmark-form-button" />
                {this.renderFilters()}
                {this.renderContent()}
            </>
        );
    }
}
