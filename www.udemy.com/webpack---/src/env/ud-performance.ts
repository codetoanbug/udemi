import {serverOrClient} from './server-or-client';

export const udPerformance = () => {
    return serverOrClient.global.UD?.performance;
};
