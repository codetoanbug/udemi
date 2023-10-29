import { action, observable } from "mobx";

import { OCCUPATION_EXPLORER_URL } from "udemy-django-static/js/occupation/constants";

export default class OccupationVisibilityStore {
  @observable isModalOpen = false;
  modalURL = `${OCCUPATION_EXPLORER_URL}?isAjaxModal`;

  @action
  openModal() {
    this.isModalOpen = true;
  }

  @action
  closeModal = () => {
    this.isModalOpen = false;
  };
}
