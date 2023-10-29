import {LocalizedHtml} from '@udemy/i18n';
import {Button, Image, Link} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ONE_PANE_MODE} from 'instructor/common/constants';
import escapeHtml from 'utils/escape/escape-html';

import NumUpvotes from '../course-taking/dashboard/questions/question-answer/num-upvotes.react-component';
import ThreadActionsDropdown from './thread-actions-dropdown.react-component';

import './question-header.less';

const stopMarkAsReadProps = {onClick: (event) => event.stopPropagation()};

@observer
export default class QuestionHeader extends Component {
    static propTypes = {
        thread: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
    };

    get numUpvotes() {
        const {store, thread} = this.props;
        return (
            <NumUpvotes
                numUpvotes={thread.num_upvotes}
                onToggleUpvoted={() => store.questionUpvote(thread)}
                isUpvoted={thread.is_upvoted}
            />
        );
    }

    render() {
        const {store, thread} = this.props;
        return (
            <div className="ud-text-sm" styleName="thread-header">
                {store.viewModeType !== ONE_PANE_MODE && (
                    <Button
                        componentClass={Link}
                        to={`${store.baseUrl}/${thread.id}/`}
                        udStyle="ghost"
                        styleName="back"
                        typography="ud-heading-sm"
                    >
                        {gettext('Back')}
                    </Button>
                )}
                <div styleName="thread-header-course-image">
                    <Image src={thread.course.image_125_H} alt="" width={125} height={70} />
                </div>
                <div styleName="thread-header-course-info">
                    <LocalizedHtml
                        styleName="ellipsis"
                        html={interpolate(
                            gettext('Public question in <a class="courseLink">%(name)s</a>'),
                            {name: escapeHtml(thread.course.title)},
                            true,
                        )}
                        interpolate={{
                            courseLink: (
                                <a
                                    href={`${thread.course.url}#questions/${thread.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                    {thread.related_object ? (
                        <div styleName="ellipsis">
                            <a
                                // Lectures and quizzes have url, practice objects have learn_url in their serializers.
                                href={`${
                                    thread.related_object.url || thread.related_object.learn_url
                                }#questions/${thread.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {thread.related_object.title}
                            </a>
                        </div>
                    ) : (
                        <div styleName="ellipsis subdued">
                            {gettext('This question isn’t linked to a lecture')}
                        </div>
                    )}
                </div>
                <div {...stopMarkAsReadProps}>
                    <div styleName="row">
                        <div styleName="upvotes">{this.numUpvotes}</div>
                        <ThreadActionsDropdown {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}
