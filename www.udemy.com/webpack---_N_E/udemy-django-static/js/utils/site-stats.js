import getConfigData from "udemy-django-static/js/utils/get-config-data";
import { formatNumber } from "udemy-django-static/js/utils/numeral";
/**
 * Please keep these implementations in sync with the backend equivalent:
 * udemy/site_stats/templatetags/site_stats.py.
 */
export function getOrgNumericSiteStat(statName, udDataOverrides = {}) {
  const siteStats = udDataOverrides.site_stats || UD.site_stats;
  const stat = siteStats.organizations[statName];
  return typeof stat === "number" ? formatNumber(stat) : stat;
}

export function getNumericSiteStat(statName, udDataOverrides = {}) {
  const udConfig = udDataOverrides.Config || getConfigData();
  const siteStats = udDataOverrides.site_stats || UD.site_stats;
  let stat = siteStats.default[statName];
  if (udConfig.brand.has_organization && statName in siteStats.organizations) {
    stat = siteStats.organizations[statName];
  }
  return typeof stat === "number" ? formatNumber(stat) : stat;
}
