import {Avatar} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {Badge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import NumUpvotes from '../course-taking/dashboard/questions/question-answer/num-upvotes.react-component';
import ReplyActionsDropdown from './reply-actions-dropdown.react-component';
import ResponseStore from './response.mobx-store';

import './response.less';

const stopMarkAsReadProps = {onClick: (event) => event.stopPropagation()};

@observer
export default class Response extends Component {
    static propTypes = {
        highlight: PropTypes.bool.isRequired,
        response: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        const {thread, response} = this.props;
        this.store = new ResponseStore(thread, response);
    }

    get numUpvotes() {
        const {numUpvotes, isUpvoted, upvote} = this.store;
        return (
            <NumUpvotes numUpvotes={numUpvotes} onToggleUpvoted={upvote} isUpvoted={isUpvoted} />
        );
    }

    render() {
        const {response, thread, highlight} = this.props;
        const user = response.user,
            newResponse =
                thread.last_instructor_viewed_time &&
                thread.last_instructor_viewed_time < response.last_activity;
        return (
            <div
                styleName={classNames('response-outer', {
                    'response-outer-new': !!newResponse,
                    'response-outer-highlight': highlight,
                })}
            >
                <a
                    aria-hidden={true}
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex="-1"
                >
                    <Avatar user={user} alt="NONE" srcKey="image_50x50" size="small" />
                </a>
                <div styleName="response-content">
                    <div className="ud-text-sm" styleName="response-content-row">
                        <a href={user.url} target="_blank" rel="noopener noreferrer">
                            {user.title}
                        </a>
                        <span styleName="user-info-date">
                            <RelativeDuration datetime={response.created} />
                        </span>
                    </div>
                    <RichTextViewer wrapImages={true} unsafeHTML={response.body} />
                    {response.is_top_answer && (
                        <Badge styleName="response-top-answer">{gettext('Top answer')}</Badge>
                    )}
                </div>
                <div {...stopMarkAsReadProps} styleName="response-actions">
                    <div styleName="row">
                        <div styleName="upvotes">{this.numUpvotes}</div>
                        <ReplyActionsDropdown thread={thread} response={response} />
                    </div>
                </div>
            </div>
        );
    }
}
