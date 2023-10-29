import {Avatar, Button, Link} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import PreserveScroll from 'instructor/layout/preserve-scroll.react-component';
import getRequestData from 'utils/get-request-data';

import ActionsDropdown from './actions-dropdown.react-component';
import {localizeRecentDate} from './date';
import ReplyForm from './reply-form.react-component';

import './message-thread-detail.less';

const stopMarkAsReadProps = {onClick: (event) => event.stopPropagation()};

export const EnrolledCoursesDropdown = observer(({courses}) => {
    if (!courses || !courses.length) {
        return null;
    }

    return (
        <Dropdown
            placement="bottom-start"
            menuWidth="large"
            styleName="inline"
            trigger={
                <Dropdown.Button udStyle="link" styleName="inline" typography="ud-text-sm">
                    <span styleName="ellipsis">
                        {gettext('Enrolled in one or more of your courses')}
                    </span>
                </Dropdown.Button>
            }
        >
            <Dropdown.Menu>
                {courses.map((course) => (
                    <Dropdown.MenuItem key={course.id} href={course.url}>
                        {course.title}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
});

const Message = ({message, user}) => (
    <div styleName="message-outer">
        <a
            aria-hidden={true}
            href={user.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex="-1"
        >
            <Avatar user={user} alt="NONE" srcKey="image_50x50" size="small" />
        </a>
        <div styleName="message-content">
            <div className="ud-text-sm" styleName="message-content-row">
                <a
                    className="ud-text-bold"
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {user.display_name}
                </a>
                <span styleName="message-info-date">
                    {new Date(message.created).toLocaleTimeString(
                        getRequestData().locale.replace('_', '-') || 'en-US',
                        {
                            hour: 'numeric',
                            minute: '2-digit',
                        },
                    )}
                </span>
            </div>
            <div className="fs-exclude" styleName="message-rich-text">
                <RichTextViewer wrapImages={true} unsafeHTML={message.content} />
            </div>
        </div>
    </div>
);

Message.propTypes = {
    message: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

const DateDivider = ({date}) => {
    return (
        <div className="ud-heading-xs" styleName="date-divider">
            {date}
        </div>
    );
};
DateDivider.propTypes = {
    date: PropTypes.string.isRequired,
};

@inject('store')
@observer
export default class MessageThreadDetail extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object,
    };

    static defaultProps = {
        thread: null,
    };

    @autobind
    markAsRead() {
        this.props.store.markAsRead(this.props.thread);
    }

    render() {
        const {store, thread} = this.props;

        if (!thread) {
            // Render empty content?
            return null;
        }

        const messageList = [],
            messages = thread.messages,
            otherUser = thread.other_user;
        let date = null;
        for (const message of messages) {
            const thisDate = localizeRecentDate(new Date(message.created));
            if (date != thisDate) {
                date = thisDate;
                messageList.push(<DateDivider date={date} key={date} />);
            }
            const user = message.is_outgoing ? store.me : thread.other_user;
            messageList.push(<Message message={message} user={user} key={message.id} />);
        }

        // Both UnreadIndicator and ActionsDropdown handle "mark as read" a11y.
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        return (
            <div styleName="two-pane-container" onClick={this.markAsRead}>
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div className="ud-text-sm" styleName="thread-header">
                    <Button
                        componentClass={Link}
                        to={`${store.baseUrl}/${thread.id}/`}
                        udStyle="ghost"
                        styleName="back"
                        typography="ud-heading-sm"
                    >
                        {gettext('Back')}
                    </Button>
                    <div styleName="thread-header-message-info">
                        <div styleName="ellipsis">
                            {interpolate(
                                gettext('Conversation with %(name)s'),
                                {name: otherUser.display_name},
                                true,
                            )}
                        </div>
                        <EnrolledCoursesDropdown courses={thread.enrolled_courses} />
                    </div>
                    <div {...stopMarkAsReadProps}>
                        <ActionsDropdown thread={thread} />
                    </div>
                </div>
                <PreserveScroll autoScrollToBottom={true} contentId={thread.id}>
                    {store.isThreadDetailLoading && messages.length === 0 ? (
                        <Loader styleName="loader" block={true} size="large" />
                    ) : (
                        messageList
                    )}
                </PreserveScroll>
                {!store.directMessagingDisabled && thread.can_respond && (
                    <ReplyForm thread={thread} onSend={store.replyToThread} />
                )}
            </div>
        );
    }
}
