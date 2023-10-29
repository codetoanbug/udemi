import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import autosize from 'autosize';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {isCueTextEmpty} from 'caption/vtt-parser';

import './cue-content-editor.less';

@observer
export default class CueContentEditor extends React.Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onFocus: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.setValue(this.props.value);
        if (this.props.active) {
            this.initialiseEditor();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.valueCopy) {
            this.setValue(nextProps.value);
        }
        if (this.props.active && !nextProps.active) {
            autosize.destroy(this.textarea);
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.active && this.props.active) {
            this.initialiseEditor();
        }
        if (this.props.active) {
            autosize.update(this.textarea);
        }
    }

    @observable valueCopy = this.props.value;
    error = false;
    previousKeyPress = null;

    initialiseEditor() {
        this.originalValue = this.valueCopy;
        autosize(this.textarea);
        this.textarea.focus();
    }

    @action
    setValue(newValue) {
        this.valueCopy = newValue;
    }

    @autobind
    @action
    handleChange(event) {
        const intendedValue = event.target.value;
        this.setValue(intendedValue.replace(/(\r\n|\r|\n){2,}/g, '\n').replace(/^\s+/gm, ''));
        // We clean input onKeyDown and onChange. If we only cleaned onChange, we would get a
        // flickering effect in the textarea. If we only cleaned onKeyDown, we wouldn't be
        // protecting against copy-and-paste
        this.validate();
        if (!this.error) {
            this.props.onChange(this.valueCopy);
        }
    }

    @autobind
    handleBlur() {
        if (this.error) {
            this.setValue(this.originalValue);
            this.props.onChange(this.valueCopy);
            this.error = null;
        }
    }

    @autobind
    avoidDoubleEnter(event) {
        const doubleEnter = this.previousKeyPress === 'Enter' && event.key === 'Enter';
        const startWithBlankCharacters =
            this.textarea.selectionStart === 0 && ['Enter', ' '].includes(event.key);
        if (doubleEnter || startWithBlankCharacters) {
            event.preventDefault();
        }
        this.previousKeyPress = event.key;
    }

    showError() {
        return (
            <AlertBanner
                showCta={false}
                udStyle="error"
                styleName="cue-content-alert"
                showIcon={false}
                title={gettext("Caption entry text can't be empty.")}
            />
        );
    }

    validate() {
        this.error = isCueTextEmpty(this.valueCopy);
    }

    get cueEditor() {
        return (
            <textarea
                ref={(textarea) => {
                    this.textarea = textarea;
                }}
                rows="1"
                className="ud-text-md"
                styleName="cue-content-textarea"
                value={this.valueCopy}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onKeyDown={this.avoidDoubleEnter}
            />
        );
    }

    get cueDisplay() {
        // We provide click behaviour on focus, rather than on key press, so no need for extra handlers.
        /* eslint-disable jsx-a11y/click-events-have-key-events */
        return (
            <div
                styleName="cue-content-display"
                data-purpose="cue-display"
                role="textbox"
                onClick={this.props.onFocus}
                onFocus={this.props.onFocus}
                tabIndex="0"
            >
                {this.valueCopy}
            </div>
        );
        /* eslint-enable jsx-a11y/click-events-have-key-events */
    }

    render() {
        return (
            <div styleName="cue-content-textarea-wrapper">
                {this.props.active ? this.cueEditor : this.cueDisplay}
                {this.error && this.showError()}
            </div>
        );
    }
}
