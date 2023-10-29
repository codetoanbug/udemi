import {getVariantValueFromUdRequest} from 'utils/get-experiment-data';

export function isExperimentEnabled(featureName: string) {
    return getVariantValueFromUdRequest(featureName, 'is_active', false);
}
