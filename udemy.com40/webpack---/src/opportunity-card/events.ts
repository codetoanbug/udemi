import {ClientEvent} from '@udemy/event-tracking';

/**
 * The struct to be used for the events: SupplyGapOpportunityPresented,
 * CreateCourseInSupplyGapOpportunityCardSelected
 */
export interface EventSupplyGapOpportunity {
    /** ID for the opportunity */
    id?: number;
    /** The course language of the opportunity */
    courseLanguage?: string;
    /** The domain of the opportunity */
    domain?: string;
    /** The subject of the opportunity */
    subject?: string;
    /** The unique identifier for the opportunity */
    uniqueOpportunityId?: string;
}

/**
 * The struct to be used for the events: SupplyGapOpportunityPresented
 */
export interface EventSupplyGapOpportunityFilters {
    /** The unique identifier for the opportunity */
    id?: string;
    /** The course languages of the applied filter */
    courseLanguages?: string[];
    /** The domains of the applied filter */
    domains?: string[];
    /** The subject sof the applied filter */
    subjects?: string[];
    /** The opportunity types of the applied filter */
    opportunityTypes?: string[];
    /** The priority levels of the applied filter */
    priorityLevels?: string[];
    /** The instructional levels of the applied filter */
    instructionalLevels?: string[];
    /** Deprecated, use financialIncentiveEligibility instead */
    isFinancialIncentiveEligible: boolean;
    /** The financial incentive eligibility of the applied filter */
    financialIncentiveEligibility?: string;
    /** The display rules of the applied filter */
    displayRules?: string[];
    /** The page size of the applied filter */
    pageSize?: number;
    /** The page number of the applied filter */
    pageNumber?: number;
}

/**
 * Fired when a supply gap opportunity card is rendered
 */
export class SupplyGapOpportunityPresented extends ClientEvent {
    uiRegion: string;
    opportunity: EventSupplyGapOpportunity;
    opportunityFilters: EventSupplyGapOpportunityFilters;
    detailsPresented: boolean;

    constructor(
        uiRegion: string,
        opportunity: EventSupplyGapOpportunity,
        opportunityFilters: EventSupplyGapOpportunityFilters,
        detailsPresented: boolean,
    ) {
        super('SupplyGapOpportunityPresented');
        this.uiRegion = uiRegion;
        this.opportunity = opportunity;
        this.opportunityFilters = opportunityFilters;
        this.detailsPresented = detailsPresented;
    }
}
