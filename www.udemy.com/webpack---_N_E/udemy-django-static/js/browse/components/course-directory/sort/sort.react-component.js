import PropTypes from "prop-types";
import React, { useContext } from "react";

import { CompactFormGroup } from "@udemy/react-form-components";
import { Select } from "@udemy/react-form-components";

import FilterFormContext from "../filter-form-context";

function getLabel(sortOption) {
  // After UDlite migration is complete, move this change to the backend
  // AllCoursesDiscoveryUnitViewSet.default_sort_option
  return sortOption.key === "popularity"
    ? gettext("Most Popular")
    : sortOption.label;
}

const Sort = ({ sortOptions, ...props }) => {
  function handleChange(event) {
    event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
  }
  let filteredSortOptions = sortOptions;
  const { hiddenSortOptions = [] } = useContext(FilterFormContext);
  if (hiddenSortOptions) {
    filteredSortOptions = {
      ...sortOptions,
      options: sortOptions.options.filter(
        ({ key }) => !hiddenSortOptions.includes(key)
      ),
    };
  }

  return (
    <CompactFormGroup label={gettext("Sort by")}>
      <Select
        name="sort"
        defaultValue={filteredSortOptions.current_sort_option.key}
        form="filter-form"
        onChange={handleChange}
        {...props}
      >
        <option
          key={filteredSortOptions.current_sort_option.key}
          value={filteredSortOptions.current_sort_option.key}
        >
          {getLabel(filteredSortOptions.current_sort_option)}
        </option>
        {filteredSortOptions.options.map((option) => (
          <option key={option.key} value={option.key}>
            {getLabel(option)}
          </option>
        ))}
      </Select>
    </CompactFormGroup>
  );
};

Sort.propTypes = {
  sortOptions: PropTypes.object.isRequired,
};

export default Sort;
