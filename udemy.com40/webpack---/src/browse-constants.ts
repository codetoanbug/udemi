import {I18nApi} from '@udemy/i18n';

import {BadgeNavItemType, LearningTypeNavItemType} from './events';

export interface BROWSE_LEARNING_TYPE {
    id: number;
    type: string;
    title: string;
    absolute_url: string;
}

export const BROWSE_TYPE = {
    CATEGORY: 'category',
    SUBCATEGORY: 'subcategory',
    TOPIC: 'course_label',
};

export const BROWSE_LEARNING_TYPES = (gettext: I18nApi['gettext']) => ({
    LABS: {
        id: 0,
        type: LearningTypeNavItemType.LABS,
        title: gettext('Labs'),
        absolute_url: '/labs/listing/',
    },
    ASSESSMENTS: {
        id: 1,
        type: LearningTypeNavItemType.ASSESSMENTS,
        title: gettext('Assessments'),
        absolute_url: '/skills-assessment/',
    },
    UDEMY_PRO_PATHS: {
        id: 2,
        type: LearningTypeNavItemType.UDEMY_PRO_PATHS,
        title: gettext('Udemy paths'),
        absolute_url: '/learning-paths/pro/',
    },
});

export const BADGING_NAV = (gettext: I18nApi['gettext']) => ({
    CERTIFICATIONS: {
        id: 0,
        type: BadgeNavItemType.CERTIFICATIONS,
        title: gettext('Certification preparation'),
        absolute_url: '/open-badges/',
    },
});
