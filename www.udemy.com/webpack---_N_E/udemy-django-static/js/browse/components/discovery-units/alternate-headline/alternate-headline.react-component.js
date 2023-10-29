import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import styles from "./alternate-headline.module.less";

const AlternateHeadline = ({
  className,
  title,
  titleTag,
  secondaryText,
  titleClass,
  titleStyle,
  secondaryTextClass,
  secondaryTextStyle,
  layoutVariant,
  titleId,
}) => {
  let defaultTitleClass = "ud-heading-xl";
  let headingStyle = styles[titleStyle];

  switch (layoutVariant) {
    case "compact":
      defaultTitleClass = "ud-heading-lg";
      headingStyle = styles["title-compact"];
      secondaryTextClass = "ud-text-sm";
      break;
    case "default":
      defaultTitleClass = "ud-heading-xl";
      break;
    case "large":
      defaultTitleClass = "ud-heading-xxl";
      break;
  }

  titleClass = titleClass || defaultTitleClass;
  titleId = titleId !== "" ? titleId : title;
  const titleText = React.createElement(
    titleTag,
    {
      id: titleId,
      className: titleClass,
      "data-purpose": "alternate-headline-title",
    },
    title
  );

  return (
    <div className={classNames(styles["title-container"], className)}>
      <div className={headingStyle}>{titleText}</div>
      {secondaryText && (
        <p
          className={classNames(secondaryTextClass, styles[secondaryTextStyle])}
        >
          {secondaryText}
        </p>
      )}
    </div>
  );
};

AlternateHeadline.propTypes = {
  title: PropTypes.string.isRequired,
  titleTag: PropTypes.oneOf(["div", "h1", "h2"]),
  secondaryText: PropTypes.string,
  className: PropTypes.string,
  titleClass: PropTypes.string,
  titleStyle: PropTypes.oneOf([
    "title",
    "title-compact",
    "topic-page-title",
    "title-no-margin",
  ]),
  secondaryTextClass: PropTypes.string,
  secondaryTextStyle: PropTypes.string,
  layoutVariant: PropTypes.oneOf(["compact", "default", "large"]),
  titleId: PropTypes.string,
};
AlternateHeadline.defaultProps = {
  titleTag: "div", // Don't change this unless SEO specifically asks for it
  secondaryText: undefined,
  className: undefined,
  titleClass: undefined,
  titleStyle: "title",
  secondaryTextClass: "ud-text-md",
  secondaryTextStyle: "secondary-text",
  layoutVariant: "default",
  titleId: "",
};

export default AlternateHeadline;
