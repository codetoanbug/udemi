import {Avatar} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {Badge} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import './question.less';

@observer
export default class Question extends Component {
    static propTypes = {
        thread: PropTypes.object.isRequired,
        showFeaturedQuestionsBadge: PropTypes.bool.isRequired,
    };

    render() {
        const {thread, showFeaturedQuestionsBadge} = this.props;
        const user = thread.user;

        return (
            <div styleName="question-outer">
                <a
                    aria-hidden={true}
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex="-1"
                >
                    <Avatar user={user} alt="NONE" srcKey="image_50x50" size="small" />
                </a>
                <div styleName="question-content">
                    <div className="ud-text-sm" styleName="question-content-row">
                        <a href={user.url} target="_blank" rel="noopener noreferrer">
                            {user.title}
                        </a>
                        <span styleName="user-info-date">
                            <RelativeDuration datetime={thread.created} />
                        </span>
                        {showFeaturedQuestionsBadge && thread.is_featured && (
                            <Badge styleName="featured-question-badge">
                                {gettext('Featured Question')}
                            </Badge>
                        )}
                    </div>
                    <div className="ud-heading-md" styleName="question-title">
                        {thread.title}
                    </div>
                    <RichTextViewer wrapImages={true} unsafeHTML={thread.body} />
                </div>
            </div>
        );
    }
}
