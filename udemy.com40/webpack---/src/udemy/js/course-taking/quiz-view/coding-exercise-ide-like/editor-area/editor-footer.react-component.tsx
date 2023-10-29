import {useI18n} from '@udemy/i18n';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useCallback, useContext, useEffect, useRef} from 'react';

import SystemMessagePopover from 'base-components/ungraduated/popover/system-message-popover.react-component';
import {useIsOutputEnabled} from 'instructor/hooks/use-is-output-enabled';
import SystemMessage from 'utils/ud-system-message';

import {CodingExerciseStore} from '../coding-exercise.mobx-store';
import styles from './editor-footer.less';
import {ResetButton} from './reset-button.react-component';

const EditorFooterComponent: React.FC = () => {
    const store = useContext(MobXProviderContext);
    const codingExerciseStore: CodingExerciseStore = store.codingExerciseStore;
    const i18n = useI18n();
    const footerRef = useRef<HTMLDivElement>(null);
    const isOutputEnabled = useIsOutputEnabled(codingExerciseStore.question.prompt.language);

    const evaluateEvent = useCallback(
        (e: KeyboardEvent) => {
            if (e.ctrlKey && e.code === 'F9') {
                codingExerciseStore.evaluate();
            }
        },
        [codingExerciseStore],
    );

    useEffect(() => {
        codingExerciseStore.parentContainer()?.addEventListener('keydown', evaluateEvent);
        return () =>
            codingExerciseStore.parentContainer()?.removeEventListener('keydown', evaluateEvent);
    }, [codingExerciseStore, evaluateEvent]);

    const {isEvaluating, evaluate, statusText} = codingExerciseStore;
    const {isCodeRunning, runCode} = codingExerciseStore;

    return (
        <div className={`ud-text-sm ${styles['flex-wrap']} ${styles.footer}`} ref={footerRef}>
            <div styleName="check-reset-button">
                <Button
                    size="small"
                    className={`ud-link-neutral ${
                        isEvaluating ? styles['check-waiting'] : styles['check-primary']
                    }`}
                    udStyle="white-solid"
                    data-purpose="check-button"
                    aria-disabled={isEvaluating || isCodeRunning}
                    onClick={evaluate}
                >
                    <span styleName="block">
                        <span styleName="check-text primary">
                            {!isOutputEnabled && (
                                <PlayIcon styleName="button-play-icon" label={false} />
                            )}
                            {codingExerciseStore.isSQL
                                ? i18n.gettext('Run query')
                                : i18n.gettext('Run tests')}
                        </span>
                        <span styleName="check-text waiting">
                            <Loader color="inherit" size="small" styleName="check-loader" />
                        </span>
                    </span>
                </Button>

                {isOutputEnabled ? (
                    <SystemMessagePopover
                        systemMessageId={SystemMessage.ids.ceOutputLearnerWelcomePopover}
                        withArrow={true}
                        placement="top"
                        trigger={
                            <Button
                                size="small"
                                className={`${styles['run-code-button']} ${
                                    isCodeRunning
                                        ? styles['check-waiting']
                                        : styles['check-primary']
                                }`}
                                udStyle="ghost"
                                data-purpose="run-code-button"
                                aria-disabled={isCodeRunning || isEvaluating}
                                onClick={runCode}
                            >
                                <span styleName="block">
                                    <span styleName="check-text primary">
                                        <PlayIcon styleName="button-runcode-icon" label={false} />
                                        {i18n.gettext('Run code')}
                                    </span>
                                    <span styleName="check-text waiting">
                                        <Loader
                                            color="inherit"
                                            size="small"
                                            styleName="check-loader"
                                        />
                                    </span>
                                </span>
                            </Button>
                        }
                    >
                        <p className="ud-text-md" data-purpose="output-popover-text">
                            {i18n.gettext(
                                'Use the new “Run code” button to see your logs before running tests.',
                            )}
                        </p>
                    </SystemMessagePopover>
                ) : (
                    <ResetButton />
                )}
            </div>
            <div styleName="flex-wrap messages">
                {statusText && (
                    <div styleName="message" data-purpose="status-message">
                        {statusText}
                    </div>
                )}
                <div styleName="message">{'|'}</div>
                <div data-purpose="location-message">
                    {interpolate(
                        i18n.gettext('Line %(line)s, Column %(column)s'),
                        {
                            line: codingExerciseStore.currentLine,
                            column: codingExerciseStore.currentColumn,
                        },
                        true,
                    )}
                </div>
            </div>
        </div>
    );
};

export const EditorFooter = observer(EditorFooterComponent);
