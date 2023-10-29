import {observable} from 'mobx';

import {toLocaleDateString} from 'utils/date';
import {APIModel} from 'utils/mobx';

export default class AutoAssignRuleModel extends APIModel {
    @observable isActive;

    get apiDataMap() {
        return {
            id: 'id',
            resource: 'resource',
            resourceType: 'resource_type',
            message: 'message',
            groupTitle: 'group_title',
            isActive: 'is_active',
            due: 'due',
            lastAssigned: 'last_assigned',
            organizationId: 'organization_id',
        };
    }

    get assignedToText() {
        return this.groupTitle ? this.groupTitle : gettext('Unavailable group');
    }

    get statusText() {
        return this.isActive ? gettext('Active') : gettext('Deactivated');
    }

    get dueText() {
        if (this.due) {
            if (typeof this.due == 'number') {
                return interpolate(
                    ngettext('After %(number)s day', 'After %(number)s days', this.due),
                    {number: this.due},
                    true,
                );
            }
            return toLocaleDateString(new Date(this.due), {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }

        return '';
    }

    get lastAssignedDate() {
        if (this.lastAssigned) {
            return toLocaleDateString(new Date(this.lastAssigned.created), {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }
        return '';
    }

    get lastAssigner() {
        if (this.lastAssigned && this.lastAssigned.assigned_by) {
            return interpolate(
                gettext('by %(name)s'),
                {name: this.lastAssigned.assigned_by.display_name},
                true,
            );
        }
        return '';
    }
}
