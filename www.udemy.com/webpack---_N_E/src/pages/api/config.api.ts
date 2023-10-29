import {internalConfig, publicConfig} from 'next.config.env.runtime';

export type RunTimeConfigKeys = keyof typeof internalConfig & keyof typeof publicConfig;

declare global {
    interface Window {
        PUBLIC_CONFIG: typeof internalConfig & typeof publicConfig;
    }
}

/**
 * getRuntimeConfig()
 * This method is used to supplement Next.js buildtime configurations with a method of resolving configuration at runtime.
 * @param name {string} The name of the configuration key to resolve.
 * @returns
 */
export const getRuntimeConfig = (name: RunTimeConfigKeys): string => {
    const IS_CI = process.env.IS_CI;
    let resolved;
    if (IS_CI) {
        // If we are in a CI environment, use the public context configuration
        resolved = publicConfig[name];
    } else {
        // Otherwise, if server, use internal context configuration,
        // if client, use public context configuration
        resolved =
            typeof window !== 'undefined' ? window.PUBLIC_CONFIG[name] : internalConfig[name];
    }
    // TODO: implement debug log mode
    // console.debug(`getRuntimeConfig: ${name} = ${resolved}`);
    return resolved;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function handler(_req: any, res: any) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    res.status(200).send(`window.PUBLIC_CONFIG = ${JSON.stringify(publicConfig)}`);
}
