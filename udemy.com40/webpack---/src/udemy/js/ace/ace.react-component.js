import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';
import {loadAce, loadAceMode, loadAceTheme} from 'utils/ud-ace';
import Raven from 'utils/ud-raven';

import extensionToAceMode from './ace-file-extensions';
import {
    ACE_THEME_DEFAULT,
    ACE_THEME_MONOKAI,
    ACE_THEME_TWILIGHT,
    ACE_THEME_TOMORROW_NIGHT_BRIGHT,
    EMMET_ENABLED_MODES,
} from './constants';

let ace = null;

export default class Ace extends Component {
    static themes = {
        [ACE_THEME_DEFAULT]: 'ace/theme/clouds',
        [ACE_THEME_TWILIGHT]: 'ace/theme/twilight',
        [ACE_THEME_MONOKAI]: 'ace/theme/monokai',
        [ACE_THEME_TOMORROW_NIGHT_BRIGHT]: 'ace/theme/tomorrow_night_bright',
    };

    static propTypes = {
        file: PropTypes.object.isRequired,
        updateFile: PropTypes.func.isRequired,
        readOnly: PropTypes.bool,
        useSoftTabs: PropTypes.bool,
        theme: PropTypes.string,
        updateCursorPosition: PropTypes.func,
        registerResizeHandler: PropTypes.func,
        scrollMarginTop: PropTypes.number,
        scrollMarginBottom: PropTypes.number,
        fontSize: PropTypes.number,
        onError: PropTypes.func,
    };

    static defaultProps = {
        theme: ACE_THEME_DEFAULT,
        readOnly: false,
        useSoftTabs: true,
        updateCursorPosition: noop,
        registerResizeHandler: noop,
        scrollMarginTop: 20,
        scrollMarginBottom: 20,
        fontSize: 12,
        onError: noop,
    };

    constructor(props) {
        super(props);
        this.editorSessions = new Map();
    }

    componentDidMount() {
        try {
            this.createEditor().then(async (editor) => {
                try {
                    this.editor = editor;
                    await this.setEditorSession(
                        this.editor,
                        this.props.file,
                        this.props.readOnly,
                        this.props.useSoftTabs,
                    );
                    this.props.registerResizeHandler(() => {
                        if (this.editor && this.editor.isThemeLoaded && this.editor.isModeLoaded) {
                            this.editor.resize();
                        }
                    });
                    this.appendAutocompletePopupForFullscreen();
                } catch (e) {
                    this.props.onError();
                    Raven.captureException(`Letter repeating / Failed to set session ${e}`);
                }
            });
        } catch (e) {
            this.props.onError();
            Raven.captureException(`Letter repeating / Failed to create editor ${e}`);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.editor && prevProps.file !== this.props.file) {
            this.setEditorSession(
                this.editor,
                this.props.file,
                this.props.readOnly,
                this.props.useSoftTabs,
            );
        }
    }

    getFileExtension(file) {
        return (file.file_name || file.fileName || '').split('.').pop();
    }

    updateCursorPosition(editor) {
        const pos = editor.getCursorPosition();
        this.props.updateCursorPosition(pos.row + 1, pos.column + 1);
    }

    appendAutocompletePopupForFullscreen = () => {
        const popup = this.getAutocompletePopup(this.editor);
        if (popup === null) return;
        setTimeout(() => {
            const editorElement = document.getElementById('editor');
            editorElement?.appendChild(popup);
        }, 500);
    };

    getAutocompletePopup = (editor) => {
        if (!editor.completer) {
            return null;
        }
        if (!editor.completer.popup) {
            editor.completer.getPopup();
        }
        return editor.completer.popup.container;
    };

    createEditor() {
        return loadAce().then(async (_ace_) => {
            ace = _ace_;
            const editor = ace.edit(this.node);
            await loadAceTheme(this.props.theme).then(() => {
                editor.setTheme(Ace.themes[this.props.theme]);
                editor.isThemeLoaded = true;
            });
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
            });
            editor.setHighlightActiveLine(false);
            editor.setHighlightGutterLine(true);
            editor.setShowPrintMargin(false);
            editor.setDisplayIndentGuides(true);
            editor.setFontSize(`${pxToRem(this.props.fontSize)}rem`);
            editor.commands.removeCommand('gotoline');
            editor.commands.removeCommand('find');
            editor.renderer.setScrollMargin(
                this.props.scrollMarginTop,
                this.props.scrollMarginBottom,
                0,
                0,
            );
            editor.$blockScrolling = Infinity;
            editor.on('change', () => {
                this.props.updateFile(this.props.file, editor.getValue());
            });
            editor.execCommand('startAutocomplete');
            return editor;
        });
    }

    async setEditorSession(editor, file, readOnly, useSoftTabs) {
        if (readOnly) {
            editor.setOptions({
                readOnly: true,
                highlightActiveLine: false,
                highlightGutterLine: false,
            });
            editor.renderer.$cursorLayer.element.style.display = 'none';
        } else {
            editor.setOptions({
                readOnly: false,
                highlightActiveLine: true,
                highlightGutterLine: true,
            });
            editor.renderer.$cursorLayer.element.style.display = '';
        }

        let session = this.editorSessions.get(file);
        if (session) {
            editor.setSession(session);
            if (session.getValue() !== file.content) {
                session.setValue(file.content);
            }
            return;
        }
        const mode = file.type || extensionToAceMode(this.getFileExtension(file));
        editor.isModeLoaded = false;
        session = new ace.EditSession(file.content);
        await loadAceMode(mode).then(() => {
            try {
                session.setMode({path: `ace/mode/${mode}`, v: Date.now()});
                if (EMMET_ENABLED_MODES.includes(mode)) {
                    editor.setOption('enableEmmet', true);
                    // remove auto-complete behaviour on tab key inorder to enable emmet behaviour
                    delete editor.completer.keyboardHandler.commandKeyBinding.tab;
                }
                editor.isModeLoaded = true;
            } catch (e) {
                this.props.onError();
                // send error to sentry
                Raven.captureException(`Letter repeating / Failed to load mode ${mode} ${e}`);
            }
        });
        session.setUndoManager(new ace.UndoManager());
        session.setUseSoftTabs(useSoftTabs);
        session.setUseWrapMode(true);
        session
            .getSelection()
            .on('changeCursor', this.updateCursorPosition.bind(this, this.editor));
        editor.setSession(session);
        this.editorSessions.set(file, session);
        this.updateCursorPosition(editor);
    }

    @autobind
    setRefs(node) {
        this.node = node;
    }

    render() {
        return <div id="editor" ref={this.setRefs} />;
    }
}
