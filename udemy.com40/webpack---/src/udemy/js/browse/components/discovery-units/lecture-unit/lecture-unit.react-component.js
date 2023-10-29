import {Tracker, TrackImpression, ClickEvent} from '@udemy/event-tracking';
import {UnitTitle} from '@udemy/react-discovery-units';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {LECTURE_DRAWER_ID} from 'browse/components/lecture-quick-view/constants';
import {LectureDiscoveryCardClickEvent, LectureDiscoveryCardImpressionEvent} from 'browse/events';
import {attachFrontendTrackingIds, discoveryTracker} from 'browse/tracking';
import {VideoCard} from 'topic/components/video-card.react-component';

@inject(({trackingContext = {}}) => ({trackingContext}))
@observer
export class LectureCard extends Component {
    static propTypes = {
        lecture: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            enroll_url: PropTypes.string.isRequired,
            content_length: PropTypes.number.isRequired,
            tracking_id: PropTypes.string.isRequired,
            primary_topic_title: PropTypes.string,
        }).isRequired,
        unit: PropTypes.object.isRequired,
        trackingContext: PropTypes.shape({
            backendSource: PropTypes.string.isRequired,
        }).isRequired,
        index: PropTypes.number.isRequired,
        isConsumerSubsSubscriber: PropTypes.bool,
        lectureQuickViewStore: PropTypes.object,
        uiRegion: PropTypes.string,
    };

    static defaultProps = {
        isConsumerSubsSubscriber: false,
        trackingId: '',
        lectureQuickViewStore: undefined,
        uiRegion: '',
    };

    handleAction = () => {
        const lecture = this.props.lecture;
        const serveTrackingId = this.props.unit.tracking_id;
        Tracker.publishEvent(
            new ClickEvent({
                componentName: 'recommendedLectureCard',
                trackingId: lecture.frontendTrackingId,
                relatedObjectType: ClickEvent.relatedObjectTypes.lecture,
                relatedObjectId: lecture.id,
            }),
        );
        if (this.props.uiRegion && serveTrackingId) {
            Tracker.publishEvent(
                new LectureDiscoveryCardClickEvent({
                    id: this.props.lecture.id,
                    position: this.props.index,
                    backendSource: this.props.trackingContext.backendSource,
                    trackingId: this.props.lecture.tracking_id,
                    uiRegion: this.props.uiRegion,
                    serveTrackingId,
                }),
            );
        }
        if (this.props.lectureQuickViewStore) {
            this.props.lectureQuickViewStore.setTrackingContext({
                searchTrackingId: serveTrackingId,
                backendSource: this.props.trackingContext.backendSource,
                trackingId: lecture.tracking_id,
                index: this.props.index,
            });
            this.props.lectureQuickViewStore.fetchLectureQuickViewData(
                lecture.course.id,
                lecture.id,
            );
        }
    };

    trackImpression = () => {
        const serveTrackingId = this.props.unit.tracking_id;
        discoveryTracker.trackDiscoveryImpression(
            {item: this.props.lecture},
            {
                backendSource: this.props.trackingContext.backendSource,
                index: this.props.index,
            },
        );
        if (this.props.uiRegion && serveTrackingId) {
            Tracker.publishEvent(
                new LectureDiscoveryCardImpressionEvent({
                    id: this.props.lecture.id,
                    position: this.props.index,
                    backendSource: this.props.trackingContext.backendSource,
                    trackingId: this.props.lecture.tracking_id,
                    uiRegion: this.props.uiRegion,
                    serveTrackingId,
                }),
            );
        }
    };

    render() {
        const {lecture, index, isConsumerSubsSubscriber} = this.props;
        if (!lecture) {
            return null;
        }
        return (
            <TrackImpression trackFunc={this.trackImpression}>
                <div>
                    <VideoCard
                        data={lecture}
                        showTopicTitle={true}
                        onAction={this.handleAction}
                        index={index}
                        trackingData={lecture}
                        isConsumerSubsSubscriber={isConsumerSubsSubscriber}
                        buttonProps={
                            this.props.lectureQuickViewStore
                                ? {
                                      cssToggleId: LECTURE_DRAWER_ID,
                                      componentClass: 'button',
                                  }
                                : undefined
                        }
                    />
                </div>
            </TrackImpression>
        );
    }
}

@observer
export default class LectureUnit extends Component {
    static propTypes = {
        unit: PropTypes.object.isRequired,
        showTitle: PropTypes.bool,
        className: PropTypes.string,
        showPager: PropTypes.bool,
        fullWidth: PropTypes.bool,
        isConsumerSubsSubscriber: PropTypes.bool,
        lectureQuickViewStore: PropTypes.object,
        uiRegion: PropTypes.string,
    };

    static defaultProps = {
        showTitle: false,
        showPager: false,
        fullWidth: false,
        className: undefined,
        isConsumerSubsSubscriber: false,
        lectureQuickViewStore: undefined,
        uiRegion: '',
    };

    trackLectureImpression = () => {
        if (!(this.props.unit.title && this.props.unit.item_type)) {
            return;
        }
        discoveryTracker.trackUnitView(this.props.unit, this.props.unit.item_type);
    };

    renderLectures() {
        const {unit} = this.props;
        attachFrontendTrackingIds(unit.items);
        return unit.items.map((lecture, index) => (
            <LectureCard
                key={lecture.id}
                unit={unit}
                lecture={lecture}
                index={index}
                isConsumerSubsSubscriber={this.props.isConsumerSubsSubscriber}
                lectureQuickViewStore={this.props.lectureQuickViewStore}
                uiRegion={this.props.uiRegion}
            />
        ));
    }

    render() {
        if (!this.props.unit.items) {
            return null;
        }
        const {className, showPager, fullWidth} = this.props;
        return (
            <TrackImpression trackFunc={this.trackLectureImpression}>
                <div className={className}>
                    {this.props.showTitle && <UnitTitle unit={this.props.unit} />}
                    <Carousel showPager={showPager} fullViewport={fullWidth}>
                        {this.renderLectures()}
                    </Carousel>
                </div>
            </TrackImpression>
        );
    }
}
