export const collectorPath = '/api-2.0/ecl';
export const defaultDomain = 'https://www.udemy.com';
export const defaultWebAppKey = 'web_main';
export const defaultCollectorUrl = 'https://www.udemy.com/api-2.0/ecl';
export const visitorUuidCookieKey = '__udmy_2_v57r';

export const enum EventStatus {
    WAITING = 'WAITING',
    FAILURE = 'FAILURE',
    SUCCESS = 'SUCCESS',
    BEACON_SENT = 'BEACON_SENT',
}

export const DOMAIN_CONFIG = Object.freeze({
    USE_DEFAULT: 0,
    USE_CURRENT: 1,
    USE_PROVIDED: 2,
});
