import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import udApi from 'utils/ud-api';

import {
    APPROVED_COURSE_HAS_LABEL,
    MAXIMUM_LABELS_PER_COURSE,
    PROPOSED_COURSE_HAS_LABEL,
} from './constants';
import CourseHasLabelStore from './course-has-label.mobx-store';
import CourseLabelsStore from './course-labels.mobx-store';
import ProposedCourseHasLabelStore from './proposed-course-has-label.mobx-store';

export default class CourseHasLabelsStore {
    @observable approvedCourseHasLabels = [];
    @observable proposedCourseHasLabels = [];
    @observable removedApprovedCourseHasLabels = [];
    @observable removedProposedCourseHasLabels = [];

    constructor(courseId, initialCourseHasLabels, propagateChangesToServer) {
        // courseId and propagateChangesToServer should be treated as immutable
        this.courseId = courseId;
        this.propagateChangesToServer = propagateChangesToServer;
        for (const data of initialCourseHasLabels) {
            this._addLocalCourseHasLabel(data);
        }
    }

    @autobind
    @action
    addAssignment(assignment) {
        const labelId = assignment.label.id;
        if (assignment instanceof ProposedCourseHasLabelStore) {
            this.proposedCourseHasLabels.push(assignment);
            this._removeCourseHasLabel(labelId, 'removedProposedCourseHasLabels');
        } else if (assignment instanceof CourseHasLabelStore) {
            this.approvedCourseHasLabels.push(assignment);
            this._removeCourseHasLabel(labelId, 'removedApprovedCourseHasLabels');
        }
    }

    @autobind
    @action
    removeAssignment(assignment) {
        const labelId = assignment.label.id;
        if (assignment instanceof ProposedCourseHasLabelStore) {
            this.removedProposedCourseHasLabels.push(assignment);
            this._removeCourseHasLabel(labelId, 'proposedCourseHasLabels');
        } else if (assignment instanceof CourseHasLabelStore) {
            this.removedApprovedCourseHasLabels.push(assignment);
            this._removeCourseHasLabel(labelId, 'approvedCourseHasLabels');
        }
    }

    makeCourseHasLabel(data) {
        return new CourseHasLabelStore(
            this.courseId,
            data,
            this.propagateChangesToServer,
            this.addAssignment,
            this.removeAssignment,
        );
    }

    makeProposedCourseHasLabel(data) {
        return new ProposedCourseHasLabelStore(
            this.courseId,
            data,
            this.propagateChangesToServer,
            this.addAssignment,
            this.removeAssignment,
        );
    }

    @autobind
    _addLocalCourseHasLabel(data) {
        let assignment;
        if (data._class === APPROVED_COURSE_HAS_LABEL) {
            assignment = this.makeCourseHasLabel(data);
        } else if (data._class === PROPOSED_COURSE_HAS_LABEL) {
            assignment = this.makeProposedCourseHasLabel(data);
        }
        this.addAssignment(assignment);

        return assignment;
    }

    _removeCourseHasLabel(labelId, listName) {
        this[listName] = this[listName].filter((chl) => chl.label.id !== labelId);
    }

    @computed
    get courseHasLabels() {
        return [...this.approvedCourseHasLabels, ...this.proposedCourseHasLabels];
    }

    @computed
    get removedAssignments() {
        return [...this.removedApprovedCourseHasLabels, ...this.removedProposedCourseHasLabels];
    }

    @computed
    get canAddLabel() {
        return this.visibleCourseHasLabels.length < MAXIMUM_LABELS_PER_COURSE;
    }

    @action
    addLabel(label) {
        const existing = this.proposedCourseHasLabels.find((pchl) => pchl.label.id === label.id);
        if (!existing) {
            const pchl = this.makeProposedCourseHasLabel({
                label,
                approval_status: CourseHasLabelStore.APPROVAL_STATUS.unapproved,
                is_primary: false,
            });
            return pchl.create();
        }
        return Promise.resolve();
    }

    @computed
    get primaryCourseHasLabels() {
        return this.visibleCourseHasLabels.filter((chl) => chl.is_primary);
    }

    @computed
    get nonPrimaryCourseHasLabels() {
        return this.visibleCourseHasLabels.filter((chl) => !chl.is_primary);
    }

    @computed
    get visibleCourseHasLabels() {
        return this.courseHasLabels.filter((chl) => !chl.is_deleted);
    }

    @computed
    get canApprove() {
        return (
            this.visibleCourseHasLabels.every(
                (chl) => chl.label.status === CourseLabelsStore.LABEL_STATUS.approved,
            ) && this.primaryCourseHasLabels.length > 0
        );
    }

    @computed
    get approvalStatus() {
        const isEscalated = (pchl) =>
            pchl.approval_status === CourseHasLabelStore.APPROVAL_STATUS.escalated;
        const isUnapproved = (pchl) =>
            pchl.approval_status === CourseHasLabelStore.APPROVAL_STATUS.unapproved;
        if (this.proposedCourseHasLabels.some(isEscalated)) {
            return CourseHasLabelStore.APPROVAL_STATUS.escalated;
        } else if (this.proposedCourseHasLabels.some(isUnapproved)) {
            return CourseHasLabelStore.APPROVAL_STATUS.unapproved;
        }
        return CourseHasLabelStore.APPROVAL_STATUS.approved;
    }

    @autobind
    @action
    changeApproval(approvalStatus) {
        return udApi
            .patch(`courses/${this.courseId}/proposed-assignments/`, {
                approval_status: approvalStatus,
            })
            .then(
                action(() => {
                    for (const chl of this.courseHasLabels) {
                        chl.approval_status = approvalStatus;
                    }
                }),
            );
    }
}
