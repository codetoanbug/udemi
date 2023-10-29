import "udemy-django-static/js/utils/composed-path";

import { LAB_VERTICAL } from "./constants";

export const getLabVerticalIconForKey = (key) => {
  return Object.values(LAB_VERTICAL).find((item) => item.key === key)
    ?.iconComponent;
};
