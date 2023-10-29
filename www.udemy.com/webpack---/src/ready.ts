import {OneTrustReadyHandler} from './types';

export function whenOneTrustReady(cb: OneTrustReadyHandler) {
    window.OneTrustReadyHandlers = window.OneTrustReadyHandlers || [];
    window.OneTrustReadyHandlers?.push(cb);
}
