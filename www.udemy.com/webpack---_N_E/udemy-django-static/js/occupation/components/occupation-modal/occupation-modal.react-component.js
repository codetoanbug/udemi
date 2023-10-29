import { observer, Provider } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";

import AjaxModal from "udemy-django-static/js/base-components/dialog/ajax-modal.react-component";

import styles from "./occupation-modal.module.less";

@observer
export default class OccupationModal extends React.Component {
  static propTypes = {
    occupationVisibilityStore: PropTypes.object.isRequired,
  };

  preloadScreen() {
    return import(
      /* webpackChunkName: "occupation-explorer-app" */ "udemy-django-static/js/occupation/pages/occupation-explorer/occupation-explorer.react-isocomponent"
    );
  }

  render() {
    const { occupationVisibilityStore } = this.props;
    return (
      <Provider isAjaxModal={true}>
        <AjaxModal
          labelledById="occupation-modal"
          url={occupationVisibilityStore.modalURL}
          isOpen={occupationVisibilityStore.isModalOpen}
          onClose={occupationVisibilityStore.closeModal}
          fullPage={true}
          requireExplicitAction={true}
          preloader={this.preloadScreen}
          className={styles["occupation-modal"]}
        />
      </Provider>
    );
  }
}
