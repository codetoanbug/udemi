/**
 * Wraps `gtag.js` client SDK downloaded from our server-side GTM container hosted at https://gtm.udemy.com/
 *
 * Udemy GTM server-side container wiki: https://udemywiki.atlassian.net/wiki/spaces/PDEUX/pages/2242447106/Google+Tag+Manager+Server+Side+Containers
 * How To Develop Tags: https://udemywiki.atlassian.net/wiki/spaces/PDEUX/pages/2375877532/How+To+Develop+GTM+Server+Container+Tagging
 */

import sha256 from 'crypto-js/sha256';
import $script from 'scriptjs';
import {v4 as uuidv4} from 'uuid';

import {
    ANALYTICS_PARAMS,
    BrowserLogger,
    getVisitorUUID,
    OneTrustConsent,
    udMe,
} from '@udemy/shared-utils';
import {AnyObject} from '@udemy/shared-utils/types';
import {udApi} from '@udemy/ud-api';

// Import local state API
// This API needs to be in a separate file to avoid isomorphic API access violations to getRequestData(), etc.
import {
    getEventData,
    hasEventFired,
    saveEventData,
    setEventFired,
} from './ud-server-side-gtag-state';

// Augment `window` interface
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataLayer: any;
        udGtag:
            | {
                  push(cb: UdGtagCallback): void;
              }
            | Array<UdGtagCallback>;
        gtag: UdGtag;
    }
}

// Define udGtag interface
type UdGtag = (
    command: 'config' | 'get' | 'set' | 'event' | 'js',
    commandParameters: unknown,
    additionalData?: AnyObject,
) => void;

type UdGtagCallback = (
    udGtagApi: UdGtag,
    eventData: AnyObject,
    saveEventDataFn: typeof saveEventData,
) => void;

// Base URL for GTM server-side container
const gtmBaseUrl = 'https://gtm.udemy.com'; // Do not change this

// GA4 Measurement ID
// Stream details: https://analytics.google.com/analytics/web/#/a12366301p259439294/admin/streams/table/2254254511
const GA4MeasurementId = 'G-7YMFEFLR6Q'; // Do not change this -- this is the primary web stream ID

// Ddog metrics
const browserLogger = new BrowserLogger('gtag-client');

/**
 * Explicitly define interface for `gtag.js` for a better developer experience
 * see https://developers.google.com/gtagjs/reference/api
 * @string command - can be `config`, `get`, `set`, `event` or `js`
 * @object commandParameters - parameters sent with command
 * @object additionalData - additional configuration data
 */
export const udGtag: UdGtag = (command, commandParameters, additionalData = {}) => {
    window.dataLayer = window.dataLayer || [];
    // in the case of events, ensure we send data to `GA4MeasurementId` data stream via GTM server-side with full context
    if (command === 'event') {
        // In the context of `command=event`, `commandParameters` is the name of the events
        const eventName = commandParameters as string; // readability
        if (additionalData.onlyOnce === true) {
            // check local dictionary if `eventName` was already called previously.
            if (hasEventFired(eventName)) {
                return;
            }
        }
        setEventFired(eventName);
        additionalData = {
            ...additionalData,
            ...getEventData(),
        };
    }
    // gtag.js does not seem to be flexible about working any other object type than Arguments, despite what documentation says.
    // So we have to create a function closure here to manufacture correct `arguments` to pass to dataLayer
    // window.dataLayer.push([command, commandParameters, additionalData]); -- doesn't work
    // window.dataLayer.push({event: commandParameters, ...additionalData}); -- doesn't work (for just events)
    (function (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        command: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        commandParameters: unknown,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        additionalData: AnyObject,
    ) {
        // The dataLayer is very finicky about getting an `Arguments` array (vs `...rest`)
        // Need to dig in more into why preview container doesn't work with ...rest
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
    })(command, commandParameters, additionalData);
};

/**
 *  Create globally safe accessible API.  This enables calling this module from outside webpack.
 *  This is helpful for making an easier migration path.  This API should be used sparingly!
 *
 *  ```js
 *  window.udGtag = window.udGtag || [];
 *  window.udGtag.push((gtag, eventData, saveEventDataFn) => {
 *      // API access
 *      gtag('event', 'interesting_event');
 *
 *      // API to save persistent data
 *      saveEventData({foo: 'bar'});
 *
 *      // Read persistent data
 *      getEventData('foo');
 *  });
 *  ```
 *
 *  - Before initialization: `window.udGtag = [f(), f(), f()];`
 *  - After initialization: `window.udGtag = {push: (cb) => cb(udGtag)}`
 */
export function createGlobalSafeAPI() {
    // Process any invocations to API
    const udGtagInvocations = window.udGtag;

    // Create `window.udGtag` public API
    window.udGtag = {
        push: (cb: UdGtagCallback) => {
            return cb(udGtag, getEventData(), saveEventData);
        },
    };
    // Process any consent changed events already added
    if (Array.isArray(udGtagInvocations) && udGtagInvocations && udGtagInvocations.length > 0) {
        for (let i = 0; i < udGtagInvocations.length; i++) {
            window.udGtag.push(udGtagInvocations[i]);
        }
    }
}

export interface PageConfig {
    app_key: string;
    env: string;
    isCLP: boolean;
    isJapanese: boolean;
    isLoggedInHomePage: boolean;
    isMarketPlaceUS: boolean;
    page_key: string;
}

/**
 * Loads gtag from server-side GTM container
 * @param scriptLoadedCallback - optional callback function to signal when script has downloaded
 * @param scriptLoader - function to override $script for unit test purposes
 * @param overrideUniqueTrackingId - Overrides uuidv4 generated ID for unit test purposes
 * @returns Promise - Promise that resolves when all required data is available to fire a `page_view` event
 */
export function loadGtag(
    pageConfig: PageConfig,
    scriptLoadedCallback?: () => void,
    scriptLoader: (url: string, callback: () => void) => void = $script,
    overrideUniqueTrackingId?: string,
) {
    // Initialize unique tracking id, needed for de-duplication of FB eventing
    const uniqueTrackingId = overrideUniqueTrackingId || uuidv4();
    const visitorUuid = getVisitorUUID();

    saveEventData({
        unique_tracking_id: uniqueTrackingId,
        event_id: uniqueTrackingId,
        visitor_uuid: visitorUuid,
        external_id: visitorUuid ? `${sha256(`${visitorUuid}`)}` : undefined,
    });

    if (!getEventData().external_id) {
        browserLogger.error('external_id undefined at first set');
    }

    // Construct base GTM URL
    const url = `${gtmBaseUrl}/gtag/js?id=${GA4MeasurementId}`;

    // Initialize & save configuration
    udGtag('js', new Date(), {});
    udGtag('config', GA4MeasurementId, {
        transport_url: gtmBaseUrl,
        send_page_view: false, // send page view when we resolve user params
    });
    saveEventData({
        send_to: GA4MeasurementId,
        transport_url: gtmBaseUrl,
    });

    if (!getEventData().external_id) {
        browserLogger.error('external_id undefined at first overwrite');
    }

    // Save page information
    saveEventData({...pageConfig, transport_url: gtmBaseUrl, first_party_collection: true});

    if (!getEventData().external_id) {
        browserLogger.error('external_id undefined at pageConfig save');
    }

    const promises = [];
    const me = udMe() ?? {};
    promises.push(
        ANALYTICS_PARAMS.user.extract().then((data) => {
            const userEventData = {
                ...data,
                visitor_uuid: getVisitorUUID(),
                user_data: {},
            };
            // If we see additional user specific information, save it
            if (me?.email) {
                userEventData.user_data = {
                    email_address: me.email,
                    address: {
                        first_name: me.name,
                        last_name: me.surname,
                        country: me.country,
                    },
                };
            }
            saveEventData(userEventData);
        }),
    );

    // TODO: add CLP support. Need to port udApi into shared util first.
    // Save CLP information
    // Get CLP specific info
    const clpCourseId = parseInt(document.body.getAttribute('data-clp-course-id') as string, 10);
    const isCLP = clpCourseId > 0;
    if (isCLP) {
        promises.push(
            udApi
                .get(ANALYTICS_PARAMS.course.url(clpCourseId), {
                    params: ANALYTICS_PARAMS.course.params,
                })
                .then((response) => {
                    const extractedAnalytics = ANALYTICS_PARAMS.course.extract(response.data);
                    const courseData = {
                        ...extractedAnalytics,
                        items: [
                            {
                                item_id: `${extractedAnalytics.course_id}`,
                                item_name: extractedAnalytics.course_title,
                                item_category: extractedAnalytics.course_category,
                                item_category2: extractedAnalytics.course_subcategory,
                                item_category3: extractedAnalytics.course_topic,
                            },
                        ],
                    };
                    return courseData;
                })
                .then((data) => {
                    saveEventData({
                        ...data,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        CLPCourseId: clpCourseId,
                    });
                    if (!getEventData().external_id) {
                        browserLogger.error('external_id undefined at CLP ID save');
                    }
                    // Interoperability for CLP views
                    udGtag('event', 'course-data-ready');
                    if (!getEventData().external_id) {
                        browserLogger.error('external_id undefined after udGtag push on CLP');
                    }
                }),
        );
    }

    // Load Gtag script
    scriptLoader(url, () => {
        if (typeof scriptLoadedCallback === 'function') {
            scriptLoadedCallback();
        }
    });

    // Create global API
    createGlobalSafeAPI();

    // When all Promises resolve, fire a `page_view` event
    return Promise.all(promises).then(() => {
        const consentData = OneTrustConsent.toGtagEventData();
        if (consentData.ad_storage !== 'true' || consentData.personalization_storage !== 'true') {
            return;
        }

        udGtag('event', 'page_view', Object.assign({}, consentData, {onlyOnce: true}));
    });
}
