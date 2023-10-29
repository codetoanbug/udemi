import {LICENSE_TYPE} from 'organization-common/constants';
import udLink from 'utils/ud-link';

export const ASSIGN_PRO_LICENSE = gettext('Assign Pro license');
export const ASSIGN_PRO_LICENSES = gettext('Assign Pro licenses');
export const REMOVE_PRO_LICENSE = gettext('Remove Pro license');

export const WARNING_TITLE_MAX_LICENSES_EXCEEDED = gettext(
    'You reached the maximum number of available licenses.',
);
export const WARNING_TITLE_PRO_AND_DEACTIVATED = gettext(
    'Some of the selected users have already an assigned Pro license or are deactivated.',
);
export const WARNING_TITLE_DEACTIVATED_ONLY = gettext(
    'Some of the selected users are deactivated, and they can not be assigned Pro licenses.',
);
export const WARNING_TITLE_PRO_ONLY = gettext(
    'Some of the selected users have already an assigned Pro license.',
);
export const WARNING_TITLE_PRO_AND_DEACTIVATED_ALL = gettext(
    'All of the selected users have a Pro license assigned or are deactivated.',
);
export const WARNING_TITLE_DEACTIVATED_ONLY_ALL = gettext(
    'All of the selected users are deactivated, and they can not be assigned Pro licenses.',
);
export const WARNING_TITLE_PRO_ONLY_ALL = gettext(
    'All of the selected users have a Pro license assigned.',
);
export const WARNING_BODY_MAX_LICENSES_EXCEEDED_LINK = udLink.to(
    'support',
    '115005396128-Adding-More-Licenses-to-Your-Account-',
);
export const WARNING_BODY_DEFAULT = gettext('Please select active users without a Pro license.');
export const WARNING_BODY_PRO = gettext(
    'You can see below the list of users who will get a Pro license.',
);

export const PRO_LICENSE_TYPE = 'Pro';
export const LICENSE_SERVICE_UNAVAILABLE = gettext('Unavailable');

export const LICENSE_TYPE_STRING_REPRESENTATION = Object.freeze({
    [LICENSE_TYPE.UNSPECIFIED]: gettext('No license'),
    [LICENSE_TYPE.ENTERPRISE]: gettext('Enterprise'),
    [LICENSE_TYPE.PRO]: gettext('Pro'),
});
