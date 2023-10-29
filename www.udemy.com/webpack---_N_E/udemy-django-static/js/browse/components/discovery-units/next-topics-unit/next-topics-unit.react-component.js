import { useI18n } from "@udemy/i18n";
import { Button } from "@udemy/react-core-components";
import PropTypes from "prop-types";
import React from "react";

import { SkillsHubUnit } from "@udemy/react-discovery-units";

import styles from "./next-topics-unit.module.less";

const NextTopicsUnit = (props) => {
  const { unit, ...restOfProps } = props;
  const { gettext } = useI18n();

  const patchedSkillsHubUnit = {
    ...unit,
    available_filters: {
      ...unit.available_filters,
      units: unit.available_filters.course_labels.map((filteredUnit) => {
        return {
          ...filteredUnit,
          topic_url: filteredUnit.url,
          url: `${unit.url}&f_label_id=${filteredUnit.value}&page_size=6`,
        };
      }),
    },
  };

  const unitCta = (unit) => {
    return (
      <Button
        href={unit.topic_url}
        className={styles["button-style"]}
        componentClass="a"
      >
        {gettext("Explore more courses")}
      </Button>
    );
  };

  return (
    <SkillsHubUnit
      {...restOfProps}
      unit={patchedSkillsHubUnit}
      renderUnitCta={unitCta}
    />
  );
};

NextTopicsUnit.propTypes = { unit: PropTypes.object.isRequired };

export default NextTopicsUnit;
