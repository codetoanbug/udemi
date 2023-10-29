import hoistStatics from "hoist-non-react-statics";
import { observer, PropTypes as MobxPropTypes } from "mobx-react";
import PropTypes from "prop-types";
import React, { Component } from "react";

import { getDisplayName } from "udemy-django-static/js/browse/lib/utils";
import CoursePriceStore, {
  PRICE_STATUS_ERROR,
  PRICE_STATUS_LOADING,
} from "udemy-django-static/js/course-price-store//course-price-store";

export default function deferredCoursePriceGenerator(
  LoadingComponent,
  ErrorComponent
) {
  return function withDeferredCoursePrice(WrappedPriceText) {
    class AsyncPriceText extends Component {
      static propTypes = {
        className: PropTypes.string,
        courses: MobxPropTypes.arrayOrObservableArray,
        loaderProps: PropTypes.object,
      };

      static defaultProps = {
        courses: [],
        className: "",
        loaderProps: {},
      };

      static displayName = `WithCourse${getDisplayName(WrappedPriceText)}`;

      constructor(props) {
        super(props);
        props.courses.forEach((course) => this.registerCourse(course));
      }

      registerCourse(course) {
        if (course.price) {
          CoursePriceStore.registerCourse(course, {
            price: course.price,
            price_detail: course.price_detail,
            discount: course.discount,
            discount_price: course.discount_price,
          });
        } else {
          CoursePriceStore.registerCourse(course);
        }
      }

      getPriceAmountsFromCoursePrice(coursePrice) {
        const courseListPrice = coursePrice.price_detail
          ? coursePrice.price_detail.amount
          : 0;
        const courseDiscountPrice = coursePrice.discount
          ? coursePrice.discount.price.amount
          : 0;
        return { courseListPrice, courseDiscountPrice };
      }

      getPriceStringsFromCoursePrice(coursePrice) {
        const courseListPriceString = coursePrice.price_detail
          ? coursePrice.price_detail.price_string
          : undefined;
        const courseDiscountPriceString = coursePrice.discount
          ? coursePrice.discount.price.price_string
          : undefined;
        return { courseListPriceString, courseDiscountPriceString };
      }

      render() {
        const { courses, loaderProps, ...restOfProps } = this.props;
        const hasError = courses.some((course) => {
          return (
            CoursePriceStore.priceMap.get(course.id).status ===
            PRICE_STATUS_ERROR
          );
        });

        if (hasError) {
          return <ErrorComponent className={this.props.className} />;
        }

        const isLoading = courses.some((course) => {
          return (
            CoursePriceStore.priceMap.get(course.id).status ===
            PRICE_STATUS_LOADING
          );
        });

        if (isLoading) {
          return (
            <LoadingComponent
              {...loaderProps}
              className={this.props.className}
            />
          );
        }

        const priceTextProps = {};

        let listPrice = 0;
        let discountPrice = 0;
        courses.forEach((course) => {
          const currentCoursePrice = CoursePriceStore.priceMap.get(course.id);
          const { courseListPrice, courseDiscountPrice } =
            this.getPriceAmountsFromCoursePrice(currentCoursePrice);
          listPrice += courseListPrice;
          if (courseDiscountPrice) {
            discountPrice += courseDiscountPrice;
          } else {
            discountPrice += courseListPrice;
          }
        });

        priceTextProps.listPrice = listPrice;
        priceTextProps.discountPrice = discountPrice;
        if (courses.length === 1) {
          const coursePrice = CoursePriceStore.priceMap.get(courses[0].id);
          const { courseListPriceString, courseDiscountPriceString } =
            this.getPriceStringsFromCoursePrice(coursePrice);
          priceTextProps.listPriceString = courseListPriceString;
          priceTextProps.discountPriceString =
            courseDiscountPriceString || courseListPriceString;
          priceTextProps.priceServeTrackingId =
            coursePrice.price_serve_tracking_id;
        }
        return <WrappedPriceText {...priceTextProps} {...restOfProps} />;
      }
    }
    return hoistStatics(observer(AsyncPriceText), WrappedPriceText);
  };
}
