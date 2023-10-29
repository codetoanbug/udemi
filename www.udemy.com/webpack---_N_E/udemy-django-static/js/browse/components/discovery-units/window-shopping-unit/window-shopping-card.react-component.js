import classNames from "classnames";

import { inject } from "mobx-react";
import PropTypes from "prop-types";
import React, { Component } from "react";

import { StarRating } from "@udemy/react-merchandising-components";
import { courseBadgeFromType } from "udemy-django-static/js/browse/components/badge/course-badges.react-component";
import { withFunnelLog } from "@udemy/funnel-tracking";
import {
  trackGenericCourseClick,
  TrackImpression,
} from "@udemy/event-tracking";
import { safelySetInnerHTML } from "udemy-django-static/js/utils/escape/safely-set-inner-html";
import { formatNumber } from "udemy-django-static/js/utils/numeral";
import styles from "./window-shopping-card.module.less";

// Todo remove Funnel Log after events migration complete
@inject(({ trackingContext = {} }) => ({ trackingContext }))
@withFunnelLog("course")
export default class WindowShoppingCard extends Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    className: PropTypes.string,
    trackingContext: PropTypes.shape({
      trackImpressionFunc: PropTypes.func,
    }).isRequired,
    trackingClickCallbackFunc: PropTypes.func,
    titleTag: PropTypes.elementType,
  };

  static defaultProps = {
    className: undefined,
    trackingClickCallbackFunc: undefined,
    titleTag: "div",
  };

  trackImpression = () => {
    const { trackImpressionFunc, ...trackingContext } =
      this.props.trackingContext;
    // Think of this as trackImpressionFunc(componentLocalData, trackingContext)
    trackImpressionFunc({ item: this.props.course }, trackingContext);
  };

  trackClick = () => {
    const trackingClickCallbackFunc = this.props.trackingClickCallbackFunc;
    trackGenericCourseClick({
      courseId: this.props.course.id,
      courseTrackingId:
        this.props.course.frontendTrackingId || this.props.course.tracking_id,
      componentName: "courseCard",
    });
    if (trackingClickCallbackFunc) {
      trackingClickCallbackFunc();
    }
  };

  render() {
    const { course, className, titleTag: Title } = this.props;
    const badgeData =
      course.badges && course.badges.length > 0 && course.badges[0];
    const CourseBadgeComponent =
      badgeData && courseBadgeFromType(badgeData.badge_family);
    return (
      <TrackImpression trackFunc={this.trackImpression}>
        <div className={classNames(className, styles["card"])}>
          <Title>
            <a
              className={classNames("ud-heading-lg", styles["course-title"])}
              data-purpose="course-title"
              href={course.url}
              onClick={this.trackClick}
            >
              {course.title}
            </a>
          </Title>
          {course.visible_instructors.length && (
            <div
              className={classNames("ud-text-sm", styles["instructor-list"])}
              {...safelySetInnerHTML({
                descriptionOfCaller: "course-card:visible-instructors",
                html: course.visible_instructors
                  .map((instructor) => instructor.display_name)
                  .join(", "),
              })}
            />
          )}
          <div className={classNames("ud-text-sm", styles["num-students"])}>
            {ninterpolate(
              "%(numSubscriber)s student",
              "%(numSubscriber)s students",
              course.num_subscribers,
              {
                numSubscriber: formatNumber(course.num_subscribers),
              }
            )}
          </div>
          <div className={styles["row"]}>
            <StarRating showNumber={true} rating={course.rating} />
            <span
              aria-label={ninterpolate(
                "%(count)s review",
                "%(count)s reviews",
                course.num_reviews,
                { count: course.num_reviews }
              )}
              className={classNames("ud-text-xs", styles["reviews-text"])}
            >{`(${formatNumber(course.num_reviews)})`}</span>
          </div>
          {CourseBadgeComponent && <CourseBadgeComponent />}
        </div>
      </TrackImpression>
    );
  }
}
