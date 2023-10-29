import {action, observable} from 'mobx';

import {File} from './types';

export class FileModel {
    @observable content = '';
    @observable fileName: string;
    type?: string | null;

    constructor(file: File) {
        this.fileName = file.file_name;
        this.type = file.type;
        this.setObservablesFromFile(file);
    }

    @action
    setObservablesFromFile(file: File) {
        this.content = file.content;
    }

    @action
    setContent(content: string) {
        this.content = content;
    }

    @action
    setFileName(fileName: string) {
        this.fileName = fileName;
    }
}
