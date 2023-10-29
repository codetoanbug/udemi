import {useI18n} from '@udemy/i18n';
import {observer} from 'mobx-react';
import React, {useEffect, useRef} from 'react';

import Ace from 'ace/ace.react-component';
import {ACE_THEME_TOMORROW_NIGHT_BRIGHT} from 'ace/constants';
import {showErrorToast} from 'instructor/toasts';

import styles from './code-editor.less';
import {EditorHeader} from './editor-header.react-component';
import {CodeEditorProps} from './types';

/**
 * This component should be wrapped with a flex container.
 */
const CodeEditorComponent: React.FC<CodeEditorProps> = (props) => {
    const {codeEditorStore, headerLeftButtons, headerRightButtons, headerEditable} = props;

    const editorFontSize = 16;
    const scrollMarginTop = 16;
    const scrollMarginBottom = 16;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const i18n = useI18n();
    useEffect(() => {
        document.body.classList.add(styles['code-editor-active']);
        document.addEventListener('resize', codeEditorStore.triggerResize);
        return () => {
            const editorElement = document.getElementById('editor');
            if (!editorElement) document.body.classList.remove(styles['code-editor-active']);
            document.removeEventListener('resize', codeEditorStore.triggerResize);
        };
    }, [codeEditorStore.triggerResize]);

    return (
        <div styleName="code-editor" ref={wrapperRef}>
            <EditorHeader
                codeEditorStore={codeEditorStore}
                leftButtons={headerLeftButtons}
                rightButtons={headerRightButtons}
                editable={headerEditable}
            />
            <div styleName="editor">
                {codeEditorStore.activeFile && (
                    <Ace
                        readOnly={props.readonly}
                        theme={ACE_THEME_TOMORROW_NIGHT_BRIGHT}
                        file={codeEditorStore.activeFile}
                        updateFile={codeEditorStore.updateFile}
                        updateCursorPosition={codeEditorStore.onCursorPositionChanged}
                        fontSize={editorFontSize}
                        scrollMarginTop={scrollMarginTop}
                        scrollMarginBottom={scrollMarginBottom}
                        registerResizeHandler={codeEditorStore.registerResizeHandler}
                        onError={() => {
                            showErrorToast(
                                i18n.gettext('Code editor could not be loaded properly.'),
                                // @ts-expect-error showErrorToast has not been typed yet.
                                {
                                    body: i18n.gettext('Please refresh the page.'),
                                },
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export const CodeEditor = observer(CodeEditorComponent);
