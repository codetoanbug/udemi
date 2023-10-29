import {udExpiringLocalStorage} from '@udemy/shared-utils';

export function setupTooltipLocalStorage(tooltipType: string) {
    const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    return udExpiringLocalStorage('trialTooltip', tooltipType, expirationDate);
}
