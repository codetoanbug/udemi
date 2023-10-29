import autobind from 'autobind-decorator';
import {action, observable, computed} from 'mobx';
import uuidv4 from 'uuid/v4';

export const ACTION_STATUS = {
    pending: 'pending',
    success: 'success',
    error: 'error',
};

export const ENTITY_TYPES = {
    topic: 'topic',
    subcategory: 'subcategory',
    topicDescriptor: 'topic_descriptor',
};
export default class SDAction {
    @observable status = ACTION_STATUS.pending;
    @observable message;
    constructor(actionType) {
        this.id = uuidv4();
        this.actionType = actionType;
    }

    @autobind
    @action
    setResponse(response) {
        this.status = ACTION_STATUS[response.status];
        this.message = response.message;
    }

    @computed
    get isPending() {
        return this.status === ACTION_STATUS.pending;
    }

    @computed
    get isError() {
        return this.status === ACTION_STATUS.error;
    }

    @computed
    get isSuccess() {
        return this.status === ACTION_STATUS.success;
    }

    toApi() {
        return {
            id: this.id,
            action: this.actionType,
            options: this._serialize(),
        };
    }

    isSameAction(action) {
        return (
            this.actionType === action.actionType &&
            JSON.stringify(this._serialize()) === JSON.stringify(action._serialize())
        );
    }

    _serialize() {
        throw new Error('An SD action must implement toApi().');
    }

    getEntityType(entity) {
        const result = entity.type === 'gtinstance' ? entity.schema : entity.type;
        return result.toLowerCase();
    }
}
