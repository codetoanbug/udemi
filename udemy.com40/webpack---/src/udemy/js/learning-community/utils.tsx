import {ExpressiveIconName} from '@udemy/icons-expressive';
import {AvatarUser} from '@udemy/react-core-components';
import {UDData} from '@udemy/ud-data';

import {Reason, ReasonType, User, UserProfile} from './types';

export function getReasonText(reason: Reason) {
    if (reason.type === ReasonType.Other) return reason.text;
    return getReasonLabel(reason.type);
}

export function getReasonLabel(reasonType: ReasonType) {
    switch (reasonType) {
        case ReasonType.StudyForACertificate:
            return gettext('Study for a certification');
        case ReasonType.CompanyWideTransformationInitiate:
            return gettext('Company-wide transformation initiative');
        case ReasonType.LearnNewSkillsTogetherWithOthers:
            return gettext('Learn new skills together with others');
        case ReasonType.ComplianceTraining:
            return gettext('Compliance training');
        case ReasonType.OnboardingANewTeam:
            return gettext('Onboarding a new team');
        default:
            return gettext('Other');
    }
}

export function getReasonIcon(reasonType: ReasonType) {
    switch (reasonType) {
        case ReasonType.StudyForACertificate:
            return ExpressiveIconName[ExpressiveIconName.indexOf('certificate')];
        case ReasonType.CompanyWideTransformationInitiate:
            return ExpressiveIconName[ExpressiveIconName.indexOf('hands-on-practice')];
        case ReasonType.LearnNewSkillsTogetherWithOthers:
            return ExpressiveIconName[ExpressiveIconName.indexOf('learning-together')];
        case ReasonType.ComplianceTraining:
            return ExpressiveIconName[ExpressiveIconName.indexOf('hands-on-learning')];
        case ReasonType.OnboardingANewTeam:
            return ExpressiveIconName[ExpressiveIconName.indexOf('soft-skills')];
        default:
            return ExpressiveIconName[ExpressiveIconName.indexOf('team-training-2')];
    }
}

export const ReasonTypesOrdered = [
    ReasonType.StudyForACertificate,
    ReasonType.CompanyWideTransformationInitiate,
    ReasonType.LearnNewSkillsTogetherWithOthers,
    ReasonType.ComplianceTraining,
    ReasonType.OnboardingANewTeam,
    ReasonType.Other,
];

export function getProfileDisplayName(profile: Pick<UserProfile, 'name' | 'surname'>) {
    return `${profile.name} ${profile.surname}`;
}

export function getProfileInitials(profile: Pick<UserProfile, 'name' | 'surname'>) {
    if (!profile.name && !profile.surname) return undefined;
    if (!profile.surname) return profile.name.slice(0, 2).toUpperCase();
    if (!profile.name) return profile.surname.slice(0, 2).toUpperCase();
    return `${profile.name[0]}${profile.surname[0]}`.toUpperCase();
}

export function getAvatarUser(udData: UDData, user: User): AvatarUser {
    return {
        id: user.id,
        display_name: getProfileDisplayName(user.profile),
        initials: getProfileInitials(user.profile),
        image_75x75: user.profile.image,
    };
}

export function distinct<T>(item: T, index: number, self: T[]) {
    return self.indexOf(item) === index;
}
