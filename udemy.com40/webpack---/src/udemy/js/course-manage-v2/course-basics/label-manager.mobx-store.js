import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {APPROVED_COURSE_LABEL, PROPOSED_COURSE_LABEL} from 'course-labels/constants';
import CourseHasLabelsStore from 'course-labels/course-has-labels.mobx-store';

export default class LabelManagerStore {
    constructor(courseId, initialCourseHasLabels, locked) {
        this.courseHasLabelsStore = new CourseHasLabelsStore(
            courseId,
            initialCourseHasLabels,
            false,
        );
        if (this.courseHasLabelsStore.visibleCourseHasLabels.length === 1) {
            // If there was only one label, it would have been set to primary implicitly on save,
            // so clear it now
            // It will be re-chosen as primary by the same default logic
            // unless the user adds more labels (in which case they should re-choose).
            this.courseHasLabelsStore.visibleCourseHasLabels[0].setPrimary(false);
        }
        this.setLocked(locked);
        this.captureOriginalLabelsJSON();
    }

    @observable locked = false;

    @observable _originalLabelsJSON = null;

    @computed
    get dirty() {
        return this._originalLabelsJSON !== this.labelsJSON;
    }

    @computed
    get labelsJSON() {
        const approvedLabels = {
            ids: [],
            primary: null,
        };
        const proposedLabels = {
            ids: [],
            primary: null,
        };
        for (const assignment of this.courseHasLabelsStore.visibleCourseHasLabels) {
            const label = assignment.label;
            if (label._class === APPROVED_COURSE_LABEL) {
                approvedLabels.ids.push(label.id);
            } else {
                proposedLabels.ids.push(label.id);
            }
        }
        approvedLabels.primary = this.getPrimaryLabelId(APPROVED_COURSE_LABEL);
        proposedLabels.primary = this.getPrimaryLabelId(PROPOSED_COURSE_LABEL);
        return JSON.stringify({
            approved_labels: approvedLabels,
            proposed_labels: proposedLabels,
        });
    }

    @autobind
    getPrimaryLabelId(labelType) {
        // Calculate the primary label id which should be returned by the form element.
        // This is not used for rendering the dropdown, only the end result.
        const primaryLabelForType = this.courseHasLabelsStore.primaryCourseHasLabels.filter(
            (chl) => chl.label._class === labelType,
        );
        if (primaryLabelForType.length) {
            return primaryLabelForType[0].label.id;
        }
        // Use the first label as primary if there is only one in total and there isn't
        // any other primary assignment
        const allAssignmentsForGivenType = this.courseHasLabelsStore.visibleCourseHasLabels.filter(
            (chl) => chl.label._class === labelType,
        );
        if (
            allAssignmentsForGivenType.length === 1 &&
            this.courseHasLabelsStore.visibleCourseHasLabels.length === 1 &&
            this.courseHasLabelsStore.primaryCourseHasLabels.length === 0
        ) {
            return allAssignmentsForGivenType[0].label.id;
        }
        return null;
    }

    @autobind
    @action
    setPrimary(oldPrimary, newPrimary) {
        if (oldPrimary !== null) {
            oldPrimary.setPrimary(false);
        }
        if (newPrimary !== null) {
            newPrimary.setPrimary(true);
        }
    }

    @autobind
    @action
    setLocked(locked) {
        this.locked = locked;
    }

    @autobind
    @action
    captureOriginalLabelsJSON() {
        this._originalLabelsJSON = this.labelsJSON;
    }

    @autobind
    getCourseHasLabels() {
        return this.courseHasLabelsStore.visibleCourseHasLabels;
    }
}
