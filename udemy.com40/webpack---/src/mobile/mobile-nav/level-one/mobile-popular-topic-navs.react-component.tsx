import {observer} from 'mobx-react';
import React from 'react';

import {Tracker} from '@udemy/event-tracking';

import {CategoryNavItemSelectEvent} from '../../../events';
import {useMobileNavStore} from '../../../hooks/use-mobile-nav-store';
import {BrowseNavCategory} from '../../../types/browse-nav-item';
import {MobileNavItem, MobileNavL1Nav, MobileNavSection} from '../mobile-nav.react-component';

export const MobilePopularTopicNavs = observer(() => {
    const mobileNavStore = useMobileNavStore();

    function handleTopicNavClick(subcat: BrowseNavCategory, item: {id: number}) {
        const context = {
            categoryId: subcat.parentId as number,
            subcategoryId: subcat.id,
            topicId: item.id,
        };
        Tracker.publishEvent(new CategoryNavItemSelectEvent({context}));
    }

    return (
        <span>
            {mobileNavStore.mostPopularSubcategories?.map((subcat) => (
                <MobileNavL1Nav
                    key={`l1-subcat-id-${subcat.id}`}
                    id={`header-toggle-side-nav-popular-topics-of-${subcat.id}`}
                >
                    <MobileNavSection>
                        {subcat.popularTopics?.map((topic) => (
                            <MobileNavItem
                                onClick={() => handleTopicNavClick(subcat, topic)}
                                key={`mobile-nav-topic-id-${topic.id}`}
                                data-purpose="topic-item"
                                href={topic.absolute_url || topic.url}
                            >
                                {topic.title}
                            </MobileNavItem>
                        ))}
                    </MobileNavSection>
                </MobileNavL1Nav>
            ))}
        </span>
    );
});
