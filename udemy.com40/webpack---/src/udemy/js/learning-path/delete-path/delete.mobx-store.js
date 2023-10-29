import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';

export default class DeleteStore {
    @observable isDeleteModalVisible = false;
    @observable isConfirmBoxChecked = false;

    constructor(learningPath) {
        this.learningPath = learningPath;
    }

    @autobind
    @action
    toggleDeleteModal() {
        this.isDeleteModalVisible = !this.isDeleteModalVisible;
    }

    @autobind
    @action
    handleConfirmBoxClick() {
        this.isConfirmBoxChecked = !this.isConfirmBoxChecked;
    }
}
