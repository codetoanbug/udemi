import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {htmlToText} from 'base-components/ungraduated/form/rich-text-editor/helpers';

import './announcement-table.less';

export default class AnnouncementTitleCell extends Component {
    static propTypes = {
        announcement: PropTypes.object.isRequired,
    };

    render() {
        const {id, course, announcement_group: announcementGroup} = this.props.announcement;
        return (
            <div data-purpose="announcement-cell">
                <div styleName="table-cell-ellipsis table-cell-ellipsis-underline">
                    <b>
                        <a
                            className="ud-link-underline"
                            href={`/announcement/${id}/?course=${course.id}`}
                            target="_blank"
                            rel="nofollow noreferrer noopener"
                        >
                            {announcementGroup.title}
                        </a>
                    </b>
                </div>
                <div data-purpose="announcement-content" styleName="table-cell-ellipsis">
                    {htmlToText(announcementGroup.content).trim()}
                </div>
            </div>
        );
    }
}
