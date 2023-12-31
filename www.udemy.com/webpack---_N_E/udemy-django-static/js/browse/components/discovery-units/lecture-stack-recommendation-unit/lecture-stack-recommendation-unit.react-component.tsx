import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import {
    CardProps,
    DetailProps,
    LectureStackCard,
} from 'udemy-django-static/js/base-components/ungraduated/lecture-stack-card/lecture-stack-card.react-component';
import {StackedCarousel} from 'udemy-django-static/js/base-components/ungraduated/stacked-carousel/stacked-carousel.react-component';
import {attachFrontendTrackingIds} from 'udemy-django-static/js/browse/tracking';
import {UI_REGION} from 'udemy-django-static/js/browse/ui-regions';

import {NUM_LECTURES_PER_STACK} from './constants';
import {LectureStackRecommendationUnitHeader} from './lecture-stack-recommendation-unit-header.react-component';
import {LectureStackRecommendationUnitProps, LectureProps} from './types';
import styles from './lecture-stack-recommendation-unit.module.less';

export const LectureStackRecommendationUnit = ({
    className,
    representativeTopicName,
    unit,
}: LectureStackRecommendationUnitProps) => {
    const {gettext, interpolate} = useI18n();
    if (!unit.items.length) return null;

    const lectureStacks = [unit.items, ...unit.secondary_items];
    const topics = unit.available_filters.units;
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
                    learnUrl: lecture.learn_url,
                    lectureCardId: lecture.id,
                    lectureTitle: lecture.title,
                    courseTitle: course.title,
                    visibleInstructors: course.visible_instructors,
                    lecturePosition: idx,
                    lectureServeTrackingId: lecture.tracking_id,
                    lectureTrackingId: lecture.frontendTrackingId ?? '',

                    // TODO: Adjust the following properties after getting user
                    //  consumption data for lectures.
                    inProgress: false,
                    completed: false,
                    // remainingTime: lecture.content_length,
                    duration: lecture.content_length,
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
            <LectureStackRecommendationUnitHeader title={representativeTopicName} />
            <div className={classNames(styles['children-container'])}>
                {lectureStacks.map((lectureStack, idx) => {
                    return (
                        <React.Fragment key={idx}>
                            <h3
                                aria-hidden={true}
                                className={classNames(styles.title, 'ud-heading-xl')}
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
                                <h3
                                    className={classNames(
                                        styles.title,
                                        'ud-heading-xl',
                                        'ud-sr-only',
                                    )}
                                >
                                    {topics[idx].title}
                                </h3>
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
        </div>
    );
};
