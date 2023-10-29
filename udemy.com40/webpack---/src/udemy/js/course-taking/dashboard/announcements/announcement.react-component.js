import {LocalizedHtml} from '@udemy/i18n';
import {Avatar} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CommentThread from 'base-components/ungraduated/comments/comment-thread.react-component';
import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import ReportAbuseTooltip from 'report-abuse/report-abuse-tooltip.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import './announcements.less';

const InstructorName = ({children, ...props}) => (
    <span styleName="instructor-name">
        <a {...props} styleName="instructor-name-link">
            <span styleName="instructor-name-text">{children}</span>
        </a>
    </span>
);

@inject('announcementsStore')
@observer
export default class Announcement extends React.Component {
    static propTypes = {
        announcementsStore: PropTypes.object.isRequired,
        announcement: PropTypes.object.isRequired,
    };

    get commentResourceUrl() {
        const announcementId = this.props.announcement.id;
        return `/announcements/${announcementId}/comments/`;
    }

    render() {
        const {announcement, announcementsStore} = this.props;
        const instructor = announcement.instructor;
        return (
            <div styleName="announcement" data-purpose="announcement">
                <div
                    styleName="instructor-details"
                    className="ud-text-with-links"
                    data-purpose="instructor-details"
                >
                    <Avatar
                        user={{...instructor, display_name: instructor.title}}
                        srcKey="image50x50"
                        alt="NONE"
                        size="medium"
                    />
                    <div styleName="instructor-post">
                        <LocalizedHtml
                            styleName="instructor-post-text"
                            html={interpolate(
                                gettext(
                                    '<a class="instructor">%(instructor_name)s</a> posted an announcement',
                                ),
                                {instructor_name: instructor.name},
                                true,
                            )}
                            interpolate={{
                                instructor: (
                                    <InstructorName
                                        href={instructor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ),
                            }}
                        />
                        <span styleName="bullet">{' · '}</span>
                        <span styleName="line-break-mobile" />
                        <time>
                            <RelativeDuration datetime={announcement.created} />
                        </time>
                        {announcementsStore.isReportAbuseEnabled && (
                            <span styleName="bullet">{' · '}</span>
                        )}
                        {announcementsStore.isReportAbuseEnabled && (
                            <ReportAbuseModalTrigger
                                objectId={announcement.id}
                                objectType="courseannouncement"
                                trigger={
                                    <ReportAbuseTooltip
                                        udStyle="link"
                                        className="ud-link-neutral"
                                        styleName="report-abuse"
                                    />
                                }
                            />
                        )}
                    </div>
                </div>
                <div data-purpose="announcement-content">
                    {!!announcement.title && (
                        <div className="ud-heading-lg" styleName="announcement-title">
                            {announcement.title}
                        </div>
                    )}
                    <div
                        className="ud-text-with-links"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'announcement:content',
                            html: announcement.content,
                        })}
                    />
                    {announcementsStore.canShowComments && (
                        <CommentThread
                            resourceUrl={this.commentResourceUrl}
                            commentThread={announcement.commentThread}
                            styleName="comment-thread"
                        />
                    )}
                </div>
            </div>
        );
    }
}
