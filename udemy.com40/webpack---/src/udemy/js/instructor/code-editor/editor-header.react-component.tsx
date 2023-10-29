import AddCircleSolidIcon from '@udemy/icons/dist/add-circle-solid.ud-icon';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {FormGroup, TextInputWithCounter} from '@udemy/react-form-components';
import {Dropdown} from '@udemy/react-menu-components';
import {Tooltip} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import React, {useState} from 'react';

import Tabs from 'base-components/tabs/tabs.react-component';

import {AddButtonProps, EditButtonProps, EditorHeaderProps} from './types';
import './editor-header.less';

const EditButton: React.FC<EditButtonProps> = (props) => {
    const {codeEditorStore, fileIndex} = props;
    const fileName = codeEditorStore.files[fileIndex].fileName;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
    const [renamedFileName, setRenamedFileName] = useState<string>(fileName);
    const [fileNameInvalidMessage, setFileNameInvalidMessage] = useState<string>('');

    function onClickDelete(event: React.MouseEvent) {
        setIsDeleteConfirmationOpen(true);
        event.stopPropagation(); // Don't trigger onClick.
        codeEditorStore.trackEvent?.('delete', fileName);
    }

    function onConfirmDelete() {
        setIsDeleteConfirmationOpen(false);
        codeEditorStore.deleteFileAtIndex(fileIndex);
        codeEditorStore.trackEvent?.('delete_modal_confirm', fileName);
    }

    function onCancelDelete() {
        setIsDeleteConfirmationOpen(false);
        codeEditorStore.trackEvent?.('delete_modal_cancel', fileName);
    }

    function onClickRename(event: React.MouseEvent) {
        setIsRenameModalOpen(true);
        setRenamedFileName(fileName);
        setFileNameInvalidMessage('');
        event.stopPropagation(); // Don't trigger onClick.
        codeEditorStore.trackEvent?.('rename', fileName);
    }

    function isFileNameValid() {
        if (!renamedFileName.trim()) {
            setFileNameInvalidMessage(gettext("File name can't be empty."));
            return false;
        }
        if (!/^[\w-]+\.[\w-]+$/.test(renamedFileName)) {
            setFileNameInvalidMessage(
                gettext(
                    'File name is invalid. Please add an extension to your file name, such as index.py',
                ),
            );
            return false;
        } else if (codeEditorStore.doesAnotherFileExistWithName(renamedFileName, fileIndex)) {
            setFileNameInvalidMessage('File name already exists.');
            return false;
        }
        setFileNameInvalidMessage('');
        return true;
    }

    function onConfirmRename() {
        if (!isFileNameValid()) {
            return;
        }
        setIsRenameModalOpen(false);
        codeEditorStore.renameFileAtIndex(fileIndex, renamedFileName);
        codeEditorStore.trackEvent?.('rename_modal_confirm', renamedFileName);
    }

    function onCancelRename() {
        setIsRenameModalOpen(false);
        codeEditorStore.trackEvent?.('rename_modal_cancel', fileName);
    }

    return (
        <>
            <Dropdown
                placement="bottom-start"
                isOpen={isOpen}
                onToggle={setIsOpen}
                detachFromTarget={true}
                trigger={
                    <IconButton
                        styleName="tab-button-icon-container"
                        round={false}
                        size="medium"
                        udStyle="ghost"
                    >
                        <MoreIcon label={false} />
                    </IconButton>
                }
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem styleName="action-item" onClick={onClickRename}>
                        {gettext('Rename')}
                    </Dropdown.MenuItem>
                    {codeEditorStore.files.length > 1 ? (
                        <Dropdown.MenuItem styleName="action-item" onClick={onClickDelete}>
                            {gettext('Delete')}
                        </Dropdown.MenuItem>
                    ) : null}
                </Dropdown.Menu>
            </Dropdown>
            <ConfirmModal
                onConfirm={onConfirmDelete}
                onCancel={onCancelDelete}
                isOpen={isDeleteConfirmationOpen}
                data-purpose="delete-file-modal"
                title={gettext('Delete file')}
                confirmText={gettext('Confirm')}
            >
                {interpolate(
                    gettext('Please confirm to delete file %(fileName)s'),
                    {fileName},
                    true,
                )}
            </ConfirmModal>
            <ConfirmModal
                onConfirm={onConfirmRename}
                onCancel={onCancelRename}
                isOpen={isRenameModalOpen}
                title={gettext('Rename file')}
                confirmText={gettext('Save')}
                data-purpose="rename-file-modal"
            >
                <form>
                    <FormGroup
                        label="Title"
                        validationState={fileNameInvalidMessage ? 'error' : 'neutral'}
                        note={fileNameInvalidMessage}
                    >
                        <TextInputWithCounter
                            data-dialog-auto-focus={true}
                            maxLength={50}
                            value={renamedFileName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setRenamedFileName(e.target.value)
                            }
                        />
                    </FormGroup>
                </form>
            </ConfirmModal>
        </>
    );
};

const AddButton: React.FC<AddButtonProps> = (props) => {
    const {codeEditorStore} = props;
    const fileName = codeEditorStore.getInitialFileName();

    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState<boolean>(false);
    const [addFileFileName, setAddFileFileName] = useState<string>(fileName);
    const [fileNameInvalidMessage, setFileNameInvalidMessage] = useState<string>('');

    function onClickAdd(event: React.MouseEvent) {
        setIsAddFileModalOpen(true);
        setAddFileFileName(fileName);
        setFileNameInvalidMessage('');
        event.stopPropagation(); // Don't trigger onClick.
        codeEditorStore.trackEvent?.('add', fileName);
    }

    function onConfirmAddFile() {
        if (!isFileNameValid()) {
            return;
        }

        setIsAddFileModalOpen(false);

        codeEditorStore.createFile(addFileFileName);
        codeEditorStore.trackEvent?.('add_modal_confirm', addFileFileName);
    }

    function onCancelAddFile() {
        setIsAddFileModalOpen(false);
        codeEditorStore.trackEvent?.('add_modal_cancel', addFileFileName);
    }

    function isFileNameValid() {
        if (!addFileFileName.trim()) {
            setFileNameInvalidMessage(gettext("File name can't be empty."));
            return false;
        }
        if (!/^[\w-]+\.[\w-]+$/.test(addFileFileName)) {
            setFileNameInvalidMessage(
                gettext(
                    'File name is invalid. Please add an extension to your file name, such as index.py',
                ),
            );
            return false;
        } else if (codeEditorStore.doesAnotherFileExistWithName(addFileFileName)) {
            setFileNameInvalidMessage('File name already exists.');
            return false;
        }
        setFileNameInvalidMessage('');
        return true;
    }

    return (
        <>
            <IconButton
                styleName="tab-button-icon-container add-button-icon-container"
                round={false}
                size="xsmall"
                udStyle="ghost"
                onClick={onClickAdd}
            >
                <AddCircleSolidIcon label={false} />
            </IconButton>
            <ConfirmModal
                onConfirm={onConfirmAddFile}
                onCancel={onCancelAddFile}
                isOpen={isAddFileModalOpen}
                title={gettext('Enter file name')}
                data-purpose="add-file-modal"
            >
                <form>
                    <FormGroup
                        label="Title"
                        validationState={fileNameInvalidMessage ? 'error' : 'neutral'}
                        note={fileNameInvalidMessage}
                    >
                        <TextInputWithCounter
                            data-dialog-auto-focus={true}
                            maxLength={50}
                            value={addFileFileName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setAddFileFileName(e.target.value)
                            }
                        />
                    </FormGroup>
                </form>
            </ConfirmModal>
        </>
    );
};

const EditorHeaderComponent: React.FC<EditorHeaderProps> = (props) => {
    const {codeEditorStore, leftButtons, rightButtons} = props;

    const activeTab = codeEditorStore.activeFile?.fileName;

    const onTabChange = (selectedTab: string) => {
        const selectedFile = codeEditorStore.files.find((file) => file.fileName === selectedTab);
        codeEditorStore.selectFile(selectedFile);
        codeEditorStore.trackEvent?.('switch', selectedFile?.fileName ?? '');
    };

    return (
        <div styleName="header">
            {leftButtons}
            <div styleName="tabs-container">
                <div styleName="tabs-container-inner">
                    <div styleName="tabs-container-inner-item">
                        <Tabs
                            key={codeEditorStore.editorWidth}
                            invertedColors={true}
                            size="small"
                            activeTabId={activeTab}
                            onSelect={(selectedTab) => onTabChange(selectedTab as string)}
                        >
                            {codeEditorStore.files.map((file, index) => (
                                <Tabs.Tab
                                    title={file.fileName}
                                    renderTabButton={(button) => (
                                        <div styleName="tab-button-container">
                                            {button}
                                            {props.editable ? (
                                                <EditButton
                                                    codeEditorStore={codeEditorStore}
                                                    fileIndex={index}
                                                />
                                            ) : null}
                                        </div>
                                    )}
                                    key={file.fileName}
                                    id={file.fileName}
                                />
                            ))}
                        </Tabs>
                    </div>
                    <div styleName="tabs-container-inner-item">
                        {props.editable ? (
                            <Tooltip
                                udStyle="black"
                                placement={'bottom'}
                                trigger={<AddButton codeEditorStore={codeEditorStore} />}
                            >
                                {gettext('Add File')}
                            </Tooltip>
                        ) : null}
                    </div>
                </div>
            </div>
            {rightButtons}
        </div>
    );
};

export const EditorHeader = observer(EditorHeaderComponent);
