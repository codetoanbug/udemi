import React, { Component } from "react";

import AsyncCourseStaticPriceText from "udemy-django-static/js/base-components/price-text/async-course-static-price-text.react-component";
import BrowseCourseCard from "udemy-django-static/js/browse/components/course-card/browse-course-card.react-component";

const renderWithAsyncCourseStaticPrice = (
  UnusedComponents,
  propsFromComponent
) => {
  const { course, ...passThroughProps } = propsFromComponent;
  return (
    <AsyncCourseStaticPriceText courses={[course]} {...passThroughProps} />
  );
};

export default class AsyncPriceCourseCard extends Component {
  render() {
    return (
      <BrowseCourseCard
        renderPriceText={renderWithAsyncCourseStaticPrice}
        {...this.props}
      />
    );
  }
}
