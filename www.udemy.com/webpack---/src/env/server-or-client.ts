import {JSDOM} from 'jsdom';

const isServer = typeof window === 'undefined';

interface UDGlobal {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
    browse: Record<string, any>;
    Config: Record<string, any>;
    experiment: Record<string, any>;
    me?: Record<string, any>;
    meProperties?: Array<any>;
    performance: {
        start(name: string): boolean;
        end(name: string): boolean;
        mark(eventName: string): boolean;
    };
    request: Record<string, any>;
    site_stats: Record<string, any>;
    userAgnosticTrackingParams: Record<string, any>;
    userAgnosticTrackingProperties: Array<any>;
    userSpecificTrackingParams?: Record<string, any>;
    userSpecificTrackingProperties?: Array<any>;
    visiting: Record<string, any>;
    visitingProperties: Array<any>;
    tracking: Record<string, any>;
    GoogleAnalytics: {
        createAccount: any;
        instructor?: {
            accountId: string;
            page: string;
        };
        queuedPurchase?: unknown;
        trackEvent: any;
        trackPageview: any;
        setValue: any;
        trackPurchase: any;
        trackAllPageview: any;
    };
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
}

export const serverOrClient = {
    isServer,
    isClient: !isServer,
    global: isServer ? global : window,
} as {
    isServer: boolean;
    isClient: boolean;
    global: ((Window & typeof globalThis) | typeof globalThis) & {
        JSDOM: typeof JSDOM;
        OnetrustActiveGroups: string;
        UD: UDGlobal;
    };
};
