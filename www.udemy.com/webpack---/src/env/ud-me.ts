import {serverOrClient} from './server-or-client';

export const udMe = () => {
    return serverOrClient.global.UD?.me;
};
