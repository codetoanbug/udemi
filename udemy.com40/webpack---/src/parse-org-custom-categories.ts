import {UDData} from '@udemy/ud-data';

export function parseOrgCustomCategories(browse: UDData['browse']) {
    return browse?.org_custom_categories || [];
}
