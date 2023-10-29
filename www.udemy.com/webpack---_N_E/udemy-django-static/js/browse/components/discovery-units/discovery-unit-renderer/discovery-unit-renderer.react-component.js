import { withI18n } from "@udemy/i18n";
import { inject } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";

import { SkillsHubUnit } from "@udemy/react-discovery-units";
import { FunnelLogContextProvider } from "@udemy/funnel-tracking";

import { ErrorBoundary } from "src/components/error-boundary/error-boundary.react-component";
import { AssessmentUnit } from "udemy-django-static/js/browse/components/discovery-units/assessment-unit/assessment-unit.react-component";
import CourseComparison from "udemy-django-static/js/browse/components/discovery-units/course-comparison/course-comparison.react-component";
import { CourseUnit } from "@udemy/react-discovery-units";
import { IncludedTopicsUnit } from "udemy-django-static/js/browse/components/discovery-units/included-topics-unit/included-topics-unit.react-component";
import { LabUnit } from "udemy-django-static/js/browse/components/discovery-units/lab-unit/lab-unit.react-component";
import { LectureStackRecommendationUnit } from "udemy-django-static/js/browse/components/discovery-units/lecture-stack-recommendation-unit/lecture-stack-recommendation-unit.react-component";
import LectureUnit from "udemy-django-static/js/browse/components/discovery-units/lecture-unit/lecture-unit.react-component";
import NextTopicsUnit from "udemy-django-static/js/browse/components/discovery-units/next-topics-unit/next-topics-unit.react-component";
import OccupationUnit from "udemy-django-static/js/browse/components/discovery-units/occupation-unit/occupation-unit.react-component";
import { PopularInstructorsUnit } from "udemy-django-static/js/browse/components/discovery-units/popular-instructors-unit/popular-instructors-unit.react-component";
import PopularTopicsUnit from "udemy-django-static/js/browse/components/discovery-units/popular-topics-unit/popular-topics-unit.react-component";
import RelatedCategoriesUnit from "udemy-django-static/js/browse/components/discovery-units/related-categories-unit/related-categories-unit.react-component";
import { RelatedOccupationsUnit } from "udemy-django-static/js/browse/components/discovery-units/related-occupations-unit/related-occupations-unit.react-component";
import SequenceUnit from "udemy-django-static/js/browse/components/discovery-units/sequence-unit/sequence-unit.react-component";
import SingleCourseUnit from "udemy-django-static/js/browse/components/discovery-units/single-course-unit/single-course-unit.react-component";
import ValueProps from "udemy-django-static/js/browse/components/discovery-units/value-props/value-props.react-component";
import WindowShoppingUnit from "udemy-django-static/js/browse/components/discovery-units/window-shopping-unit/window-shopping-unit.react-component";

import { pageTypes } from "udemy-django-static/js/browse/lib/constants";
import udPerf from "udemy-django-static/js/utils/ud-performance";

/**
 * Receives a unit object and renders the appropriate unit.
 *
 * const unitTypes = [
 'bestseller',
 'bestseller_labels',
 'enroll_based',
 'most_viewed',
 'newest',
 'next_topics',
 'related_categories',
 'related_subcategories',
 'short_and_sweet',
 'view_based',
 'bundle',
 'algorithm_based_occupation'
 ];
 const viewTypes = ['horizontal_tabbed', 'window_shopping', 'default'];
 const itemTypes = ['course', 'course_label', 'instructor', 'category', 'subcategory', 'occupation'];
 const memberOf = ['skills_hub_categories', 'skills_hub_top_new_beginner'];
 */
@inject((stores) => ({ shouldSendPerfMetric: stores.shouldSendPerfMetric }))
class DiscoveryUnitRenderer extends React.Component {
  static propTypes = {
    unit: PropTypes.object.isRequired,
    shouldSendPerfMetric: PropTypes.bool,
    pageType: PropTypes.oneOf(pageTypes).isRequired,
    unitPropsByType: PropTypes.objectOf(PropTypes.object),
    gettext: PropTypes.func.isRequired,
  };

  static defaultProps = { shouldSendPerfMetric: false, unitPropsByType: {} };

  onLoad = () => {
    if (this.props.shouldSendPerfMetric) {
      udPerf.mark("udlite.first-unit-loaded");
    }
  };

  render() {
    let Component;
    let contextObj = {};
    let additionalProps = {};

    switch (this.props.unit.type) {
      case "assessments":
      case "algorithm_based_assessments_with_filter":
      case "algorithm_based_assessments_without_filter":
        Component = AssessmentUnit;
        additionalProps = this.props.unitPropsByType.AssessmentUnit || {};
        break;
      case "bestseller_labels":
        contextObj = {
          subcontext: "affinity",
        };
        if (this.props.unit.view_type === "included_topics") {
          Component = IncludedTopicsUnit;
          additionalProps = {};
        } else {
          Component = PopularTopicsUnit;
          additionalProps = this.props.unitPropsByType.PopularTopicsUnit || {};
        }
        break;
      case "featured_course":
        contextObj = {
          context2: "featured",
          subcontext: this.props.unit.title,
          subcontext2: this.props.unit.id,
        };
        Component = SingleCourseUnit;
        additionalProps = this.props.unitPropsByType.SingleCourseUnit || {};
        break;
      // case 'next_topics': // Skillshub with button
      case "related_categories_and_subcategories":
        Component = RelatedCategoriesUnit;
        additionalProps =
          this.props.unitPropsByType.RelatedCategoriesUnit || {};
        break;
      case "top_instructor":
        contextObj = {
          context2: "featured",
          subcontext: this.props.unit.title,
          subcontext2: this.props.unit.id,
        };
        Component = PopularInstructorsUnit;
        additionalProps = {
          componentName: "popular_instructors_unit",
          ...this.props.unitPropsByType.PopularInstructorsUnit,
        };
        break;
      case "top_pick":
        contextObj = {
          context2: "featured",
          subcontext: this.props.unit.title,
          subcontext2: this.props.unit.id,
        };
        Component = SingleCourseUnit;
        additionalProps = this.props.unitPropsByType.SingleCourseUnit || {};
        break;
      // eventually remove this from Discovery Units and let it be just a normal component
      case "discovery_value_props": // unit processor
        Component = ValueProps;
        additionalProps = this.props.unitPropsByType.ValueProps || {};
        break;
      case "featured_topics_unit":
        Component = () => null;
        break;
      case "next_topics":
        Component = NextTopicsUnit;
        additionalProps = this.props.unitPropsByType.NextTopicsUnit || {};
        break;
      case "algorithm_based_lectures":
      case "cluster_lectures":
        Component = LectureUnit;
        additionalProps = this.props.unitPropsByType.LectureUnit || {};
        break;
      case "algorithm_based_occupation":
        Component = RelatedOccupationsUnit;
        additionalProps =
          this.props.unitPropsByType.RelatedOccupationsUnit || {};
        break;
      case "algorithm_based_labs":
      case "algorithm_based_labs_with_filter":
      case "algorithm_based_labs_without_filter":
        Component = LabUnit;
        additionalProps = this.props.unitPropsByType.LabUnit || {};
        break;
      default:
        switch (this.props.unit.view_type) {
          case "sequence":
            Component = SequenceUnit;
            contextObj = {
              context2: "sequence",
            };
            additionalProps = this.props.unitPropsByType.SequenceUnit || {};
            break;
          case "course_comparison":
            Component = CourseComparison;
            contextObj = {
              context2: "course_comparison",
            };
            additionalProps = this.props.unitPropsByType.CourseComparison || {};
            break;
          case "horizontal_tabbed":
            Component = SkillsHubUnit;
            additionalProps = this.props.unitPropsByType.SkillsHubUnit || {};
            break;
          case "lectures_by_topic":
            Component = LectureStackRecommendationUnit;
            additionalProps =
              this.props.unitPropsByType.LectureStackRecommendationUnit || {};
            break;
          case "popular_topics":
            contextObj = {
              subcontext: "affinity",
            };
            Component = PopularTopicsUnit;
            additionalProps =
              this.props.unitPropsByType.PopularTopicsUnit || {};
            break;
          case "occupation":
            Component = OccupationUnit;
            additionalProps = this.props.unitPropsByType.OccupationUnit || {};
            break;
          case "window_shopping":
            Component = WindowShoppingUnit;
            additionalProps =
              this.props.unitPropsByType.WindowShoppingUnit || {};
            break;
          case "single_course":
            Component = SingleCourseUnit;
            additionalProps = this.props.unitPropsByType.SingleCourseUnit || {};
            break;
          default:
            contextObj = {
              context2: "featured",
              subcontext: this.props.unit.title,
              subcontext2: this.props.unit.id,
            };
            Component = CourseUnit;
            additionalProps = this.props.unitPropsByType.CourseUnit || {};
        }
    }

    // UFB onboarding units should have a link to onboarding again
    if (this.props.unit.view_type === "ufb_onboarding") {
      this.props.unit.actionLink = {
        text: this.props.gettext("Edit selection"),
        buttonProps: {
          href: "/organization/onboarding?p=1",
        },
      };
    }

    return (
      <ErrorBoundary>
        <FunnelLogContextProvider
          pageType={this.props.pageType}
          {...contextObj}
        >
          <Component
            {...this.props}
            {...additionalProps}
            onLoad={this.onLoad}
          />
        </FunnelLogContextProvider>
      </ErrorBoundary>
    );
  }
}

export default withI18n(DiscoveryUnitRenderer);
