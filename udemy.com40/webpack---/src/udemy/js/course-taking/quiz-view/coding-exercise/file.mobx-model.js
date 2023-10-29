import {action, observable} from 'mobx';

export default class FileModel {
    @observable content = '';

    constructor(apiData) {
        this.fileName = apiData.file_name;
        this.type = apiData.type;
        this.setObservablesFromAPIData(apiData);
    }

    @action
    setObservablesFromAPIData(apiData) {
        this.content = apiData.content;
    }

    @action
    setContent(content) {
        this.content = content;
    }
}
