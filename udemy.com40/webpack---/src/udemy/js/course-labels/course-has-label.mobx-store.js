import autobind from 'autobind-decorator';
import {action, extendObservable, observable} from 'mobx';

import udApi from 'utils/ud-api';

import {ASSIGNMENT_APPROVAL_STATUS} from '../tapen/structured-data-search-admin/constants';

export default class CourseHasLabelStore {
    @observable label;
    // See _initData for other properties from database

    constructor(courseId, data, propagateChangesToServer, onCreate, onDelete) {
        this._initData(data);
        // courseId and propagateChangesToServer should be treated as immutable
        this.courseId = courseId;
        this.propagateChangesToServer = propagateChangesToServer;
        this.onCreate = onCreate;
        this.onDelete = onDelete;
    }

    @action
    _initData(data) {
        extendObservable(this, {
            approval_status: data.approval_status,
            is_primary: data.is_primary,
        });
        this.label = data.label;
    }

    get apiUrl() {
        return `courses/${this.courseId}/labels/${this.label.id}/`;
    }

    @autobind
    @action
    setPrimary(isPrimary) {
        this.is_primary = isPrimary;
        if (!this.propagateChangesToServer) {
            return Promise.resolve();
        }
        return udApi.patch(`${this.apiUrl}`, {
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
        return udApi.put(`${this.apiUrl}`).then(() => {
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
        return udApi.delete(`${this.apiUrl}`).then(() => {
            this.onDelete(this);
        });
    }
}

// These enums are defined in udemy/course_label/models.py.  Please keep the definitions in sync
CourseHasLabelStore.APPROVAL_STATUS = ASSIGNMENT_APPROVAL_STATUS;
