import {onEnterAndSpace} from '@udemy/design-system-utils';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {ExpressiveIcon} from '@udemy/icons-expressive';
import {Duration} from '@udemy/react-date-time-components';
import classNames from 'classnames';
import {reaction} from 'mobx';
import React, {useCallback, useEffect, useState} from 'react';

import {LECTURE_SEGMENTS} from 'browse/components/lecture-quick-view/constants';
import {LectureSegment} from 'browse/components/lecture-quick-view/types';
import ProgressBarStore from 'video-player/progress-bar/progress-bar.mobx-store';

import styles from './lecture-segment-list.less';

interface LectureSegmentListProps {
    lectureSegments?: LectureSegment[];
    progressBarStore: ProgressBarStore;
    handleSegmentClickForUnloadedVideo?: (startTime: number) => void;
    isVideoLoaded?: boolean;
}

export const LectureSegmentList = ({
    lectureSegments,
    handleSegmentClickForUnloadedVideo,
    isVideoLoaded,
    progressBarStore,
}: LectureSegmentListProps) => {
    const {gettext} = useI18n();
    const isMobileMax = useMatchMedia('mobile-max');
    const [currentIndex, setCurrentIndex] = useState(0);

    const syncSelectedSegment = useCallback(() => {
        // by default videoCurrentTime is 0. Only sync segments once there is actual progress on lecture
        if (progressBarStore.videoCurrentTime >= 1 && lectureSegments) {
            const index = lectureSegments.findIndex((segment) => {
                const time = progressBarStore.videoCurrentTime;
                return segment.startTime <= time && segment.endTime >= time;
            });
            if (currentIndex != index) {
                setCurrentIndex(index);
            }
        }
    }, [currentIndex, lectureSegments, progressBarStore.videoCurrentTime]);

    useEffect(() => {
        const progressTimeUpdateDisposer = reaction(
            () => progressBarStore.videoCurrentTime,
            () => {
                syncSelectedSegment();
            },
            {fireImmediately: true},
        );
        return () => {
            // dispose react on unmount
            progressTimeUpdateDisposer();
        };
    });

    if (!lectureSegments || lectureSegments.length == 0) {
        return (
            <div className={styles['empty-state-container']} data-purpose="segments-empty-state">
                <ExpressiveIcon
                    data-purpose="illustration"
                    name="learning-delivery"
                    size={isMobileMax ? 'medium' : 'large'}
                />
                <h2 className={classNames('ud-heading-serif-lg', styles['message-header'])}>
                    {gettext('Sorry...')}
                </h2>
                <p className={classNames('ud-text-xs', styles['message-subtitle'])}>
                    {LECTURE_SEGMENTS.NO_SEGMENTS_MESSAGE}
                </p>
            </div>
        );
    }

    const playSegment = (index: number, startTime: number) => {
        setCurrentIndex(index);

        if (!isVideoLoaded && handleSegmentClickForUnloadedVideo) {
            return handleSegmentClickForUnloadedVideo(startTime);
        }

        return progressBarStore?.seekTo(startTime);
    };

    return (
        <div
            className={classNames('ud-text-xs', styles['segment-list'])}
            data-purpose="segment-list"
        >
            {lectureSegments?.map((segment, index) => (
                <div
                    role="button"
                    key={index}
                    tabIndex={0}
                    data-purpose="segment-row"
                    className={classNames(styles['segment-row'], {
                        [styles['selected-segment']]: currentIndex === index,
                    })}
                    onClick={() => playSegment(index, segment.startTime)}
                    onKeyDown={onEnterAndSpace(() => playSegment(index, segment.startTime))}
                >
                    <div
                        className={classNames(
                            'ud-text-xs',
                            'ud-text-bold',
                            styles['time-container'],
                        )}
                    >
                        <span className={styles.time}>
                            <Duration
                                numSeconds={segment.startTime}
                                presentationStyle={Duration.STYLE.TIMESTAMP}
                            />
                        </span>
                    </div>
                    <span className={styles.title}>{segment.title}</span>
                </div>
            ))}
        </div>
    );
};
