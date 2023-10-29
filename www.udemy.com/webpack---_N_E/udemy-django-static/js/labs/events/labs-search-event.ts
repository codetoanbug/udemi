import {ClientEvent} from '@udemy/event-tracking';

export class LabsSearchEvent extends ClientEvent {
    private sourceComponent: string;
    private searchTerm: string;
    private searchCategory: string;
    private numResults: number;
    private ordering: string | null;
    private isPopularTopicPillSelected: boolean;
    private features: [];

    constructor({
        sourceComponent,
        searchTerm,
        searchCategory,
        numResults,
        ordering,
        isPopularTopicPillSelected,
        features,
    }: {
        sourceComponent: string;
        searchTerm: string;
        searchCategory: string;
        numResults: number;
        ordering: string;
        isPopularTopicPillSelected: boolean;
        features: [];
    }) {
        super('LabsSearchEvent');
        this.sourceComponent = sourceComponent;
        this.searchTerm = searchTerm;
        this.searchCategory = searchCategory;
        this.numResults = numResults;
        this.ordering = ordering;
        this.isPopularTopicPillSelected = isPopularTopicPillSelected;
        this.features = features;
    }
}
