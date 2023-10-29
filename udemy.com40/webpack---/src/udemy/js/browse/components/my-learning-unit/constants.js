import {LabDiscoveryCardClickEvent} from 'browse/lab-events';

import LabsDiscoverEvent from './labs-discover-event';

export const LAB_LANDING_PAGE_URL = '/labs/listing/';

export const LABS_DISCOVER_COMPONENTS = Object.freeze({
    MY_LEARNING_SHOW_LABS: 'my_learning_show_labs',
    MY_LEARNING_LABS_TAB: 'my_learning_labs_tab',
    MY_LEARNING_LABS_PAGE: 'my_learning_labs_page',
    LABS_LANDING_PAGE: 'labs_landing_page',
    LABS_IN_COURSE_PROMPT: 'labs_in_course_prompt',
    LABS_IN_SEARCH: 'labs_in_search',
    LABS_UNIT_LIHP: 'labs_unit_lihp',
    LABS_UNIT_TOPIC: 'labs_unit_topic',
    LAB_OVERVIEW_PAGE: 'lab_overview_page',
    LAB_LISTING_PAGE: 'lab_listing_page',
});

export const LAB_TRACKING_EVENTS = Object.freeze({
    DISCOVER: LabsDiscoverEvent,
    DISCOVERY_CARD_CLICK: LabDiscoveryCardClickEvent,
});
