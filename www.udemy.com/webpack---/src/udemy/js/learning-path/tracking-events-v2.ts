import {ClientEvent} from '@udemy/event-tracking';

export interface LearningPath {
    id: string;
    isPublicLearningPath: boolean;
    isUdemyPath: boolean;
}

export interface PathEnrollmentSource {
    id: string;
    type: 'lab' | 'assessment' | 'course' | 'section' | 'email' | 'lms';
    isDeeplink: boolean;
}

export class LearningPathCreated extends ClientEvent {
    constructor(readonly learningPath: LearningPath) {
        super('LearningPathCreated');
        this.learningPath = learningPath;
    }
}

export class LearningPathEdited extends ClientEvent {
    constructor(readonly learningPath: LearningPath) {
        super('LearningPathEdited');
        this.learningPath = learningPath;
    }
}

export class LearningPathDeleted extends ClientEvent {
    constructor(readonly learningPath: LearningPath) {
        super('LearningPathDeleted');
        this.learningPath = learningPath;
    }
}

export class LearningPathEnrolled extends ClientEvent {
    constructor(
        readonly learningPath: LearningPath,
        readonly pathEnrollmentSource: PathEnrollmentSource | null,
        readonly isAutoEnrolled: boolean,
        readonly userIsLearningPathEditor: boolean,
        readonly uiRegion: 'path_enroll_button' | 'context_menu' | null,
    ) {
        super('LearningPathEnrolled');
        this.learningPath = learningPath;
        this.pathEnrollmentSource = pathEnrollmentSource;
        this.isAutoEnrolled = isAutoEnrolled;
        this.userIsLearningPathEditor = userIsLearningPathEditor;
        this.uiRegion = uiRegion;
    }
}
export class LearningPathUnenrolled extends ClientEvent {
    constructor(readonly learningPath: LearningPath, readonly userIsLearningPathEditor: boolean) {
        super('LearningPathUnenrolled');
        this.learningPath = learningPath;
        this.userIsLearningPathEditor = userIsLearningPathEditor;
    }
}

export class LearningPathContentItemSelected extends ClientEvent {
    constructor(
        readonly learningPathId: number,
        readonly learningPath: LearningPath,
        readonly contentItemType: string,
        readonly contentItemId: number,
    ) {
        super('LearningPathContentItemSelected');
        this.learningPathId = learningPathId;
        this.learningPath = learningPath;
        this.contentItemType = contentItemType;
        this.contentItemId = contentItemId;
    }
}

export class LearningPathReturnSelected extends ClientEvent {
    constructor(
        readonly learningPath: LearningPath,
        readonly contentItemType: string,
        readonly contentItemId: number,
    ) {
        super('LearningPathReturnSelected');
        this.learningPath = learningPath;
        this.contentItemType = contentItemType;
        this.contentItemId = contentItemId;
    }
}
