import autobind from 'autobind-decorator';
import {action, extendObservable} from 'mobx';

import udApi from 'utils/ud-api';

export default class ProposedCourseHasLabelStore {
    constructor(courseId, pchl, propagateChangesToServer, onCreate, onDelete) {
        extendObservable(this, {
            approval_status: pchl.approval_status,
            is_primary: pchl.is_primary,
        });
        this.courseId = courseId;
        this.label = pchl.label;
        this.propagateChangesToServer = propagateChangesToServer;
        this.onCreate = onCreate;
        this.onDelete = onDelete;
    }

    get apiUrl() {
        return `courses/${this.courseId}/proposed-assignments/${this.label._class}/`;
    }

    @autobind
    @action
    setPrimary(isPrimary) {
        this.is_primary = isPrimary;
        if (!this.propagateChangesToServer) {
            return Promise.resolve();
        }
        return udApi.patch(`${this.apiUrl}${this.label.id}/`, {
            is_primary: isPrimary,
        });
    }

    @autobind
    @action
    create() {
        if (!this.propagateChangesToServer) {
            this.onCreate(this);
            return Promise.resolve();
        }
        return udApi
            .post(this.apiUrl, {
                label_id: this.label.id,
            })
            .then(() => {
                this.onCreate(this);
            });
    }

    @autobind
    @action
    delete() {
        if (!this.propagateChangesToServer) {
            this.onDelete(this);
            return Promise.resolve();
        }
        return udApi.delete(`${this.apiUrl}${this.label.id}/`).then(() => {
            this.onDelete(this);
        });
    }
}
