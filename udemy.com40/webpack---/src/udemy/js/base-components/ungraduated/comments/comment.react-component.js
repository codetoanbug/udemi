import {getUniqueId} from '@udemy/design-system-utils';
import {withI18n} from '@udemy/i18n';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {Avatar, Button, IconButton} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {FormGroup, TextArea} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import ReportAbuseTooltip from 'report-abuse/report-abuse-tooltip.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';
import {noop} from 'utils/noop';
import udMe from 'utils/ud-me';

import CommentModel from './comment.mobx-model';
import {getPlaceHolderText} from './constants';

import './comment.less';

const udConfig = getConfigData();

@observer
class Comment extends React.Component {
    static propTypes = {
        comment: PropTypes.instanceOf(CommentModel).isRequired,
        richTextTheme: PropTypes.oneOf(Object.values(RichTextEditor.THEMES)),
        // eslint-disable-next-line react/require-default-props
        placeholder: PropTypes.string,
        // Avoid using this prop. It's a workaround for QRP criteria comments, which are edited as
        // plain text, but displayed as HTML. Ideally, the edit and display modes should match,
        // but given the lack of product expertise on QRP, we don't want to change its UI.
        textToHTML: PropTypes.func,
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    static defaultProps = {
        // If there's no rich text theme, we render a plain text editor (i.e. a <textarea />).
        richTextTheme: null,
        textToHTML: null,
    };

    constructor(props) {
        super(props);
        this.editCommentTipId = getUniqueId('edit-comment-tip');
    }

    componentDidMount() {
        // New comments should start in edit mode
        if (!this.comment.id) {
            this.toggleEditMode({autoFocus: false});
        }
    }

    componentWillUnmount() {
        this.wysiwygRef = null;
    }

    @observable isEditMode = false;
    @observable isTextAreaFocused = false;
    @observable isWysiwygActive = false;

    get placeholderText() {
        if (!this.props.placeholder) {
            return getPlaceHolderText({gettext: this.props.gettext});
        }

        return this.props.placeholder;
    }

    @action
    toggleEditMode(options = {}) {
        options = {autoFocus: true, ...options};
        this.isEditMode = !this.isEditMode;
        if (this.isEditMode && options.autoFocus) {
            if (this.props.richTextTheme && !this.isWysiwygActive) {
                this.toggleWysiwyg();
            } else if (!this.props.richTextTheme) {
                setTimeout(() => {
                    if (this.textAreaRef) {
                        this.textAreaRef.focus();
                        const inputLength = this.textAreaRef.value.length;
                        if (this.textAreaRef.setSelectionRange && inputLength > 0) {
                            // Move the cursor to the end of the input (for Safari).
                            this.textAreaRef.setSelectionRange(inputLength, inputLength);
                        }
                    }
                }, 0);
            }
        }
    }

    @autobind
    @action
    setTextAreaFocused() {
        this.isTextAreaFocused = true;
    }

    @autobind
    @action
    setTextAreaNotFocused() {
        this.isTextAreaFocused = false;
    }

    @autobind
    onKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.target.blur();
            if (this.comment.id) {
                this.toggleEditMode();
            }
        }
    }

    @autobind
    onKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.target.blur();
            this.saveComment();
        }
    }

    @autobind
    onClickEdit() {
        this.toggleEditMode();
    }

    @autobind
    onWysiwygSubmit() {
        this.toggleWysiwyg();
        this.saveComment();
    }

    @autobind
    @action
    onWysiwygCancel() {
        this.toggleWysiwyg();
        // New comments should revert to edit mode. Existing comments should revert to display mode.
        this.isEditMode = !this.comment.id;
    }

    @autobind
    saveComment() {
        this.comment
            .save()
            .then(() => {
                if (this.comment.id) {
                    this.toggleEditMode();
                } else {
                    this.comment.setContent('');
                }
            })
            .catch(noop); // happens if submitting already
    }

    @autobind
    deleteComment(onClose) {
        onClose();
        this.comment.delete().catch(noop); // happens if deleting already
    }

    @autobind
    onInputChange(event) {
        this.comment.setContent(event.target.value);
    }

    @autobind
    onWysiwygInputChange(value) {
        this.comment.setContent(value);
    }

    @autobind
    @action
    toggleWysiwyg() {
        this.isWysiwygActive = !this.isWysiwygActive;
        if (this.isWysiwygActive) {
            setTimeout(() => {
                this.isWysiwygActive && this.wysiwygRef && this.wysiwygRef.focus();
            }, 0);
        }
    }

    get comment() {
        return this.props.comment;
    }

    @autobind
    setTextAreaRef(ref) {
        // We want the underlying DOM node, not the <TextArea /> instance.
        // eslint-disable-next-line react/no-find-dom-node
        this.textAreaRef = ref ? ReactDOM.findDOMNode(ref) : null;
    }

    @autobind
    setWysiwygRef(ref) {
        this.wysiwygRef = ref;
    }

    renderDisplayMode() {
        const {gettext} = this.props;
        const isMyComment = udMe.id === this.comment.user.id;
        const showReportAbuse = udConfig.features.report_abuse && !isMyComment;

        return (
            <div styleName="flex comment-right" data-purpose="content-container">
                <div styleName="flex-row">
                    <div styleName="flex-row flex comment-top-info">
                        <span styleName="commenter-name-row">
                            <a href={this.comment.user.url} data-purpose="commenter-name">
                                <span styleName="ellipsis">{this.comment.user.title}</span>
                            </a>
                        </span>
                        {this.comment.created && <span styleName="bullet">&nbsp;{'·'}&nbsp;</span>}
                        {this.comment.created && (
                            <time data-purpose="comment-time">
                                <RelativeDuration datetime={this.comment.created} />
                            </time>
                        )}
                        {showReportAbuse && <span styleName="bullet">&nbsp;{'·'}&nbsp;</span>}
                        {showReportAbuse && (
                            <ReportAbuseModalTrigger
                                objectId={this.comment.id}
                                objectType="comment"
                                trigger={
                                    <ReportAbuseTooltip
                                        udStyle="link"
                                        className="ud-link-neutral"
                                    />
                                }
                            />
                        )}
                    </div>
                    {isMyComment && (
                        <div styleName="flex-row comment-top-btns">
                            <IconButton
                                className="ud-link-neutral"
                                udStyle="ghost"
                                size="small"
                                data-purpose="edit-button"
                                disabled={this.comment.isDeleting}
                                onClick={this.onClickEdit}
                            >
                                <EditIcon label={gettext('Edit comment')} />
                            </IconButton>
                            <ModalTrigger
                                trigger={
                                    <IconButton
                                        className="ud-link-neutral"
                                        udStyle="ghost"
                                        size="small"
                                        data-purpose="delete-button"
                                        disabled={this.comment.isDeleting}
                                    >
                                        <DeleteIcon label={gettext('Delete comment')} />
                                    </IconButton>
                                }
                                renderModal={({isOpen, onClose}) => (
                                    <ConfirmModal
                                        className="udlite-in-udheavy"
                                        isOpen={isOpen}
                                        onCancel={onClose}
                                        onConfirm={() => this.deleteComment(onClose)}
                                    >
                                        {gettext('Are you sure you want to delete?')}
                                    </ConfirmModal>
                                )}
                            />
                        </div>
                    )}
                </div>
                {this.comment.content && !!(this.props.richTextTheme || this.props.textToHTML) && (
                    <RichTextViewer
                        data-purpose="content"
                        unsafeHTML={
                            this.props.textToHTML
                                ? this.props.textToHTML(this.comment.content)
                                : this.comment.content
                        }
                    />
                )}
                {this.comment.content && !(this.props.richTextTheme || this.props.textToHTML) && (
                    <div data-purpose="content">{this.comment.content}</div>
                )}
            </div>
        );
    }

    renderBasicEditor() {
        const {gettext} = this.props;
        return (
            <>
                <FormGroup
                    label={gettext('Enter your comment:')}
                    labelProps={{className: 'ud-sr-only'}}
                >
                    <TextArea
                        ref={this.setTextAreaRef}
                        value={this.comment.content}
                        disabled={this.comment.isSubmitting}
                        rows="1"
                        onFocus={this.setTextAreaFocused}
                        onBlur={this.setTextAreaNotFocused}
                        onChange={this.onInputChange}
                        onKeyDown={this.onKeyDown}
                        onKeyPress={this.onKeyPress}
                        placeholder={this.placeholderText}
                        data-purpose="edit-textarea"
                        aria-describedby={this.editCommentTipId}
                    />
                </FormGroup>
                {this.isTextAreaFocused && (
                    <div
                        id={this.editCommentTipId}
                        className="ud-text-xs"
                        styleName="edit-comment-tip"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'comments:edit-comment-tip',
                            html: gettext(
                                'Press <b>Enter</b> to post, <b>Esc</b> to cancel, <b>Shift + Enter</b> to go to a new line',
                            ),
                            dataPurpose: 'edit-comment-tip',
                        })}
                    />
                )}
            </>
        );
    }

    renderWysiwygEditor() {
        const {gettext} = this.props;
        const textarea = (
            <FormGroup label={this.placeholderText} labelProps={{className: 'ud-sr-only'}}>
                <TextArea
                    rows="1"
                    onFocus={this.toggleWysiwyg}
                    placeholder={this.props.placeholder}
                    data-purpose="edit-textarea"
                />
            </FormGroup>
        );
        const wysiwygEditor = (
            <>
                <RichTextEditor
                    theme={this.props.richTextTheme}
                    placeholder={this.placeholderText}
                    value={this.comment.content}
                    contentEditable={!this.comment.isSubmitting}
                    onInit={this.setWysiwygRef}
                    onValueChange={this.onWysiwygInputChange}
                />
                <div styleName="flex-row footer-btns">
                    <Button
                        size="small"
                        data-purpose="submit-wysiwyg"
                        disabled={this.comment.isSubmitting}
                        onClick={this.onWysiwygSubmit}
                    >
                        {gettext('Submit')}
                    </Button>
                    <Button
                        className="ud-link-neutral"
                        udStyle="ghost"
                        size="small"
                        data-purpose="cancel-wysiwyg"
                        disabled={this.comment.isSubmitting}
                        onClick={this.onWysiwygCancel}
                    >
                        {gettext('Cancel')}
                    </Button>
                </div>
            </>
        );

        return this.isWysiwygActive ? wysiwygEditor : textarea;
    }

    renderEditMode() {
        return (
            <div styleName="flex comment-right" data-purpose="edit-container">
                {this.props.richTextTheme ? this.renderWysiwygEditor() : this.renderBasicEditor()}
            </div>
        );
    }

    render() {
        const {gettext} = this.props;
        return (
            <div styleName="flex-row comment" data-purpose="comment">
                <Avatar
                    user={{...this.comment.user, display_name: gettext('Commenter')}}
                    alt="DISPLAY_NAME"
                    size="medium"
                    srcKey="image_50x50"
                    data-purpose="avatar"
                    title={gettext('Commenter')}
                />
                {this.isEditMode ? this.renderEditMode() : this.renderDisplayMode()}
            </div>
        );
    }
}

export default withI18n(Comment);
