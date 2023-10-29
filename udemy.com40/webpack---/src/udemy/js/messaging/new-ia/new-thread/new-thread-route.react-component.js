import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {action, observable, runInAction} from 'mobx';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Prompt, withRouter} from 'react-router-dom';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';

import UserAutosuggest from '../../new-thread/user-autosuggest.react-component';
import './new-thread-route.less';

@inject('store')
@observer
class NewThreadRoute extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        // Accept an initial user if location is redirected from /user/:id/ path.
        if (this.props.location.state && this.props.location.state.user) {
            this.selectedUserId = this.props.location.state.user.id;
        }
    }

    @observable content = '';
    @observable disabled = false;
    @observable selectedUserId;

    @autobind
    @action
    updateMessage(value) {
        this.content = value;
    }

    @autobind
    @action
    async sendMessageToUser(event) {
        event.preventDefault();
        this.disabled = true;
        const {history, store} = this.props;
        const response = await store.sendMessageToUser(this.selectedUserId, this.content);
        runInAction(() => {
            this.content = '';
            this.disabled = false;
        });
        history.push(`${store.baseUrl}/${response.data.message_thread_id}/detail/`);
    }

    @autobind
    @action
    handleAutosuggest(selectedUser) {
        this.selectedUserId = selectedUser ? selectedUser.id : null;
    }

    @autobind
    submitOnKeyShortcuts(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            this.sendMessageToUser(event);

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

    render() {
        const isThreadCreateDisabled = this.props.store.isThreadCreateDisabled,
            isSendButtonDisabled =
                !this.content || !this.selectedUserId || isThreadCreateDisabled || this.disabled,
            currentUser = this.props.location.state && this.props.location.state.user;

        const theme = isThreadCreateDisabled
            ? RichTextEditor.THEMES.SIMPLE
            : RichTextEditor.THEMES.MESSAGE;

        return (
            <div styleName="new-thread">
                <div styleName="recipient">
                    <span>{gettext('To:')}</span>
                    <div styleName="recipient-input">
                        <FormGroup label={gettext('User')} labelProps={{className: 'ud-sr-only'}}>
                            <UserAutosuggest
                                disabled={isThreadCreateDisabled}
                                initialUser={currentUser}
                                placeholder={gettext("Type a user's name")}
                                onChange={this.handleAutosuggest}
                            />
                        </FormGroup>
                    </div>
                </div>

                <form onSubmit={this.sendMessageToUser}>
                    <FormGroup label={gettext('Message')} labelProps={{className: 'ud-sr-only'}}>
                        <RichTextEditor
                            theme={theme}
                            minHeight={`${pxToRem(300)}rem`}
                            placeholder={gettext('Write a message...')}
                            value={this.content}
                            onKeyDown={this.submitOnKeyShortcuts}
                            contentEditable={!isThreadCreateDisabled}
                            onValueChange={this.updateMessage}
                        />
                    </FormGroup>
                    <FooterButtons>
                        <Button type="submit" size="medium" disabled={isSendButtonDisabled}>
                            {gettext('Send')}
                        </Button>
                    </FooterButtons>

                    <Prompt
                        when={!!this.content}
                        message={gettext(
                            'Your message has not been sent. Are you sure you want to discard it?',
                        )}
                    />
                </form>
            </div>
        );
    }
}

export default withRouter(NewThreadRoute);
