import classNames from 'classnames';
import React from 'react';

import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Button, ButtonProps, Image} from '@udemy/react-core-components';

import {
    LectureDiscoveryCardClickEvent,
    LectureDiscoveryCardEventData,
    LectureDiscoveryCardImpressionEvent,
} from '../events';
import {LectureDetails} from '../lecture-details/lecture-details.react-component';
import styles from './lecture-card.module.less';
import {Lecture, LECTURE_CARD_SIZES, TrackingContext} from './types';

/** React Prop interface for the `LectureCard` component */
export interface LectureCardProps {
    /** Button props for buttons inside the lecture card so their behavior can be customized */
    buttonProps?: ButtonProps;
    /** Lecture object to be displayed */
    lecture: Lecture;
    /** Size of the card */
    size?: (typeof LECTURE_CARD_SIZES)[keyof typeof LECTURE_CARD_SIZES];
    /** Tracking context used for event tracking */
    trackingContext?: TrackingContext;
    /** UI region where the card is displayed */
    uiRegion: string;
    /** Screen reader context passed to {@link LectureDetails} */
    srContext?: string;
}

/**
 * LectureCard component
 *
 * @remarks
 * This card component displays a lecture's image with its duration
 * followed by {@link LectureDetails}
 */
export const LectureCard = ({
    lecture,
    buttonProps = {
        componentClass: 'a',
        href: lecture?.url,
    },
    size = LECTURE_CARD_SIZES.SMALL,
    uiRegion,
    trackingContext,
    srContext,
}: LectureCardProps) => {
    const {gettext, ninterpolate} = useI18n();
    const course = lecture.course;

    // This assumes that the lecture duration is in the format of `mm:ss`.
    // We might consider refactoring duration to be a number of seconds instead.
    const splitDuration = lecture.duration.split(':');
    const duration = {
        minutes: Number(splitDuration[0]),
        seconds: Number(splitDuration[1]),
    };

    // When the lecture image is non-existent, we use the course image instead */
    const cardImage = lecture.image && lecture.image.length > 0 ? lecture.image : course.image;
    const eventData = {
        id: lecture.id,
        position: trackingContext?.position ?? 0,
        backendSource: trackingContext?.backendSource,
        trackingId: trackingContext?.frontendTrackingId,
        serveTrackingId: trackingContext?.trackingId,
        uiRegion,
    } as LectureDiscoveryCardEventData;

    const trackImpression = () => {
        trackingContext && Tracker.publishEvent(new LectureDiscoveryCardImpressionEvent(eventData));
    };

    const trackClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        trackingContext && Tracker.publishEvent(new LectureDiscoveryCardClickEvent(eventData));
        if (buttonProps?.onClick) {
            buttonProps.onClick(event);
        }
    };

    return (
        <TrackImpression trackFunc={trackImpression}>
            <div className={classNames(styles.container, styles[`container-${size}`])}>
                <div className={styles['image-container']}>
                    <div id={`lecture-button-desc`} className="ud-sr-only">
                        {buttonProps?.cssToggleId
                            ? gettext('Open lecture. ')
                            : gettext('Play lecture. ')}
                        <span> {lecture.title} </span>
                        {ninterpolate(
                            'Duration: %(minutes)s minute ',
                            'Duration: %(minutes)s minutes ',
                            duration.minutes,
                            {
                                minutes: duration.minutes,
                            },
                        )}
                        {ninterpolate(
                            'and %(seconds)s second.',
                            'and %(seconds)s seconds.',
                            duration.seconds,
                            {
                                seconds: duration.seconds,
                            },
                        )}
                    </div>
                    <Button
                        className={styles['image-button']}
                        {...buttonProps}
                        aria-describedby={'lecture-button-desc'}
                        onClick={trackClick}
                    >
                        <Image src={cardImage} alt="" className={styles.image} />
                    </Button>
                    <span
                        className={classNames('ud-text-xs', styles['lecture-duration'])}
                        aria-hidden={true}
                    >
                        {lecture.duration}
                    </span>
                </div>
                <LectureDetails
                    lecture={lecture}
                    isCompact={size === LECTURE_CARD_SIZES.LARGE}
                    uiRegion={uiRegion}
                    buttonProps={{...buttonProps, onClick: trackClick}}
                    srContext={srContext}
                />
            </div>
        </TrackImpression>
    );
};
