import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {useBreakpoint} from '@udemy/hooks';
import {Image, Button, ButtonProps} from '@udemy/react-core-components';
import {Modal, ModalProps} from '@udemy/react-dialog-components';
import {ShowMore, ShowMoreProps} from '@udemy/react-reveal-components';
import {mediaQueryRemToPx, tokens} from '@udemy/styles';
import classNames from 'classnames';
import React, {ReactNode, useRef, useState} from 'react';

import Carousel, {CarouselProps} from 'base-components/carousel/carousel.react-component';
import {LearningProduct as BrowseLearningProduct, LearningProductType} from 'browse/events';

import {
    PracticeIncentiveImpressionEvent,
    PracticeIncentivesCarouselActionEvent,
    PracticeIncentiveShowMoreClickEvent,
    PracticeIncentivesImpressionEvent,
    PracticeIncentivesType,
} from '../../events';
import {useOnCarouselActionEnd} from '../../hooks/use-on-carousel-action-end';
import {IncentivesData} from '../incentives/incentives.react-component';
import assignmentImagex1 from './assets/assignment-1x.png';
import assignmentImagex2 from './assets/assignment-2x.png';
import codingExerciseImagex1 from './assets/code-exercise-1x.png';
import codingExerciseImagex2 from './assets/code-exercise-2x.png';
import practiceImagex1 from './assets/practice-test-1x.png';
import practiceImagex2 from './assets/practice-test-2x.png';
import quizImagex1 from './assets/quiz-1x.png';
import quizImagex2 from './assets/quiz-2x.png';
import styles from './practice-incentive-cards.less';

type LearningProduct = Omit<BrowseLearningProduct, 'trackingId'> & {
    trackingId?: BrowseLearningProduct['trackingId'];
};

const trackPracticeIncentivesImpression = (learningProduct: LearningProduct) => {
    if (learningProduct.trackingId) {
        Tracker.publishEvent(
            new PracticeIncentivesImpressionEvent(learningProduct as BrowseLearningProduct),
        );
    }
};

const trackPracticeIncentiveItemImpression = (
    learningProduct: LearningProduct,
    incentiveType: PracticeIncentivesType,
    position: number,
) => {
    if (learningProduct.trackingId) {
        Tracker.publishEvent(
            new PracticeIncentiveImpressionEvent(
                learningProduct as BrowseLearningProduct,
                incentiveType,
                position,
            ),
        );
    }
};

const trackPracticeIncentivesCarouselAction = (
    learningProduct: LearningProduct,
    action: 'scroll' | 'button-click',
) => {
    Tracker.publishEvent(
        new PracticeIncentivesCarouselActionEvent(learningProduct as BrowseLearningProduct, action),
    );
};

const trackPracticeIncentiveItemShowMoreClick = (
    learningProduct: LearningProduct,
    position: number,
) => {
    Tracker.publishEvent(
        new PracticeIncentiveShowMoreClickEvent(learningProduct as BrowseLearningProduct, position),
    );
};

export const getPracticeIncentiveCardsConfig = (): (PracticeIncentiveCardProps & {
    show: (incentivesData: IncentivesData) => boolean;
    type: PracticeIncentivesType;
})[] => [
    {
        show: (incentivesData: IncentivesData) => Boolean(incentivesData.num_coding_exercises > 0),
        title: gettext('Coding Exercises'),
        explanation: gettext('Try out new skills as you learn them with hands-on exercises'),
        imageSource: {
            x1: codingExerciseImagex1,
            x2: codingExerciseImagex2,
        },
        type: PracticeIncentivesType.NUM_CODING_EXERCISES,
    },
    {
        show: (incentivesData: IncentivesData) => Boolean(incentivesData.num_practice_tests > 0),
        title: gettext('Practice Tests'),
        explanation: gettext('Prepare for real exams with timed, long-form practice tests'),
        imageSource: {
            x1: practiceImagex1,
            x2: practiceImagex2,
        },
        type: PracticeIncentivesType.NUM_PRACTICE_TESTS,
    },
    {
        show: (incentivesData: IncentivesData) => Boolean(incentivesData.num_quizzes > 0),
        title: gettext('Quizzes'),
        explanation: gettext('Gauge how you’re progressing with short multiple-choice quizzes'),
        imageSource: {
            x1: quizImagex1,
            x2: quizImagex2,
        },
        type: PracticeIncentivesType.NUM_QUIZZES,
    },
    {
        show: (incentivesData: IncentivesData) => incentivesData.has_assignments,
        title: gettext('Assignments'),
        explanation: gettext(
            'Complete optional assignments and ask for feedback from other learners',
        ),
        imageSource: {
            x1: assignmentImagex1,
            x2: assignmentImagex2,
        },
        type: PracticeIncentivesType.HAS_ASSIGNMENTS,
    },
];

export interface PracticeIncentiveCardProps {
    title: string;
    explanation?: string;
    explanationComponent?: ReactNode;
    imageSource: {
        x1: string;
        x2: string;
    };
}

export const PracticeIncentiveCard = ({
    title,
    explanation = '',
    explanationComponent,
    imageSource,
}: PracticeIncentiveCardProps) => {
    const defaultExplanationComponent = (
        <span className={classNames('ud-text-xs', styles.explanation)}>{explanation}</span>
    );

    return (
        <div
            data-purpose="practice-card"
            className={classNames('ud-text-xs', styles['practice-card'])}
        >
            <div data-purpose={'practice-card--icon'} className={styles.icon}>
                <Image
                    alt="practice-card-image"
                    srcSet={`${imageSource.x1} 1x, ${imageSource.x2} 2x`}
                    src={imageSource.x1}
                />
            </div>
            <div data-purpose={'practice-card--body'} className={styles.body}>
                <h3 data-purpose="practice-card-title" className={'ud-heading-xs'}>
                    {title}
                </h3>
                {explanationComponent ?? defaultExplanationComponent}
            </div>
        </div>
    );
};

export const PracticeIncentiveCardWithShowMore = ({
    practiceCardProps,
    showMoreProps,
    onShowMore,
}: {
    onShowMore: () => void;
    practiceCardProps: PracticeIncentiveCardProps;
    showMoreProps: ShowMoreProps;
}) => {
    const showMoreRef = useRef<ShowMore>(null);
    const ShowMoreButton = (props: ButtonProps) => {
        const {cssToggleId, ...buttonProps} = props;
        return (
            <Button
                {...buttonProps}
                className={classNames(
                    'ud-text-xs',
                    'ud-text-bold',
                    styles['practice-explanation-show-more-button'],
                )}
                onClick={onShowMore}
                // For preventing it for toggling since we do not need to use collapse logic.
                cssToggleId={''}
            >
                {gettext('Show More')}
            </Button>
        );
    };

    const props = showMoreRef?.current?.doesContentOverflow
        ? {
              contentClassName: styles['practice-card-show-more-gradient'],
              ...showMoreProps,
          }
        : showMoreProps;

    return (
        <PracticeIncentiveCard
            {...practiceCardProps}
            explanationComponent={
                <ShowMore buttonComponent={ShowMoreButton} ref={showMoreRef} {...props}>
                    <span className={classNames('ud-text-xs', styles.explanation)}>
                        {practiceCardProps.explanation}
                    </span>
                </ShowMore>
            }
        />
    );
};

const PracticeIncentivesModal = (
    props: Pick<ModalProps, 'isOpen' | 'onClose'> & {incentivesData: IncentivesData},
) => {
    const practiceCards = getPracticeCardsData(props.incentivesData);
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} title={gettext('Practice Included')}>
            <div data-purpose={'practice-incentive-cards-modal'}>
                {practiceCards.map((config, key) => {
                    const {show, ...practiceCardProps} = config;
                    return (
                        <PracticeIncentiveCard
                            key={`${key}-${config.title}`}
                            {...practiceCardProps}
                        />
                    );
                })}
            </div>
        </Modal>
    );
};

/*
Solely for test purposes. Since we're using an external js module (imported from a package), we're not able to rewire.
Therefore, we're wrapping it to another function to mock it on tests.
 */
export const useCustomBreakPoint = () =>
    useBreakpoint(
        Object.freeze({
            mobileMin: mediaQueryRemToPx(tokens['breakpoint-mobile-max']),
            desktopMin: mediaQueryRemToPx(tokens['breakpoint-sm-min']),
        }),
    );

const getPracticeCardsData = (incentivesData: IncentivesData) =>
    getPracticeIncentiveCardsConfig().filter((config) => config.show(incentivesData));

interface PracticeIncentivesCarouselProps {
    incentivesData: IncentivesData;
    courseId: number;
    courseTrackingId?: string;
    styleName?: string;
}
export const PracticeIncentivesCarousel = ({
    incentivesData,
    courseId,
    courseTrackingId,
    styleName,
}: PracticeIncentivesCarouselProps) => {
    // The reason that we're using Objet.freeze is that order of the custom breakpoints are important.
    const breakpoint = useCustomBreakPoint();
    const isMobile = breakpoint === 'mobileMin';
    const [isModalOpen, setModalState] = useState(false);
    const carouselScrollActionProps = useOnCarouselActionEnd(
        () => trackPracticeIncentivesCarouselAction(learningProduct, 'scroll'),
        'scroll',
    );

    const carouselButtonActionProps = useOnCarouselActionEnd(
        () => trackPracticeIncentivesCarouselAction(learningProduct, 'button-click'),
        'button-click',
    );

    const practiceCards = getPracticeCardsData(incentivesData);

    // Check if we have available practice cards
    if (practiceCards.length === 0) {
        return null;
    }

    const learningProduct: LearningProduct = {
        id: courseId,
        trackingId: courseTrackingId,
        type: LearningProductType.COURSE,
    };

    const carouselProps = {
        showPager: !isMobile,
        allowScroll: isMobile,
        smallGrid: true,
        className: classNames(styles.carousel, styleName ?? '', {
            [styles['carousel--mobile-full-bleed']]: isMobile,
        }),
        ...{...carouselScrollActionProps},
        ...{...carouselButtonActionProps},
    } as CarouselProps;

    return (
        <>
            <TrackImpression trackFunc={() => trackPracticeIncentivesImpression(learningProduct)}>
                <Carousel data-purpose={'practice-incentive-cards'} {...carouselProps}>
                    {practiceCards.map((practice, position) => {
                        const {show, type, ...practiceCardProps} = practice;
                        const showMoreProps = {
                            collapsedHeight: 35,
                            withGradient: true,
                        };
                        return (
                            <TrackImpression
                                key={`${position} - ${type}`}
                                trackFunc={() =>
                                    trackPracticeIncentiveItemImpression(
                                        learningProduct,
                                        type,
                                        position,
                                    )
                                }
                            >
                                <div data-purpose={'practice-incentive-card-with-show-more'}>
                                    <PracticeIncentiveCardWithShowMore
                                        onShowMore={() => {
                                            trackPracticeIncentiveItemShowMoreClick(
                                                learningProduct,
                                                position,
                                            );
                                            setModalState(true);
                                        }}
                                        practiceCardProps={practiceCardProps}
                                        showMoreProps={showMoreProps}
                                    />
                                </div>
                            </TrackImpression>
                        );
                    })}
                </Carousel>
            </TrackImpression>
            <PracticeIncentivesModal
                data-purpose={'practice-incentive-cards-modal'}
                isOpen={isModalOpen}
                onClose={() => setModalState(false)}
                incentivesData={incentivesData}
            />
        </>
    );
};
