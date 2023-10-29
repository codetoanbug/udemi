import {NewBadge} from '@udemy/browse-course';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Accordion} from '@udemy/react-reveal-components';
import React from 'react';

import {LECTURE_SEGMENTS} from 'browse/components/lecture-quick-view/constants';
import {Lecture} from 'browse/components/lecture-quick-view/types';
import ProgressBarStore from 'video-player/progress-bar/progress-bar.mobx-store';

import {LectureSegmentList} from './lecture-segment-list.react-component';
import styles from './lecture-segments.less';

interface LectureSegmentsProps {
    lecture: Lecture;
    progressBarStore: ProgressBarStore;
    isVideoLoaded?: boolean;
    handleSegmentClickForUnloadedVideo?: (startTime: number) => void;
}

export const LectureSegments = ({
    lecture,
    isVideoLoaded,
    progressBarStore,
    handleSegmentClickForUnloadedVideo,
}: LectureSegmentsProps) => {
    const {gettext} = useI18n();
    const isMobileMax = useMatchMedia('mobile-max');

    if (!lecture) {
        return null;
    }

    const isSegmentDescExpanded =
        (!lecture.segments || lecture.segments.length <= 5) && !isMobileMax;

    const renderTitleSection = () => {
        return (
            <>
                <h3 className="ud-heading-md">{gettext('Segments in this Lecture')}</h3>
                <Button
                    data-purpose="course-link"
                    udStyle="link-underline"
                    className="ud-text-md"
                    componentClass="a"
                    href={lecture.url}
                >
                    {gettext('Watch this lecture within the course')}
                </Button>
            </>
        );
    };

    return (
        <div
            className={styles['lecture-details-container']}
            role="region"
            aria-label={gettext('Lecture segments')}
            data-purpose="lecture-details-container"
        >
            <h3 className="ud-heading-md" data-purpose="title">
                {gettext('Segments')}
                <NewBadge className={styles['new-badge']} />
            </h3>
            {isMobileMax !== null && (
                <Accordion className={styles['segment-description']}>
                    <Accordion.Panel
                        title={gettext('What are segments')}
                        defaultExpanded={isSegmentDescExpanded}
                        className={styles['segment-description-content']}
                        data-purpose="segment-description"
                    >
                        {LECTURE_SEGMENTS.SEGMENT_DESCRIPTION}
                    </Accordion.Panel>
                </Accordion>
            )}
            <div className={styles['segments-list-container']}>
                <div className={styles['segments-list-header']}>{renderTitleSection()}</div>
                <div className={styles['lecture-segments']} data-purpose="lecture-segments">
                    <LectureSegmentList
                        lectureSegments={lecture.segments}
                        progressBarStore={progressBarStore}
                        handleSegmentClickForUnloadedVideo={handleSegmentClickForUnloadedVideo}
                        isVideoLoaded={isVideoLoaded}
                    />
                </div>
            </div>
        </div>
    );
};
