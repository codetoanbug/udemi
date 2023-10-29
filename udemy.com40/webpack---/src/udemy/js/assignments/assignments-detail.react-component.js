import {Avatar, Image} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CommentThread from 'base-components/ungraduated/comments/comment-thread.react-component';
import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import SectionDivider from 'instructor/common/section-divider.react-component';
import ReplyForm from 'messaging/new-ia/reply-form.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import FeedbackActionsDropdown from './feedback-actions-dropdown.react-component';
import ThreadActionsDropdown from './thread-actions-dropdown.react-component';

import './assignments-detail.less';

const stopMarkAsReadProps = {onClick: (event) => event.stopPropagation()};

const Response = ({response, thread, highlight}) => {
    const user = response.user,
        newResponse =
            thread.last_instructor_viewed_time &&
            thread.last_instructor_viewed_time < response.last_activity;
    return (
        <>
            <SectionDivider text={gettext('your feedback')} />
            <div
                styleName={classNames('response-outer', {
                    'response-outer-new': !!newResponse,
                    'response-outer-highlight': highlight,
                })}
            >
                <Avatar user={user} alt="NONE" srcKey="image_50x50" size="medium" />
                <div styleName="response-content">
                    <div className="ud-text-md" styleName="response-content-title">
                        <span styleName="response-user-name-row">
                            <a href={user.url} target="_blank" rel="noopener noreferrer">
                                <span styleName="ellipsis">{user.title}</span>
                            </a>
                        </span>
                        <span styleName="bullet">&nbsp;{'·'}&nbsp;</span>
                        <span>
                            <RelativeDuration datetime={response.created} />
                        </span>
                    </div>
                    <RichTextViewer wrapImages={true} unsafeHTML={response.body} />
                </div>
                <div {...stopMarkAsReadProps} styleName="response-actions">
                    <FeedbackActionsDropdown thread={thread} response={response} />
                </div>
            </div>
            {!response.isPlaceholderFeedback && (
                <CommentThread
                    autoLoad={true}
                    isReversed={true}
                    commentThread={response.comment_thread}
                    resourceUrl={`/practices/${thread.practice.id}/user-attempted-practices/${thread.id}/feedback-user-answers/${response.id}/comments/`}
                    richTextTheme={RichTextEditor.THEMES.ASSIGNMENT}
                    styleName="comment-thread"
                />
            )}
        </>
    );
};
Response.propTypes = {
    highlight: PropTypes.bool.isRequired,
    response: PropTypes.object.isRequired,
    thread: PropTypes.object.isRequired,
};

const QuestionAnswers = ({answers}) => {
    const practiceQuestionIds = answers.map((qua) => qua.practice_question.id);
    const uniqueQuestionIds = [...new Set(practiceQuestionIds)];
    const uniqueQuestionAnswers = [];

    // due to a previous bug there exists some duplicate answers to the same questions
    // here, we eliminate duplicates and take the last reply as an answer.
    answers.forEach((answer) => {
        const idx = uniqueQuestionIds.findIndex((qId) => qId === answer.practice_question.id);
        if (idx !== -1) {
            if (idx >= uniqueQuestionAnswers.length) {
                uniqueQuestionAnswers.push(answer);
            } else {
                uniqueQuestionAnswers[idx] = answer;
            }
        }
    });

    return (
        <>
            {uniqueQuestionAnswers.map((qua, num) => (
                <React.Fragment key={qua.id}>
                    <div styleName="question-title">
                        <div>{`${num + 1}.`}</div>
                        <RichTextViewer
                            wrapImages={true}
                            styleName="question-title-text"
                            unsafeHTML={qua.practice_question.body}
                        />
                    </div>
                    <RichTextViewer wrapImages={true} unsafeHTML={qua.body} />
                </React.Fragment>
            ))}
        </>
    );
};
QuestionAnswers.propTypes = {
    answers: PropTypes.object.isRequired,
};

const ThreadDetail = ({thread}) => {
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
                        <RelativeDuration datetime={thread.submission_time} />
                    </span>
                </div>
                <QuestionAnswers answers={thread.question_user_answers} />
            </div>
        </div>
    );
};
ThreadDetail.propTypes = {
    thread: PropTypes.object.isRequired,
};

@inject('store')
@observer
export default class AssignmentsDetail extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object,
    };

    static defaultProps = {
        thread: null,
    };

    constructor(props) {
        super(props);
        this.editingReplyDisposer = reaction(
            () => this.props.store.editingReply,
            () => {
                setTimeout(() => {
                    this.props.store.editingReply && this.focusReply();
                });
            },
        );
    }

    componentWillUnmount() {
        this.editingReplyDisposer && this.editingReplyDisposer();
    }

    replyBox = null;

    @autobind
    markAsRead() {
        this.props.store.markAsRead(this.props.thread);
    }

    @autobind
    updateReply(thread, content) {
        return this.props.store.updateReply({body: content}).then(() => {
            if (this.props.store.editingReply) {
                this.focusReply();
                throw new Error('Cannot save reply');
            }
        });
    }

    @autobind
    focusReply() {
        this.replyBox && this.replyBox.focusEditor && this.replyBox.focusEditor();
    }

    @autobind
    cancelEditReply() {
        this.props.store.cancelEditingReply();
    }

    @autobind
    setReplyRef(ref) {
        this.replyBox = ref;
    }

    @autobind
    hideAlert() {
        this.props.store.clearErrorMessage();
    }

    @autobind
    replyToThread(thread, body) {
        return this.props.store.replyToThread(thread, body);
    }

    renderHeader(thread) {
        const course = thread.practice.course;
        return (
            <div className="ud-text-sm" styleName="thread-header">
                <div styleName="thread-header-course-image">
                    <Image src={course.image_125_H} alt="" width={125} height={70} />
                </div>
                <div styleName="thread-header-course-info">
                    <div styleName="ellipsis">
                        <a href={course.url} target="_blank" rel="noopener noreferrer">
                            {course.title}
                        </a>
                    </div>
                    <div styleName="ellipsis">
                        <span>{`${gettext('Assignment')}: `}</span>
                        <a
                            href={thread.practice.learn_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {thread.practice.title}
                        </a>
                    </div>
                </div>
                <div {...stopMarkAsReadProps}>
                    <ThreadActionsDropdown thread={thread} />
                </div>
            </div>
        );
    }

    render() {
        const {thread, store} = this.props;
        if (!thread) {
            // Render empty content?
            return null;
        }
        const editingReply = thread.id === store.editingThread.id && store.editingReply;
        const initialContent = editingReply ? store.editingReply.body : '';
        const responses = thread.responses;
        // Both QuestionStatusTooltip and ThreadActionsDropdown handle "mark as read" a11y.
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        return (
            <div styleName="one-pane-container" onClick={this.markAsRead}>
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                {this.renderHeader(thread)}
                <ThreadDetail thread={thread} />
                {store.isThreadDetailLoading && responses.length === 0 ? (
                    <Loader styleName="loader" block={true} size="large" />
                ) : (
                    responses.map((response) => (
                        <Response
                            response={response}
                            thread={thread}
                            highlight={response === store.editingReply}
                            key={`${response.id}`}
                        />
                    ))
                )}
                {store.errorMessage && (
                    <AlertBanner
                        udStyle={store.errorMessage.type || 'error'}
                        showCta={!!store.errorMessage.type}
                        ctaText={gettext('Dismiss')}
                        onAction={this.hideAlert}
                        dismissButtonProps={false}
                        title={
                            store.errorMessage.type === 'warning'
                                ? gettext('Warning')
                                : gettext('Error')
                        }
                        body={
                            <div
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'assignments:error-message-0',
                                    html: store.errorMessage.messages[0],
                                })}
                            />
                        }
                    />
                )}
                {editingReply ? (
                    <ReplyForm
                        ref={this.setReplyRef}
                        thread={thread}
                        CTAText={gettext('Update')}
                        onCancel={this.cancelEditReply}
                        cancelText={gettext('Cancel')}
                        initialContent={initialContent}
                        placeholder={gettext('Update your feedback...')}
                        onSend={this.updateReply}
                        richTextTheme={RichTextEditor.THEMES.Q_AND_A}
                    />
                ) : responses.length === 0 ? (
                    <ReplyForm
                        thread={thread}
                        CTAText={gettext('Post')}
                        placeholder={gettext('Give feedback...')}
                        onSend={this.replyToThread}
                        richTextTheme={RichTextEditor.THEMES.Q_AND_A}
                    />
                ) : null}
            </div>
        );
    }
}
