import { observable, action } from "mobx";

import serverOrClient from "udemy-django-static/js/utils/server-or-client";
import udApi from "udemy-django-static/js/utils/ud-api";

const BATCH_SIZE = 10;

export const PRICING_API = "pricing/";
export const PRICING_API_FIELDS =
  "price,discount_price,list_price,price_detail,price_serve_tracking_id";

export const PRICE_STATUS_LOADING = "loading";
export const PRICE_STATUS_LOADED = "loaded";
export const PRICE_STATUS_ERROR = "error";

class CoursePriceStore {
  constructor() {
    this.priceMap = observable.map({}, { name: "priceMap", deep: false });
    this.modelMap = observable.map({}, { name: "modelMap", deep: false });
    this.isLoading = false;
    this._courseIdsToFetch = [];
    this._timeouts = [];
  }

  registerCourse = (course, initialPrice = {}) => {
    // Store the original model so we can update it once we get the price (in _updatePriceMap).
    // This is done just for funnel-logging. Once migrate off it, this should be removed.
    this.modelMap.set(+course.id, course);

    const existingPrice = this.priceMap.get(course.id);
    if (existingPrice && existingPrice.status !== PRICE_STATUS_ERROR) {
      return;
    }
    this._setCoursePrice(course.id, initialPrice);
    if (this._courseIdsToFetch.length === 0) {
      this._courseIdsToFetch.push(course.id);
      this._loadCourses();
    } else {
      this._courseIdsToFetch.push(course.id);
    }
  };

  _loadCourses = () => {
    if (serverOrClient.isClient) {
      this.isLoading = true;
      this._timeouts.push(setTimeout(this._requestInBatches, 250));
    }
  };

  _requestInBatches = () => {
    const sortedCourseIds = this._courseIdsToFetch.sort();
    while (sortedCourseIds.length !== 0) {
      const courseIds = sortedCourseIds.splice(0, BATCH_SIZE);
      udApi
        .get(PRICING_API, {
          params: {
            course_ids: courseIds.join(","),
            "fields[pricing_result]": PRICING_API_FIELDS,
          },
        })
        .then(this._updatePriceMap)
        .catch(this._updateErrorState(courseIds));
    }
    this.isLoading = false;
  };

  @action
  _updatePriceMap = (responseData) => {
    Object.entries(responseData.data.courses).forEach(
      ([courseId, priceResult]) => {
        const priceObj = {
          discount: {
            price: priceResult.price,
          },
          discount_price: priceResult.discount_price,
          price: priceResult.list_price.price_string,
          price_detail: priceResult.price_detail,
          price_serve_tracking_id: priceResult.price_serve_tracking_id,
          status: PRICE_STATUS_LOADED,
        };
        courseId = parseInt(courseId, 10);
        this.priceMap.set(courseId, priceObj);

        const courseModel = this.modelMap.get(courseId);
        if (courseModel && courseModel._course) {
          Object.assign(courseModel._course, priceObj);
        }
      }
    );
  };

  _updateErrorState = (courseIds) => {
    return action(() => {
      courseIds.forEach((courseId) => {
        const existingPrice = this.priceMap.get(courseId);
        const newStatus = { ...existingPrice, status: PRICE_STATUS_ERROR };
        this.priceMap.set(courseId, newStatus);
      });
    });
  };

  @action
  _setCoursePrice(id, price) {
    this.priceMap.set(id, { ...price, status: PRICE_STATUS_LOADING });
  }

  @action
  reset() {
    // utility for testing
    this.priceMap.clear();
    this.isLoading = false;
    this._courseIdsToFetch = [];
    this._timeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
  }
}

export default new CoursePriceStore();
