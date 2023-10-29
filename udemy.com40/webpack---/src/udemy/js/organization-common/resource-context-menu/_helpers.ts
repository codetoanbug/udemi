import {Tracker} from '@udemy/event-tracking';

import {RESOURCE_TYPES} from 'organization-common/constants';

import getConfigData from '../../utils/get-config-data';
import {OrganizationResourceMenuItemClickEvent} from './events';

interface ResourcePropsType {
    resourceType: typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];
    resourceId: number;
}

interface GlobalOverridesType {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Config: {
        brand: {
            has_organization: boolean;
        };
    };
}

export function trackClickAction(
    context: string,
    label: string,
    resourceProps: ResourcePropsType,
    globalOverrides?: GlobalOverridesType,
) {
    const udConfig = globalOverrides?.Config ?? getConfigData();
    if (udConfig.brand.has_organization) {
        Tracker.publishEvent(
            new OrganizationResourceMenuItemClickEvent({
                actionDescription: label,
                ...resourceProps,
            }),
        );
    }
}
