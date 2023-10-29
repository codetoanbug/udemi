import {TrackingContextProvider} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import classNames from 'classnames';
import React from 'react';

import LectureUnit from 'browse/components/discovery-units/lecture-unit/lecture-unit.react-component';
import {LectureQuickViewStore} from 'browse/components/lecture-quick-view/lecture-quick-view.mobx-store';
import {DiscoveryItemImpressionEvent} from 'browse/events';
import {discoveryTracker} from 'browse/tracking';
import {UI_REGION} from 'browse/ui-regions';

import styles from './related-lectures.less';
import {RelatedLecturesStore} from './related-lectures.mobx-store';

interface RelatedLecturesProps {
    store: RelatedLecturesStore;
    lectureQuickViewStore?: LectureQuickViewStore;
    uiRegion?: string;
}

export const RelatedLectures = ({
    store,
    lectureQuickViewStore,
    uiRegion = UI_REGION.LECTURE_DISCOVERY_UNIT_VIDEO_CARD,
}: RelatedLecturesProps) => {
    const hasFinePointer = useMatchMedia('(any-pointer: fine)');
    const isMobileMax = useMatchMedia('mobile-max');

    if (!store.lectures?.length) {
        return null;
    }

    return (
        <div>
            <div className={styles['title-container']}>
                <h2 className={classNames('ud-heading-xl', styles.title)}>
                    {gettext('Lectures for you — bite-size learning in minutes')}
                </h2>
            </div>
            <TrackingContextProvider
                trackingContext={{
                    trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                    backendSource:
                        DiscoveryItemImpressionEvent.backendSourceOptions.SEARCH_RECOMMENDATIONS,
                }}
            >
                <LectureUnit
                    unit={store.unit}
                    showPager={!!hasFinePointer}
                    fullWidth={!!isMobileMax}
                    lectureQuickViewStore={lectureQuickViewStore}
                    uiRegion={uiRegion}
                />
            </TrackingContextProvider>
        </div>
    );
};
