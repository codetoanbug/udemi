import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Prompt as PromptBase} from 'react-router-dom';

@observer
export default class Prompt extends Component {
    static propTypes = {
        when: PropTypes.bool.isRequired,
    };

    componentDidMount() {
        window.addEventListener('beforeunload', this.onloadHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onloadHandler);
    }

    message = gettext('Changes you made may not be saved.');

    @autobind
    onloadHandler(event) {
        const {when} = this.props;
        if (when) {
            // The onbeforeunload message cannot be customized, but expects a string
            // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
            event.returnValue = this.message;
            return this.message;
        }
    }

    render() {
        const {when} = this.props;
        return <PromptBase when={when} message={this.message} />;
    }
}
