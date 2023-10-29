import {useI18n} from '@udemy/i18n';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import {observer} from 'mobx-react';
import React from 'react';

import {
    LEARNING_PATH_DESCRIPTION_PLACEHOLDER,
    LEARNING_PATH_TITLE_MAXLENGH,
    LEARNING_PATH_TITLE_PLACEHOLDER,
} from 'learning-path/learning-path-page/constants';
import {noop} from 'utils/noop';

import {OPTIONAL} from './constants';
import styles from './list-page.less';

export interface LearningPathDetailsModalProps {
    isOpen: boolean;
    onSuccess: (title: string, description: string) => void;
    onClose: () => void;
    onOpen?: () => void;
    onCancel: () => void;
    modalTitle: string;
    modalConfirmText: string;
    initialTitle: string;
    initialDescription: string;
}

export const LearningPathDetailsModal = observer(
    ({
        isOpen = true,
        onOpen = noop,
        onClose,
        onSuccess,
        onCancel = noop,
        modalTitle,
        modalConfirmText,
        initialTitle = '',
        initialDescription = '',
    }: LearningPathDetailsModalProps) => {
        const {gettext} = useI18n();
        const [title, setTitle] = React.useState(initialTitle);
        const [description, setDescription] = React.useState(initialDescription);

        return (
            <ConfirmModal
                isOpen={isOpen}
                title={modalTitle}
                confirmText={modalConfirmText}
                onOpen={onOpen}
                onCancel={() => {
                    onCancel();
                    onClose();
                }}
                onClose={onClose}
                onConfirm={() => {
                    onSuccess(title, description);
                    onClose();
                }}
            >
                <FormGroup label={LEARNING_PATH_TITLE_PLACEHOLDER.TEXT}>
                    <TextInput
                        maxLength={LEARNING_PATH_TITLE_MAXLENGH}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus={true}
                        autoComplete="off"
                        data-purpose="Learning path title"
                        placeholder={LEARNING_PATH_TITLE_PLACEHOLDER.TEXT}
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('Description')}
                    className={styles['mt-sm']}
                    labelProps={{tag: OPTIONAL.TEXT}}
                >
                    <TextInput
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoFocus={true}
                        autoComplete="off"
                        data-purpose="Learning path description"
                        placeholder={LEARNING_PATH_DESCRIPTION_PLACEHOLDER.TEXT}
                    />
                </FormGroup>
            </ConfirmModal>
        );
    },
);
