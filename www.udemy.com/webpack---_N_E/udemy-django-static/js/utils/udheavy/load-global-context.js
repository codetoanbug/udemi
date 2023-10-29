import Cookies from "js-cookie";
import { runInAction } from "mobx";

import { fetchCommonAppData } from "@udemy/ud-api";

import udApi, {
  ADDITIONAL_CONTEXT_REQUESTED_COOKIE,
  populateUDFromResponse,
} from "udemy-django-static/js/utils/ud-api";
import { transformUDMe, updateUDMe } from "udemy-django-static/js/utils/ud-me";
import { transformUDVisiting } from "udemy-django-static/js/utils/ud-visiting";

const API_PREFIX = "/api-2.0/";

/**
 *  Loads Global Context whenever required (passed through Cookie set from public caching process).
 *  If there is a need to load global context first, calls the API with the request to be executed
 *  and populate the global variable UD with the response content.
 */
export default function loadGlobalContext(callback) {
  const cookie = Cookies.get(ADDITIONAL_CONTEXT_REQUESTED_COOKIE);
  const additionalVisitorContext = cookie && JSON.parse(cookie);
  const contextRequired = Boolean(
    additionalVisitorContext && additionalVisitorContext.requires_api_call
  );
  const fetchAdditionalContext = () => {
    return udApi
      .get(additionalVisitorContext.value.replace(API_PREFIX, ""))
      .then(populateUDFromResponse)
      .then(() => {
        Cookies.remove(ADDITIONAL_CONTEXT_REQUESTED_COOKIE);
      });
  };
  contextRequired ? fetchAdditionalContext().then(callback) : callback();
}

/**
 *  Loads user-specific Global Context (AKA the "me" context):
 *  - UD.me
 *  - UD.visiting
 *
 *  You can ignore this if you're working on UDHeavy, since the UD stuff is defined by
 *  Django via script tags in the initial HTML response.
 *
 *  We use this on UDLite because we want the initial HTML response to be cached,
 *  which requires that the response does not contain any user-specific data.
 */
export async function loadGlobalMeContext() {
  let response;
  if (UD.isGlobalMeContextLoading) {
    response = await fetchCommonAppData({
      visiting: true,
      user_specific_tracking: true,
      me: true,
      request: true,
      Config: true,
      experiment: true,
    });

    runInAction(() => {
      UD.me = response.data.me;
      updateUDMe();
      transformUDMe();
      UD.visiting = response.data?.visiting || {};
      UD.userSpecificTrackingParams =
        response.data?.user_specific_tracking || {};
      UD.request = response.data?.request || {};
      UD.request.clientTimestamp = new Date().toISOString();
      UD.Config = response.data?.Config || {};
      UD.experiment = response.data?.experiment || {};
      transformUDVisiting();
      UD.isGlobalMeContextLoading = false;
    });
  }

  initializeMyTimezone();
  return response && response.data;
}

async function initializeMyTimezone() {
  if (UD.me.id && !UD.me.time_zone) {
    try {
      const { default: updateMyTimezone } = await import(
        /* webpackChunkName: "update-my-timezone" */ "udemy-django-static/js/utils/udheavy/update-my-timezone"
      );
      updateMyTimezone();
    } catch (e) {
      /* empty */
    }
  }
}
