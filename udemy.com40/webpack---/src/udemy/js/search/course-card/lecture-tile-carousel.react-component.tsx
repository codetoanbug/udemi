import {Tracker, ClickEvent, TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {ButtonProps} from '@udemy/react-core-components';
import {Accordion} from '@udemy/react-reveal-components';
import {inject} from 'mobx-react';
import React from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {LECTURE_DRAWER_ID} from 'browse/components/lecture-quick-view/constants';
import {LectureQuickViewStore} from 'browse/components/lecture-quick-view/lecture-quick-view.mobx-store';
import {
    BackendSourceOptions,
    DiscoveryItemClickEvent,
    LectureDiscoveryCardClickEvent,
    LectureDiscoveryCardImpressionEvent,
    LectureTileUnitToggledEvent,
    LectureTileUnitToggleOptions,
} from 'browse/events';
import {UI_REGION} from 'browse/ui-regions';
import {ITEM_TYPES} from 'course-taking/curriculum/constants';
import {TrackingContext} from 'search/events';
import {CurriculumItem} from 'search/types/curriculum-item';

import styles from './lecture-tile-carousel.less';
import {LectureTile} from './lecture-tile.react-component';

export interface LectureTileCarouselProps {
    lectures: CurriculumItem[];
    courseId: number;
    courseUrl: string;
    courseImage: string;
    maxNumLectures?: number;
    defaultExpanded?: boolean;
    lectureQuickViewStore?: LectureQuickViewStore;
    trackingContext?: TrackingContext;
}

export const LectureTileCarousel = inject(
    'lectureQuickViewStore',
    'trackingContext',
)(
    ({
        lectures,
        courseId,
        courseUrl,
        courseImage,
        defaultExpanded = false,
        maxNumLectures = undefined,
        lectureQuickViewStore,
        trackingContext,
    }: LectureTileCarouselProps) => {
        const {ninterpolate} = useI18n();

        // Component only supports lectures, and no other curriculum item types
        lectures = lectures.filter((l) => l.item_type === ITEM_TYPES.LECTURE);

        if (!lectures.length) {
            return null;
        }

        if (maxNumLectures !== undefined) {
            lectures = lectures.slice(0, maxNumLectures);
        }

        const numLectures = lectures.length;
        const title = ninterpolate(
            '%(numLectures)s matching lecture in this course',
            '%(numLectures)s matching lectures in this course',
            numLectures,
            {numLectures},
        );

        const commonEventsData = {
            backendSource:
                trackingContext?.backendSource ?? BackendSourceOptions.SEARCH_RECOMMENDATIONS,
            serveTrackingId: trackingContext?.searchTrackingId ?? '',
            trackingId: trackingContext?.trackingId ?? '',
            uiRegion: trackingContext?.uiRegion ?? UI_REGION.SEARCH_RECOMMENDATION_UNIT,
        };

        const handleLectureImpression = (lectureId: number, idx: number) => {
            Tracker.publishEvent(
                new LectureDiscoveryCardImpressionEvent({
                    id: lectureId,
                    position: idx,
                    ...commonEventsData,
                }),
            );
        };

        const handleLectureClick = (lectureId: number, idx: number) => {
            if (trackingContext) {
                lectureQuickViewStore?.setTrackingContext(trackingContext);
            }

            lectureQuickViewStore?.fetchLectureQuickViewData(courseId, lectureId);
            Tracker.publishEvent(
                new LectureDiscoveryCardClickEvent({
                    id: lectureId,
                    position: idx,
                    ...commonEventsData,
                }),
            );
        };

        const handlePaidLectureClick = (lectureId: number, index: number) => {
            Tracker.publishEvent(
                new ClickEvent({
                    componentName: 'lectureTileCarousel',
                    relatedObjectType: ClickEvent.relatedObjectTypes.lecture,
                    relatedObjectId: lectureId,
                    trackingId: commonEventsData.trackingId,
                }),
            );
            Tracker.publishEvent(
                new DiscoveryItemClickEvent({
                    id: lectureId,
                    type: 'lecture',
                    trackingId: commonEventsData.trackingId,
                    serveTrackingId: commonEventsData.serveTrackingId, // DiscoveryItemClickEvent on courses are using same tracking id for both the fields.
                    backendSource: BackendSourceOptions.SEARCH_RECOMMENDATIONS,
                    position: index,
                    badgeFamilies: [],
                }),
            );
        };

        const handleLectureTileUnitToggle = (isExpanded: boolean) => {
            Tracker.publishEvent(
                new LectureTileUnitToggledEvent({
                    action: isExpanded
                        ? LectureTileUnitToggleOptions.EXPANDED
                        : LectureTileUnitToggleOptions.COLLAPSED,
                    initialState: defaultExpanded
                        ? LectureTileUnitToggleOptions.EXPANDED
                        : LectureTileUnitToggleOptions.COLLAPSED,
                    ...commonEventsData,
                }),
            );
        };

        const getButtonProps = (lecture: CurriculumItem, idx: number) => {
            if (lecture.enroll_and_preview_url) {
                return {
                    cssToggleId: LECTURE_DRAWER_ID,
                    onClick: () => handleLectureClick(lecture.id, idx),
                } as ButtonProps;
            }
            // for lectures in paid courses
            return {
                componentClass: 'a',
                href: courseUrl,
                onClick: () => handlePaidLectureClick(lecture.id, idx),
            } as ButtonProps;
        };
        return (
            <Accordion className={styles.accordion}>
                <Accordion.Panel
                    title={title}
                    defaultExpanded={defaultExpanded}
                    className={styles['accordion-panel']}
                    onToggle={handleLectureTileUnitToggle}
                    onClick={(event) => event.stopPropagation()}
                >
                    <Carousel
                        allowScroll={true}
                        className={styles['carousel-container']}
                        itemClassName={styles['carousel-item']}
                        pagerButtonSize={'medium'}
                        showPager={true}
                        ariaLive="off"
                    >
                        {lectures.map((lecture, idx) => (
                            <TrackImpression
                                trackFunc={() => handleLectureImpression(lecture.id, idx)}
                                key={idx}
                            >
                                <div>
                                    <LectureTile
                                        courseImage={courseImage}
                                        duration={lecture.content_summary ?? '00:00'}
                                        lectureImage={lecture.thumbnail_url}
                                        title={lecture.title}
                                        buttonProps={getButtonProps(lecture, idx)}
                                    />
                                </div>
                            </TrackImpression>
                        ))}
                    </Carousel>
                </Accordion.Panel>
            </Accordion>
        );
    },
);
