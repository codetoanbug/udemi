// These enums are defined in udemy/course_label/models.py.  Please keep the definitions in sync
export const ASSIGNMENT_APPROVAL_STATUS = {
    unapproved: 0,
    approved: 1,
    escalated: 2,
};

export const enum Inject {
    USER_GROUPS = 'userGroups',
    ROUTES = 'routes',
    SCHEMA_SERVICE = 'schemaService',
    GT_INSTANCE_SERVICE = 'gtInstanceService',
}
