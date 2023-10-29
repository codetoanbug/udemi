import {action, observable} from 'mobx';

export default class MathFormModel {
    @observable mathRepresentation = '';
    @observable isInline = false;
    @observable isEditing = false;

    constructor(context) {
        this.context = context;
    }

    @action
    setIsEditing(value) {
        this.isEditing = value;
    }

    @action
    setMathRepresentation(value) {
        this.mathRepresentation = value;
    }

    @action
    setIsInline(value) {
        this.isInline = value;
    }
}
