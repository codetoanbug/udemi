import {UDData} from '@udemy/ud-data';

import {LabCardData} from 'browse/components/lab-card/types';
import Lab from 'labs/lab.mobx-model';
import getRequestData from 'utils/get-request-data';

/**
 * Helper function that is used lab-taking/discovery/lab-card and in `browse/components/lab-card`.
 *
 * Accepts a `lab` param that supports two different types depending on the lab
 * card that is invoking it.
 *
 * @param lab
 * @returns date
 */
export function getLabCompletionDate(lab: Lab | LabCardData, globalOverrides?: UDData) {
    if (!lab.isCompleted) {
        return '';
    }

    const udRequest = globalOverrides?.request ?? getRequestData();
    const userLocale = udRequest ? udRequest.locale.replace('_', '-') : 'en-US';
    const date = new Date(lab.enrollment?.lastAttemptedTime);

    return date.toLocaleDateString(userLocale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
