import {useI18n} from '@udemy/i18n';
import ArrowRightIcon from '@udemy/icons/dist/arrow-right.ud-icon';
import CollapseHorizontalIcon from '@udemy/icons/dist/collapse-horizontal.ud-icon';
import ExpandHorizontalIcon from '@udemy/icons/dist/expand-horizontal.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import classnames from 'classnames';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext} from 'react';

import CurriculumItemLoader from 'course-taking/curriculum/curriculum-item-loader.react-component';
import {CodeEditor} from 'instructor/code-editor/code-editor.react-component';
import {useIsOutputEnabled} from 'instructor/hooks/use-is-output-enabled';

import {CodingExerciseStore} from '../coding-exercise.mobx-store';
import styles from './editor-container.less';
import {EditorFooter} from './editor-footer.react-component';
import {ResetButton} from './reset-button.react-component';

const EditorContainerComponent: React.FC = () => {
    const i18n = useI18n();
    const store = useContext(MobXProviderContext);
    const codingExerciseStore: CodingExerciseStore = store.codingExerciseStore;
    const isOutputEnabled = useIsOutputEnabled(codingExerciseStore.question.prompt.language);

    const headerLeftButtons = codingExerciseStore.problemAreaHidden &&
        !codingExerciseStore.editorExpanded && (
            <IconButton
                onClick={() => codingExerciseStore.toggleProblemAreaHidden()}
                size="medium"
                udStyle="ghost"
                className={styles['expand-problem-area-button']}
                data-purpose="expand-problem-area-button"
            >
                <ArrowRightIcon label={false} size="small" />
            </IconButton>
        );

    const headerRightButtons = (
        <>
            {isOutputEnabled && <ResetButton />}
            <Tooltip
                udStyle="black"
                placement={'bottom'}
                detachFromTarget={true}
                trigger={
                    <IconButton
                        onClick={() => codingExerciseStore.toggleEditorExpanded()}
                        size="medium"
                        udStyle="ghost"
                        className={styles.button}
                        data-purpose="expand-button"
                    >
                        {codingExerciseStore.editorExpanded ? (
                            <CollapseHorizontalIcon label={false} size="small" />
                        ) : (
                            <ExpandHorizontalIcon label={false} size="small" />
                        )}
                    </IconButton>
                }
            >
                {codingExerciseStore.editorExpanded
                    ? i18n.gettext('Collapse Editor')
                    : i18n.gettext('Expand Editor')}
            </Tooltip>
        </>
    );

    return (
        <div
            styleName={classnames('editor-container', {
                'editor-expanded': codingExerciseStore.editorExpanded,
            })}
            data-purpose="editor-container"
        >
            {codingExerciseStore.studentFilesLoaded ? (
                <div styleName="editor-container-resize">
                    <CodeEditor
                        codeEditorStore={codingExerciseStore.codeEditorStore}
                        headerLeftButtons={headerLeftButtons}
                        headerRightButtons={headerRightButtons}
                    />
                    <EditorFooter />
                </div>
            ) : (
                <CurriculumItemLoader />
            )}
        </div>
    );
};

export const EditorContainer = observer(EditorContainerComponent);
