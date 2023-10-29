import getConfigData from 'utils/get-config-data';
import {APIModel} from 'utils/mobx';
import udApi from 'utils/ud-api';

const udConfig = getConfigData();

export default class Assignment extends APIModel {
    get apiDataMap() {
        return {
            id: 'id',
            organization: {
                source: 'organization',
                defaultValue: udConfig.brand.organization,
            },
            assignedBy: {
                source: 'assigned_by',
                map: (assignedBy) => ({
                    id: assignedBy.id,
                    displayName: assignedBy.display_name,
                }),
                defaultValue: {id: undefined, displayName: undefined},
            },
            assignedTo: {
                source: 'assigned_to',
                map: (assignedTo) => ({
                    id: assignedTo.id,
                    displayName: assignedTo.display_name,
                    name: assignedTo.name,
                }),
                defaultValue: {id: undefined, displayName: undefined, name: undefined},
            },
            dueDate: 'due_date',
            canUnenrollUser: 'can_unenroll_user',
            resourceType: 'related_object_type',
        };
    }

    get url() {
        return `/organizations/${this.organization.id}/assignments/${this.id}/`;
    }

    unassign() {
        return udApi.delete(this.url).then(() => this.id);
    }
}
