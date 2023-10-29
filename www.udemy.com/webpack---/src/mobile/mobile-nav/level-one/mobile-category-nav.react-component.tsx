import {observer} from 'mobx-react';
import React from 'react';

import {Tracker} from '@udemy/event-tracking';

import {CategoryNavItemSelectEvent} from '../../../events';
import {useMobileNavStore} from '../../../hooks/use-mobile-nav-store';
import {MobileNavItem, MobileNavL1Nav, MobileNavSection} from '../mobile-nav.react-component';

export const MobileCategoryNav = observer(() => {
    const mobileNavStore = useMobileNavStore();

    function handleCategoryNavClick(item: {id: unknown}) {
        const context = {
            categoryId: item.id as number,
            subcategoryId: null,
            topicId: null,
        };
        Tracker.publishEvent(new CategoryNavItemSelectEvent({context}));
    }

    return (
        <MobileNavL1Nav id="header-toggle-side-nav-categories">
            <MobileNavSection>
                {mobileNavStore.navigationCategories?.map((c) => (
                    <MobileNavItem
                        onClick={() => handleCategoryNavClick(c)}
                        key={`mobile-nav-item-${c.id}`}
                        cssToggleId={`header-toggle-side-nav-subcategories-of-${c.id}`}
                        data-purpose="category-item"
                    >
                        {c.title}
                    </MobileNavItem>
                ))}
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
