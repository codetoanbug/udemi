import {serverOrClient} from './server-or-client';

export const udUserAgnosticTrackingParams = () => {
    return serverOrClient.global.UD?.userAgnosticTrackingParams;
};
