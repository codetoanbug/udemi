import {Tracker} from '@udemy/event-tracking';

import {CERTIFICATE_TRACKING_EVENTS, EVENT_LABEL} from '../../constants';

export interface Badge {
    name: string;
}

export const sendCertificateSearchEvent = (
    searchQuery: string | undefined,
    filteredByIssuers: string[],
    filteredBySubjectAreas: string[],
) => {
    const eventData = {
        searchQuery,
        filteredByIssuers,
        filteredBySubjectAreas,
    };
    Tracker.publishEvent(new CERTIFICATE_TRACKING_EVENTS.CERTIFICATE_SEARCH_EVENT(eventData));
};

export const sendCertificateListingPageSelectEvent = (certificateName: string) => {
    const eventData = {
        name: certificateName,
    };
    Tracker.publishEvent(
        new CERTIFICATE_TRACKING_EVENTS.CERTIFICATE_SELECT_EVENT(
            EVENT_LABEL.SELECT_CERTIFICATE_ON_LISTING_PAGE,
            eventData,
        ),
    );
};

export const sendCertificateTopicPageSelectEvent = (certificateName: string) => {
    const eventData = {
        name: certificateName,
    };
    Tracker.publishEvent(
        new CERTIFICATE_TRACKING_EVENTS.CERTIFICATE_SELECT_EVENT(
            EVENT_LABEL.SELECT_CERTIFICATE_ON_TOPIC_PAGE,
            eventData,
        ),
    );
};

export const sendCertificateDetailLinkClickEvent = (certificateName: string) => {
    const eventData = {
        name: certificateName,
    };
    Tracker.publishEvent(new CERTIFICATE_TRACKING_EVENTS.CLICK_CERTIFICATE_DETAIL_LINK(eventData));
};

export const sendEnrolledCertificationSelectedEvent = (certificateName: string) => {
    const eventData = {
        name: certificateName,
    };
    Tracker.publishEvent(
        new CERTIFICATE_TRACKING_EVENTS.ENROLLED_CERTIFICATE_SELECTED(
            EVENT_LABEL.SELECT_ENROLLED_CERTIFICATE,
            eventData,
        ),
    );
};

export const sendCertificationUnenrolledEvent = (certificateName: string) => {
    const eventData = {
        name: certificateName,
    };
    Tracker.publishEvent(
        new CERTIFICATE_TRACKING_EVENTS.ENROLLED_CERTIFICATE_SELECTED(
            EVENT_LABEL.CERTIFICATE_UNENROLLED,
            eventData,
        ),
    );
};
