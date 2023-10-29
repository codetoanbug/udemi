import classNames from "classnames";
import { inject } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";

import { withMatchMedia } from "@udemy/hooks";
import { SaveToListButtonWrapper } from "udemy-django-static/js/browse/components/save-to-list/save-to-list-button-wrapper.react-component";

import styles from "./course-card-resource-context-menu.module.less";

@inject(
  ({
    resourceContextMenu,
    resourceContextMenuProps,
    uiRegion,
    enableLectureBottomDrawerOnSRP = false,
  }) => ({
    resourceContextMenu,
    resourceContextMenuProps,
    uiRegion,
    enableLectureBottomDrawerOnSRP,
  })
)
@withMatchMedia({ isDesktop: "md-min" })
export default class CourseCardResourceContextMenuWrapper extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    resourceContextMenu: PropTypes.object,
    resourceContextMenuProps: PropTypes.object,
    className: PropTypes.string,
    isDesktop: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.instanceOf(null),
    ]),
    uiRegion: PropTypes.string.isRequired,
    enableLectureBottomDrawerOnSRP: PropTypes.bool,
  };

  static defaultProps = {
    resourceContextMenu: {},
    resourceContextMenuProps: {},
    className: undefined,
    isDesktop: null,
    enableLectureBottomDrawerOnSRP: false,
  };

  render() {
    const {
      children,
      className,
      course,
      isDesktop,
      resourceContextMenu,
      resourceContextMenuProps,
    } = this.props;

    const courseContextMenu = resourceContextMenu.getCourseCardContextMenu
      ? resourceContextMenu.getCourseCardContextMenu(
          { ...course, isPublished: true },
          resourceContextMenuProps
        )
      : null;

    if (courseContextMenu) {
      return (
        <div className={classNames(className, styles["card-wrapper"])}>
          {children}
          <div className={styles["more-menu-button"]}>{courseContextMenu}</div>
        </div>
      );
    }
    if (course.is_in_user_subscription) {
      return (
        <div
          className={classNames(
            className,
            styles["card-wrapper"],
            styles["card-wrapper-save-button"]
          )}
        >
          {children}
          <SaveToListButtonWrapper
            course={course}
            udStyle={isDesktop ? "secondary" : "ghost"}
            typography="ud-heading-md"
            size={isDesktop ? "large" : "medium"}
            uiRegion={this.props.uiRegion}
            className={styles["save-to-list-button"]}
            labelPosition={
              this.props.enableLectureBottomDrawerOnSRP && !isDesktop
                ? "right"
                : "left"
            }
            label={
              this.props.enableLectureBottomDrawerOnSRP
                ? gettext("Save")
                : undefined
            }
          />
        </div>
      );
    }
    return children;
  }
}
