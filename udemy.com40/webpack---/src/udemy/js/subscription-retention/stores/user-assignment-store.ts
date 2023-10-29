import {FeatureVariantAssignmentsQuery, useFeatureVariantAssignmentsQuery} from '@udemy/graphql';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {UserAssignment} from 'subscription-retention/types/user-assignment';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

export class UserAssignmentStore {
    @observable private _assignmentsIsFetching = true;
    @observable private _assignmentIsCreating = true;
    @observable private _assignmentIsUpdating = true;
    @observable private _assignmentIsDeleting = true;

    @observable private _assignmentsFetchHasErrored = false;
    @observable private _assignmentCreateHasErrored = false;
    @observable private _assignmentUpdateHasErrored = false;
    @observable private _assignmentDeleteHasErrored = false;
    @observable userAssignments: UserAssignment[] = [];
    @observable badgeDueDateTrackerEnabled = false;

    @computed
    get assignmentsIsFetching() {
        return this._assignmentsIsFetching;
    }

    set assignmentsIsFetching(loading) {
        this._assignmentsIsFetching = loading;
    }

    @computed
    get assignmentsFetchHasErrored() {
        return this._assignmentsFetchHasErrored;
    }

    set assignmentsFetchHasErrored(errorState) {
        this._assignmentsFetchHasErrored = errorState;
    }

    @computed
    get assignmentIsCreating() {
        return this._assignmentIsCreating;
    }

    set assignmentIsCreating(loading) {
        this._assignmentIsCreating = loading;
    }

    @computed
    get assignmentCreateHasErrored() {
        return this._assignmentCreateHasErrored;
    }

    set assignmentCreateHasErrored(errorState) {
        this._assignmentCreateHasErrored = errorState;
    }

    @computed
    get assignmentIsUpdating() {
        return this._assignmentIsUpdating;
    }

    set assignmentIsUpdating(loading) {
        this._assignmentIsUpdating = loading;
    }

    @computed
    get assignmentUpdateHasErrored() {
        return this._assignmentUpdateHasErrored;
    }

    set assignmentUpdateHasErrored(errorState) {
        this._assignmentUpdateHasErrored = errorState;
    }

    @computed
    get assignmentIsDeleting() {
        return this._assignmentIsDeleting;
    }

    set assignmentIsDeleting(loading) {
        this._assignmentIsDeleting = loading;
    }

    @computed
    get assignmentDeleteHasErrored() {
        return this._assignmentDeleteHasErrored;
    }

    set assignmentDeleteHasErrored(errorState) {
        this._assignmentDeleteHasErrored = errorState;
    }

    @action
    setBadgeDueDateTrackerEnabled(badgeDueDateTrackerEnabled: boolean) {
        this.badgeDueDateTrackerEnabled = badgeDueDateTrackerEnabled;
    }

    async load() {
        await this.fetchBadgeDueDateTrackerExperimentAssignment();
    }

    async fetchUserAssignments(orgId: number) {
        this.assignmentsIsFetching = true;
        this.assignmentsFetchHasErrored = false;
        try {
            const params = {
                'fields[organization_course_assignment]': '@all',
            };
            const response = await udApi.get(`/users/me/assignments/`, {params});
            const results = response?.data.results;
            const assignments: UserAssignment[] = [];
            for (const result of results) {
                assignments.push({
                    id: result.id,
                    relatedObjectId: result.related_object_id,
                    relatedObjectType: result.related_object_type,
                    orgId,
                    dueDate: result.due_date,
                    assignedBy: result.assigned_by,
                    assignedTo: result.assigned_to,
                });
            }
            return assignments;
        } catch (e) {
            Raven.captureException(e);
            this.assignmentsFetchHasErrored = true;
        } finally {
            this.assignmentsIsFetching = false;
        }
    }

    @autobind
    @action
    setUserAssignments(assignments: UserAssignment[]) {
        this.userAssignments = assignments;
    }

    @autobind
    async loadUserAssignments(orgId: number) {
        const assignments = await this.fetchUserAssignments(orgId);
        if (assignments) {
            this.setUserAssignments(assignments);
        }
    }

    async createUserAssignment(assigment: UserAssignment) {
        this.assignmentIsCreating = true;
        this.assignmentCreateHasErrored = false;
        try {
            const data = {
                resource_id: assigment.relatedObjectId,
                resource_type: assigment.relatedObjectType,
                due_date: assigment.dueDate,
            };
            await udApi.post(`/users/me/assignments/`, data);
        } catch (e) {
            Raven.captureException(e);
            this.assignmentCreateHasErrored = true;
        } finally {
            this.assignmentIsCreating = false;
        }
    }

    async updateUserAssignment(assigment: UserAssignment, newDueDate: string) {
        this.assignmentIsUpdating = true;
        this.assignmentUpdateHasErrored = false;

        try {
            const data = {
                due_date: newDueDate,
                assigned_to: assigment.assignedTo,
                assigned_by: assigment.assignedBy,
                related_object_id: assigment.relatedObjectId,
            };
            await udApi.put(`/users/me/assignments/${assigment.id}/`, data);
        } catch (e) {
            Raven.captureException(e);
            this.assignmentUpdateHasErrored = true;
        } finally {
            this.assignmentIsUpdating = false;
        }
    }

    async deleteUserAssignment(assigment: UserAssignment) {
        this.assignmentIsDeleting = true;
        this.assignmentDeleteHasErrored = false;
        try {
            await udApi.delete(`/users/me/assignments/${assigment.id}`);
        } catch (e) {
            Raven.captureException(e);
            this.assignmentDeleteHasErrored = true;
        } finally {
            this.assignmentIsDeleting = false;
        }
    }

    async fetchBadgeDueDateTrackerExperimentAssignment() {
        try {
            const featureVariantAssignmentsQuery: FeatureVariantAssignmentsQuery = await useFeatureVariantAssignmentsQuery.fetcher(
                {
                    featureCodes: ['cert_due_date_tracker'],
                },
            )();
            const response =
                featureVariantAssignmentsQuery.featureVariantAssignmentsByCodeAndAttributes[0];
            this.setBadgeDueDateTrackerEnabled(
                response.configuration.enableCertDueDateTracker ?? false,
            );
        } catch (e) {
            Raven.captureException(e);
            this.setBadgeDueDateTrackerEnabled(false);
        }
    }
}
