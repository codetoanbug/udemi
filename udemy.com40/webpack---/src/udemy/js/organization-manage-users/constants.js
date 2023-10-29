import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import {getSCIMProvider} from './utils';

const udConfig = getConfigData();

export const udemyProduct = udConfig.brand.product_name;

export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 12;
export const DISPLAY_NUMBER_USER_GROUPS = 2;
export const GROUP_NAME_MAX_SIZE = 100;

export const ROLE_STUDENT = 'student';
export const ROLE_ADMIN = 'admin';
export const ROLE_GROUP_ADMIN = 'group_admin';

export const GROUPS_ALL_USERS = 'all-users';
export const GROUPS_ALL_MY_GROUPS_USERS = 'my-users';
export const GROUPS_PENDING_INVITATIONS = 'pending-invitations';
export const GROUPS_NOT_IN_GROUP = 'not-in-group';
export const GROUPS_TO_DISPLAY_INITIAL_STEP_SIZE = 12;
export const GROUPS_TO_DISPLAY_STEP_SIZE = 50;
export const COMMON_GROUPS = [GROUPS_ALL_USERS, GROUPS_ALL_MY_GROUPS_USERS, GROUPS_NOT_IN_GROUP];
export const GROUPS_ALL_MY_GROUPS_USERS_MESSAGE = gettext('My users');
export const GROUPS_NOT_IN_GROUP_MESSAGE = gettext('Not in a group');

export const SCIM_GROUPS_WARNING = interpolate(
    gettext(
        'Group Admins can invite/deactivate users in %(udemyProduct)s groups that are not managed by %(scimProvider)s.',
    ),
    {udemyProduct, scimProvider: getSCIMProvider()},
    true,
);

export const SCIM_GROUPS_EXCLUDED_WARNING = interpolate(
    gettext(
        'This list excludes %(scimProvider)s managed groups this user is not a member of. Manage membership of these groups through %(scimProvider)s.',
    ),
    {scimProvider: getSCIMProvider()},
    true,
);

export const SCIM_ALL_GROUPS_EXCLUDED_WARNING = interpolate(
    gettext(
        'This list excludes %(scimProvider)s managed groups. Manage membership of these groups through %(scimProvider)s.',
    ),
    {scimProvider: getSCIMProvider()},
    true,
);

export const DEFAULT_NUMBER_OF_INVITATION_EMAILS = 3;

export const USER_TYPE_ADMIN = 'admin';
export const USER_TYPE_GROUP_ADMIN = 'group_admin';
export const USER_TYPE_STUDENT = 'student';

export const INVITATION_SOURCE = {
    APPROVED_DOMAIN_SIGNUP: 'approved_domain_signup',
};

// Generic error message for email filled with no @
export const INVALID_EMAIL_ERROR = gettext(
    "This email is in an incorrect format. Please include an '@' and a valid domain.",
);

// We deny emails with + for trial organization to not abuse limited trial consumption
export const INVALID_EMAIL_ERROR_PLUS = gettext(
    "You cannot send invites to an email address with a '+' symbol",
);
// List or domains excluded from that rule (i.e. for our internal testing)
export const ALLOWED_PLUS_DOMAINS = ['udemy.com'];

// Deactivation-related constants
export const ORGANIZATION_HAS_USER_STATUS = {
    active: 'active',
    deactivated: 'deactivated',
    anonymized: 'anonymized',
    pending: 'pending',
};
export const DEACTIVATE_USER_ACTION = gettext('Deactivate user');

export const ANONYMOUS_USER_LABEL = 'Anonymized User';

export const BUY_MORE_LICENSES = gettext('Buy more licenses');
export const BUY_UFB = gettext('Buy Udemy Business');
// Error codes
export const NOT_ENOUGH_SEATS_LEFT_ERROR_CODE = 'not_enough_seats';
export const NOT_ENOUGH_PRO_LICENSES_LEFT_ERROR_CODE = 'not_enough_pro_licenses';
export const TOO_MANY_REQUESTS_ERROR_CODE = 'too_many_requests';

export const ANALYTICS_BUY_MORE_LICENSES_SIDEBAR = 'buy_more_licences_sidebar.link';
export const ANALYTICS_UPGRADE_TEAM_PLAN_SIDEBAR = 'upgrade_team_plan_sidebar.link';

export const SUPPORT_CENTER_NEW_TICKET_LINK = udLink.toSupportContact(520747);

export const SUPPORT_CENTER_DEACTIVATION_AND_ANONYMIZATION_LINK = udLink.to(
    'support',
    '360020224574',
);

export const SUPPORT_CENTER_HOW_TO_IMPORT_USER_CSV_LINK = udLink.to('support', '115005524008');

export const SUPPORT_CENTER_NAVIGATING_USER_MANAGEMENT = udLink.to('support', '115010386907');

export const SUPPORT_CENTER_MANAGE_GROUPS = udLink.to('support', '360060403113');

// TODO: Update this link to the correct article once it is written
export const SUPPORT_CENTER_LICENSE_POOLS = udLink.to('support', '888888888888');

export const SUPPORT_CENTER_WHAT_CAN_GROUP_ADMINS_DO = udLink.to('support', '360052160454');

export const MANAGE_USERS_ROUTE_PATH = '/organization-manage/users/';

export const MANAGE_USERS_MAIN_CONTENT_ID = 'sidebar-frame';
export const MANAGE_USERS_FOCUS_INPUT_ID = 'manage-users-filter-user';

export const DEFAULT_GROUP_BULK_MODAL_TITLE = gettext('Add to groups');

export const DEFAULT_GROUP_BULK_MODAL_FORM_LABEL = gettext(
    'Choose the groups that these users will be members of:',
);
export const DEFAULT_GROUP_BULK_MODAL_ERROR_MESSAGE = gettext(
    'An unknown error has happened, please refresh your browser and try again.',
);

export const VIEW_COURSE_INSIGHTS_MENU_ITEM_LABEL = gettext('View course insights');
export const VIEW_USER_ACTIVITY_MENU_ITEM_LABEL = gettext('View user activity');

export const OHU_STATUS_MAPPING = {
    [ORGANIZATION_HAS_USER_STATUS.active]: gettext('Active'),
    [ORGANIZATION_HAS_USER_STATUS.deactivated]: gettext('Deactivated'),
    [ORGANIZATION_HAS_USER_STATUS.pending]: gettext('SCIM provisioned'),
};

export const buyMoreLicensesText = (isTest, isTeamPlanV2) => {
    if (isTeamPlanV2) {
        return BUY_MORE_LICENSES;
    } else if (isTest) {
        return BUY_UFB;
    }
    return BUY_MORE_LICENSES;
};
