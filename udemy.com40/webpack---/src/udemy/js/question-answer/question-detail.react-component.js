import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, observable, reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import {ONE_PANE_MODE} from 'instructor/common/constants';
import SectionDivider from 'instructor/common/section-divider.react-component';
import PreserveScroll from 'instructor/layout/preserve-scroll.react-component';
import ReplyForm from 'messaging/new-ia/reply-form.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import QuestionHeader from './question-header.react-component';
import Question from './question.react-component';
import Response from './response.react-component';

import './question-detail.less';

@inject('store')
@observer
export default class QuestionDetail extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object,
        showFeaturedQuestionsBadge: PropTypes.bool.isRequired,
        isGenerateWithAIButtonEnabled: PropTypes.bool,
    };

    static defaultProps = {
        thread: null,
        isGenerateWithAIButtonEnabled: false,
    };

    constructor(props) {
        super(props);
        reaction(
            () => this.props.store.editingReply,
            () => {
                setTimeout(() => {
                    this.props.store.editingReply && this.focusReply();
                });
            },
        );
    }

    componentDidUpdate() {
        this.setEnableAutoScrollToBottom();
    }

    @observable showExpanded = false;
    @observable enableAutoScrollToBottom = false;
    replyBox = null;

    @action
    setEnableAutoScrollToBottom() {
        this.enableAutoScrollToBottom = false;
    }

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
        if (this.props.store.editingThread.id === this.replyBox.props.thread.id) {
            this.replyBox.focusEditor && this.replyBox.focusEditor();
        }
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
        this.enableAutoScrollToBottom = true;
        return this.props.store.replyToThread(thread, body);
    }

    render() {
        const {
            thread,
            store,
            showFeaturedQuestionsBadge,
            isGenerateWithAIButtonEnabled,
        } = this.props;
        if (!thread) {
            // Render empty content?
            return null;
        }
        const responses = thread.responses;
        const initialContent =
            thread.id === store.editingThread.id
                ? store.editingReply && store.editingReply.body
                : '';
        const showZeroAnswersDivider =
            store.isThreadDetailLoading &&
            responses.length === 0 &&
            store.viewModeType !== ONE_PANE_MODE;
        // Both QuestionStatusTooltip and ThreadActionsDropdown handle "mark as read" a11y.
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        return (
            <div
                styleName={
                    store.viewModeType === ONE_PANE_MODE
                        ? 'one-pane-container'
                        : 'two-pane-container'
                }
                onClick={this.markAsRead}
            >
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <QuestionHeader {...this.props} />
                <PreserveScroll
                    autoScrollToBottom={this.enableAutoScrollToBottom}
                    contentId={thread.id}
                >
                    <Question
                        thread={thread}
                        showFeaturedQuestionsBadge={showFeaturedQuestionsBadge}
                    />
                    {showZeroAnswersDivider ? (
                        <>
                            <SectionDivider text={gettext('answers')} />
                            <Loader styleName="loader" block={true} size="large" />
                        </>
                    ) : (
                        <>
                            {responses.length === 0 &&
                            store.viewModeType === ONE_PANE_MODE ? null : (
                                <SectionDivider
                                    text={ninterpolate('%s answer', '%s answers', responses.length)}
                                />
                            )}
                            {responses.map((response) => (
                                <Response
                                    response={response}
                                    thread={thread}
                                    highlight={response === store.editingReply}
                                    key={`${response.id}${response.is_top_answer}`}
                                />
                            ))}
                        </>
                    )}
                </PreserveScroll>
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
                                className="ud-text-with-links"
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'question-detail:error-message-0',
                                    domPurifyConfig: {ADD_ATTR: ['target']},
                                    html: store.errorMessage.messages[0],
                                })}
                            />
                        }
                    />
                )}
                {store.editingReply ? (
                    <ReplyForm
                        ref={this.setReplyRef}
                        thread={thread}
                        CTAText={gettext('Update')}
                        onCancel={this.cancelEditReply}
                        cancelText={gettext('Cancel')}
                        initialContent={initialContent}
                        placeholder={gettext('Change your answer...')}
                        onSend={this.updateReply}
                        richTextTheme={RichTextEditor.THEMES.Q_AND_A}
                    />
                ) : (
                    <ReplyForm
                        thread={thread}
                        CTAText={gettext('Post')}
                        placeholder={gettext('Post a public answer...')}
                        onSend={this.replyToThread}
                        richTextTheme={RichTextEditor.THEMES.Q_AND_A}
                        isGenerateWithAIButtonEnabled={isGenerateWithAIButtonEnabled}
                    />
                )}
            </div>
        );
    }
}
