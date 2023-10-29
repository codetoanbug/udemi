export const LABS_BASE_API_URL = '/labs/';

export const labBaseApiUrl = (labId: unknown) => {
    return `${LABS_BASE_API_URL}${labId}/`;
};

export const labTasksApiUrl = (labId: unknown) => {
    return `${labBaseApiUrl(labId)}tasks/`;
};

export const labInstanceBaseApiUrl = (labId: unknown) => {
    return `${labBaseApiUrl(labId)}instance/`;
};

export const labInstanceApiUrl = (labId: unknown, labInstanceId: unknown) => {
    return `${labInstanceBaseApiUrl(labId)}${labInstanceId}/`;
};

export const stopLabInstanceApiUrl = (labId: unknown, labInstanceId: unknown) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}stop/`;
};

export const terminateLabInstanceApiUrl = (labId: unknown, labInstanceId: unknown) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}terminate/`;
};

export const LAB_REFRESH_AND_RETRIEVE_LABS_URL = `${LABS_BASE_API_URL}retrieve-running-labs/`;
