import {LocalizedHtml} from '@udemy/i18n';
import React from 'react';

import {LICENSE_TYPE} from 'organization-common/constants';
import {toLocaleDateString} from 'utils/date';
import getConfigData from 'utils/get-config-data';

import {
    LICENSE_SERVICE_UNAVAILABLE,
    LICENSE_TYPE_STRING_REPRESENTATION,
} from './licenses/constants';

const udConfig = getConfigData();

// eslint-disable-next-line import/prefer-default-export
export function getSCIMProvider() {
    return (
        (udConfig.brand.organization && udConfig.brand.organization.scim_provider_name) || 'SCIM'
    );
}

export function getLicenseTypesForUserAttribute(user) {
    let licenseTypes;

    if (!user?.license_types) {
        licenseTypes = [LICENSE_SERVICE_UNAVAILABLE];
    }
    if (user?.license_types?.length) {
        licenseTypes = getLicenseTypes(user.license_types);
    }
    if (!licenseTypes?.length) {
        licenseTypes = [LICENSE_TYPE_STRING_REPRESENTATION[LICENSE_TYPE.UNSPECIFIED]];
    }

    return licenseTypes;
}

export function getLicenseTypes(licenseTypes) {
    const licenses = licenseTypes
        ?.filter((licenseType) => licenseType in LICENSE_TYPE_STRING_REPRESENTATION)
        .map((licenseType) => LICENSE_TYPE_STRING_REPRESENTATION[licenseType])
        .sort();

    return licenses || [];
}

export function buildInvitationMessage(emails, gettext) {
    if (emails.length === 1) {
        return (
            <LocalizedHtml
                html={interpolate(
                    gettext(
                        'An invitation to join your account has been sent to <span class="address">%(email)s</span>',
                    ),
                    {email: [emails[0]]},
                    true,
                )}
                interpolate={{
                    address: <span style={{wordBreak: 'break-all'}} />,
                }}
            />
        );
    }

    return interpolate(
        gettext('%(recipientsCount)s invitations to join your account have been sent'),
        {recipientsCount: emails.length},
        true,
    );
}

export async function fetchManageUsersInfo(
    routerStore,
    licenseStore,
    organizationGroupsStore,
    searchStore,
) {
    await Promise.all([
        licenseStore.fetchLicenseInformation(),
        organizationGroupsStore.fetchCounts(),
        organizationGroupsStore.fetchGroups(),
    ]);

    if (routerStore.isInvitationPage) {
        searchStore.fetchUsers();
    }
}

export function getFormattedJoinedDate(user) {
    if (user.joined_date === undefined) {
        return gettext('Unavailable');
    }

    if (user.joined_date === null) {
        return gettext('Not joined');
    }

    const date = new Date(user.joined_date);

    return toLocaleDateString(date);
}
