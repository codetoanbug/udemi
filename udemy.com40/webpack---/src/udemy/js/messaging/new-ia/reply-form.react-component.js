import UpgradeIcon from '@udemy/icons/dist/upgrade.ud-icon';
import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Prompt} from 'react-router-dom';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';

import './reply-form.less';
import {AIResponseModal} from './ai-response-modal.react-component';

const BLACKLIST = ['(linksynergy(?:.[w-]+)*.com)'];

@inject('store')
@observer
export default class ReplyForm extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired,
        placeholder: PropTypes.string,
        onSend: PropTypes.func, // returns a Promise.
        onCancel: PropTypes.func,
        onFocus: PropTypes.func,
        CTAText: PropTypes.string,
        cancelText: PropTypes.string,
        initialContent: PropTypes.string,
        richTextTheme: PropTypes.oneOf(Object.values(RichTextEditor.THEMES)),
        isGenerateWithAIButtonEnabled: PropTypes.bool,
    };

    static defaultProps = {
        placeholder: gettext('Type your message...'),
        onSend: () => Promise.resolve(true),
        onFocus: null,
        onCancel: null,
        CTAText: gettext('Send'),
        cancelText: null,
        initialContent: '',
        richTextTheme: RichTextEditor.THEMES.MESSAGE,
        isGenerateWithAIButtonEnabled: false,
    };

    constructor(props) {
        super(props);
        this.updateMessage(props.initialContent);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.thread !== this.props.thread) {
            this.updateMessage('');
        }
        if (nextProps.initialContent != this.props.initialContent) {
            this.updateMessage(nextProps.initialContent);
        }
    }

    @observable content = '';
    @observable focused = false;
    @observable isAIResponseModalVisible = false;

    @autobind
    @action
    updateMessage(value) {
        this.content = value;
    }

    @computed
    get isInvalidText() {
        const errorMessage = this.props.store.errorMessage;
        return (
            errorMessage &&
            errorMessage.error_type === 'affiliate_url_forbidden' &&
            new RegExp(BLACKLIST.join('|')).test(this.content)
        );
    }

    @autobind
    @action
    async handleSubmit(event) {
        event.preventDefault();
        const content = this.content;
        this.updateMessage('');
        this.handleBlur();
        try {
            await this.props.onSend(this.props.thread, content);
        } catch (error) {
            this.updateMessage(content);
            throw error;
        }
    }

    @autobind
    @action
    handleFocus() {
        this.focused = true;
        window.clearTimeout(this.blurTimeout);
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    @autobind
    handleBlur() {
        this.blurTimeout = window.setTimeout(
            action(() => {
                this.focused = false;
            }),
            100,
        );
    }

    @autobind
    @action
    handleCancel() {
        this.focused = false;
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    @autobind
    renderModal() {
        const response =
            "Remember that effective time management is a personal journey, and what works best for you may vary. It's about finding the balance that allows you to be productive and maintain a healthy work-life balance. Keep practicing and refining your time management skills, and you'll see improvements in your efficiency and overall well-being.";
        return (
            <AIResponseModal
                response={response}
                onPost={this.handleCancel}
                onHide={this.hideModal}
            />
        );
    }

    @autobind
    @action
    showModal() {
        this.isAIResponseModalVisible = true;
    }

    @autobind
    @action
    hideModal() {
        this.isAIResponseModalVisible = false;
    }

    @autobind
    submitOnKeyShortcuts(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            this.handleSubmit(event);

            // This cancels default editor hotkeys, e.g. we don't want Ctrl-Enter to create
            // a <br /> as a side effect.
            //
            // http://prosemirror.net/docs/ref/#view.EditorProps
            // Handler functions are called one at a time, starting with the base props and
            // then searching through the plugins (in order of appearance) until one of them
            // returns true.
            return true;
        }
    }

    @autobind
    setEditor({focus}) {
        this.focusEditor = focus;
    }

    render() {
        const {
            cancelText,
            placeholder,
            CTAText,
            richTextTheme,
            isGenerateWithAIButtonEnabled,
        } = this.props;
        const showEditButtons = !!this.content || this.focused;
        return !this.isAIResponseModalVisible ? (
            <form
                onSubmit={this.handleSubmit}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                styleName={classNames('reply-form', {
                    'reply-form-open': this.focused,
                    'reply-form-with-buttons': showEditButtons,
                    'reply-form-with-ai-button': isGenerateWithAIButtonEnabled,
                })}
                data-purpose="form"
            >
                <FormGroup
                    className="fs-exclude"
                    label={gettext('Message')}
                    labelProps={{className: 'ud-sr-only'}}
                >
                    <RichTextEditor
                        onInit={this.setEditor}
                        theme={richTextTheme}
                        menuBarPosition={isGenerateWithAIButtonEnabled ? 'top' : 'bottom'}
                        placeholder={placeholder}
                        value={this.content}
                        onValueChange={this.updateMessage}
                        onKeyDown={this.submitOnKeyShortcuts}
                    />
                </FormGroup>

                <div
                    styleName={
                        isGenerateWithAIButtonEnabled ? 'button-group-with-ai' : 'button-group'
                    }
                >
                    {cancelText && (
                        <Button
                            className="ud-link-neutral"
                            size="small"
                            udStyle="ghost"
                            onClick={this.handleCancel}
                        >
                            {cancelText}
                        </Button>
                    )}
                    {isGenerateWithAIButtonEnabled && (
                        <Button
                            size="small"
                            type="button"
                            udStyle="secondary"
                            data-purpose="generate-answer-with-ai-btn"
                            onClick={this.showModal}
                        >
                            <UpgradeIcon />
                            {gettext('Generate answer with AI')}
                        </Button>
                    )}
                    <Button
                        size="small"
                        type="submit"
                        data-purpose="submit-reply-form-btn"
                        disabled={!this.content || this.isInvalidText}
                    >
                        {CTAText}
                    </Button>
                </div>
                <Prompt
                    when={!!this.content}
                    message={gettext(
                        'Your message has not been sent. Are you sure you want to discard it?',
                    )}
                />
            </form>
        ) : (
            this.renderModal()
        );
    }
}
