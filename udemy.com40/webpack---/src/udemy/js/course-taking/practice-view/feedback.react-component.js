import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {Avatar, Button, IconButton} from '@udemy/react-core-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CommentThread from 'base-components/ungraduated/comments/comment-thread.react-component';
import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import {showErrorToast} from 'course-taking/toasts';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import './feedback.less';

const FeedbackEditor = ({
    feedback,
    localFeedbackAnswer,
    onChange,
    onSubmit,
    onCancel,
    showPlaceholder,
    onClickPlaceholder,
}) => {
    if (showPlaceholder) {
        return <TextInput placeholder={feedback.placeholderText} onClick={onClickPlaceholder} />;
    }

    return (
        <>
            <RichTextEditor
                autoFocus={true}
                theme={RichTextEditor.THEMES.ASSIGNMENT}
                onValueChange={onChange}
                value={localFeedbackAnswer}
            />
            <div styleName="flex-row footer-btns">
                <Button size="small" onClick={onSubmit} data-purpose="submit-button">
                    {gettext('Submit')}
                </Button>
                <Button
                    className="ud-link-neutral"
                    udStyle="ghost"
                    size="small"
                    onClick={onCancel}
                    data-purpose="cancel-button"
                >
                    {gettext('Cancel')}
                </Button>
            </div>
        </>
    );
};

FeedbackEditor.propTypes = {
    feedback: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    showPlaceholder: PropTypes.bool.isRequired,
    onClickPlaceholder: PropTypes.func.isRequired,
    localFeedbackAnswer: PropTypes.string,
};

FeedbackEditor.defaultProps = {
    localFeedbackAnswer: null,
};

const FeedbackViewer = ({feedback, onEdit, onDelete}) => {
    return (
        <>
            <div styleName="flex-row">
                <div styleName="flex">
                    <a href={feedback.answer.user.url} data-purpose="commenter-name">
                        <span styleName="ellipsis">{feedback.answer.user.title}</span>
                    </a>
                </div>
                {feedback.userCanEdit && (
                    <div styleName="flex-row feedback-answer-top-btns">
                        <IconButton
                            className="ud-link-neutral"
                            udStyle="ghost"
                            size="small"
                            data-purpose="edit-button"
                            onClick={onEdit}
                        >
                            <EditIcon label={gettext('Edit answer')} />
                        </IconButton>
                        <IconButton
                            className="ud-link-neutral"
                            udStyle="ghost"
                            size="small"
                            data-purpose="delete-button"
                            onClick={onDelete}
                        >
                            <DeleteIcon label={gettext('Delete answer')} />
                        </IconButton>
                    </div>
                )}
            </div>
            <RichTextViewer unsafeHTML={feedback.answer.body} />
        </>
    );
};

FeedbackViewer.propTypes = {
    feedback: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

FeedbackViewer.defaultProps = {
    localFeedbackAnswer: null,
};

@observer
export default class Feedback extends Component {
    static propTypes = {
        feedback: PropTypes.object.isRequired,
        areCommentsVisible: PropTypes.bool,
    };

    static defaultProps = {
        areCommentsVisible: true,
    };

    constructor(props) {
        super(props);
        this.setInitialEditorStatus();
        this.updateLocalAnswer(props.feedback.answer.body);
    }

    @observable localFeedbackAnswer;
    @observable shouldShowEditor;
    @observable isEditing = false;

    @action
    setInitialEditorStatus() {
        this.shouldShowEditor = !this.props.feedback.answer.body;
    }

    @autobind
    @action
    toggleEditor() {
        this.shouldShowEditor = !this.shouldShowEditor;
    }

    @autobind
    @action
    toggleEditMode() {
        if (this.props.feedback.isSubmitted) {
            this.toggleEditor();
        }
        this.isEditing = !this.isEditing;
    }

    // Local answer is stored separately than feedback.answer.body so that feedback appears correctly
    // when user clicks to a comment, makes changes but does not save, then clicks cancel.
    @autobind
    @action
    updateLocalAnswer(val) {
        this.localFeedbackAnswer = val;
    }

    @autobind
    onSubmitAnswer() {
        const onSaveCallback = this.toggleEditMode;
        this.props.feedback.updateAnswerValue(this.localFeedbackAnswer);
        const onErrorCallback = (errorMessage) => {
            if (errorMessage && errorMessage.length > 0) {
                showErrorToast(errorMessage);
            }
        };
        this.props.feedback.saveAnswer(onSaveCallback, onErrorCallback);
    }

    @autobind
    onDeleteAnswer() {
        this.props.feedback.deleteAnswer();
        this.updateLocalAnswer(null);
        this.toggleEditor();
    }

    render() {
        const {feedback, areCommentsVisible} = this.props;
        return (
            <div data-purpose="practice-feedback">
                <div
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'feedback:question-body',
                        html: feedback.question.body,
                        dataPurpose: 'feedback-question',
                    })}
                />
                <div styleName="flex-row feedback-answer" data-purpose="feedback-answer">
                    <Avatar
                        user={feedback.answer.user}
                        alt="DISPLAY_NAME"
                        size="medium"
                        srcKey="image_50x50"
                    />
                    <form styleName="flex feedback-answer-right">
                        <FormGroup
                            label={gettext('Add feedback...')}
                            labelProps={{className: 'ud-sr-only'}}
                            note={feedback.answer.errors}
                            validationState={feedback.answer.errors ? 'error' : 'neutral'}
                        >
                            {this.shouldShowEditor ? (
                                <FeedbackEditor
                                    feedback={feedback}
                                    localFeedbackAnswer={this.localFeedbackAnswer}
                                    onChange={this.updateLocalAnswer}
                                    onSubmit={this.onSubmitAnswer}
                                    onDelete={this.onDeleteAnswer}
                                    onCancel={this.toggleEditMode}
                                    showPlaceholder={!this.isEditing}
                                    onClickPlaceholder={this.toggleEditMode}
                                />
                            ) : (
                                <FeedbackViewer
                                    feedback={feedback}
                                    onEdit={this.toggleEditMode}
                                    onDelete={this.onDeleteAnswer}
                                />
                            )}
                        </FormGroup>
                        {areCommentsVisible && feedback.isSubmitted && (
                            <CommentThread
                                autoLoad={true}
                                canReply={feedback.canReplyToComment}
                                resourceUrl={feedback.commentUrl}
                                commentThread={feedback.answer.commentThread}
                                richTextTheme={RichTextEditor.THEMES.ASSIGNMENT}
                                styleName="comment-thread"
                            />
                        )}
                    </form>
                </div>
            </div>
        );
    }
}
