import {
  TrackImpression,
  trackGenericCourseClick,
} from "@udemy/event-tracking";
import { withMatchMedia } from "@udemy/hooks";
import { PlayOverlay } from "@udemy/react-structure-components";
import classNames from "classnames";
import { inject } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";

import CourseCard from "udemy-django-static/js/base-components/course-card/course-card.react-component";
import { COURSE_BADGE_CODING_EXERCISES } from "udemy-django-static/js/browse/components/badge/constants";
import { courseBadgeFromType } from "udemy-django-static/js/browse/components/badge/course-badges.react-component";
import { SelectBadge } from "udemy-django-static/js/browse/components/badge/select-badge.react-component";
import { withFunnelLog } from "@udemy/funnel-tracking";
import { PersonalPlanBadge } from "udemy-django-static/js/browse/components/personal-plan-badge/personal-plan-badge.react-component";
import { BackendSourceOptions } from "udemy-django-static/js/browse/events";
import { trackCourseClickEvent } from "udemy-django-static/js/browse/lib/common-tracking";
import { CourseCardSeoInfo } from "./course-card-seo-info.react-component";

import styles from "./browse-course-card.module.less";

/*
Browse version of CourseCard wraps the base CourseCard with a course link, and
adds tracking for impressions and clicks.
 */

// Todo remove Funnel Log after events migration complete
@withMatchMedia({ isMobileMax: "mobile-max" })
@inject(
  ({
    showPersonalPlanBadge,
    trackingContext = {},
    showCodingExercisesBadge,
  }) => ({
    showPersonalPlanBadge,
    trackingContext,
    showCodingExercisesBadge,
  })
)
@withFunnelLog("course")
export default class BrowseCourseCard extends React.Component {
  static propTypes = {
    ...CourseCard.propTypes,
    trackingContext: PropTypes.shape({
      trackImpressionFunc: PropTypes.func,
      relatedSourceId: PropTypes.string,
      relatedSourceType: PropTypes.string,
    }).isRequired,
    trackingClickCallbackFunc: PropTypes.func,
    showPersonalPlanBadge: PropTypes.bool,
    isMobileMax: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.instanceOf(null),
    ]),
    showCodingExercisesBadge: PropTypes.bool,
  };

  static defaultProps = {
    ...CourseCard.defaultProps,
    trackingClickCallbackFunc: undefined,
    showPersonalPlanBadge: false,
    isMobileMax: null,
    showCodingExercisesBadge: false,
  };

  trackImpression = () => {
    const {
      trackImpressionFunc,
      relatedSourceId,
      relatedSourceType,
      ...trackingContext
    } = this.props.trackingContext;

    trackImpressionFunc({ item: this.props.course }, trackingContext, {
      relatedSourceId,
      relatedSourceType,
    });
  };

  trackClick = () => {
    const trackingClickCallbackFunc = this.props.trackingClickCallbackFunc;
    const { index } = this.props.trackingContext;
    trackGenericCourseClick({
      courseId: this.props.course.id,
      courseTrackingId:
        this.props.course.frontendTrackingId || this.props.course.tracking_id,
      componentName: "courseCard",
      index,
    });

    trackCourseClickEvent(
      this.props.course,
      index,
      BackendSourceOptions.DISCOVERY
    );

    if (trackingClickCallbackFunc) {
      trackingClickCallbackFunc();
    }
  };

  render() {
    const {
      children,
      trackingContext,
      trackingClickCallbackFunc,
      isUserEnrolled,
      showPersonalPlanBadge,
      isMobileMax,
      showCodingExercisesBadge,
      ...props
    } = this.props;
    const { className, course, size } = props;
    if (course.is_in_user_subscription || isUserEnrolled) {
      props.renderPriceText = () => null;
      props.showBadges = false;
    }

    const showSelectBadgeOnImage =
      size === "medium" || (size === "large" && !isMobileMax);
    const renderCourseImage = (Component, props) => {
      props.className = classNames(props.className, styles.image);
      if (isUserEnrolled) {
        return (
          <>
            {this.props.renderCourseImage(Component, props)}
            <div className={styles["opacity-overlay-dark"]} />
            <PlayOverlay className={styles["enrolled-play-overlay-mobile"]} />
          </>
        );
      }
      if (course.is_in_personal_plan_collection && showPersonalPlanBadge) {
        return (
          <>
            {this.props.renderCourseImage(Component, props)}
            <PersonalPlanBadge />
          </>
        );
      }
      if (
        course.is_in_premium &&
        !course.is_in_user_subscription &&
        this.props.showBadges &&
        showSelectBadgeOnImage
      ) {
        return (
          <>
            {this.props.renderCourseImage(Component, props)}
            <SelectBadge onCardDetails={false} />
          </>
        );
      }

      return this.props.renderCourseImage(Component, props);
    };

    const renderCourseTitle = (Component, props) => {
      return this.props.renderCourseTitle(Component, {
        ...props,
        children: (
          <>
            {props.children}
            <CourseCardSeoInfo course={this.props.course} />
          </>
        ),
      });
    };

    const renderCourseBadges = (Component, props) => {
      const shouldShowSelectBadge =
        course.is_in_premium &&
        !course.is_in_user_subscription &&
        this.props.showBadges &&
        !showSelectBadgeOnImage;

      if (shouldShowSelectBadge) {
        return (
          <Component {...props}>
            <SelectBadge />
          </Component>
        );
      }

      if (
        showCodingExercisesBadge &&
        course.is_coding_exercises_badge_eligible &&
        this.props.showBadges
      ) {
        const CodingExercisesBadgeComponent = courseBadgeFromType(
          COURSE_BADGE_CODING_EXERCISES
        );
        return (
          <Component {...props}>
            <CodingExercisesBadgeComponent />
          </Component>
        );
      }

      return this.props.renderCourseBadges(Component, props);
    };

    const courseCardLink = (
      <CourseCard
        {...props}
        className={className}
        renderCourseImage={renderCourseImage}
        renderCourseTitle={renderCourseTitle}
        renderCourseBadges={renderCourseBadges}
        url={course.is_in_user_subscription ? course.learn_url : course.url}
        onClick={this.trackClick}
        onContextMenu={this.trackClick}
      >
        {children}
      </CourseCard>
    );

    if (!trackingContext.trackImpressionFunc) {
      return courseCardLink;
    }
    return (
      <TrackImpression trackFunc={this.trackImpression}>
        {courseCardLink}
      </TrackImpression>
    );
  }
}
