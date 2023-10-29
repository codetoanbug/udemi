import {serverOrClient} from '../env/server-or-client';

/*
 * This is a hard copy of `CUSTOM_EVENT_NAME_PROVIDER_BRIDGE` in
 * `@udemy/ud-data`.  It is copied here to prevent a circular dependency.
 */
const CUSTOM_EVENT_NAME_PROVIDER_BRIDGE = 'update-uddata-provider';

export function getConfigData() {
    return serverOrClient.global.UD.Config;
}

const jsonify = (value) => {
    switch (typeof value) {
        case 'object':
            return value;
        case 'string':
            try {
                return JSON.parse(value.replace(/\\054/g, ',').replace(/'/g, '"'));
            } catch (e) {
                return null;
            }
        default:
            return null;
    }
};

/**
 * Populate `UD` keys/values from context dictionary. If key does not exist, we initialize it.
 * */

export function updateUDWith(context) {
    context = jsonify(context);
    if (!context) {
        return;
    }
    const UD = serverOrClient.global.UD;
    Object.keys(context).forEach((key) => {
        const value = context[key];
        if (UD[key]) {
            Object.assign(UD[key], value);
        } else {
            UD[key] = value;
        }
    });
    // Sync UD Data Providers
    if (serverOrClient.isClient) {
        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME_PROVIDER_BRIDGE, {detail: context}));
    }
}
