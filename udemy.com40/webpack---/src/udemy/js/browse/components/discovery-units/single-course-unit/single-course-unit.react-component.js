import {
    getCourseBadgeFromType,
    COURSE_BADGE_CODING_EXERCISES,
    PersonalPlanBadge,
} from '@udemy/browse-course';
import {TrackImpression, trackGenericCourseClick} from '@udemy/event-tracking';
import {FunnelLog} from '@udemy/funnel-tracking';
import {withMatchMedia} from '@udemy/hooks';
import {useI18n, withI18n, formatNumber} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {AlternateHeadline} from '@udemy/react-discovery-units';
import {StarRating} from '@udemy/react-merchandising-components';
import {Carousel, AutoPlayCarousel} from '@udemy/react-structure-components';
import {safelySetInnerHTML} from '@udemy/shared-utils';
import {withUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AsyncCourseStaticPriceText from 'base-components/price-text/async-course-static-price-text.react-component';
import PURCHASE_PRICE_TYPES from 'base-components/price-text/constants';
import {SelectBadge} from 'browse/components/badge/select-badge.react-component';
import StartLearningLabel from 'browse/components/course-card/start-learning-label.react-component';
import {DiscoveryItemImpressionEvent} from 'browse/events';
import {discoveryTracker} from 'browse/tracking';

import InstructorContent from './instructor-content.react-component';
import InstructorTitle from './instructor-titles.react-component';
import styles from './single-course-unit.less';
import SingleCourseUnitStore from './single-course-unit.mobx-store';

const CourseMetaInfo = ({contentInfo, numPublishedLectures, level}) => {
    const {ninterpolate} = useI18n();
    return (
        <div
            data-purpose="course-meta-info"
            className={classNames('ud-text-xs', styles['course-meta-info'])}
        >
            {contentInfo && <span>{contentInfo}</span>}
            {numPublishedLectures && (
                <span>{ninterpolate('%s lecture', '%s lectures', numPublishedLectures)}</span>
            )}
            {level && <span>{level}</span>}
        </div>
    );
};

CourseMetaInfo.propTypes = {
    contentInfo: PropTypes.string,
    numPublishedLectures: PropTypes.number,
    level: PropTypes.string,
};

CourseMetaInfo.defaultProps = {
    contentInfo: undefined,
    numPublishedLectures: undefined,
    level: undefined,
};

@inject(({showPersonalPlanBadge, showCodingExercisesBadge}) => ({
    showPersonalPlanBadge,
    showCodingExercisesBadge,
}))
export class InternalCourseCard extends Component {
    backendSource = DiscoveryItemImpressionEvent.backendSourceOptions.DISCOVERY;

    renderInstructorContent(course) {
        return <InstructorContent course={course} />;
    }

    renderCourseImage = (Image, props) => {
        return <Image {...props} />;
    };

    trackClick(event) {
        const courseId = parseInt(event.currentTarget.getAttribute('data-course-id'), 10);
        const courseTrackingId = event.currentTarget.getAttribute('data-course-tracking-id');
        trackGenericCourseClick({
            courseId,
            courseTrackingId,
            componentName: 'singleCourseUnit',
        });
    }

    renderPriceText = (course) => {
        const {Config: udConfig} = this.props.udData;
        if (course.is_in_user_subscription) {
            return <StartLearningLabel className="price-text-container" />;
        }
        if (!udConfig.brand.has_organization) {
            return (
                <AsyncCourseStaticPriceText
                    courses={[course]}
                    className="price-text-container"
                    listPriceClassName="list-price ud-text-sm"
                    discountPriceClassName="discount-price ud-heading-md"
                    trackingEventContext={{
                        buyableId: course.id,
                        priceType: PURCHASE_PRICE_TYPES.individual_buyable,
                        buyableType: 'course',
                        buyableTrackingId: course.frontendTrackingId || course.tracking_id,
                    }}
                />
            );
        }
    };

    trackImpression = () => {
        const trackingContext = {
            index: this.props.index,
            backendSource: this.backendSource,
        };
        discoveryTracker.trackDiscoveryImpression({item: this.props.course}, trackingContext);
    };

    render() {
        const {
            course,
            showPersonalPlanBadge,
            showCodingExercisesBadge,
            ninterpolate,
            locale,
        } = this.props;
        const numReviewsText = formatNumber(course.num_reviews, locale);

        const CourseBadgeComponent =
            course.badges && course.badges.length && !course.is_in_user_subscription
                ? getCourseBadgeFromType(course.badges[0].badge_family)
                : null;
        const CodingExercisesBadgeComponent =
            showCodingExercisesBadge &&
            course.is_coding_exercises_badge_eligible &&
            getCourseBadgeFromType(COURSE_BADGE_CODING_EXERCISES);

        const courseWrapperClass = classNames(styles.container, styles['course-wrapper'], {
            [styles['course-wrapper__multi']]: this.store && this.store.courses.length > 1,
        });

        return (
            <a
                href={course.is_in_user_subscription ? course.learn_url : course.url}
                className={classNames('ud-custom-focus-visible', courseWrapperClass)}
                data-purpose="container"
                data-course-id={course.id}
                data-course-tracking-id={course.frontendTrackingId || course.tracking_id}
                onClick={this.trackClick}
                onContextMenu={this.trackClick}
            >
                <div className={styles['image-wrapper']}>
                    <Image
                        src={course.image_480x270}
                        srcSet={`${course.image_480x270} 1x, ${course.image_750x422} 2x`}
                        alt=""
                        width={480}
                        height={270}
                        className={styles['course-image']}
                    />
                    {course.is_in_personal_plan_collection && showPersonalPlanBadge && (
                        <PersonalPlanBadge />
                    )}
                    {course.is_in_premium && !course.is_in_user_subscription && (
                        <SelectBadge onCardDetails={false} />
                    )}
                </div>
                <TrackImpression trackFunc={this.trackImpression}>
                    <div className={styles['main-content']}>
                        <div
                            className={classNames(
                                'ud-heading-lg ud-focus-visible-target',
                                styles['course-title'],
                            )}
                        >
                            {course.title}
                        </div>
                        {course.headline && (
                            <p
                                className={classNames('ud-text-sm', styles['course-headline'])}
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'single-course-unit:headline',
                                    html: course.headline,
                                })}
                            />
                        )}
                        <div className={styles['info-row']}>
                            <div
                                className={classNames('ud-text-xs', styles['instructor-titles'])}
                                data-purpose="instructor-titles"
                            >
                                <InstructorTitle instructors={course.visible_instructors} />
                            </div>
                        </div>
                        <div className={styles['info-row']}>
                            {course.visible_instructors &&
                                course.visible_instructors.length > 0 &&
                                this.renderInstructorContent(course)}
                            <CourseMetaInfo
                                contentInfo={course.content_info}
                                numPublishedLectures={course.num_published_lectures}
                                level={course.instructional_level_simple}
                            />
                        </div>
                        <div className={styles['info-row']}>
                            <div className={styles['star-rating-wrapper']}>
                                <StarRating showNumber={true} rating={course.rating} />
                                <span className="ud-sr-only">
                                    {ninterpolate(
                                        '%(count)s review',
                                        '%(count)s reviews',
                                        course.num_reviews,
                                        {count: numReviewsText},
                                    )}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={classNames('ud-text-xs', styles['reviews-text'])}
                                >{`(${numReviewsText})`}</span>
                            </div>
                            {CourseBadgeComponent && <CourseBadgeComponent />}
                            {CodingExercisesBadgeComponent && <CodingExercisesBadgeComponent />}
                        </div>
                        {this.renderPriceText(course)}
                    </div>
                </TrackImpression>
            </a>
        );
    }
}

InternalCourseCard.propTypes = {
    course: PropTypes.object,
    index: PropTypes.number,
    showPersonalPlanBadge: PropTypes.bool,
    showCodingExercisesBadge: PropTypes.bool,
    ninterpolate: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    udData: PropTypes.object.isRequired,
};

InternalCourseCard.defaultProps = {
    course: undefined,
    index: undefined,
    showPersonalPlanBadge: false,
    showCodingExercisesBadge: false,
};

const CourseCard = withUDData(withI18n(InternalCourseCard));

@withMatchMedia({
    hasCoarsePointer: '(any-pointer: coarse)',
    hasFinePointer: '(any-pointer: fine)',
    hasPrimaryCoarsePointer: '(pointer: coarse)',
})
export default class SingleCourseUnit extends Component {
    static propTypes = {
        alternateHeadline: PropTypes.shape({
            title: PropTypes.string.isRequired,
            secondaryText: PropTypes.string,
        }),
        className: PropTypes.string,
        unit: PropTypes.object.isRequired,
        showTitle: PropTypes.bool,
        titleTypography: PropTypes.string,
        hasCoarsePointer: PropTypes.bool,
        hasFinePointer: PropTypes.bool,
        hasPrimaryCoarsePointer: PropTypes.bool,
    };

    static defaultProps = {
        alternateHeadline: undefined,
        className: '',
        showTitle: true,
        titleTypography: 'ud-heading-xl',
        hasCoarsePointer: null,
        hasFinePointer: null,
        hasPrimaryCoarsePointer: null,
    };

    constructor(props) {
        super(props);
        this.store = new SingleCourseUnitStore(this.props.unit);
    }

    render() {
        const {
            alternateHeadline,
            className,
            showTitle,
            titleTypography,
            hasCoarsePointer,
            hasFinePointer,
            hasPrimaryCoarsePointer,
        } = this.props;

        const CarouselComponent = hasPrimaryCoarsePointer ? Carousel : AutoPlayCarousel;

        return (
            <div className={className}>
                {showTitle && (
                    <h2
                        className={classNames(titleTypography, styles.title)}
                        data-purpose="single-course-unit-title"
                    >
                        {this.store.title}
                    </h2>
                )}
                {!showTitle && alternateHeadline && this.store.courses.length && (
                    <AlternateHeadline
                        titleTag="h2"
                        title={alternateHeadline.title}
                        secondaryText={alternateHeadline.secondaryText}
                    />
                )}
                <CarouselComponent
                    allowScroll={hasCoarsePointer}
                    showPager={hasFinePointer}
                    prioritizeTouch={hasPrimaryCoarsePointer}
                    className={styles['carousel-courses']}
                    pagerButtonClassName="single-course-unit__pager-button"
                >
                    {this.store.courses.map((course, index) => {
                        return (
                            <FunnelLog key={course.id} item={course}>
                                <CourseCard course={course} index={index} />
                            </FunnelLog>
                        );
                    })}
                </CarouselComponent>
            </div>
        );
    }
}
