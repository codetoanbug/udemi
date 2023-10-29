import {Tracker} from '@udemy/event-tracking';
import {EmbeddedSupplyGapOpportunity} from '@udemy/instructor';

import {SupplyGapOpportunityPresented} from '../events';
import {EventSupplyGapOpportunity, EventSupplyGapOpportunityFilters} from '../types/instructor';

export function fireOpportunityImpressionEvent(
    opportunities: EmbeddedSupplyGapOpportunity[],
    pageSize: number,
    pageNumber: number,
    checkedCourseLanguages: string[],
    checkedDomains: string[],
) {
    opportunities.forEach((opportunity: EmbeddedSupplyGapOpportunity) => {
        const eventSupplyGapOpportunity: EventSupplyGapOpportunity = {
            id: 0, // This is not used anymore, but we still need to pass it
            courseLanguage: opportunity.courseLanguage,
            domain: opportunity.domain,
            subject: opportunity.subject,
            uniqueOpportunityId: opportunity.id,
        };
        const eventSupplyGapOpportunityFilters: EventSupplyGapOpportunityFilters = {
            courseLanguages: checkedCourseLanguages,
            domains: checkedDomains,
            pageSize,
            pageNumber,
            isFinancialIncentiveEligible: false, // This is not used anymore, but we still need to pass it
        };
        Tracker.publishEvent(
            new SupplyGapOpportunityPresented({
                uiRegion: 'ub-content-opportunities-page',
                opportunity: eventSupplyGapOpportunity,
                opportunityFilters: eventSupplyGapOpportunityFilters,
                detailsPresented: false, // This is the default behavior
            }),
        );
    });
}
