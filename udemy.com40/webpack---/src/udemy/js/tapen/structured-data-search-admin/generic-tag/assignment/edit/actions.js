import SDAction from 'tapen/structured-data-search-admin/search-admin/sd-action';

export const ACTION_TYPES = {
    assign_gt_instance: 'assign_gt_instance',
    unassign_gt_instance: 'unassign_gt_instance',
    user_entity_assign: 'user_entity_assign',
    user_entity_unassign: 'user_entity_unassign',
    unassign_occupation: 'unassign_occupation',
    assign_management_to_user: 'assign_management_to_user',
    unassign_management_from_user: 'unassign_management_from_user',
    occupation_user_upsert: 'occupation_user_upsert',
};

// for GT assignment actions
export const DEFAULT_ASSIGNMENT_TYPE = {id: 2, name: 'default'};
export const APPROVED_ASSIGNMENT_STATUS = 'approved';
export const UNAPPROVED_ASSIGNMENT_STATUS = 'unapproved';
export const ESCALATED_ASSIGNMENT_STATUS = 'escalated';

export const COURSE_EDIT_LOCATION = 'structured_data:course_edit_admin';
export const CHAPTER_ASSIGNMENT_LOCATION = 'structured_data:chapter_assignment_admin';
export const ENTITY_EDIT_LOCATION = 'structured_data:entity_edit_admin';

export const COURSE_ENTITY = {
    TYPE: 'Course',
    APP: 'course',
};
export const CHAPTER_ENTITY = {
    TYPE: 'Chapter',
    APP: 'curriculum',
};
export const USER_ENTITY = {
    TYPE: 'User',
    APP: 'user',
};

export const GT_INSTANCE_TYPE_NAME = 'gtinstance';
export const COURSE_LABEL_TYPE_NAME = 'topic';

export const GTINSTANCE_ENTITY = {
    TYPE: GT_INSTANCE_TYPE_NAME,
    APP: 'generic_tag',
};

export class BaseAssignGTInstanceAction extends SDAction {
    constructor(
        actionType,
        entity,
        gtInstance,
        location,
        assignmentType = DEFAULT_ASSIGNMENT_TYPE,
        assignmentStatus = '',
    ) {
        super(actionType);
        this.options = {
            entity,
            gtInstance,
            location,
            assignmentType,
            assignmentStatus,
        };
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
        };
    }

    toString() {
        const {entity, gtInstance, assignmentType} = this.options;
        return `Assign '${gtInstance.schema.name}/${gtInstance.defaultName} (${
            assignmentType.name
        })' to ${this.getEntityType(entity)}.`;
    }
}

export class BaseUnassignGTInstanceAction extends SDAction {
    constructor(
        actionType,
        entity,
        gtInstance,
        assignmentType = DEFAULT_ASSIGNMENT_TYPE,
        assignmentStatus = '',
    ) {
        super(actionType);
        this.options = {
            entity,
            gtInstance,
            assignmentType,
            assignmentStatus,
        };
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
            status: this.options.assignmentStatus,
        };
    }

    toString() {
        const {entity, gtInstance, assignmentType} = this.options;
        return `Unassign '${gtInstance.schema.name}/${gtInstance.defaultName} (${
            assignmentType.name
        })' from ${this.getEntityType(entity)}.`;
    }
}

export class AssignGTInstanceAction extends BaseAssignGTInstanceAction {
    constructor(
        entity,
        gtInstance,
        location,
        assignmentType = DEFAULT_ASSIGNMENT_TYPE,
        assignmentStatus = '',
    ) {
        super(
            ACTION_TYPES.assign_gt_instance,
            entity,
            gtInstance,
            location,
            assignmentType,
            assignmentStatus,
        );
    }
}

export class UnassignGTInstanceAction extends BaseUnassignGTInstanceAction {
    constructor(
        entity,
        gtInstance,
        assignmentType = DEFAULT_ASSIGNMENT_TYPE,
        assignmentStatus = '',
    ) {
        super(
            ACTION_TYPES.unassign_gt_instance,
            entity,
            gtInstance,
            assignmentType,
            assignmentStatus,
        );
    }
}
