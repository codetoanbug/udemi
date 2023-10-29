/**
 * Creates a proxy object for UD globals that contain user-specific data, e.g. UD.me.
 * The data is loaded via API call (see load-global-context.js), so that the initial HTML response
 * can be cached. The proxy makes the UD properties observable, so that your code "refreshes"
 * once the data has loaded.
 *
 * The proxy raises an error if you try to access one of the UD properties before the
 * data has loaded. Avoid this error by checking the `isLoading` flag on the proxy.
 * - If you're in the `render` function of a React component, just use an if-statement:
 *       if (!udMe.isLoading) { ... }
 * - If you're in some callback function, use `when` from MobX:
 *       await when(() => !udMe.isLoading)
 *
 * Note, there's ES6 Proxy, which would work perfectly here, except it isn't supported
 * on some mobile browsers: https://caniuse.com/#search=proxy. Hence, we're creating
 * proxies manually.
 */
import serverOrClient from 'utils/server-or-client';

export default function createUDProxy(key, propertiesKey) {
    if (UD[key] && !UD[key].isLoading) {
        // On non-publicly cached pages, UD[key] is already set up by Django,
        // so we don't need to do anything.
        return UD[key];
    }

    const proxy = {...UD[key]};

    // Note: We intentionally chose a flag that should be negated so that
    // `when(() => !UD[key].isLoading, doStuffWithMeContext)` triggers `doStuffWithMeContext`
    // immediately in case `UD.isGlobalMeContextLoading` is undefined.
    Object.defineProperty(proxy, 'isLoading', {get: () => UD.isGlobalMeContextLoading});

    UD[propertiesKey].forEach((prop) => {
        Object.defineProperty(proxy, prop, {
            get: () => {
                if (serverOrClient.isServer) {
                    // The server-side part of isomorphic rendering should never reference
                    // the me context, as it's never loaded.
                    throw new Error(`UD.${key}.${prop} should not be accessed by Node.js`);
                }
                if (proxy.isLoading) {
                    throw new Error(
                        `UD.${key}.${prop} has not loaded yet- ` +
                            `you need to check !UD.${key}.isLoading first`,
                    );
                }
                return UD[key][prop];
            },
        });
    });

    return proxy;
}
