export const isServer = typeof window === 'undefined';

const serverOrClient = isServer ? global : window;

// Shim `global` to prevent errors in parse time read errors
serverOrClient.global = serverOrClient.global || {
    UD: {},
};
/*
    These global shims are required before App first renders to attach the UD data and text translation functions.
    Known issue:
        - Translations before App first renders will be only in english.
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object.assign(serverOrClient.global, {
    UD: {
        isGlobalMeContextLoading: true,
        Config: {
            isLoading: true,
            brand: {
                has_organization: false,
            },
            url: {
                to_root: process.env.APP_BASE_PATH,
            },
            third_party: {
                storage_static_asset_base_url: '',
            },
            version: process.env.VERSION,
        },
        me: {
            isLoading: true,
        },
        meProperties: [],
        request: {
            isLoading: true,
        },
        visiting: {
            isLoading: true,
        },
        visitingProperties: [],
        userSpecificTrackingParams: {
            isLoading: true,
        },
        userSpecificTrackingProperties: [],
        userAgnosticTrackingParams: {},
        experiment: {},
        site_stats: {},
        performance: {
            start: () => false,
            end: () => false,
        },
    },
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
serverOrClient.global.gettext = (e: string) => e;
serverOrClient.global.ngettext = (s: string, p: string, c: number) => (c === 1 ? s : p);
serverOrClient.global.pgettext = (e: string, n: string) => {
    // eslint-disable-next-line @udemy/no-variable-string
    let i = serverOrClient.global.gettext(e + '' + n);
    if (i.indexOf('') != -1) {
        i = n;
    }
    return i;
};
serverOrClient.global.npgettext = (e: string, n: string, i: string, r: number) => {
    // eslint-disable-next-line @udemy/no-variable-string
    let o = serverOrClient.global.ngettext(e + '' + n, e + '' + i, r);
    if (o.indexOf('') != -1) {
        // eslint-disable-next-line @udemy/no-variable-string
        o = serverOrClient.global.ngettext(n, i, r);
    }
    return o;
};
serverOrClient.global.interpolate = (e: string, t: unknown, n?: boolean) => {
    if (n) {
        return e.replace(/%\(\w+\)s/g, function (e) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return String((t as any)[e.slice(2, -2)]);
        });
    } else {
        return e.replace(/%s/g, function () {
            return String((t as number[]).shift());
        });
    }
};
serverOrClient.global.ninterpolate = (
    singular: string,
    plural: string,
    count: number,
    namedContext: unknown,
) => {
    let context: number[] | unknown = [count];
    let named = false;

    if (namedContext) {
        context = namedContext;
        named = true;
    }

    return serverOrClient.global.interpolate(
        // eslint-disable-next-line @udemy/no-variable-string
        serverOrClient.global.ngettext(singular, plural, count),
        context,
        named,
    );
};

serverOrClient.global.django = {
    formats: {
        DATETIME_FORMAT: 'N j, Y, g:i a',
        DATETIME_INPUT_FORMATS: [
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d %H:%M:%S.%f',
            '%Y-%m-%d %H:%M',
            '%Y-%m-%d',
            '%m/%d/%Y %H:%M:%S',
            '%m/%d/%Y %H:%M:%S.%f',
            '%m/%d/%Y %H:%M',
            '%m/%d/%Y',
            '%m/%d/%y %H:%M:%S',
            '%m/%d/%y %H:%M:%S.%f',
            '%m/%d/%y %H:%M',
            '%m/%d/%y',
        ],
        DATE_FORMAT: 'N j, Y',
        DATE_INPUT_FORMATS: ['%Y-%m-%d', '%m/%d/%Y', '%m/%d/%y'],
        DECIMAL_SEPARATOR: '.',
        FIRST_DAY_OF_WEEK: 0,
        MONTH_DAY_FORMAT: 'F j',
        NUMBER_GROUPING: 3,
        SHORT_DATETIME_FORMAT: 'm/d/Y P',
        SHORT_DATE_FORMAT: 'm/d/Y',
        THOUSAND_SEPARATOR: ',',
        TIME_FORMAT: 'P',
        TIME_INPUT_FORMATS: ['%H:%M:%S', '%H:%M:%S.%f', '%H:%M'],
        YEAR_MONTH_FORMAT: 'F Y',
    },
};

// Some functions are scoped to the `window` or `global` context.  Create a copy to avoid broken functionality.
Object.assign(serverOrClient, serverOrClient.global);

// @udemy/shared-utils expects global state at parse time so we have to import this after shimming global state
// If server-side context, import JSDOM
if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {serverOrClient} = require('@udemy/shared-utils');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    serverOrClient.global.JSDOM = require('jsdom').JSDOM;
    // Shim for backwards compatible support of isomorphic rendered components with `extract-css-chunks-webpack-plugin` that need preload
    // https://github.com/faceyspacey/extract-css-chunks-webpack-plugin/blob/a44cd0bfad12411ced3ad6c92fdac689eba674d5/src/index.js#L331
    // components that implement `import ...` that import CSS/LESS will trigger `document` references in server code
    Object.assign(global, {
        document: new serverOrClient.global.JSDOM().window.document,
    });
}
