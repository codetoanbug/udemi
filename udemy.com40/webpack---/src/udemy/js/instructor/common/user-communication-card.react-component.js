import {Avatar, Link} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {Badge} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import UnreadIndicator from './unread-indicator.react-component';
import './user-communication-card.less';

@observer
export default class UserCommunicationCard extends Component {
    static propTypes = {
        isSelected: PropTypes.bool.isRequired,
        thread: PropTypes.object.isRequired,
        onUnreadClick: PropTypes.func,
        response: PropTypes.shape({
            user: PropTypes.object.isRequired,
            content: PropTypes.string.isRequired,
            created: PropTypes.string.isRequired,
        }).isRequired,
        headline: PropTypes.string,
        showFeaturedQuestionBadge: PropTypes.bool.isRequired,
        to: PropTypes.string.isRequired,
    };

    static defaultProps = {
        headline: null,
        onUnreadClick: noop,
    };

    @autobind
    onUnreadClick(event) {
        this.props.onUnreadClick(event, this.props.thread);
    }

    render() {
        const {headline, isSelected, response, thread, to, showFeaturedQuestionBadge} = this.props;

        // Strip out HTML content to show a text-only snippet.
        const lastResponseSnippet = (response.content || '').replace(/<[^>]+(>|$)/g, ' ');

        const unread = thread.is_read !== undefined && !thread.is_read;
        const important = thread.is_starred !== undefined && thread.is_starred;

        const answers = ninterpolate('%s answer', '%s answers', parseInt(thread.num_replies, 10));

        const upvotes = ninterpolate('%s upvote', '%s upvotes', parseInt(thread.num_upvotes, 10));

        const answersAndUpvotes = `${answers}, ${upvotes}`;

        const card = (
            <div styleName="card">
                <Avatar user={response.user} alt="NONE" srcKey="image_50x50" size="small" />
                <div styleName="flex">
                    <div className="fs-exclude" styleName="content-top">
                        {headline && (
                            <p className="ud-text-bold" styleName="ellipsis headline">
                                {headline}
                            </p>
                        )}
                        <p className={unread ? 'ud-text-bold' : ''} styleName="message">
                            {lastResponseSnippet}
                        </p>
                    </div>
                    <div className="ud-text-xs" styleName="content-bottom">
                        <span className="ud-text-bold" styleName="ellipsis flex">
                            {response.user.title}
                        </span>
                        <span styleName="ellipsis timestamp">
                            <RelativeDuration datetime={response.created} />
                        </span>
                    </div>
                    {showFeaturedQuestionBadge && thread.is_featured && (
                        <Badge styleName="featured-question-badge">
                            {gettext('Featured Question')}
                        </Badge>
                    )}
                    {thread.num_replies !== undefined && thread.num_upvotes !== undefined && (
                        <div className="ud-text-xs" styleName="content-bottom-info">
                            <span styleName="ellipsis upvote-answer">{answersAndUpvotes}</span>
                        </div>
                    )}
                </div>
            </div>
        );

        return (
            <div styleName={classNames('card-container', {active: isSelected})}>
                <Link styleName="link" to={to}>
                    {card}
                </Link>
                <div styleName="unread-indicator">
                    <UnreadIndicator
                        unread={unread}
                        important={important}
                        onClick={this.onUnreadClick}
                    />
                </div>
            </div>
        );
    }
}
