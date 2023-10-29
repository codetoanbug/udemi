import {CertificateDetailLinkClickEvent} from './events/certification-detail-link-click-event';
import {CertificateSelectEvent} from './events/certification-listing-page-select-event';
import {CertificateSearchEvent} from './events/certification-search-filter-event';
import {EnrolledCertificateSelectEvent} from './events/my-certification-preparation-select-event';

export const DISCOVERY_PAGE_MESSAGES = {
    get searchPlaceholder() {
        return gettext('Enter certification or issuer name');
    },

    get searchSubmit() {
        return gettext('Submit');
    },

    get searchFormLabel() {
        return gettext('Search');
    },

    get issuerFilterLabel() {
        return gettext('Issuer');
    },

    get subjectAreaFilterLabel() {
        return gettext('Subject area');
    },
};

export const OPEN_BADGES_BASE_PATH = '/open-badges';
export const MY_CERTIFICATION_PREPARATION_PATH = `${OPEN_BADGES_BASE_PATH}/my-certification-preparation`;
export const LEARNING_IN_PROGRESS_TAB_PATH = 'learning-in-progress';

class OpenBadgeRoutes {
    certificationDetailPath(id: string) {
        return `${OPEN_BADGES_BASE_PATH}/${id}/`;
    }

    learningInProgressPath(id: string) {
        return `${OPEN_BADGES_BASE_PATH}/${id}/${LEARNING_IN_PROGRESS_TAB_PATH}`;
    }

    assertionDetailPath(assertionId: string, userUrl: string) {
        return `${userUrl}certifications/${assertionId}`;
    }
}

export const routes = new OpenBadgeRoutes();

export const ISSUER_FILTER_KEY = 'issuer';
export const SUBJECT_AREA_FILTER_KEY = 'subject_area';
export const DEFAULT_API_PAGE_SIZE = 12;

export const EVENT_LABEL = {
    SEARCH_CERTIFICATE: 'CertificationSearchEvent',
    SELECT_CERTIFICATE_ON_LISTING_PAGE: 'CertificationListingPageSelectEvent',
    SELECT_CERTIFICATE_ON_TOPIC_PAGE: 'CertificationTopicWidgetSelectEvent',
    CLICK_CERTIFICATE_DETAIL_LINK: 'CertificationDetailLinkClickEvent',
    SELECT_ENROLLED_CERTIFICATE: 'EnrolledCertificationSelected',
    CERTIFICATE_UNENROLLED: 'CertificationUnenrolled',
    CERTIFICATION_PREPARATION_SELECTED: 'CertificationPreparationSelected',
    CERTIFICATION_PREPARATION_EXPLORE_SELECTED: 'CertificationPreparationExploreSelected',

    BADGE_ASSERTION_IMPORT_FAILURE_MESSAGE_PRESENTED: 'BadgeAssertionImportFailureMessagePresented',
    BADGE_ASSERTION_IMPORTED: 'BadgeAssertionImported',
    USER_DETAILS_BADGES_TAB_SELECTED: 'UserDetailsBadgesTabSelected',
} as const;

export const CERTIFICATE_TRACKING_EVENTS = {
    CERTIFICATE_SEARCH_EVENT: CertificateSearchEvent,
    CERTIFICATE_SELECT_EVENT: CertificateSelectEvent,
    CLICK_CERTIFICATE_DETAIL_LINK: CertificateDetailLinkClickEvent,
    ENROLLED_CERTIFICATE_SELECTED: EnrolledCertificateSelectEvent,
};

export const ALLOWED_SUBJECT_AREAS = [
    {id: '510', name: 'Accounting'},
    {id: '428', name: 'Agile/Scrum'},
    {id: '430', name: 'Application Development'},
    {id: '550', name: 'Business Intelligence'},
    {id: '438', name: 'Cloud'},
    {id: '458', name: 'Computer Programming'},
    {id: '552', name: 'Customer Relationship Management'},
    {id: '490', name: 'Cybersecurity'},
    {id: '442', name: 'Data Analysis'},
    {id: '448', name: 'Data Centers'},
    {id: '454', name: 'Data Science'},
    {id: '456', name: 'Databases'},
    {id: '460', name: 'Enterprise Architecture'},
    {id: '554', name: 'Enterprise Resource Planning'},
    {id: '556', name: 'Healthcare'},
    {id: '540', name: 'Human Resources'},
    {id: '470', name: 'Information Technology'},
    {id: '474', name: 'Networking'},
    {id: '562', name: 'Office Productivity'},
    {id: '476', name: 'Operating Systems'},
    {id: '480', name: 'Platform Development'},
    {id: '486', name: 'Project Management'},
    {id: '2180888', name: 'Quality Management'},
    {id: '492', name: 'Servers'},
    {id: '494', name: 'Software Testing'},
    {id: '568', name: 'Supply Chain Management'},
    {id: '500', name: 'System Administration'},
];

export const MAX_CERTIFICATE_COURSE_COUNT = 16;

export const CERTIFICATION_DETAIL_PAGE_TABS = {
    EXPLORE: 'explore',
    LEARNING_IN_PROGRESS: 'learning-in-progress',
};

export const CERTIFICATION_LANDING_PAGE_TABS = {
    CERTIFICATION_FINDER: 'certification-finder',
    MY_CERTIFICATION_PREPARATION: 'my-certification-preparation',
};
