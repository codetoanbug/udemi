import { action, computed, extendObservable } from "mobx";

import { WishlistEvent } from "udemy-django-static/js/browse/events";
import { Tracker as tracker } from "@udemy/event-tracking";
import { ShoppingClient } from "@udemy/shopping";
import { udLink } from "@udemy/ud-data";
import udMe from "udemy-django-static/js/utils/ud-me";

import {
  WISHLIST_DEFAULT_STATE,
  WISHLIST_LOADING_STATE,
  WISHLIST_FINISHED_STATE,
} from "./constants";

export default class WishlistStore {
  constructor(course, window) {
    extendObservable(this, {
      wishlistProcessState: WISHLIST_DEFAULT_STATE,
      isWishlisted: this._getIsWishlisted(course.id),
    });
    this.window = window;
    this.course = course;
    this.searchParams = new URLSearchParams(this.window.location.search);
    this.buyables = {
      buyable_context: {},
      buyable_object_type: "course",
      id: this.course.id,
    };
  }

  _getIsWishlisted = (courseId) => {
    return ShoppingClient.lists.wishlist.items.some(
      (item) => item.buyable.id === courseId
    );
  };

  @action
  _setIsWishlisted = () => {
    this.isWishlisted = true;
    // Update the original course object so that the client/server wishlist states are equal
    this.course.is_wishlisted = true;
  };

  @action
  _clearIsWishlisted = () => {
    this.isWishlisted = false;
    this.course.is_wishlisted = false;
  };

  @action
  _setWishlistProcessState = (nextState) => {
    this.wishlistProcessState = nextState;
  };

  _buildNextUrl = () => {
    this.searchParams.set("xref", "wish");
    this.searchParams.set("courseId", this.course.id);
    const url = `${
      this.window.location.href.split("?")[0]
    }?${this.searchParams.toString()}`;

    return url;
  };

  _authUrl = () => {
    const nextUrl = this._buildNextUrl();
    const returnUrl = this.window.location.href;

    if (udMe.id) {
      return nextUrl;
    }

    return udLink.toAuth({
      showLogin: false,
      nextUrl,
      returnUrl,
      source: "course_landing_page",
      responseType: "html",
    });
  };

  logWishlistClickEvent = () => {
    tracker.publishEvent(
      new WishlistEvent({
        id: this.course.id,
        trackingId: this.course.frontendTrackingId || this.course.tracking_id,
      })
    );
    if (
      window.appboy &&
      typeof window.appboy.isPushPermissionGranted === "function" &&
      window.appboy.isPushPermissionGranted()
    ) {
      window.appboy.logCustomEvent("Wishlist", { course_id: this.course.id });
    }
  };

  _addToWishlist = () => {
    this._setIsWishlisted();
    this._setWishlistProcessState(WISHLIST_LOADING_STATE);
    this.logWishlistClickEvent();
    return ShoppingClient.addToList("wishlist", { buyable: this.buyables })
      .then(
        action(() => {
          this._setWishlistProcessState(WISHLIST_FINISHED_STATE);
          return Promise.resolve();
        })
      )
      .catch(
        action((error) => {
          this._clearIsWishlisted();
          this._setWishlistProcessState(WISHLIST_DEFAULT_STATE);
          throw error;
        })
      );
  };

  _removeFromWishlist = () => {
    this._clearIsWishlisted();
    this._setWishlistProcessState(WISHLIST_LOADING_STATE);

    return ShoppingClient.removeFromList("wishlist", { buyable: this.buyables })
      .then(
        action(() => {
          this._setWishlistProcessState(WISHLIST_FINISHED_STATE);
          return Promise.resolve();
        })
      )
      .catch(
        action((error) => {
          this._setIsWishlisted();
          this._setWishlistProcessState(WISHLIST_DEFAULT_STATE);
          throw error;
        })
      );
  };

  _getHasWishlistIntent = () => {
    return this.searchParams.get("xref") === "wish";
  };

  @action
  toggleWishlist = () => {
    const authUrl = this._authUrl();

    if (!udMe.id) {
      this.window.location.href = authUrl;
    } else if (!this.apiRequestIsLoading) {
      const toggle = this.isWishlisted
        ? this._removeFromWishlist
        : this._addToWishlist;
      this._setWishlistProcessState(WISHLIST_DEFAULT_STATE);
      return toggle();
    }
  };

  removeWishlistIntent = () => {
    if (!this._getHasWishlistIntent()) {
      return;
    }
    this.searchParams.delete("xref");
    this.searchParams.delete("courseId");
    this.window.history.replaceState(
      {},
      "",
      `${this.window.location.pathname}?${this.searchParams.toString()}`
    );
  };

  @computed
  get apiRequestIsLoading() {
    return this.wishlistProcessState === WISHLIST_LOADING_STATE;
  }
}
