import {tokens, pxToRem} from '@udemy/styles';

export const pathMap = {
    'Amazon Web Services': {color: 'color-orange-300', id: 'aws'},
    'Google Cloud': {color: 'color-indigo-300', id: 'google'},
    'Microsoft Azure': {color: 'color-indigo-300', id: 'azure'},
    CompTIA: {color: 'color-red-300', id: 'comptia'},
    Security: {color: 'color-green-400', id: 'security'},
    Salesforce: {color: 'color-red-300', id: 'salesforce'},
    'Project Management': {color: 'color-green-300', id: 'project-management'},
    'Additional Resources': {color: 'color-red-400', id: 'other'},
    default: {color: 'color-green-400', id: 'default'},
};

export function pathConfig(path = 'default') {
    return pathMap[path as keyof typeof pathMap] || pathMap.default;
}

export function pathBarStyle(path: string) {
    const color = pathConfig(path).color;
    return {borderLeft: `${pxToRem(8)}rem solid ${tokens[color as keyof typeof tokens]}`};
}
