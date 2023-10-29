import {getCourseBadgeFromBadgesFamily} from '@udemy/browse-course';
import {trackGenericCourseClick, TrackImpression} from '@udemy/event-tracking';
import {udPerf} from '@udemy/performance-rum-client';
import {CourseCardImage, APICourseCard, imagePropsFrom} from '@udemy/react-card-components';
import {Meter} from '@udemy/react-messaging-components';
import {PlayOverlay} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AltLeaveRating from 'course-reviews/common/alt-leave-rating.react-component';
import getConfigData from 'utils/get-config-data';

import OptionsMenu from './options-menu.react-component';
import './enrolled-course-card.less';

const udConfig = getConfigData();

@inject(({trackingContext = {}}) => ({trackingContext}))
@observer
export default class EnrolledCourseCard extends Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
        collection: PropTypes.object,
        trackingContext: PropTypes.shape({
            trackImpressionFunc: PropTypes.func,
        }).isRequired,
        uiRegion: PropTypes.string.isRequired,
    };

    static defaultProps = {
        collection: null,
    };

    @autobind
    onLoadImage() {
        udPerf.mark('MyCourses.learning-tab-first-img-loaded');
    }

    @autobind
    trackImpression() {
        const {trackImpressionFunc, ...trackingContext} = this.props.trackingContext;
        trackImpressionFunc({item: this.props.course}, trackingContext);
    }

    @autobind
    trackClick() {
        trackGenericCourseClick({
            courseId: this.props.course.id,
            courseTrackingId: this.props.course.frontendTrackingId || this.props.course.tracking_id,
            componentName: 'enrolledCourseCard',
        });
    }

    @autobind
    renderCourseImage() {
        const {course} = this.props;
        return (
            <>
                <CourseCardImage
                    {...imagePropsFrom({course})}
                    styleName="image"
                    onLoad={this.onLoadImage}
                />
                <div styleName="image-overlay">
                    <PlayOverlay size="xlarge" styleName="play-overlay" />
                    {course.num_collections > 0 && (
                        <div className="ud-heading-xs" styleName="collections-count">
                            {ninterpolate(
                                'In %(num_collection)s List',
                                'In %(num_collection)s Lists',
                                course.num_collections,
                                {num_collection: course.num_collections},
                            )}
                        </div>
                    )}
                </div>
            </>
        );
    }

    renderRatings() {
        if (
            udConfig.brand.is_add_reviews_enabled &&
            udConfig.features.course_review.leave_feedback &&
            this.props.course.completion_ratio > 0 &&
            this.props.course.features.reviews_view &&
            this.props.course.leaveRatingStore
        ) {
            return (
                <AltLeaveRating
                    store={this.props.course.leaveRatingStore}
                    styleName="rating"
                    udStyle="link"
                    typography="ud-text-xs"
                />
            );
        }
    }

    render() {
        const {course, trackingContext} = this.props;
        const card = (
            <div styleName="container">
                <APICourseCard
                    badgesProps={{course, badges: getCourseBadgeFromBadgesFamily}}
                    headline={course.headline}
                    image={this.renderCourseImage()}
                    instructorsProps={{course}}
                    onClick={this.trackClick}
                    onContextMenu={this.trackClick}
                    titleProps={{course, url: `/course-dashboard-redirect/?course_id=${course.id}`}}
                >
                    <Meter
                        value={course.completion_ratio}
                        min={0}
                        max={100}
                        aria-hidden={true}
                        label={gettext('%(percent)s% complete')}
                        styleName="meter"
                    />
                    <div className="ud-text-xs" styleName="progress-and-rating">
                        {course.completion_ratio > 0
                            ? interpolate(
                                  gettext('%(percent)s% complete'),
                                  {percent: course.completion_ratio},
                                  true,
                              )
                            : gettext('START COURSE')}
                        {this.renderRatings()}
                    </div>
                </APICourseCard>
                <div styleName="options-menu">
                    <OptionsMenu
                        course={course}
                        store={this.props.store}
                        collection={this.props.collection}
                        uiRegion={this.props.uiRegion}
                    />
                </div>
            </div>
        );

        if (!trackingContext.trackImpressionFunc) {
            return card;
        }

        return <TrackImpression trackFunc={this.trackImpression}>{card}</TrackImpression>;
    }
}
