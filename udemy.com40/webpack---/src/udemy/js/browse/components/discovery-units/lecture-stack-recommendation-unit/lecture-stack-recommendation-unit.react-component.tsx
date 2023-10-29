import {TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import {LECTURE_DRAWER_ID} from 'browse/components/lecture-quick-view/constants';
import {LectureStackCard} from 'browse/components/lecture-stack-card/lecture-stack-card.react-component';
import {CardProps, DetailProps} from 'browse/components/lecture-stack-card/types';
import {StackedCarousel} from 'browse/components/stacked-carousel/stacked-carousel.react-component';
import {attachFrontendTrackingIds, discoveryTracker} from 'browse/tracking';
import {UI_REGION} from 'browse/ui-regions';

import {NUM_LECTURES_PER_STACK} from './constants';
import {LectureStackRecommendationUnitHeader} from './lecture-stack-recommendation-unit-header.react-component';
import styles from './lecture-stack-recommendation-unit.less';
import {LectureStackRecommendationUnitProps, LectureProps} from './types';

export const LectureStackRecommendationUnit = ({
    className,
    representativeTopicName,
    unit,
    lectureQuickViewStore,
    isStandaloneUnit = false,
}: LectureStackRecommendationUnitProps) => {
    const {gettext, interpolate} = useI18n();
    if (!unit.items.length) return null;

    const lectureStacks = [unit.items, ...unit.secondary_items];
    const topics = unit.available_filters.units;
    const trackUnitImpression = () => {
        discoveryTracker.trackUnitView(unit, unit.item_type);
    };

    const renderLectureStack = (lectureStack: LectureProps[]) => {
        attachFrontendTrackingIds(lectureStack);

        return lectureStack
            .slice(0, NUM_LECTURES_PER_STACK)
            .map((lecture: LectureProps, idx: number) => {
                const course = lecture.course;

                const cardProps: CardProps = {
                    courseImage: course.image_304x171,
                    lectureImage: lecture.image_320_H ?? '',
                    learnUrl: lecture.learn_url,
                };
                const detailProps: DetailProps = {
                    lecture: {
                        id: lecture.id,
                        url: lecture.learn_url,
                        title: lecture.title,
                        position: idx,
                        serveTrackingId: lecture.tracking_id,
                        trackingId: lecture.frontendTrackingId ?? '',
                        duration: lecture.content_length,
                        course: {
                            id: course.id,
                            title: course.title,
                            instructors: course.visible_instructors,
                            image: course.image_304x171,
                        },
                    },
                    lectureQuickViewStore,
                    buttonProps: lectureQuickViewStore
                        ? {cssToggleId: LECTURE_DRAWER_ID}
                        : {
                              componentClass: 'a',
                              href: lecture.learn_url,
                              target: '_blank',
                              rel: 'noopener noreferrer',
                          },

                    // TODO: Adjust the following properties after getting user
                    //  consumption data for lectures.
                    inProgress: false,
                    completed: false,
                    // remainingTime
                    currentIndex: 1,
                    numOfLectures: 5,
                    uiRegion: UI_REGION.LECTURE_STACK,
                };
                return (
                    <LectureStackCard
                        key={lecture.id}
                        cardProps={cardProps}
                        detailProps={detailProps}
                    />
                );
            });
    };

    return (
        <div
            className={classNames(styles.wrapper, className)}
            data-purpose="lecture-recommendation-unit"
        >
            <LectureStackRecommendationUnitHeader
                title={representativeTopicName}
                isStandaloneUnit={isStandaloneUnit}
            />
            <TrackImpression trackFunc={trackUnitImpression}>
                <div className={classNames(styles['children-container'])}>
                    {lectureStacks.map((lectureStack, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                <h3
                                    aria-hidden={true}
                                    className={classNames(
                                        isStandaloneUnit ? 'ud-heading-xl' : 'ud-heading-lg',
                                    )}
                                >
                                    {topics[idx].title}
                                </h3>
                                <section
                                    key={idx}
                                    aria-label={interpolate(
                                        gettext('%(topic)s top lectures carousel'),
                                        {topic: topics[idx].title},
                                        true,
                                    )}
                                >
                                    <h3 className="ud-sr-only">{topics[idx].title}</h3>
                                    <StackedCarousel
                                        className={styles['recos-child']}
                                        data-purpose="lecture-stack"
                                    >
                                        {renderLectureStack(lectureStack)}
                                    </StackedCarousel>
                                </section>
                            </React.Fragment>
                        );
                    })}
                </div>
            </TrackImpression>
        </div>
    );
};
