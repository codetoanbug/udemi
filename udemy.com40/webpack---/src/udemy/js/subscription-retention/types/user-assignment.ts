export interface UserAssignment {
    id?: number;
    relatedObjectId: number;
    relatedObjectType: AssignmentRelatedObjectType;
    orgId: number;
    dueDate: string;
    assignedTo: number;
    assignedBy: number;
}

export const enum AssignmentRelatedObjectType {
    COURSE = 'course',
    OPEN_BADGE = 'open_badge',
}
