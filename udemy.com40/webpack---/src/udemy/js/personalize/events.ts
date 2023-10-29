import {ClientEvent} from '@udemy/event-tracking';

import {Badge} from 'open-badges/common/utils/event-helpers';

/**
 * Fired when a user selects and saves an occupation group from the learner goal collection onboarding flow.
 */
class LearningForOccupationGroupSavedEvent extends ClientEvent {
    private occupationGroupId: number | null;
    private isOnboarding: boolean;
    constructor({
        occupationGroupId = null,
        isOnboarding,
    }: {
        occupationGroupId: number | null;
        isOnboarding: boolean;
    }) {
        super('LearningForOccupationGroupSaved');
        this.occupationGroupId = occupationGroupId;
        this.isOnboarding = isOnboarding;
    }
}

/**
 * Fired when a user selects and saves their management status from the learner goal collection onboarding flow.
 */
class IsManagerRoleSavedEvent extends ClientEvent {
    private isManager: boolean;
    private isOnboarding: boolean;
    constructor({isManager, isOnboarding}: {isManager: boolean; isOnboarding: boolean}) {
        super('IsManagerRoleSaved');
        this.isManager = isManager;
        this.isOnboarding = isOnboarding;
    }
}

/**
 * Fired when a user selects and saves skills of interest from the learner goal collection onboarding flow.
 */
class SkillInterestsSavedEvent extends ClientEvent {
    private topicIds: Array<number>;
    private isOnboarding: boolean;
    constructor({topicIds, isOnboarding}: {topicIds: Array<number>; isOnboarding: boolean}) {
        super('SkillInterestsSaved');
        this.topicIds = topicIds;
        this.isOnboarding = isOnboarding;
    }
}

/**
 * Fired when a user selects and saves certifications of interest from the learner goal collection onboarding flow.
 */
class CertificationInterestsSavedEvent extends ClientEvent {
    private topicIds: Array<number>;
    private isOnboarding: boolean;
    constructor({topicIds, isOnboarding}: {topicIds: Array<number>; isOnboarding: boolean}) {
        super('CertificationInterestsSaved');
        this.topicIds = topicIds;
        this.isOnboarding = isOnboarding;
    }
}

/**
 * Fired when the user selects "View certification interests" after adding/removing a badge to/from their interests.
 */
class ViewCertificationInterestsSelected extends ClientEvent {
    constructor() {
        super('ViewCertificationInterestsSelected');
    }
}

/**
 * Fired when a badge is presented to the user.
 */
class BadgePresented extends ClientEvent {
    private badgeId: number;
    private badgeClass?: Badge;
    private sourcePageId?: number;

    constructor({
        badgeId,
        badgeClass,
        sourcePageId,
    }: {
        badgeId: number;
        badgeClass?: Badge;
        sourcePageId?: number;
    }) {
        super('BadgePresented');
        this.badgeId = badgeId;
        this.badgeClass = badgeClass;
        this.sourcePageId = sourcePageId;
    }
}

/**
 * Fired when a user selects and saves an occupation from the learner goal collection onboarding flow.
 */
class LearningForOccupationSavedEvent extends ClientEvent {
    private occupationId: number | null;
    private isCustom: boolean;
    private isOnboarding: boolean;
    constructor({
        occupationId = null,
        isCustom,
        isOnboarding,
    }: {
        occupationId: number | null;
        isCustom: boolean;
        isOnboarding: boolean;
    }) {
        super('LearningForOccupationSaved');
        this.occupationId = occupationId;
        this.isCustom = isCustom;
        this.isOnboarding = isOnboarding;
    }
}

/**
 * Fired when a user makes a selection of a skill of interest from the learner goal collection onboarding flow.
 * This could be a skill that is suggested to them based on their occupation selection or from the typeahead field.
 */
class SkillInterestSelectedEvent extends ClientEvent {
    private topicId: number;
    private topicGroupId: number | null;
    private uiRegion: string;
    private isOnboarding: boolean;
    constructor({
        topicId,
        topicDescriptorId = null,
        uiRegion,
        isOnboarding,
    }: {
        topicId: number;
        topicDescriptorId: number | null;
        uiRegion: string;
        isOnboarding: boolean;
    }) {
        super('SkillInterestSelected');
        this.topicId = topicId;
        this.topicGroupId = topicDescriptorId;
        this.uiRegion = uiRegion;
        this.isOnboarding = isOnboarding;
    }
}

/**
 * Fired when a user makes a selection of a certification of interest from the learner goal collection onboarding flow.
 */
class CertificationInterestSelectedEvent extends ClientEvent {
    private topicId: number;
    private topicGroupId: number;
    private hasBadge: boolean;
    private uiRegion: string;
    private isOnboarding: boolean;
    constructor({
        topicId,
        topicDescriptorId,
        badge,
        uiRegion,
        isOnboarding,
    }: {
        topicId: number;
        topicDescriptorId: number;
        badge: boolean;
        uiRegion: string;
        isOnboarding: boolean;
    }) {
        super('CertificationInterestSelected');
        this.topicId = topicId;
        this.topicGroupId = topicDescriptorId;
        this.hasBadge = badge;
        this.uiRegion = uiRegion;
        this.isOnboarding = isOnboarding;
    }
}

class GoalCollectionExited extends ClientEvent {
    uiRegion: string;
    isOnboarding: boolean;
    constructor({uiRegion, isOnboarding}: {uiRegion: string; isOnboarding: boolean}) {
        super('GoalCollectionExited');
        this.uiRegion = uiRegion;
        this.isOnboarding = isOnboarding;
    }
}

class GoalCollectionStarted extends ClientEvent {
    isOnboarding: boolean;
    firstVisit: boolean;
    constructor({isOnboarding, firstVisit}: {isOnboarding: boolean; firstVisit: boolean}) {
        super('GoalCollectionStarted');
        this.isOnboarding = isOnboarding;
        this.firstVisit = firstVisit;
    }
}

class GoalCollectionCompleted extends ClientEvent {
    isOnboarding: boolean;
    constructor({isOnboarding}: {isOnboarding: boolean}) {
        super('GoalCollectionCompleted');
        this.isOnboarding = isOnboarding;
    }
}

class CannotFindOccupationSelected extends ClientEvent {
    isOnboarding: boolean;
    constructor({isOnboarding}: {isOnboarding: boolean}) {
        super('CannotFindOccupationSelected');
        this.isOnboarding = isOnboarding;
    }
}

/* export events in alphabetical order*/
export {
    BadgePresented,
    CannotFindOccupationSelected,
    CertificationInterestsSavedEvent,
    CertificationInterestSelectedEvent,
    GoalCollectionCompleted,
    GoalCollectionExited,
    GoalCollectionStarted,
    LearningForOccupationGroupSavedEvent,
    LearningForOccupationSavedEvent,
    IsManagerRoleSavedEvent,
    SkillInterestsSavedEvent,
    SkillInterestSelectedEvent,
    ViewCertificationInterestsSelected,
};
