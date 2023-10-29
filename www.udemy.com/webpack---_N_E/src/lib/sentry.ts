import SentryFullstory from '@sentry/fullstory';
import * as Sentry from '@sentry/nextjs';

import {beforeSend, udSentry} from '@udemy/sentry';
import {UDData} from '@udemy/ud-data';

const getSentryDsn = () => {
    const SENTRY_DSN = process.env.SENTRY_DSN as string;
    const SENTRY_DSN_CHINA = process.env.SENTRY_DSN_CHINA as string;
    if (typeof window === 'undefined') {
        return SENTRY_DSN;
    }

    return window.location.hostname.endsWith('udemy.cn') ? SENTRY_DSN_CHINA : SENTRY_DSN;
};

export const getSentryOptions = () => {
    const DEPLOY_ENV = process.env.DEPLOY_ENV as string;

    const integrations = [];
    if (DEPLOY_ENV === 'prod') {
        integrations.push(new SentryFullstory('udemycom'));
    }

    return {
        beforeSend,
        dsn: getSentryDsn(),
        environment: DEPLOY_ENV === 'prod' ? 'PROD' : 'DEV',
        whitelistUrls: DEPLOY_ENV === 'prod' ? [/udemy\.com/, /udemy\.cn/] : [/./],
        sampleRate: DEPLOY_ENV === 'prod' ? 0.05 : 1,
        autoSessionTracking: false,
        integrations,
    };
};

export const initializeSentry = () => {
    if (process.env.DEPLOY_ENV === 'local') {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    udSentry.initializeSentry(Sentry as any, getSentryOptions());
};

export const getSentryContext = (data: UDData) => {
    const udConfig = data.Config;
    const userAgnosticTrackingParams = data.userAgnosticTrackingParams;

    return {
        app_name: process.env.APP_NAME,
        brand: udConfig.brand?.identifier,
        js_bundle: 'nextJS',
        page_key: userAgnosticTrackingParams?.page_key || `${udConfig.app_name}-without-page-key`,
        user_id: data.me.is_authenticated ? data.me.id.toString() : undefined,
        version: process.env.VERSION,
    };
};
