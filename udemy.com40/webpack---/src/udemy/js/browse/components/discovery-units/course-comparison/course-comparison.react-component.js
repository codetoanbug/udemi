import {getCourseBadgeFromType, COURSE_BADGE_CODING_EXERCISES} from '@udemy/browse-course';
import {
    Tracker,
    TrackImpression,
    TrackingContextProvider,
    trackGenericCourseClick,
} from '@udemy/event-tracking';
import {FunnelLog} from '@udemy/funnel-tracking';
import {useFormatNumber, useI18n, withI18n} from '@udemy/i18n';
import PeopleIcon from '@udemy/icons/dist/people.ud-icon';
import {Button, Image} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {ShowMore} from '@udemy/react-reveal-components';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AsyncCourseStaticPriceText from 'base-components/price-text/async-course-static-price-text.react-component';
import PURCHASE_PRICE_TYPES from 'base-components/price-text/constants';
import {SelectBadge} from 'browse/components/badge/select-badge.react-component';
import {DiscoveryItemClickEvent} from 'browse/events';
import {discoveryTracker} from 'browse/tracking';
import {UI_REGION} from 'browse/ui-regions';
import WishlistStore from 'course-landing-page/components/wishlist/wishlist.mobx-store';
import Wishlist from 'course-landing-page/components/wishlist/wishlist.react-component';

import {DISPLAYED_SECTIONS_COUNT} from './constants';
import styles from './course-comparison.less';

const ShowMoreButton = (props) => (
    <Button {...props} udStyle="secondary">
        {props.children}
    </Button>
);

export const CourseImage = ({course, ...passThroughProps}) => {
    return (
        <Image
            src={course.image_50x50}
            srcSet={`${course.image_50x50} 1x, ${course.image_100x100} 2x`}
            alt=""
            width={64}
            height={64}
            className={styles['course-image']}
            {...passThroughProps}
        />
    );
};

CourseImage.propTypes = {
    course: PropTypes.object.isRequired,
};

export const NumStudents = ({numStudents}) => {
    const {formatNumber} = useFormatNumber();
    return (
        <span className={classNames('ud-text-sm', styles['num-students'])}>
            <PeopleIcon label={false} size="xsmall" />
            <span>{formatNumber(numStudents)}</span>
        </span>
    );
};

NumStudents.propTypes = {
    numStudents: PropTypes.number.isRequired,
};

const LastUpdatedDate = ({lastUpdatedDate}) => {
    const {gettext} = useI18n();
    const date = new Date(lastUpdatedDate);
    const {request: udRequest} = useUDData();
    const userLocale = udRequest && udRequest.locale ? udRequest.locale.replace('_', '-') : 'en-US';
    const lastUpdateDate = date.toLocaleDateString(userLocale, {
        month: 'numeric',
        year: 'numeric',
    });

    return (
        <span>
            {gettext('Updated')} {lastUpdateDate}
        </span>
    );
};

LastUpdatedDate.propTypes = {
    lastUpdatedDate: PropTypes.string.isRequired,
};

@inject(({trackingContext = {}, showCodingExercisesBadge}) => ({
    trackingContext,
    showCodingExercisesBadge,
}))
class CourseComparisonItem extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        trackingContext: PropTypes.shape({
            index: PropTypes.number.isRequired,
            backendSource: PropTypes.string.isRequired,
            relatedSourceId: PropTypes.string,
            relatedSourceType: PropTypes.string,
        }).isRequired,
        showCodingExercisesBadge: PropTypes.bool,
        hideCoursePrices: PropTypes.bool,
    };

    static defaultProps = {
        showCodingExercisesBadge: false,
        hideCoursePrices: false,
    };

    trackClick = () => {
        trackGenericCourseClick({
            courseId: this.props.course.id,
            courseTrackingId: this.props.course.frontendTrackingId,
            componentName: 'courseComparisonItem',
        });
        const trackingContext = this.props.trackingContext;
        Tracker.publishEvent(
            new DiscoveryItemClickEvent({
                id: this.props.course.id,
                type: 'course',
                trackingId:
                    this.props.course.frontendTrackingId ?? this.props.course.tracking_id ?? '',
                serveTrackingId: this.props.course.tracking_id?.toString() ?? '',
                backendSource: trackingContext.backendSource,
                position: trackingContext.index,
                badgeFamilies: [],
                uiRegion: UI_REGION.COURSE_COMPARISON,
            }),
        );
    };

    trackImpression = () => {
        const trackingContext = this.props.trackingContext;
        discoveryTracker.trackDiscoveryImpression(
            {item: this.props.course},
            {
                backendSource: trackingContext.backendSource,
                index: trackingContext.index,
            },
            {
                relatedSourceId: trackingContext.relatedSourceId,
                relatedSourceType: trackingContext.relatedSourceType,
            },
        );
    };

    render() {
        const {course, showCodingExercisesBadge, hideCoursePrices} = this.props;
        const CourseBadgeComponent =
            course.badges && course.badges.length
                ? getCourseBadgeFromType(course.badges[0].badge_family)
                : null;
        const CodingExercisesBadgeComponent =
            showCodingExercisesBadge &&
            course.is_coding_exercises_badge_eligible &&
            getCourseBadgeFromType(COURSE_BADGE_CODING_EXERCISES);

        return (
            <TrackImpression trackFunc={this.trackImpression}>
                {/*
                This div between instances of Observer (inside TrackImpression and FunnelLog)
                is needed to allow both Observers to work, on Firefox.  Without it, only one will
                fire and we'll lose events. It can be removed when we remove FunnelLog.
                */}
                <div>
                    <FunnelLog item={course}>
                        <div className={styles['course-container']} data-purpose="course-container">
                            <div className={styles['main-content']}>
                                {/* This is the only link that should receive keyboard focus */}
                                <a
                                    className={classNames('ud-heading-md', styles['course-title'])}
                                    href={course.url}
                                    onClick={this.trackClick}
                                    onContextMenu={this.trackClick}
                                >
                                    {course.title}
                                </a>
                                <div className={styles['course-info']}>
                                    <div className={styles['course-badges']}>
                                        {course.is_in_premium &&
                                            !course.is_in_user_subscription && <SelectBadge />}
                                        {CourseBadgeComponent && <CourseBadgeComponent />}
                                        {CodingExercisesBadgeComponent && (
                                            <CodingExercisesBadgeComponent />
                                        )}
                                    </div>
                                    <div className={classNames('ud-text-sm', styles['meta-items'])}>
                                        {course.content_info && (
                                            <span className={styles['content-info']}>
                                                {course.content_info}
                                            </span>
                                        )}
                                        {course.last_update_date && (
                                            <LastUpdatedDate
                                                lastUpdatedDate={course.last_update_date}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles['comparison-content']}>
                                <StarRating
                                    showNumber={true}
                                    rating={course.rating}
                                    numeric={true}
                                />
                                <NumStudents numStudents={course.num_subscribers} />

                                <AsyncCourseStaticPriceText
                                    courses={[course]}
                                    data-purpose="price-text"
                                    className={classNames(styles['price-text-container'], {
                                        [styles['hide-in-subscription']]:
                                            course.is_in_user_subscription || hideCoursePrices,
                                    })}
                                    listPriceClassName={classNames(
                                        'ud-text-xs',
                                        styles['list-price'],
                                    )}
                                    discountPriceClassName={classNames(
                                        'ud-heading-sm',
                                        styles['discount-price'],
                                    )}
                                    trackingEventContext={{
                                        buyableId: course.id,
                                        buyableType: 'course',
                                        priceType: PURCHASE_PRICE_TYPES.individual_buyable,
                                        buyableTrackingId:
                                            course.frontendTrackingId || course.tracking_id,
                                    }}
                                />
                            </div>
                            <div className={styles['image-wrapper']}>
                                <CourseImage course={course} />
                            </div>
                            {/* This link covers the entire course card and should not receive keyboard focus*/}
                            <a
                                className={styles['whole-card-link']}
                                data-purpose="card-link"
                                href={course.url}
                                aria-hidden="true"
                                tabIndex="-1"
                                onClick={this.trackClick}
                                onContextMenu={this.trackClick}
                            />
                            {/* Wishlist comes after the full link so the button is still clickable. We are not making
                                the whole-card-link the first element because then the other elements would be clickable */}
                            <div
                                data-purpose="wishlist-container"
                                className={classNames(styles['wishlist-content'], {
                                    [styles['hide-in-subscription']]:
                                        course.is_in_user_subscription,
                                })}
                            >
                                <Wishlist
                                    wishlistStore={new WishlistStore(course, window)}
                                    round={true}
                                    uiRegion={UI_REGION.COURSE_COMPARISON}
                                />
                            </div>
                        </div>
                    </FunnelLog>
                </div>
            </TrackImpression>
        );
    }
}

@observer
class CourseComparison extends React.Component {
    static propTypes = {
        unit: PropTypes.object,
        currentCourseId: PropTypes.number.isRequired,
        pageType: PropTypes.string.isRequired,
        showTitle: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
        hideCoursePrices: PropTypes.bool,
    };

    static defaultProps = {
        unit: {},
        showTitle: true,
        hideCoursePrices: false,
    };

    render() {
        const recommendedCourses = this.props.unit.items;
        if (!recommendedCourses.length) {
            return <div className="discovery-unit-empty-render" />;
        }

        const hiddenSectionsCount = recommendedCourses.length - DISPLAYED_SECTIONS_COUNT;
        const sectionComponents = recommendedCourses.map((course, index) => {
            return (
                <TrackingContextProvider trackingContext={{index}} key={course.id}>
                    <CourseComparisonItem
                        course={course}
                        hideCoursePrices={this.props.hideCoursePrices}
                    />
                </TrackingContextProvider>
            );
        });

        return (
            <>
                {this.props.showTitle && (
                    <h2 className="ud-heading-xl" data-purpose="title">
                        {this.props.unit.title || this.props.gettext('Students also bought')}
                    </h2>
                )}
                {hiddenSectionsCount > 0 ? (
                    <ShowMore
                        collapsedHeight={610}
                        fullWidthButton={true}
                        buttonComponent={ShowMoreButton}
                        hideIcons={true}
                        className={styles['show-more']}
                        data-purpose="show-more-container"
                    >
                        <div
                            className={styles['content-container']}
                            data-purpose="show-more-content-container"
                        >
                            {sectionComponents}
                        </div>
                    </ShowMore>
                ) : (
                    <div
                        className={styles['content-container']}
                        data-purpose="short-list-content-container"
                    >
                        {sectionComponents}
                    </div>
                )}
            </>
        );
    }
}

export default withI18n(CourseComparison);
