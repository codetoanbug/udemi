import {CUSTOM_EVENT_NAME_PROVIDER_BRIDGE} from '@udemy/ud-data';
import Cookies from 'js-cookie';
import {runInAction} from 'mobx';

import udApi, {ADDITIONAL_CONTEXT_REQUESTED_COOKIE, populateUDFromResponse} from 'utils/ud-api';
import {transformUDMe} from 'utils/ud-me';
import {transformUDVisiting} from 'utils/ud-visiting';

const API_PREFIX = '/api-2.0/';

/**
 *  Loads Global Context whenever required (passed through Cookie set from public caching process).
 *  If there is a need to load global context first, calls the API with the request to be executed
 *  and populate the global variable UD with the response content.
 */
export default function loadGlobalContext(callback) {
    const cookie = Cookies.get(ADDITIONAL_CONTEXT_REQUESTED_COOKIE);
    const additionalVisitorContext = cookie && JSON.parse(cookie);
    const contextRequired = Boolean(
        additionalVisitorContext && additionalVisitorContext.requires_api_call,
    );
    const fetchAdditionalContext = () => {
        return udApi
            .get(additionalVisitorContext.value.replace(API_PREFIX, ''))
            .then(populateUDFromResponse)
            .then(() => {
                Cookies.remove(ADDITIONAL_CONTEXT_REQUESTED_COOKIE);
            });
    };
    contextRequired ? fetchAdditionalContext().then(callback) : callback();
}

/**
 *  Loads user-specific Global Context (AKA the "me" context), which ends up on `UD`.
 *
 *  You can ignore this if you're working on non-publicly cached pages,
 *  since the `UD` data is already defined by Django via script tags in the initial HTML response.
 *
 *  On publicly cached pages, the initial HTML response is cached,
 *  which requires that the response does not contain any user-specific data.
 */
export async function loadGlobalMeContext() {
    if (UD.isGlobalMeContextLoading) {
        const response = await udApi.get('/contexts/me/', {
            params: {
                visiting: 'True',
                user_specific_tracking: 'True',
                me: 'True',
                request: 'True',
                Config: 'True',
                experiment: 'True',
            },
        });

        runInAction(() => {
            UD.me = response.data.me;
            transformUDMe();
            UD.visiting = response.data?.visiting || {};
            UD.userSpecificTrackingParams = response.data?.user_specific_tracking || {};
            UD.request = response.data?.request || {};
            UD.request.clientTimestamp = new Date().toISOString();
            UD.Config = response.data?.Config || {};
            UD.experiment = response.data?.experiment || {};
            transformUDVisiting();
            UD.isGlobalMeContextLoading = false;

            // Sync UD Data Providers
            window.dispatchEvent(
                new CustomEvent(CUSTOM_EVENT_NAME_PROVIDER_BRIDGE, {
                    detail: {
                        Config: UD.Config,
                        experiment: UD.experiment,
                        isGlobalMeContextLoading: UD.isGlobalMeContextLoading,
                        me: UD.me,
                        request: UD.request,
                        userSpecificTrackingParams: UD.userSpecificTrackingParams,
                        visiting: UD.visiting,
                    },
                }),
            );
        });
    }

    initializeMyTimezone();
}

async function initializeMyTimezone() {
    if (UD.me.id && !UD.me.time_zone) {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            tz && udApi.patch('/users/me/', {time_zone: tz});
        } catch (e) {
            /* empty */
        }
    }
}
