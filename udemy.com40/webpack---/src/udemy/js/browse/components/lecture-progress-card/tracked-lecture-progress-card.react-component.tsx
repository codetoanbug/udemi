import {TrackImpression, Tracker} from '@udemy/event-tracking';
import React from 'react';

import LectureProgressCard from 'browse/components/lecture-progress-card/lecture-progress-card.react-component';
import {EnrolledBrowseCourse} from 'browse/types/course';

import CarouselItemFunnelTracker from '../my-learning-unit/carousel-item-funnel-tracker.react-component';
import {buildEventData, LearningProgressCardImpressionEvent} from './events';

export interface TrackedLectureProgressCardProps {
    course: EnrolledBrowseCourse;
    pageType: string;
    uiRegion: string;
}

export class TrackedLectureProgressCard extends React.Component<TrackedLectureProgressCardProps> {
    trackImpression = () => {
        const {course, uiRegion} = this.props;
        Tracker.publishEvent(
            new LearningProgressCardImpressionEvent(buildEventData(course, uiRegion)),
        );
    };

    render() {
        const {pageType, course, ...props} = this.props;

        return (
            <TrackImpression trackFunc={this.trackImpression}>
                <CarouselItemFunnelTracker item={course} pageType={pageType}>
                    <LectureProgressCard course={course} {...props} />
                </CarouselItemFunnelTracker>
            </TrackImpression>
        );
    }
}
