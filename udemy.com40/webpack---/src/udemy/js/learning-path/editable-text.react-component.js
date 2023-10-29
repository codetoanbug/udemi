import {onEnter} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {EDITABLE_TYPES} from './constants';

import './editable-text.less';

export default class EditableText extends React.Component {
    static propTypes = {
        htmlAttributes: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        elementType: PropTypes.string,
        placeholder: PropTypes.string,
        value: PropTypes.string,
        inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        // in some cases we want a placeholder to be submitted to API as an actual value
        shouldSavePlaceholderAsValue: PropTypes.bool,
        maxLength: PropTypes.number,
        type: PropTypes.string,
    };

    static defaultProps = {
        htmlAttributes: {},
        elementType: 'p',
        placeholder: '',
        value: '',
        inputRef: null,
        shouldSavePlaceholderAsValue: false,
        maxLength: null,
        type: EDITABLE_TYPES.TEXT,
    };

    shouldComponentUpdate(prevProps) {
        // Prevent update because the value is editable
        return prevProps.id !== this.props.id;
    }

    get displayValue() {
        const {value, placeholder} = this.props;
        if (value === '' && this.props.shouldSavePlaceholderAsValue) {
            // in case of empty value display placeholder as a value
            return placeholder;
        }
        return value;
    }

    onEnter(event) {
        event.preventDefault();
    }

    @autobind
    onFocus() {
        // Autoselect the whole field if the current value is the placeholder that we had saved
        if (
            this.displayValue === this.props.placeholder &&
            this.props.shouldSavePlaceholderAsValue
        ) {
            // The setTimeout is to make sure we have switched to editable by the time selectAll fires
            // Consider also https://stackoverflow.com/questions/6139107/programmatically-select-text-in-a-contenteditable-html-element/6150060
            setTimeout(() => {
                document.execCommand('selectAll', false, null);
            });
        }
    }

    @autobind
    onBlur(event) {
        const value = event.target.textContent;
        if (value === '' && this.props.shouldSavePlaceholderAsValue) {
            // return placeholder as a value if the value is empty and focus is removed
            event.target.textContent = this.props.placeholder;
        }
        this.props.onChange(event.target.textContent);
    }

    @autobind
    onKeyDown(event) {
        onEnter(this.onEnter)(event);
        // Always allow to delete stuff
        if (['Backspace', 'Del', 'Delete'].includes(event.key)) {
            return true;
        }
        const value = event.target.textContent;
        if (this.props.maxLength && value.length >= this.props.maxLength) {
            // TODO - improve validation logic after beta, this is a temporary solution
            event.preventDefault();
        }

        if (this.props.type === EDITABLE_TYPES.NUMBER) {
            // Only allow digit characters in a numeric field
            if (event.key.length === 1 && isNaN(event.key)) {
                event.preventDefault();
            }
            // Don't allow whitespace in a numeric field
            if (event.key.trim().length === 0) {
                event.preventDefault();
            }
        }
    }

    @autobind
    onInput(event) {
        let value = event.target.textContent;
        if (value === '' && this.props.shouldSavePlaceholderAsValue) {
            // Never save empty string if placeholder should be saved
            value = this.props.placeholder;
        }
        this.props.onChange(value);
    }

    @autobind
    onPaste(event) {
        event.preventDefault();
        // take text with no formatting
        const value = event.clipboardData.getData('text/plain');
        if (
            !this.props.maxLength ||
            event.target.textContent.length + value.length < this.props.maxLength
        ) {
            // TODO Consider using the following (needs to be tested):
            // window.getSelection().getRangeAt(0).insertNode(document.createTextNode(value));
            // reason: https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
            document.execCommand('insertText', false, value);
        }
    }

    render() {
        const {
            elementType: ElementType,
            shouldSavePlaceholderAsValue,
            htmlAttributes,
            ...commonProps
        } = this.props;
        const htmlAttr = {role: 'textbox', ...htmlAttributes};
        const styleName = classNames({
            'inline-editable': true,
            'inline-editable--no-placeholder': shouldSavePlaceholderAsValue,
        });
        return (
            <ElementType
                {...htmlAttr}
                styleName={styleName}
                className={commonProps.className || ''}
                contentEditable={true}
                suppressContentEditableWarning={true}
                data-placeholder={this.props.placeholder}
                ref={this.props.inputRef}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onInput={this.onInput}
                onPaste={this.onPaste}
            >
                {this.displayValue}
            </ElementType>
        );
    }
}
