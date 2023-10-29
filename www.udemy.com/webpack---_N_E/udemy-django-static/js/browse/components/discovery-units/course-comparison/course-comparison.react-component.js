import classNames from "classnames";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";

import PeopleIcon from "@udemy/icons/dist/people.ud-icon";
import { Image, Button } from "@udemy/react-core-components";
import AsyncCourseStaticPriceText from "udemy-django-static/js/base-components/price-text/async-course-static-price-text.react-component";
import PURCHASE_PRICE_TYPES from "udemy-django-static/js/base-components/price-text/constants";
import { ShowMore } from "@udemy/react-reveal-components";
import { StarRating } from "@udemy/react-merchandising-components";
import { discoveryTracker } from "udemy-django-static/js/browse/tracking";
import { courseBadgeFromType } from "udemy-django-static/js/browse/components/badge/course-badges.react-component";
import { FunnelLog } from "@udemy/funnel-tracking";
import { UI_REGION } from "udemy-django-static/js/browse/ui-regions";
import { SelectBadge } from "udemy-django-static/js/browse/components/badge/select-badge.react-component";
import WishlistStore from "udemy-django-static/js/course-landing-page/components/wishlist/wishlist.mobx-store";
import Wishlist from "udemy-django-static/js/course-landing-page/components/wishlist/wishlist.react-component";
import {
  trackGenericCourseClick,
  TrackImpression,
  TrackingContextProvider,
} from "@udemy/event-tracking";
import getRequestData from "udemy-django-static/js/utils/get-request-data";
import { formatNumber } from "udemy-django-static/js/utils/numeral";

import { DISPLAYED_SECTIONS_COUNT } from "./constants";
import styles from "./course-comparison.module.less";

const ShowMoreButton = (props) => (
  <Button {...props} udStyle="secondary">
    {props.children}
  </Button>
);

export const CourseImage = ({ course, ...passThroughProps }) => {
  return (
    <Image
      src={course.image_50x50}
      srcSet={`${course.image_50x50} 1x, ${course.image_100x100} 2x`}
      alt=""
      width={64}
      height={64}
      {...passThroughProps}
      className={styles["course-image"]}
    />
  );
};

CourseImage.propTypes = {
  course: PropTypes.object.isRequired,
};

export const NumStudents = ({ numStudents }) => (
  <span className={classNames("ud-text-sm", styles["num-students"])}>
    <PeopleIcon label={false} size="xsmall" />
    <span>{formatNumber(numStudents)}</span>
  </span>
);

NumStudents.propTypes = {
  numStudents: PropTypes.number.isRequired,
};

const LastUpdatedDate = ({ lastUpdatedDate }) => {
  const date = new Date(lastUpdatedDate);
  const udRequest = getRequestData();
  const userLocale =
    udRequest && udRequest.locale
      ? udRequest.locale.replace("_", "-")
      : "en-US";
  const lastUpdateDate = date.toLocaleDateString(userLocale, {
    month: "numeric",
    year: "numeric",
  });

  return (
    <span>
      {gettext("Updated")} {lastUpdateDate}
    </span>
  );
};

LastUpdatedDate.propTypes = {
  lastUpdatedDate: PropTypes.string.isRequired,
};

@inject(({ trackingContext = {} }) => ({ trackingContext }))
class CourseComparisonItem extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    trackingContext: PropTypes.shape({
      index: PropTypes.number.isRequired,
      backendSource: PropTypes.string.isRequired,
    }).isRequired,
  };

  trackClick = () => {
    trackGenericCourseClick({
      courseId: this.props.course.id,
      courseTrackingId: this.props.course.frontendTrackingId,
      componentName: "courseComparisonItem",
    });
  };

  trackImpression = () => {
    discoveryTracker.trackDiscoveryImpression(
      { item: this.props.course },
      {
        backendSource: this.props.trackingContext.backendSource,
        index: this.props.trackingContext.index,
      }
    );
  };

  render() {
    const { course } = this.props;
    const CourseBadgeComponent =
      course.badges && course.badges.length
        ? courseBadgeFromType(course.badges[0].badge_family)
        : null;

    return (
      <TrackImpression trackFunc={this.trackImpression}>
        {/*
                This div between instances of Observer (inside TrackImpression and FunnelLog)
                is needed to allow both Observers to work, on Firefox.  Without it, only one will
                fire and we'll lose events. It can be removed when we remove FunnelLog.
                */}
        <div>
          <FunnelLog item={course}>
            <div
              data-purpose="course-container"
              className={styles["course-container"]}
            >
              <div className={styles["main-content"]}>
                {/* This is the only link that should receive keyboard focus */}
                <a
                  className={classNames(
                    "ud-heading-md",
                    styles["course-title"]
                  )}
                  href={course.url}
                  onClick={this.trackClick}
                  onContextMenu={this.trackClick}
                >
                  {course.title}
                </a>
                <div className={styles["course-info"]}>
                  <div className={styles["course-badges"]}>
                    {course.is_in_premium &&
                      !course.is_in_user_subscription && <SelectBadge />}
                    {CourseBadgeComponent && <CourseBadgeComponent />}
                  </div>
                  <div
                    className={classNames("ud-text-sm", styles["meta-items"])}
                  >
                    {course.content_info && (
                      <span className={styles["content-info"]}>
                        {course.content_info}
                      </span>
                    )}
                    {course.last_update_date && (
                      <LastUpdatedDate
                        lastUpdatedDate={course.last_update_date}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles["comparison-content"]}>
                <StarRating
                  showNumber={true}
                  rating={course.rating}
                  numeric={true}
                />
                <NumStudents numStudents={course.num_subscribers} />
                <AsyncCourseStaticPriceText
                  courses={[course]}
                  className={classNames(styles["price-text-container"], {
                    [styles["hide-in-subscription"]]:
                      course.is_in_user_subscription,
                  })}
                  listPriceClassName={classNames(
                    "ud-text-xs",
                    styles["list-price"]
                  )}
                  discountPriceClassName={classNames(
                    "ud-heading-sm",
                    styles["discount-price"]
                  )}
                  trackingEventContext={{
                    buyableId: course.id,
                    buyableType: "course",
                    priceType: PURCHASE_PRICE_TYPES.individual_buyable,
                    buyableTrackingId:
                      course.frontendTrackingId || course.tracking_id,
                  }}
                />
              </div>
              <div className={styles["image-wrapper"]}>
                <CourseImage course={course} />
              </div>
              {/* This link covers the entire course card and should not receive keyboard focus*/}
              <a
                href={course.url}
                aria-hidden="true"
                tabIndex="-1"
                onClick={this.trackClick}
                onContextMenu={this.trackClick}
                className={styles["whole-card-link"]}
              />
              {/* Wishlist comes after the full link so the button is still clickable. We are not making
                                the whole-card-link the first element because then the other elements would be clickable */}
              <div
                data-purpose="wishlist-container"
                className={classNames(styles["wishlist-content"], {
                  [styles["hide-in-subscription"]]:
                    course.is_in_user_subscription,
                })}
              >
                <Wishlist
                  wishlistStore={new WishlistStore(course, window)}
                  round={true}
                  uiRegion={UI_REGION.COURSE_COMPARISON}
                />
              </div>
            </div>
          </FunnelLog>
        </div>
      </TrackImpression>
    );
  }
}

@observer
export default class CourseComparison extends React.Component {
  static propTypes = {
    unit: PropTypes.object,
    currentCourseId: PropTypes.number.isRequired,
    pageType: PropTypes.string.isRequired,
    showTitle: PropTypes.bool,
  };

  static defaultProps = {
    unit: {},
    showTitle: true,
  };

  render() {
    const recommendedCourses = this.props.unit.items;
    if (!recommendedCourses.length) {
      return <div className="discovery-unit-empty-render" />;
    }

    const hiddenSectionsCount =
      recommendedCourses.length - DISPLAYED_SECTIONS_COUNT;
    const sectionComponents = recommendedCourses.map((course, index) => {
      return (
        <TrackingContextProvider trackingContext={{ index }} key={course.id}>
          <CourseComparisonItem course={course} />
        </TrackingContextProvider>
      );
    });

    return (
      <>
        {this.props.showTitle && (
          <h2 className="ud-heading-xl" data-purpose="title">
            {this.props.unit.title || gettext("Students also bought")}
          </h2>
        )}
        {hiddenSectionsCount > 0 ? (
          <ShowMore
            collapsedHeight={610}
            fullWidthButton={true}
            buttonComponent={ShowMoreButton}
            hideIcons={true}
            className={styles["show-more"]}
            data-purpose="show-more-container"
          >
            <div
              data-purpose="show-more-content-container"
              className={styles["content-container"]}
            >
              {sectionComponents}
            </div>
          </ShowMore>
        ) : (
          <div
            data-purpose="short-list-content-container"
            className={styles["content-container"]}
          >
            {sectionComponents}
          </div>
        )}
      </>
    );
  }
}
