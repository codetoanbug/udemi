import { APIModel } from "udemy-django-static/js/utils/mobx";

export default class Instructor extends APIModel {
  get apiDataMap() {
    return {
      id: "id",
      title: "title",
      url: "url",
    };
  }
}
