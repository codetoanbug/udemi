import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import MainContent from 'course-manage-v2/main-content.react-component';
import Prompt from 'course-manage-v2/prompt.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import MessagesStore from './messages.mobx-store';
import './messages.less';

const HeaderActions = ({isWarning, isSaveEnabled, onSaveForm}) => {
    return (
        <Button udStyle="white-solid" size="small" disabled={!isSaveEnabled} onClick={onSaveForm}>
            {isWarning ? gettext('Proceed') : gettext('Save')}
        </Button>
    );
};

HeaderActions.propTypes = {
    isWarning: PropTypes.bool.isRequired,
    isSaveEnabled: PropTypes.bool.isRequired,
    onSaveForm: PropTypes.func.isRequired,
};

const MessageInput = observer(({message, onChangeText}) => {
    const messageTitles = {
        welcome: gettext('Welcome Message'),
        complete: gettext('Congratulations Message'),
    };

    let note = null;
    let validationState = 'neutral';
    if (message.date) {
        note = interpolate(gettext('Last edited on %(date)s'), {date: message.date}, true);
    }

    const errorMessage = Array.isArray(message.errors) ? message.errors.join(' ') : message.errors;
    if (errorMessage) {
        note = (
            <div
                className="ud-text-with-links"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'course-message:error',
                    domPurifyConfig: {ADD_ATTR: ['target']},
                    html: errorMessage,
                })}
            />
        );
        validationState = 'error';
    }

    return (
        <FormGroup
            label={messageTitles[message.type]}
            note={note}
            validationState={validationState}
        >
            <RichTextEditor
                theme={RichTextEditor.THEMES.COURSE_MESSAGE}
                autoFocus={true}
                value={message.text}
                onValueChange={onChangeText}
                withCounter={true}
                maxLength={1000}
            />
        </FormGroup>
    );
});

MessageInput.propTypes = {
    message: PropTypes.object.isRequired,
    onChangeText: PropTypes.func.isRequired,
};

@observer
export default class Messages extends Component {
    static propTypes = {
        pageStore: PropTypes.object.isRequired,
        messagesStore: PropTypes.object,
    };

    static defaultProps = {
        messagesStore: null,
    };

    constructor(props) {
        super(props);
        this.messagesStore = props.messagesStore || new MessagesStore(props.pageStore.course.id);
        props.pageStore.setHeaderActions(this.renderHeaderButtons);
    }

    componentDidMount() {
        this.messagesStore.getMessages();
    }

    componentWillUnmount() {
        this.props.pageStore.cleanHeaderActions(this.renderHeaderButtons);
    }

    @autobind
    onChangeWelcomeMessage(value) {
        return this.messagesStore.updateMessageContent(
            this.messagesStore.welcomeMessage.type,
            value,
        );
    }

    @autobind
    onChangeCompletionMessage(value) {
        return this.messagesStore.updateMessageContent(
            this.messagesStore.completionMessage.type,
            value,
        );
    }

    @autobind
    saveForm() {
        return this.messagesStore.saveMessages().then(() => {
            this.props.pageStore.updateMenuCheckbox();
        });
    }

    @autobind
    renderHeaderButtons() {
        return (
            <HeaderActions
                isWarning={this.messagesStore.isWarning}
                isSaveEnabled={this.messagesStore.saveEnabled}
                onSaveForm={this.saveForm}
            />
        );
    }

    renderMessages() {
        const {completionMessage, welcomeMessage, saveEnabled} = this.messagesStore;
        return (
            <>
                <p data-purpose="section-description">
                    {gettext(
                        'Write messages to your students (optional) that will be sent ' +
                            'automatically when they join or complete your course to encourage students ' +
                            'to engage with course content. If you do not wish to send a welcome or ' +
                            'congratulations message, leave the text box blank.',
                    )}
                </p>
                <form styleName="form">
                    <MessageInput
                        message={welcomeMessage}
                        onChangeText={this.onChangeWelcomeMessage}
                    />
                    <MessageInput
                        message={completionMessage}
                        onChangeText={this.onChangeCompletionMessage}
                    />
                </form>
                <Prompt when={saveEnabled} />
            </>
        );
    }

    render() {
        return (
            <div>
                <SubHeader title={gettext('Course messages')} />
                <MainContent>{this.renderMessages()}</MainContent>
            </div>
        );
    }
}
