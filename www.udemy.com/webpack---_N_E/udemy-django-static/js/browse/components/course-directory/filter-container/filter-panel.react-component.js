import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { CheckedStateCheckbox } from "@udemy/react-checked-state-components";
import { useMatchMedia } from "@udemy/hooks";
import { formatNumber } from "udemy-django-static/js/utils/numeral";

import FilterForm from "../filter-form/filter-form.react-component";
import FilterButtonContainer from "./filter-button-container.react-component";
import styles from "./filter-panel.module.less";

// For desktop
const FilterPanel = ({
  aggregations,
  pagination,
  children,
  sortOptions,
  backoffLanguages,
  queryLanguageInferenceTrackingId,
  loading,
}) => {
  const isLargeDesktop = useMatchMedia("lg-min");

  // Once we set the `defaultChecked` prop on `CheckedStateCheckbox`, updates
  // to it won't have any effect. Therefore, wait until we receive an actual
  // result from useMatchMedia.
  if (isLargeDesktop === null) {
    return null;
  }

  return (
    <>
      <div
        className={classNames(styles["heading"], {
          [styles["loading"]]: loading,
        })}
      >
        <FilterButtonContainer
          aggregations={aggregations}
          sortOptions={sortOptions}
          backoffLanguages={backoffLanguages}
          queryLanguageInferenceTrackingId={queryLanguageInferenceTrackingId}
        />
        <span
          className={classNames("ud-heading-md", styles["item-count"])}
          role="status"
        >
          {interpolate(
            gettext("%(numberCourses)s results"),
            {
              numberCourses: formatNumber(pagination.total_item_count),
            },
            true
          )}
        </span>
      </div>
      <div className={styles["filtered-paginated-course-list"]}>
        <CheckedStateCheckbox
          id="filter-button"
          defaultChecked={isLargeDesktop}
          className={styles["desktop-sidebar-checkbox"]}
        />
        <div className={styles["filtered-course-list"]}>
          {aggregations && (
            <div
              className={classNames(styles["sidebar"], {
                [styles["loading"]]: loading,
              })}
            >
              <FilterForm
                aggregations={aggregations}
                sortOptions={sortOptions}
                data-purpose="desktop-filter-container"
              />
            </div>
          )}
          <div className={styles["paginated-course-list"]}>{children}</div>
        </div>
      </div>
    </>
  );
};

FilterPanel.propTypes = {
  aggregations: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  sortOptions: PropTypes.object.isRequired,
  backoffLanguages: PropTypes.object,
  queryLanguageInferenceTrackingId: PropTypes.string,
  loading: PropTypes.bool,
};

FilterPanel.defaultProps = {
  loading: false,
  backoffLanguages: undefined,
  queryLanguageInferenceTrackingId: undefined,
};

export default FilterPanel;
