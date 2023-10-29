import getConfigData from 'utils/get-config-data';
import {formatNumber} from 'utils/numeral';

const SITE_STATS = UD.site_stats;

/**
 * Please keep these implementations in sync with the backend equivalent:
 * udemy/site_stats/templatetags/site_stats.py.
 */

export function getOrgNumericSiteStat(statName, udDataOverrides = {}) {
    const siteStats = udDataOverrides.site_stats || SITE_STATS;
    const stat = siteStats.organizations[statName];
    return typeof stat === 'number' ? formatNumber(stat) : stat;
}

export function getNumericSiteStat(statName, udDataOverrides = {}) {
    const udConfig = udDataOverrides.Config || getConfigData();
    const siteStats = udDataOverrides.site_stats || SITE_STATS;
    let stat = siteStats.default[statName];
    if (udConfig.brand.has_organization && statName in siteStats.organizations) {
        stat = siteStats.organizations[statName];
    }
    return typeof stat === 'number' ? formatNumber(stat) : stat;
}
