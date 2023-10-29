import udLink from 'utils/ud-link';

import * as insightLinks from '../organization-insights/links';

export const PACKAGE_PLANS = {
    TEAM: 'Team',
    ENTERPRISE: 'Enterprise',
};

export const USER_ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    GROUP_ADMIN: 'group_admin',
    STUDENT: 'student',
};

export const UFB_ROUTES = {
    home: '/organization/home/',
    invite: '/organization-manage/users/invite/',
    orgManageBillingPayment: '/organization-manage/settings/billing/payment/',
};

export const BENESSE_BASE_URL = 'https://www.benesse.co.jp/udemy/biz/';
export const UDEMYKOREA_BUSINESS_PATH = 'https://udemy.wjtb.co.kr/insight/index';

export const UDEMYKOREA_BUSINESS_DEMO_PATH = 'https://info.udemy.com/KR_ContactUs.html';
export const UDEMY_BUSINESS_PATH = '/udemy-business/';
export const BUSINESS_SIGNUP_URL = `${UDEMY_BUSINESS_PATH}sign-up/`;

export const UFB_TRIAL_EXTENSION_SIGN_UP_URL = `${BUSINESS_SIGNUP_URL}?ref=ufb_trial_extension_request`;

export const TEAM_PLAN_V2_UPSELL = '/payment/upsell-teamplan/';

export const buyMoreLicensesLink = (plan) => {
    const links = {
        [PACKAGE_PLANS.TEAM]: '/organization-manage/settings/billing/payment/',
        [PACKAGE_PLANS.ENTERPRISE]: udLink.toSupportLink('adding_more_licenses', true),
    };
    return links[plan];
};

export const buyMoreLicensesLinkV2 = (plan, isTeamPlanV2) => {
    if (isTeamPlanV2) {
        return TEAM_PLAN_V2_UPSELL;
    }
    const links = {
        [PACKAGE_PLANS.TEAM]: '/organization-manage/settings/billing/payment/',
        [PACKAGE_PLANS.ENTERPRISE]: udLink.toSupportLink('adding_more_licenses', true),
    };
    return links[plan];
};

export const HTTP_429_TOO_MANY_REQUESTS = 429;

export const RESOURCE_TYPES = Object.freeze({
    COURSE: 'course',
    LEARNING_PATH: 'learning_path',
    LAB: 'lab',
    ASSESSMENT: 'adaptive_assessment_assessment',
    BADGE_ASSERTION: 'assertion',
});

export const resourceRedirectURL = (resourceId) => ({
    [RESOURCE_TYPES.COURSE]: insightLinks.absolute(insightLinks.toCourseDetails(resourceId)),
    [RESOURCE_TYPES.LEARNING_PATH]: insightLinks.absolute(insightLinks.toPathDetails(resourceId)),
    [RESOURCE_TYPES.LAB]: insightLinks.absolute(insightLinks.toProInsights()),
    [RESOURCE_TYPES.ASSESSMENT]: insightLinks.absolute(insightLinks.toProInsights()),
});

export const RESOURCE_URL_SLUGS = Object.freeze({
    [RESOURCE_TYPES.COURSE]: 'courses',
    [RESOURCE_TYPES.LEARNING_PATH]: 'paths',
    [RESOURCE_TYPES.LAB]: 'labs',
    [RESOURCE_TYPES.ASSESSMENT]: 'assessments',
    [RESOURCE_TYPES.BADGE_ASSERTION]: 'assertions',
});

export const USER_CLASS = 'user';
export const ORGANIZATION_GROUP_CLASS = 'organization_group';
export const ALL_USERS_LABEL = 'all_users';

export const LICENSE_TYPE = Object.freeze({
    UNSPECIFIED: 0,
    ENTERPRISE: 1,
    PRO: 2,
});
