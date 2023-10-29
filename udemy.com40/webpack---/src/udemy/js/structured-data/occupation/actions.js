import {
    ACTION_TYPES,
    BaseUnassignGTInstanceAction,
    BaseAssignGTInstanceAction,
    DEFAULT_ASSIGNMENT_TYPE,
} from 'tapen/structured-data-search-admin/generic-tag/assignment/edit/actions';

export const MARKETPLACE_DISCOVERY_ASSIGNMENT_LOCATION =
    'marketplace:discovery:occupation-collection';
export const UB_DISCOVERY_ASSIGNMENT_LOCATION = 'ub:occupation-collection';

export const OCCUPATION_ASPIRING_ASSIGNMENT_TYPE = 'Aspiring';
export const OCCUPATION_ADVANCING_ASSIGNMENT_TYPE = 'Advancing';
export const OCCUPATION_ASPIRING_MANAGER_ASSIGNMENT_TYPE = 'Aspiring manager';
export const OCCUPATION_ADVANCING_MANAGER_ASSIGNMENT_TYPE = 'Advancing manager';

// TODO: slip 'manager' instance ID and assignment type ids into grouped_occupation output
// so we don't have to hard-code them
// https://udemyjira.atlassian.net/browse/TM-1531
export const OCCUPATION_ASSIGNMENT_TYPES = {
    [OCCUPATION_ADVANCING_ASSIGNMENT_TYPE]: {id: 8, name: OCCUPATION_ADVANCING_ASSIGNMENT_TYPE},
    [OCCUPATION_ASPIRING_ASSIGNMENT_TYPE]: {id: 10, name: OCCUPATION_ASPIRING_ASSIGNMENT_TYPE},
};
export const MANAGER = {
    id: 1232,
    typeName: 'gtinstance',
};
export const GT_ASSIGNMENT_SOURCE_RAW = 'raw';

export class UserEntityAssignAction extends BaseAssignGTInstanceAction {
    constructor(
        entity,
        gtInstance,
        location,
        assignmentType = DEFAULT_ASSIGNMENT_TYPE,
        assignmentStatus = '',
    ) {
        super(
            ACTION_TYPES.user_entity_assign,
            entity,
            gtInstance,
            location,
            assignmentType,
            assignmentStatus,
        );
    }
}

export class OccupationUserUpsertAction extends BaseAssignGTInstanceAction {
    constructor(
        entity,
        gtInstance,
        location,
        selectedFocus,
        assignmentType = DEFAULT_ASSIGNMENT_TYPE,
        assignmentStatus = '',
    ) {
        super(
            ACTION_TYPES.occupation_user_upsert,
            entity,
            gtInstance,
            location,
            assignmentType,
            assignmentStatus,
        );

        this.options.selectedFocus = selectedFocus;
    }

    _serialize() {
        return {
            gt_instance: {
                type_name: this.options.gtInstance.typeName,
                id: this.options.gtInstance.id,
            },
            gt_assignment_type: {
                id: this.options.assignmentType.id,
            },
            entity: {
                id: this.options.entity.id,
                model: this.options.entity.type,
                app: this.options.entity.app,
            },
            location: this.options.location,
            status: this.options.assignmentStatus,
            selected_focus: this.options.selectedFocus,
        };
    }
}

export class UserEntityUnassignAction extends BaseUnassignGTInstanceAction {
    constructor(
        entity,
        gtInstance,
        assignmentType = DEFAULT_ASSIGNMENT_TYPE,
        assignmentStatus = '',
    ) {
        super(
            ACTION_TYPES.user_entity_unassign,
            entity,
            gtInstance,
            assignmentType,
            assignmentStatus,
        );
    }
}
