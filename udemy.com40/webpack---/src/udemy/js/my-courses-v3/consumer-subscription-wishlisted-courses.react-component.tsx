import {TrackingContextProvider} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {DiscoveryItemImpressionEvent} from 'browse/events';
import {discoveryTracker} from 'browse/tracking';
import {WishlistedCourseModel} from 'my-courses-v3/types';

import './consumer-subscription-wishlisted-courses.less';
import WishlistedCourseCard from './wishlisted-course-card.react-component';
import WishlistedCoursesStore from './wishlisted-courses.mobx-store';

export const ConsumerSubscriptionWishlistedCourses = observer(() => {
    const [store] = React.useState(() => new WishlistedCoursesStore(true));

    React.useEffect(() => {
        store.loadCourses();
    }, [store]);

    const onShowMore = action(() => {
        store.currentPage++;
        store.loadCourses();
    });

    if (store.showZeroState) {
        return null;
    }

    return (
        <>
            <h3 className="my-courses__section-heading ud-heading-xl">{gettext('Wishlist')}</h3>
            <div className="my-courses__course-card-grid">
                {store.courses.map((course: WishlistedCourseModel, idx: number) => (
                    <TrackingContextProvider
                        key={course.id}
                        trackingContext={{
                            trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                            index: idx,
                            backendSource:
                                DiscoveryItemImpressionEvent.backendSourceOptions
                                    .USER_WISHLISTED_COURSES,
                        }}
                    >
                        <div>
                            <WishlistedCourseCard course={course} />
                        </div>
                    </TrackingContextProvider>
                ))}
            </div>
            <div styleName="show-more-button">
                {store.isLoading && <Loader block={true} size="large" />}
                {!store.isLoading && store.pageCount > 0 && store.currentPage < store.pageCount && (
                    <Button onClick={onShowMore} udStyle="ghost">
                        {gettext('Show more')}
                    </Button>
                )}
            </div>
        </>
    );
});
