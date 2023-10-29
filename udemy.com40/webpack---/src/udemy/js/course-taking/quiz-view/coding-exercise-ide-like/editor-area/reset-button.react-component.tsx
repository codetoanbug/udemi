import {useI18n} from '@udemy/i18n';
import RewindIcon from '@udemy/icons/dist/rewind.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {Tooltip} from '@udemy/react-popup-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext, useState} from 'react';

import {useIsOutputEnabled} from '../../../../instructor/hooks/use-is-output-enabled';
import {CodingExerciseStore} from '../coding-exercise.mobx-store';
import styles from './reset-button.less';

const ResetButtonComponent: React.FC = () => {
    const i18n = useI18n();
    const store = useContext(MobXProviderContext);
    const codingExerciseStore: CodingExerciseStore = store.codingExerciseStore;
    const isOutputEnabled = useIsOutputEnabled(codingExerciseStore.question.prompt.language);
    const [isResetConfirmationShown, setIsResetConfirmationShown] = useState<boolean>(false);

    const showConfirmResetModal = () => {
        setIsResetConfirmationShown(true);
        codingExerciseStore.trackEvent('reset_code');
    };

    const hideConfirmResetModal = () => {
        if (isResetConfirmationShown) {
            codingExerciseStore.trackEvent('reset_code_modal_close');
            setIsResetConfirmationShown(false);
        }
    };

    const cancelConfirmResetModal = () => {
        codingExerciseStore.trackEvent('reset_code_modal_cancel');
        setIsResetConfirmationShown(false);
    };

    const resetCode = () => {
        codingExerciseStore.reset();
        codingExerciseStore.trackEvent('reset_code_modal_confirm');
        setIsResetConfirmationShown(false);
    };

    return (
        <ModalTrigger
            trigger={
                isOutputEnabled ? (
                    <Tooltip
                        udStyle="black"
                        placement={'bottom'}
                        trigger={
                            <IconButton
                                size="medium"
                                udStyle="ghost"
                                className={styles['reset-icon-button']}
                                data-purpose="reset-icon-button"
                                onClick={showConfirmResetModal}
                                disabled={
                                    codingExerciseStore.isEvaluating ||
                                    codingExerciseStore.isCodeRunning
                                }
                            >
                                <RewindIcon label={false} />
                            </IconButton>
                        }
                    >
                        {i18n.gettext('Reset Code')}
                    </Tooltip>
                ) : (
                    <Button
                        udStyle="ghost"
                        className={styles['reset-button']}
                        size="small"
                        data-purpose="reset-button"
                        onClick={showConfirmResetModal}
                        disabled={
                            codingExerciseStore.isEvaluating || codingExerciseStore.isCodeRunning
                        }
                    >
                        {i18n.gettext('Reset')}
                    </Button>
                )
            }
            renderModal={() => (
                <ConfirmModal
                    isOpen={isResetConfirmationShown}
                    onClose={hideConfirmResetModal}
                    onCancel={cancelConfirmResetModal}
                    onConfirm={resetCode}
                    confirmText={gettext('Reset')}
                    title={gettext('Reset solution')}
                    getContainer={codingExerciseStore.parentContainer as () => HTMLElement}
                >
                    {i18n.gettext('Your code will be deleted. Do you want to reset your solution?')}
                </ConfirmModal>
            )}
        />
    );
};

export const ResetButton = observer(ResetButtonComponent);
