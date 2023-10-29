import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import RichTextEditorModel from './rich-text-editor.mobx-model';

@observer
export default class BaseEditor extends Component {
    // These are used to set attributes on the <div contentEditable /> rendered by the editor lib.
    // We need to refresh these attributes whenever they change on this.props.
    static contentEditablePropNames = ['contentEditable', 'minHeight', 'placeholder'];

    static propTypes = {
        model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
        contentEditable: PropTypes.bool.isRequired,
        minHeight: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        getEditorProps: PropTypes.func,
        onWillMount: PropTypes.func,
        onDidMount: PropTypes.func,
        editorMode: PropTypes.oneOf(['WYSIWYG', 'HTML']),
        dataPurpose: PropTypes.string,
    };

    static defaultProps = {
        getEditorProps: noop,
        onWillMount: noop,
        onDidMount: noop,
        editorMode: 'WYSIWYG',
        dataPurpose: '',
    };

    componentDidMount() {
        const _this = this;
        const {model, getEditorProps, onWillMount, onDidMount} = this.props;

        onWillMount();
        const editorProps = getEditorProps() || {};
        this.view = new model.editorLib.EditorView(this.ref, {
            attributes() {
                return {
                    placeholder: _this.props.placeholder,
                    class: 'rt-scaffolding',
                    style: `min-height:${_this.props.minHeight};`,
                    role: 'textbox',
                    'aria-multiline': true,
                    'aria-label': _this.props.placeholder,
                };
            },
            editable() {
                return _this.props.contentEditable;
            },
            ...editorProps,
        });
        onDidMount(this.view);
    }

    componentDidUpdate(prevProps) {
        const shouldRefresh = BaseEditor.contentEditablePropNames.some((propName) => {
            return prevProps[propName] !== this.props[propName];
        });
        if (shouldRefresh) {
            // Apply a noop state change to refresh the contentEditable props.
            this.view.updateState(this.view.state);
        }
    }

    componentWillUnmount() {
        if (this.view) {
            this.view.destroy();
        }
    }

    @autobind
    setRef(ref) {
        this.ref = ref;
    }

    render() {
        const {model, dataPurpose, editorMode} = this.props;
        const isShown =
            (editorMode === 'WYSIWYG' && !model.htmlMode.show) ||
            (editorMode === 'HTML' && model.htmlMode.show);
        return (
            <div
                className={classNames('rt-editor ud-text-md', {
                    'rt-hidden': !isShown,
                    'rt-editor--empty': model.showPlaceholder,
                    'rt-editor--html-mode': editorMode === 'HTML',
                    'rt-editor--resizing-image': model.isResizingImage,
                    'rt-editor--wysiwyg-mode': editorMode === 'WYSIWYG',
                })}
                data-purpose={dataPurpose}
                ref={this.setRef}
            />
        );
    }
}
