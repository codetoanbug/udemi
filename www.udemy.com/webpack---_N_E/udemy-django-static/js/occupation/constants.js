export const OCCUPATION_SELECTOR_COMPONENT = "OccupationSelector";
export const FOCUS_SELECTOR_COMPONENT = "FocusSelector";
export const THANK_YOU_MESSAGE_COMPONENT = "ThankYouMessage";
export const CANNOT_FIND_OCCUPATION_COMPONENT = "CannotFindOccupation";
export const OCCUPATION_RESULT_PAGE = "OccupationResult";

export const PROGRESSION_STEPS = [
  FOCUS_SELECTOR_COMPONENT,
  OCCUPATION_SELECTOR_COMPONENT,
  THANK_YOU_MESSAGE_COMPONENT,
];

export const PROGRESSION_CANNOT_FIND_OCCUPATION = [
  FOCUS_SELECTOR_COMPONENT,
  CANNOT_FIND_OCCUPATION_COMPONENT,
  THANK_YOU_MESSAGE_COMPONENT,
];

export const PROGRESSION_SKIP = -1;
export const PROGRESSION_DONE = 999;

export const OCCUPATION_SUGGESTION_URL =
  "/structured-data/generic-tag/occupation/";
export const OCCUPATION_EXPLORER_URL = "/occupation/explorer/";
export const OCCUPATION_RESULT_URL = "/occupation/result/";
export const FOCUSES = [
  {
    get label() {
      return gettext("Enter a new field");
    },
    slug: "occupation-Aspiring",
  },
  {
    get label() {
      return gettext("Advance in my current field");
    },
    slug: "occupation-Advancing",
  },
  {
    get label() {
      return gettext("Become a manager in my field");
    },
    slug: "management-Aspiring",
  },
  {
    get label() {
      return gettext("Advance as a manager");
    },
    slug: "management-Advancing",
  },
];

export const SELECTION_TYPES = {
  JOB: "job",
  FOCUS: "focus",
};

export const OCCUPATION_GROUPS_ENDPOINT =
  "/structured-data/generic-tag/schema/occupation_group/instances/";
export const CREATE_OCCUPATION_ENDPOINT =
  "/structured-data/generic-tag/occupation/occupation/";

export const CANNOT_FIND_PROFESSION_SELECTOR_ID = 0;

export const NONE_OF_THE_ABOVE_OCCUPATION_GROUP_ID = 0;

export const COMPONENT_TITLES = {
  get [FOCUS_SELECTOR_COMPONENT]() {
    return gettext("What’s your current career goal?");
  },
};

// This used for selected focus animation.
// wait 400ms -> opacity 1->.5 to unselected items
// then wait 400ms -> transform selected item to top and 0 opacity for unselected items
export const WAIT_FOR_CSS_TRANSITIONS = 800;

export const DEFAULT_CONCEPT_GROUP_TITLE = "default";

export const CAREER_TRACK_LANDING_PAGE = "ctlp";

// This used for the Career Guide landing page (AKA Career Track) focus management
export const SUBJECT_CONTAINER_DATA_PURPOSE = "subject-container";

export const WEB_DEVELOPER_UNIT_TITLE = "Web Developers";
export const DATA_SCIENTIST_UNIT_TITLE = "Data Scientists";
