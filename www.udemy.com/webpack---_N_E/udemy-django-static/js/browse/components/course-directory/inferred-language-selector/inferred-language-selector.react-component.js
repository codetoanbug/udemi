import PropTypes from "prop-types";
import React from "react";

import { CompactFormGroup } from "@udemy/react-form-components";
import { Select } from "@udemy/react-form-components";
import { SearchInferenceLanguageChangeEvent } from "udemy-django-static/js/browse/events";
import { Tracker } from "@udemy/event-tracking";

import styles from "./inferred-language-selector.module.less";

const InferredLanguageSelector = ({
  backoffLanguages,
  queryLanguageInferenceTrackingId,
  ...props
}) => {
  function handleChange(event) {
    Tracker.publishEvent(
      new SearchInferenceLanguageChangeEvent(
        event.target.value,
        queryLanguageInferenceTrackingId
      )
    );
    event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
  }

  return backoffLanguages ? (
    <CompactFormGroup
      label={gettext("Showing first")}
      className={styles["inferred-language-selector"]}
    >
      <Select
        name="bol"
        defaultValue={backoffLanguages.current_lang_option.key}
        form="filter-form"
        onChange={handleChange}
        {...props}
      >
        <option
          key={backoffLanguages.current_lang_option.key}
          value={backoffLanguages.current_lang_option.key}
        >
          {backoffLanguages.current_lang_option.label}
        </option>
        {backoffLanguages.options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </Select>
    </CompactFormGroup>
  ) : null;
};

InferredLanguageSelector.propTypes = {
  backoffLanguages: PropTypes.object,
  queryLanguageInferenceTrackingId: PropTypes.string,
};

InferredLanguageSelector.defaultProps = {
  backoffLanguages: undefined,
  queryLanguageInferenceTrackingId: undefined,
};

export default InferredLanguageSelector;
