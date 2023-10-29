import Cookies from "js-cookie";
import { when } from "mobx";

import { LearningListCreateEvent } from "udemy-django-static/js/browse/components/save-to-list/events";
import { UI_REGION } from "udemy-django-static/js/browse/ui-regions";
import { ENROLL_COURSE_WITH_SUBSCRIPTION_QUERY } from "udemy-django-static/js/course-taking//graphql-queries";
import { Tracker } from "@udemy/event-tracking";
import udApi from "udemy-django-static/js/utils/ud-api";
import udGraphql from "udemy-django-static/js/utils/ud-graphql";
import udMe from "udemy-django-static/js/utils/ud-me";

import { CONSUMER_SUBSCRIPTION } from "./constants";

export const setVisitorIntentCookie = async function (plan) {
  await when(() => !udMe.isLoading);
  if (!udMe.id) {
    Cookies.set("udemy_visitor_intent", `purchase_${plan}`, { expires: 1 });
  }
};

export const SubscribeFromPageCookie = {
  NAME: "subscribe_from_page",
  EXPIRATION_DAYS: 14,
  set(pageKey, id) {
    Cookies.set(this.NAME, this.serialize(pageKey, id), this.EXPIRATION_DAYS);
  },
  get() {
    const cookieString = Cookies.get(this.NAME);
    if (cookieString) {
      return SubscribeFromPageCookie.deserialize(cookieString);
    }
    return {
      pageKey: undefined,
      id: undefined,
    };
  },
  serialize(pageKey, id) {
    return `${pageKey}:${id}`;
  },
  deserialize(cookieString) {
    const [pageKey, id] = cookieString.split(":");
    return { pageKey, id };
  },
  remove() {
    Cookies.remove(this.NAME);
  },
};

export function enrollInCourseViaSubscription(courseId) {
  udGraphql.query({
    query: ENROLL_COURSE_WITH_SUBSCRIPTION_QUERY,
    variables: { courseId },
  });
}

export function isConsumerSubscription(productType) {
  return productType === CONSUMER_SUBSCRIPTION;
}

export async function createDefaultCollectionList() {
  const response = await udApi.post(
    "/users/me/subscribed-courses-collections/",
    {
      title: gettext("Watch later"),
    }
  );
  if (response.status === 201) {
    Tracker.publishEvent(
      new LearningListCreateEvent({
        listId: response.data.list_id,
        uiRegion: UI_REGION.SUBSCRIPTION_EXPRESS_CHECKOUT_SUCCESS,
        nonInteraction: true,
      })
    );
  }
}
