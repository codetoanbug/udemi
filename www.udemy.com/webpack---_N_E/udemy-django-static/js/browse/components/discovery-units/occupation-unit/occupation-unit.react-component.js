import { Tracker } from "@udemy/event-tracking";
import { withI18n } from "@udemy/i18n";
import classNames from "classnames";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React, { Component } from "react";

import { NewBadge } from "udemy-django-static/js/browse/components/badge/course-badges.react-component";
import { CourseUnit } from "@udemy/react-discovery-units";
import { UnitTitle } from "@udemy/react-discovery-units";
import OccupationModal from "udemy-django-static/js/occupation/components/occupation-modal/occupation-modal.react-component";
import { OccupationFlowProgressionEvent } from "udemy-django-static/js/occupation/events";
import OccupationVisibilityStore from "udemy-django-static/js/occupation/stores/occupation-visibility/occupation-visibility.mobx-store";

import styles from "./occupation-unit.module.less";

@observer
class OccupationUnit extends Component {
  static propTypes = {
    unit: PropTypes.object.isRequired,
    className: PropTypes.string,
    showSubTitle: PropTypes.bool,
    showNewBadge: PropTypes.bool,
    gettext: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: undefined,
    showSubTitle: false,
    showNewBadge: false,
  };

  constructor(props) {
    super(props);
    this.occupationVisibilityStore = new OccupationVisibilityStore();
  }

  handleClick = () => {
    this.handleEventTracking();
    this.occupationVisibilityStore.openModal();
  };

  handleEventTracking() {
    Tracker.publishEvent(
      new OccupationFlowProgressionEvent({
        progression: 0,
        selection: "edit",
        selectionType: "edit",
      })
    );
  }

  render() {
    /* LIHP and Occupation Result pages renders this component,
        and the component decides to trigger modal via query param or occupationVisibilityStore. */
    const { unit, className, showSubTitle, showNewBadge, gettext } = this.props;
    const occupationUnit = {
      ...unit,
      actionLink: {
        text: gettext("Edit profession"),
        buttonProps: {
          onClick: this.handleClick,
          componentClass: "button",
          className: "ud-link-underline",
        },
      },
    };
    return (
      <div className={className}>
        <UnitTitle
          unit={occupationUnit}
          className={classNames(styles["title-wrapper"], {
            [styles["bottom-margin"]]: !showSubTitle,
          })}
        />
        {showSubTitle && (
          <div className={styles["secondary-text"]} data-purpose="sub-title">
            {showNewBadge && <NewBadge />}
            <span className="ud-text-xs">
              {gettext("Inspired by your selections")}
            </span>
          </div>
        )}
        <OccupationModal
          occupationVisibilityStore={this.occupationVisibilityStore}
        />
        <CourseUnit {...this.props} showTitle={false} />
      </div>
    );
  }
}

export default withI18n(OccupationUnit);
