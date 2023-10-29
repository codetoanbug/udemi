import { TrackingContextProvider } from "@udemy/event-tracking";
import classNames from "classnames";
import { inject } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";

import AsyncPriceCourseCard from "udemy-django-static/js/browse/components/course-card/async-price-course-card.react-component";
import { CourseObjectivesQuickViewBox } from "@udemy/react-discovery-units";
import ItemInjector from "udemy-django-static/js/browse/components/item-injector/item-injector.react-component";
import CourseCardResourceContextMenuWrapper from "udemy-django-static/js/organization-common/resource-context-menu/course-card-resource-context-menu-wrapper.react-component";

import styles from "./course-list.module.less";

const CourseList = inject(({ enableLectureBottomDrawerOnSRP = false }) => ({
  enableLectureBottomDrawerOnSRP,
}))(
  ({
    children = null,
    courses,
    loading,
    renderCourseCard,
    showCtaOnPopover,
    lowerFirstPopover,
    enableLectureBottomDrawerOnSRP = false,
  }) => {
    if (!courses || courses.length === 0) {
      return null;
    }
    return (
      <div
        className={classNames(styles.container, {
          [styles.loading]: loading,
          [styles["container-search"]]: enableLectureBottomDrawerOnSRP,
        })}
      >
        <ItemInjector>
          {renderCourseCard
            ? renderCourseCard(courses)
            : courses.map((course, index) => (
                <TrackingContextProvider
                  // adding frontendTackingId as key so when filter changes and courses are reloaded,
                  // react knows that there has been a change to trigger events. TB-4768
                  key={`${course.id} ${course.frontendTrackingId}`}
                  trackingContext={{ index }}
                >
                  <CourseCardResourceContextMenuWrapper
                    className="course-list-context-menu"
                    course={course}
                  >
                    {course.objectives_summary?.length > 0 ? (
                      <CourseObjectivesQuickViewBox
                        course={course}
                        courseCard={
                          <AsyncPriceCourseCard course={course} size="large" />
                        }
                        className={styles["quick-view-box"]}
                        showCta={showCtaOnPopover}
                        placement={
                          lowerFirstPopover && index === 0
                            ? "bottom"
                            : undefined
                        }
                      />
                    ) : (
                      <AsyncPriceCourseCard course={course} size="large" />
                    )}
                  </CourseCardResourceContextMenuWrapper>
                </TrackingContextProvider>
              ))}
          {children}
        </ItemInjector>
      </div>
    );
  }
);

CourseList.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  renderCourseCard: PropTypes.func,
  showCtaOnPopover: PropTypes.bool,
  lowerFirstPopover: PropTypes.bool,
};

CourseList.defaultProps = {
  loading: false,
  renderCourseCard: undefined,
  showCtaOnPopover: false,
  lowerFirstPopover: false,
};

export default CourseList;
