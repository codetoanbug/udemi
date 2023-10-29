import React from 'react';

import {formatNumber, useI18n} from '@udemy/i18n';

import {UDData} from '../types';
import {useUDData} from '../use-ud-data';

/**
 * Please keep these implementations in sync with the backend equivalent:
 * udemy/site_stats/templatetags/site_stats.py.
 */

export function getNumericSiteStat(udData: UDData, locale: string, statName: string) {
    let stat = udData.site_stats.default[statName];
    if (udData.Config.brand.has_organization && statName in udData.site_stats.organizations) {
        stat = udData.site_stats.organizations[statName];
    }
    return typeof stat === 'number' ? formatNumber(stat, locale) : stat;
}

export function getOrgNumericSiteStat(udData: UDData, locale: string, statName: string) {
    const stat = udData.site_stats.organizations[statName];
    return typeof stat === 'number' ? formatNumber(stat, locale) : stat;
}

export function useSiteStats() {
    const udData = useUDData();
    const {locale} = useI18n();

    const _getNumericSiteStat = React.useCallback(
        (statName: string) => getNumericSiteStat(udData, locale, statName),
        [locale, udData],
    );

    const _getOrgNumericSiteStat = React.useCallback(
        (statName: string) => getOrgNumericSiteStat(udData, locale, statName),
        [locale, udData],
    );

    return {
        getNumericSiteStat: _getNumericSiteStat,
        getOrgNumericSiteStat: _getOrgNumericSiteStat,
    };
}
