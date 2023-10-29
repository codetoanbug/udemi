import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {TRANSITION_DURATION} from 'instructor/animated-collapse/animated-collapse.react-component';
import Raven from 'utils/ud-raven';

import {FileModel} from './file.mobx-model';
import {CodeEditorStoreProps} from './types';

export class CodeEditorStore {
    onFileUpdated;
    onFileAdded;
    onFileRenamed;
    onFileDeleted;
    onCursorPositionChanged;
    registerResizeHandler;
    updateEditorSize?: () => void;
    trackEvent;

    constructor(props: CodeEditorStoreProps) {
        this.onFileUpdated = props.onFileUpdated;
        this.onFileAdded = props.onFileAdded;
        this.onFileRenamed = props.onFileRenamed;
        this.onFileDeleted = props.onFileDeleted;
        this.onCursorPositionChanged = props.onCursorPositionChanged;
        this.trackEvent = props.trackEvent;
        this.registerResizeHandler = (updateEditorSize: VoidFunction) => {
            try {
                this.updateEditorSize = action(() => {
                    try {
                        updateEditorSize();
                        this.editorWidth = new Date().getTime();
                    } catch (e) {
                        Raven.captureException(`Letter repeating updateEditorSize ${e}`);
                        throw new Error(`Letter repeating updateEditorSize ${e}`);
                    }
                });
            } catch (e) {
                Raven.captureException(`Letter repeating registerResizeHandler ${e}`);
                throw new Error(`Letter repeating registerResizeHandler ${e}`);
            }
        };
    }

    @observable activeFile?: FileModel;
    @observable files: FileModel[] = [];
    @observable editorWidth = 0;

    @autobind
    updateFile(file: FileModel, content: string) {
        try {
            if (file.content !== content) {
                file.setContent(content);
                this.onFileUpdated?.(file.fileName);
            }
        } catch (e) {
            Raven.captureException(`Letter repeating updateFile ${file.fileName}: ${e}`);
            throw new Error(`Letter repeating updateFile ${file.fileName}: ${e}`);
        }
    }

    @action
    selectFile(file?: FileModel) {
        this.activeFile = file;
    }

    @autobind
    @action
    deleteFileAtIndex(index: number) {
        const deletedFile = this.files[index];
        this.files.splice(index, 1);
        if (deletedFile == this.activeFile) {
            const activeFileIndex = index === this.files.length ? index - 1 : index;
            this.activeFile = this.files[activeFileIndex];
        }
        this.onFileDeleted?.(index);
    }

    @autobind
    @action
    renameFileAtIndex(index: number, name: string) {
        const renamedFile = this.files[index];
        renamedFile.setFileName(name);
        this.onFileRenamed?.(index, renamedFile.fileName);
    }

    @autobind
    @action
    createFile(fileName: string) {
        this.files.push(new FileModel({file_name: fileName, content: ''}));
        this.onFileAdded?.(fileName);
    }

    @autobind
    triggerResize() {
        setTimeout(() => {
            this.updateEditorSize?.();
        }, TRANSITION_DURATION);
    }

    getInitialFileName() {
        const fileIds = this.files.map((file) => {
            const match = file.fileName.match(/file(\d+)\.txt/);
            return match ? parseInt(match[1], 10) : 0;
        });
        const newFileName = `file${Math.max(1, ...fileIds) + 1}.txt`;

        return newFileName;
    }

    doesAnotherFileExistWithName(fileName: string, fileIndex?: number) {
        const indexOfExistFile = this.files.findIndex(
            (file: FileModel) => file.fileName === fileName,
        );
        if (fileIndex && indexOfExistFile === fileIndex) {
            return false;
        }

        return indexOfExistFile !== -1;
    }
}
