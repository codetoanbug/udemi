import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {CourseEngagamentActionEvent} from 'instructor/events';
import {formatNumber} from 'utils/numeral';

import {formatPercent} from '../helpers';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from '../list-panel.less';
import styles from './lecture-highlights.less';
/* eslint-enable no-unused-vars,import/order */

export default class LectureHighlightsListItem extends Component {
    static propTypes = {
        itemData: PropTypes.object.isRequired,
        metricLabel: PropTypes.string.isRequired,
    };

    @autobind
    openLecture(event) {
        event.preventDefault();
        window.open(this.props.itemData.url, 'newwindow', 'width=1080,height=600,top=250,left=500');

        Tracker.publishEvent(
            new CourseEngagamentActionEvent({
                category: this.props.metricLabel,
                objectType: 'lecture',
                objectId: this.props.itemData.lecture_id,
                action: 'click',
            }),
        );
    }

    render() {
        const {itemData, metricLabel} = this.props;
        const formattedMetric =
            metricLabel === 'bookmarks'
                ? ninterpolate(
                      '%(bookmarks)s bookmark',
                      '%(bookmarks)s bookmarks',
                      itemData.bookmarks,
                      {bookmarks: formatNumber(itemData.bookmarks)},
                  )
                : interpolate(gettext('%s dropped'), [formatPercent(itemData.percent_skipped)]);
        return (
            <div styleName="baseStyles.item">
                <div styleName="baseStyles.flex baseStyles.item-details">
                    <a
                        href={itemData.url}
                        onClick={this.openLecture}
                        styleName="styles.lecture-link"
                    >
                        <div styleName="baseStyles.ellipsis">{itemData.title}</div>
                        <div
                            className="ud-text-sm"
                            styleName="baseStyles.ellipsis styles.lecture-metadata"
                        >
                            {interpolate(gettext('Section %s, Lecture %s'), [
                                itemData.section,
                                itemData.index,
                            ])}
                        </div>
                    </a>
                </div>
                <div styleName="baseStyles.ellipsis">{formattedMetric}</div>
            </div>
        );
    }
}
