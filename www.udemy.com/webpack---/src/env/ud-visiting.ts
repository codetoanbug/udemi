import {serverOrClient} from './server-or-client';

export const udVisiting = () => {
    return serverOrClient.global.UD?.visiting;
};
