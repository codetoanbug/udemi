import serverOrClient from 'utils/server-or-client';

export function getExperimentData() {
    return serverOrClient.global.UD.experiment;
}

export function getExtraExperimentData() {
    return serverOrClient.global.UD.request.extra_experiment_data;
}

export function getVariantValue(experimentSet, variantName, defaultValue) {
    const udExperiment = getExperimentData();
    if (udExperiment === undefined || udExperiment[experimentSet] === undefined) {
        return defaultValue;
    }

    const allVariants = getVariants(experimentSet);

    if (!(variantName in allVariants)) {
        return defaultValue;
    }
    return allVariants[variantName];
}

export function getVariantValueFromUdRequest(experimentSet, variantName, defaultValue) {
    const extraUdExperiment = getExtraExperimentData();
    if (extraUdExperiment === undefined || extraUdExperiment[experimentSet] === undefined) {
        return defaultValue;
    }

    const allVariants = extraUdExperiment[experimentSet];
    if (!(variantName in allVariants)) {
        return defaultValue;
    }
    return allVariants[variantName];
}

export function getNonRecordedExperimentIdsFromVariantKey(experimentSet, variantKey) {
    const udExperiment = getExperimentData();
    const experimentsInSet = udExperiment[experimentSet];

    const experimentIds = Object.keys(experimentsInSet).filter((id) => {
        return (
            variantKey in experimentsInSet[id].values && experimentsInSet[id].state === 'unrecorded'
        );
    });

    return experimentIds.map((experimentId) => parseInt(experimentId, 10));
}

export function getVariants(experimentSet) {
    const udExperiment = getExperimentData();
    const experimentsInSet = udExperiment[experimentSet];
    const reducer = (allVariants, experimentId) =>
        Object.assign(allVariants, experimentsInSet[experimentId].values);
    return Object.keys(experimentsInSet).reduce(reducer, {});
}

export function getAllAssignedVariantIds() {
    const udExperiment = getExperimentData();
    const reducer = (allVariants, experimentSet) => {
        const setVariants = Object.values(experimentSet).map((experiment) => {
            return experiment.variant;
        });
        return allVariants.concat(setVariants);
    };
    return Object.values(udExperiment).reduce(reducer, []);
}
