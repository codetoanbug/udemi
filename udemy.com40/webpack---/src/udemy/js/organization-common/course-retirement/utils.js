import {toLocaleDateString} from '@udemy/shared-utils';

// eslint-disable-next-line import/prefer-default-export
export function retirementDateFormat(retirementDate) {
    return toLocaleDateString(new Date(retirementDate), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
