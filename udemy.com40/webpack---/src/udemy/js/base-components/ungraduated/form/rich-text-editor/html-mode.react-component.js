import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import escapeHtml from 'utils/escape/escape-html';

import BaseEditor from './base-editor.react-component';
import {getDetachedDoc} from './helpers';
import RichTextEditorModel from './rich-text-editor.mobx-model';

// If we pass the `show` prop from <RichTextEditor />, the entire editor re-renders whenever
// it changes. Hence, we pass it via this wrapper component instead.
const HTMLMode = (props) => {
    return <HTMLModeEditor {...props} show={props.model.htmlMode.show} />;
};

HTMLMode.propTypes = {
    model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
    contentEditable: PropTypes.bool.isRequired,
    minHeight: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
};

export default observer(HTMLMode);

class HTMLModeEditor extends Component {
    static propTypes = {
        ...HTMLMode.propTypes,
        show: PropTypes.bool.isRequired,
    };

    componentDidUpdate(prevProps) {
        // We use componentDidUpdate instead of componentWillReceiveProps so that
        // this.view.focus() works (for both this view and the parent view
        // which gets focused on this.props.onHide).
        const serializer = this.props.model.htmlMode.serializer;
        if (this.props.show && !prevProps.show) {
            const html = this.formatValue(this.props.model.editorValue);
            const doc = serializer.toInternalValue(html);
            this.props.model.editorLib.helpers.overrideDoc(this.view, doc);
            this.view.focus();
        } else if (!this.props.show && prevProps.show) {
            this.props.onHide();
        }
    }

    @autobind
    getEditorProps() {
        const htmlMode = this.props.model.htmlMode;
        const fromDOMSerializer = htmlMode.serializer.fromDOMSerializer;
        return {
            state: htmlMode.editorState,
            dispatchTransaction: this.dispatchTransaction,
            clipboardTextParser: fromDOMSerializer.parseClipboardText,
            domParser: fromDOMSerializer,
            transformPastedHTML: fromDOMSerializer.transformPastedHTML,
        };
    }

    @autobind
    onEditorWillMount() {
        this.props.model.initializeHTMLModeEditorState();
    }

    @autobind
    onEditorDidMount(view) {
        this.view = view;
    }

    @autobind
    dispatchTransaction(transaction) {
        if (!this.props.contentEditable) {
            return;
        }
        const newState = this.view.state.apply(transaction);
        this.view.updateState(newState);
        const prevEditorValue = this.props.model.editorValue;
        this.props.model.syncWithHTMLModeEditor(newState, transaction);
        if (prevEditorValue !== this.props.model.editorValue) {
            this.props.onValueChange(this.props.model.editorValue);
        }
    }

    formatValue(editorValue) {
        const div = getDetachedDoc().createElement('div');
        div.innerHTML = editorValue;
        const lines = [];
        for (let i = 0; i < div.childNodes.length; i++) {
            div.childNodes[i].outerHTML.split('\n').forEach((line) => {
                lines.push(`<p>${escapeHtml(line)}</p>`);
            });
        }
        return lines.join('');
    }

    render() {
        const {model, contentEditable, minHeight, placeholder} = this.props;
        return (
            <BaseEditor
                model={model}
                contentEditable={contentEditable}
                minHeight={minHeight}
                placeholder={placeholder}
                getEditorProps={this.getEditorProps}
                onWillMount={this.onEditorWillMount}
                onDidMount={this.onEditorDidMount}
                editorMode="HTML"
                dataPurpose="html-mode"
            />
        );
    }
}
