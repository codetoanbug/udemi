import {observer} from 'mobx-react';
import React, {BaseSyntheticEvent} from 'react';

import {Pagination} from '@udemy/react-navigation-components';

import {OpportunityCard} from '../opportunity-card/opportunity-card.react-component';
import {NoOpportunity} from '../opportunity-edge-cases/no-content.react-component';
import {OpportunityListStore} from './opportunity-list.mobx-store';

export interface OpportunityListProps {
    opportunityListStore: OpportunityListStore;
    isSelectable?: boolean;
}
export const OpportunityList = observer(
    ({opportunityListStore, isSelectable = false}: OpportunityListProps) => {
        const handleSelectionChange = (event: BaseSyntheticEvent) => {
            opportunityListStore.setSelectedOpportunityUuid(event.target.value);
        };
        return (
            <>
                {opportunityListStore.hasOpportunity ? (
                    <>
                        <div data-testid="opportunity-list">
                            {opportunityListStore.visibleOpportunities.map((opportunity) => {
                                return (
                                    <OpportunityCard
                                        data={opportunity}
                                        key={opportunity.id}
                                        isSelectable={isSelectable}
                                        isCardSelected={
                                            opportunityListStore.selectedOpportunityUuid ===
                                            opportunity.id
                                        }
                                        isIP={opportunityListStore.isIP()}
                                        onSelectChange={handleSelectionChange}
                                        defaultExpanded={false}
                                    />
                                );
                            })}
                        </div>
                        <div data-testid="pagination">
                            <Pagination
                                pageCount={opportunityListStore.pageCount}
                                activePage={opportunityListStore.activePage}
                                onPageChange={opportunityListStore.setActivePage}
                            />
                        </div>
                    </>
                ) : (
                    <NoOpportunity />
                )}
            </>
        );
    },
);
