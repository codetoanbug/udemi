import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Error from "@udemy/icons/dist/error.ud-icon";
import { Loader } from "@udemy/react-reveal-components";

import deferredCoursePriceGenerator from "../with-course-price-store-base";
import styles from "./error-component.module.less";

const ErrorComponent = ({ className }) => {
  return (
    <div className={classNames(className, styles["error-container"])}>
      <Error label={false} color="negative" />
      <span className={classNames("ud-heading-xs", styles["error-text"])}>
        {gettext("Error loading price")}
      </span>
    </div>
  );
};

ErrorComponent.propTypes = {
  className: PropTypes.string,
};

ErrorComponent.defaultProps = {
  className: undefined,
};

const LoaderComponent = ({ className }) => (
  <div className={className}>
    <Loader />
  </div>
);

LoaderComponent.propTypes = {
  className: PropTypes.string,
};

LoaderComponent.defaultProps = {
  className: undefined,
};

const withCoursePriceStore = deferredCoursePriceGenerator(
  LoaderComponent,
  ErrorComponent
);

export default withCoursePriceStore;
