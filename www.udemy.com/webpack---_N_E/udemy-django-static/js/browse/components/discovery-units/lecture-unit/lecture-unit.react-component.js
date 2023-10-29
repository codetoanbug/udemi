import { Tracker, TrackImpression, ClickEvent } from "@udemy/event-tracking";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import React, { Component } from "react";

import { Carousel } from "@udemy/react-structure-components";
import { UnitTitle } from "@udemy/react-discovery-units";
import {
  attachFrontendTrackingIds,
  discoveryTracker,
} from "udemy-django-static/js/browse/tracking";
import { VideoCard } from "udemy-django-static/js/topic/components/video-card.react-component";

@inject(({ trackingContext = {} }) => ({ trackingContext }))
@observer
export class LectureCard extends Component {
  static propTypes = {
    lecture: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      enroll_url: PropTypes.string.isRequired,
      content_length: PropTypes.number.isRequired,
      _class: PropTypes.string.isRequired,
      tracking_id: PropTypes.string.isRequired,
      primary_topic_title: PropTypes.string,
    }).isRequired,
    unit: PropTypes.object.isRequired,
    trackingContext: PropTypes.shape({
      backendSource: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    isConsumerSubsSubscriber: PropTypes.bool,
  };

  static defaultProps = {
    isConsumerSubsSubscriber: false,
  };

  handleAction = () => {
    const lecture = this.props.lecture;
    Tracker.publishEvent(
      new ClickEvent({
        componentName: "recommendedLectureCard",
        trackingId: lecture.frontendTrackingId,
        relatedObjectType: ClickEvent.relatedObjectTypes.lecture,
        relatedObjectId: lecture.id,
      })
    );
  };

  trackImpression = () => {
    discoveryTracker.trackDiscoveryImpression(
      { item: this.props.lecture },
      {
        backendSource: this.props.trackingContext.backendSource,
        index: this.props.index,
      }
    );
  };

  render() {
    const { lecture, index, isConsumerSubsSubscriber } = this.props;
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
  };

  static defaultProps = {
    showTitle: false,
    showPager: false,
    fullWidth: false,
    className: undefined,
    isConsumerSubsSubscriber: false,
  };

  trackLectureImpression = () => {
    if (!(this.props.unit.title && this.props.unit.item_type)) {
      return;
    }
    discoveryTracker.trackUnitView(this.props.unit, this.props.unit.item_type);
  };

  renderLectures() {
    const { unit } = this.props;
    attachFrontendTrackingIds(unit.items);
    return unit.items.map((lecture, index) => (
      <LectureCard
        key={lecture.id}
        unit={unit}
        lecture={lecture}
        index={index}
        isConsumerSubsSubscriber={this.props.isConsumerSubsSubscriber}
      />
    ));
  }

  render() {
    if (!this.props.unit.items) {
      return null;
    }
    const { className, showPager, fullWidth } = this.props;
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
