import Observer from '@researchgate/react-intersection-observer';
import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {CourseEngagamentActionEvent} from 'instructor/events';

import ListPanel from '../list-panel.react-component';
import LectureHighlightsListItem from './lecture-highlights-list-item.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from '../list-panel.less';
import styles from './lecture-highlights.less';
/* eslint-enable no-unused-vars,import/order */

export const BookmarkListItem = (props) => (
    <LectureHighlightsListItem metricLabel="bookmarks" {...props} />
);

export const DroppedListItem = (props) => (
    <LectureHighlightsListItem metricLabel="dropped" {...props} />
);

@observer
export default class LectureHighlights extends Component {
    static propTypes = {
        bookmarks: PropTypes.object.isRequired,
        dropped: PropTypes.object.isRequired,
    };

    @autobind
    markAsSeen({isIntersecting}, unobserve) {
        window.setTimeout(() => {
            if (isIntersecting) {
                Tracker.publishEvent(
                    new CourseEngagamentActionEvent({
                        category: 'lecture_highlights',
                        action: 'view',
                    }),
                );
                unobserve();
            }
        }, 0);
    }

    render() {
        const {bookmarks, dropped} = this.props;

        const bookmarkPanel = {
            title: ngettext(
                'Most bookmarked lecture',
                'Most bookmarked lectures',
                bookmarks.metrics.length,
            ),
            content: bookmarks,
            hasTooltip: true,
            tooltipCopy: gettext(
                'Students can create bookmarks to mark moments in your course they want to come back to. ' +
                    'Your most bookmarked lectures may have particularly helpful or important material.',
            ),
            listItemClass: BookmarkListItem,
            emptyMessage: (
                <div>
                    <p>{gettext('No bookmarks yet...')}</p>
                    <p>{gettext('Try checking back later or widening your date range')}</p>
                </div>
            ),
        };
        const droppedPanel = {
            title: ngettext(
                'Most dropped lecture',
                'Most dropped lectures',
                dropped.metrics.length,
            ),
            content: dropped,
            hasTooltip: true,
            tooltipCopy: gettext(
                'Dropped lectures are videos that students stopped watching within 15 seconds. ' +
                    "A dropped lecture may indicate that students didn't find what they were looking for in the beginning of the video.",
            ),
            listItemClass: DroppedListItem,
            emptyMessage: gettext('No dropped lectures!'),
        };

        return (
            <Observer onChange={this.markAsSeen}>
                <div styleName="baseStyles.list-panels" data-purpose="lecture-highlights-panels">
                    {[bookmarkPanel, droppedPanel].map((panel) => (
                        <ListPanel
                            key={panel.title}
                            title={panel.title}
                            content={panel.content}
                            listItemClass={panel.listItemClass}
                            hasTooltip={panel.hasTooltip}
                            tooltipCopy={panel.tooltipCopy}
                            emptyMessage={panel.emptyMessage}
                            minContentHeight={226}
                        />
                    ))}
                </div>
            </Observer>
        );
    }
}
