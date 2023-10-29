import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import classNames from 'classnames';
import React, {useEffect, useCallback, useState} from 'react';

import {LectureDetailsSlide} from 'browse/components/lecture-details-slide/lecture-details-slide.react-component';
import {LectureStackCardProps} from 'browse/components/lecture-stack-card/types';
import {LectureDiscoveryCardImpressionEvent, LectureDiscoveryCardEventData} from 'browse/events';

import {CardInfoContainer} from './card-info-container.react-component';
import styles from './stacked-carousel.less';
import {getLectureEventData, getOnClickHandler} from './utils';

/** Interface for the state of {@link StackedCarousel} cards */
interface CardIndexState {
    currentIndex: number;
    nextIndex: number;
    thirdIndex: number;
}

const setCardStatus = (indexes: CardIndexState, cardIndex: number) => {
    if (indexes.currentIndex == cardIndex) {
        return styles.first;
    } else if (indexes.nextIndex && indexes.nextIndex == cardIndex) {
        return styles.second;
    } else if (indexes.thirdIndex && indexes.thirdIndex == cardIndex) {
        return styles.third;
    } else if (indexes.currentIndex > cardIndex) {
        return styles['previous-card'];
    }

    return styles.inactive;
};

/** React props interface for the `StackedCarousel` component */
export interface StackedCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Optional handler for when card stack state changes */
    onCardChange?: (indexes: CardIndexState) => void;
    /** Optional className to apply to individual cards within `StackedCarousel` */
    cardClassName?: string;
    /**
     * Flag to auto rotate `StackedCarousel` cards
     *
     * @defaultValue false in `StackedCarousel`
     */
    autoRotate?: boolean;
    /**
     * Card rotation interval in milliseconds
     *
     * @defaultValue 2000 in `StackedCarousel`
     */
    rotationInterval?: number;
    children: React.ReactNode;
}

export const StackedCarousel = ({
    onCardChange,
    className = '',
    cardClassName = '',
    autoRotate = false,
    rotationInterval = 2000,
    children,
}: StackedCarouselProps) => {
    const [indexes, setIndexes] = useState({
        currentIndex: 0,
        nextIndex: 1,
        thirdIndex: 2,
    });
    const [seenIndexes, setSeenIndexes] = useState(new Set());
    const {gettext, interpolate} = useI18n();

    const cardCount = React.Children.count(children);
    const handleNextButton = useCallback(() => {
        setIndexes((prevState: CardIndexState) => ({
            currentIndex: prevState.currentIndex + 1,
            nextIndex: prevState.nextIndex + 1 >= cardCount ? -1 : prevState.nextIndex + 1,
            thirdIndex:
                !prevState.thirdIndex || prevState.thirdIndex + 1 >= cardCount
                    ? -1
                    : prevState.thirdIndex + 1,
        }));
    }, [cardCount]);

    const handlePrevButton = useCallback(() => {
        setIndexes((prevState) => ({
            currentIndex: prevState.currentIndex - 1,
            nextIndex:
                prevState.nextIndex && prevState.nextIndex > 0
                    ? prevState.nextIndex - 1
                    : prevState.currentIndex,
            thirdIndex:
                prevState.thirdIndex && prevState.thirdIndex > 0
                    ? prevState.thirdIndex - 1
                    : prevState.nextIndex,
        }));
    }, []);

    useEffect(() => {
        onCardChange?.(indexes);
        const transitionInterval = setInterval(() => {
            autoRotate && handleNextButton();
        }, rotationInterval);
        return () => clearInterval(transitionInterval);
    }, [handleNextButton, indexes, autoRotate, onCardChange, rotationInterval]);

    const trackImpression = (lectureEventData: LectureDiscoveryCardEventData, index: number) => {
        setSeenIndexes((prevState) => new Set([...prevState, index]));
        Tracker.publishEvent(new LectureDiscoveryCardImpressionEvent(lectureEventData));
    };

    const renderLectureCard = (card: React.ReactNode, index: number) => {
        const item = card as React.ReactElement<LectureStackCardProps>;
        const {
            lecture,
            inProgress,
            completed,
            remainingTime = 0,
            buttonProps,
        } = item.props.detailProps;
        const percentComplete = completed ? 100 : 100 - 100 * (remainingTime / lecture.duration);

        const cardWithLink = (
            <Button
                {...buttonProps}
                className={classNames(
                    styles['card-link'],
                    indexes.currentIndex !== index ? styles['inactive-card'] : '',
                )}
                tabIndex={indexes.currentIndex === index ? 0 : -1}
                aria-label={interpolate(
                    gettext('Play Lecture %(lectureNumber)s: %(lectureTitle)s'),
                    {lectureNumber: index + 1, lectureTitle: lecture.title},
                    true,
                )}
                onClick={() => getOnClickHandler(item.props.detailProps)}
            >
                {card}
            </Button>
        );

        return (
            <li
                key={`card-${lecture.id}`}
                className={classNames(cardClassName, styles.card, setCardStatus(indexes, index))}
                aria-hidden={indexes.currentIndex !== index}
            >
                {indexes.currentIndex == index && !seenIndexes.has(index) ? (
                    <TrackImpression
                        key={`card-${lecture.id}`}
                        trackFunc={() =>
                            trackImpression(getLectureEventData(item.props.detailProps), index)
                        }
                    >
                        {cardWithLink}
                    </TrackImpression>
                ) : (
                    cardWithLink
                )}
                {indexes.currentIndex == index && (
                    <CardInfoContainer
                        cardNumber={index}
                        cardCount={cardCount}
                        inProgress={inProgress}
                        completed={completed}
                        duration={lecture.duration}
                        remainingTime={remainingTime}
                        percentComplete={percentComplete}
                    />
                )}
            </li>
        );
    };

    return (
        <div className={className}>
            <div className={styles.container}>
                <IconButton
                    onClick={handlePrevButton}
                    udStyle="white-solid"
                    round={true}
                    size="medium"
                    className={
                        indexes.currentIndex != 0
                            ? styles['prev-button']
                            : styles['prev-button-hidden']
                    }
                >
                    <PreviousIcon label={gettext('Previous')} size="medium" />
                </IconButton>

                <IconButton
                    onClick={handleNextButton}
                    udStyle="white-solid"
                    round={true}
                    size="medium"
                    className={
                        indexes.currentIndex != cardCount - 1
                            ? styles['next-button']
                            : styles['next-button-hidden']
                    }
                >
                    <NextIcon label={gettext('Next')} size="medium" />
                </IconButton>

                <ul
                    role="presentation"
                    className={classNames(
                        styles['card-carousel'],
                        styles['carousel-default'],
                        'ud-unstyled-list',
                    )}
                >
                    {React.Children.map(children, (card: React.ReactNode, index) => {
                        return renderLectureCard(card, index);
                    })}
                </ul>
            </div>
            <LectureDetailsSlide currentIndex={indexes.currentIndex}>
                {children}
            </LectureDetailsSlide>
        </div>
    );
};
