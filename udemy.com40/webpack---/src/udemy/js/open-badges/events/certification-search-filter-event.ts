import {ClientEvent} from '@udemy/event-tracking';

import {EVENT_LABEL} from '../constants';

export class CertificateSearchEvent extends ClientEvent {
    private searchQuery?: string;
    private filteredByIssuers: string[];
    private filteredBySubjectAreas: string[];
    constructor({
        searchQuery,
        filteredByIssuers,
        filteredBySubjectAreas,
    }: {
        searchQuery?: string;
        filteredByIssuers: string[];
        filteredBySubjectAreas: string[];
    }) {
        super(EVENT_LABEL.SEARCH_CERTIFICATE);
        this.searchQuery = searchQuery;
        this.filteredByIssuers = filteredByIssuers;
        this.filteredBySubjectAreas = filteredBySubjectAreas;
    }
}
