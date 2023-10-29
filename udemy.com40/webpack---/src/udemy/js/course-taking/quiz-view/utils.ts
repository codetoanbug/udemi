import {getVariantValueFromUdRequest} from 'utils/get-experiment-data';

export function isExperimentEnabled(featureName: string) {
    return getVariantValueFromUdRequest(featureName, 'is_active', false);
}

export function isPracticeTestExperimentEnabled() {
    return isExperimentEnabled('is_new_practice_test_creation_ui_enabled');
}
