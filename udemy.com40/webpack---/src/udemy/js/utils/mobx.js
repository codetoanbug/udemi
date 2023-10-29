import {action, set} from 'mobx';

/**
 * This method calls `extendObservable` with only the `properties` that are in `recognizedNames`.
 * It may be useful if you have a mobx model which wraps API response data, and you want to
 * be explicit about which properties are needed.
 * The `target` and `properties` params are the same as those in `extendObservable`.
 * The `recognizedNames` param is an array of recognized property names.
 */
export function extendRecognizedObservable(target, properties, recognizedNames) {
    const recognizedProperties = {};
    recognizedNames.forEach((name) => {
        if (name in properties) {
            recognizedProperties[name] = properties[name];
        }
    });
    Object.keys(properties).forEach((name) => {
        if (!(name in recognizedProperties)) {
            throw new Error(
                `Cannot assign unrecognized property ${name} to ${target.constructor.name}`,
            );
        }
    });
    Object.entries(recognizedProperties).forEach(([key, value]) => {
        set(target, key, value);
    });
}

export class APIModel {
    /*
        This class can be extended to provide a wrapper for API data. The subclass should define
        an apiDataMap property (as shown below) that returns a mapping from returned API fields to
        fields that should be set on the JS model. For example:
        ```
        get apiDataMap() {
            return {
                courseId: 'courseId',
                archivedTime: 'archive_time',
                favoritedTime: 'favorite_time',
                notificationSettings: 'notification_settings',
                wasPurchased: 'was_purchased_by_student',
                wasPaid: 'was_paid_by_student',
                isInRefundPeriod: 'is_in_refund_period',
            };
        }
        ```
        The value from the API field will only be applied if not undefined - this allows you to
        enrich the model after initial creation by subsequent calls to `setDataFromAPI` with new
        API data - you don't have to worry about previous data being overwritten.

        A default value may be provided if the source is undefined (and the target is still
        undefined):
        ```
        get apiDataMap() {
            return {
                mediaLicenseToken: 'media_license_token',
                mediaSources: 'media_sources',
                captions: {
                    source: 'captions',
                    defaultValue: [],
                },
                created: 'created',
            };
        }
        ```

        The data mapping can use a function to map from the API data to the JS model data, and
        allows for multiple source fields to be combined:
        ```
        get apiDataMap() {
            return {
                objectUrl: {
                    source: ['asset_type', 'url_set'],
                    map: (assetType, urlSet) => {
                        if (urlSet[assetType] && urlSet[assetType].length) {
                            return urlSet[assetType][0].file;
                        }
                    },
                },
            };
        }
        ```
        The mapping will only be applied if all required source fields are provided.
     */

    get apiDataMap() {
        return {};
    }

    constructor(apiData) {
        this.setDataFromAPI(apiData);
        // Escape hatch to access the original data returned by the API.
        this._apiData = apiData;
    }

    @action
    setDataFromAPI(apiData) {
        // apiData should be an object, don't try to set data if it's not.
        if (!apiData) {
            return;
        }
        Object.entries(this.apiDataMap).forEach(([target, source]) => {
            if (typeof source === 'string') {
                if (apiData[source] !== undefined) {
                    this[target] = apiData[source];
                }
            } else {
                const sources = typeof source.source === 'string' ? [source.source] : source.source;
                const mapFn = source.map || ((source) => source);
                if (sources.every((source) => apiData[source] !== undefined)) {
                    const args = sources.map((source) => apiData[source]);
                    const mapValue = mapFn(...args);
                    if (mapValue !== undefined) {
                        this[target] = mapValue;
                    }
                } else if (source.defaultValue !== undefined && this[target] === undefined) {
                    this[target] =
                        typeof source.defaultValue === 'function'
                            ? source.defaultValue(apiData)
                            : source.defaultValue;
                }
            }
        });
    }
}
