import {
    getCourseBadgeFromType,
    COURSE_BADGE_CODING_EXERCISES,
    getCourseBadgeFromBadgesFamily,
    PersonalPlanBadge,
    CourseCardSeoInfo,
} from '@udemy/browse-course';
import {TrackImpression, trackGenericCourseClick} from '@udemy/event-tracking';
import {withFunnelLog} from '@udemy/funnel-tracking';
import {
    CourseCardBadges,
    CourseCardDetails,
    CourseCardImage,
    CourseCardInstructors,
    CourseCardRatings,
    CourseCardTitle,
    badgesPropsFrom,
    detailsPropsFrom,
    imagePropsFrom,
    instructorsPropsFrom,
    ratingsPropsFrom,
} from '@udemy/react-card-components';
import {PlayOverlay} from '@udemy/react-structure-components';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import StaticPriceText from 'base-components/price-text/static-price-text.react-component';
import {pricePropsFromWithTracking} from 'base-components/ungraduated/api-course-card/price';
import {BackendSourceOptions} from 'browse/events';
import {trackCourseClickEvent} from 'browse/lib/common-tracking';

import styles from './browse-course-card.less';
import {CourseCardWithUBGuard} from './course-card-with-ub-guard.react-component';
/*
Browse version of CourseCard wraps the base CourseCard with a course link, and
adds tracking for impressions and clicks.
 */

// Todo remove Funnel Log after events migration complete
@inject(({showPersonalPlanBadge, trackingContext = {}, showCodingExercisesBadge}) => ({
    showPersonalPlanBadge,
    trackingContext,
    showCodingExercisesBadge,
}))
@withFunnelLog('course')
export default class BrowseCourseCard extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        width: PropTypes.oneOf(['fixed', 'flexible']),
        className: PropTypes.string,
        titleClass: PropTypes.string,
        numReviewsText: PropTypes.string,
        priceProps: PropTypes.object,
        showBadges: PropTypes.bool,
        showDetails: PropTypes.bool,
        url: PropTypes.string,

        /*
         * Custom rendering functions receive a component and props to
         * render, optionally with customization. This customization pattern
         * comes from an older course card, and these functions are retained
         * here for backwards compatibility for consumers of this component. For
         * context about which components are passed to each of these functions
         * see `https://github.com/udemy/design-system-web/tree/main/packages/react-card-components/src/api-course-card`
         */
        renderCourseImage: PropTypes.func,
        renderInstructorContent: PropTypes.func,
        renderPriceText: PropTypes.func,
        renderCourseTitle: PropTypes.func,
        renderRatings: PropTypes.func,
        renderDetails: PropTypes.func,
        renderCourseBadges: PropTypes.func,

        /**
         * Optional handler if user clicks on CourseCard.
         *
         * @remarks
         * This prop is not recommended for user interaction. It is placed on the enclosing `div`
         * and does not have the associated `role` or keyboard event handlers required for a11y.
         * It can be used for click tracking.
         */
        onClick: PropTypes.func,
        isUserEnrolled: PropTypes.bool,
        trackingContext: PropTypes.shape({
            index: PropTypes.number,
            trackImpressionFunc: PropTypes.func,
            relatedSourceId: PropTypes.string,
            relatedSourceType: PropTypes.string,
        }).isRequired,
        trackingClickCallbackFunc: PropTypes.func,
        showPersonalPlanBadge: PropTypes.bool,
        showCodingExercisesBadge: PropTypes.bool,
    };

    static defaultProps = {
        size: 'medium',
        width: 'flexible',
        className: undefined,
        titleClass: undefined,
        numReviewsText: undefined,
        priceProps: undefined,
        showBadges: true,
        showDetails: true,
        renderCourseImage: (Component, props) => <Component {...props} />,
        renderInstructorContent: (Component, props) => <Component {...props} />,
        renderPriceText: (Component, props) => <Component {...props} />,
        renderCourseTitle: (Component, props) => <Component {...props} />,
        renderRatings: (Component, props) => <Component {...props} />,
        renderDetails: (Component, props) => <Component {...props} />,
        renderCourseBadges: (Component, props) => <Component {...props} />,
        url: undefined,
        onClick: undefined,
        isUserEnrolled: undefined,
        trackingClickCallbackFunc: undefined,
        showPersonalPlanBadge: false,
        showCodingExercisesBadge: false,
    };

    trackImpression = () => {
        const {
            trackImpressionFunc,
            relatedSourceId,
            relatedSourceType,
            ...trackingContext
        } = this.props.trackingContext;

        trackImpressionFunc({item: this.props.course}, trackingContext, {
            relatedSourceId,
            relatedSourceType,
        });
    };

    trackClick = (event) => {
        const {trackingClickCallbackFunc, course} = this.props;
        const {index} = this.props.trackingContext;
        trackGenericCourseClick({
            courseId: course.id,
            courseTrackingId: course.frontendTrackingId || course.tracking_id,
            componentName: 'courseCard',
            index,
        });

        trackCourseClickEvent(course, index, BackendSourceOptions.DISCOVERY);
        if (trackingClickCallbackFunc) {
            trackingClickCallbackFunc(event);
        }
    };

    render() {
        const {
            children,
            course,
            showBadges,
            titleClass,
            numReviewsText,
            priceProps,
            url,
            renderCourseImage,
            renderInstructorContent,
            renderPriceText,
            renderCourseTitle,
            renderRatings,
            renderDetails,
            renderCourseBadges,
            trackingContext,
            trackingClickCallbackFunc,
            isUserEnrolled,
            showPersonalPlanBadge,
            showCodingExercisesBadge,
            ...props
        } = this.props;

        const localRenderImage = () => {
            // Augment className in image props
            const baseImageProps = imagePropsFrom({course});
            const imageProps = {
                ...baseImageProps,
                className: classNames(baseImageProps.className, styles.image),
            };

            if (isUserEnrolled) {
                return (
                    <>
                        {renderCourseImage(CourseCardImage, imageProps)}
                        <div className={styles['opacity-overlay-dark']} />
                        <PlayOverlay className={styles['enrolled-play-overlay-mobile']} />
                    </>
                );
            }
            if (course.is_in_personal_plan_collection && showPersonalPlanBadge) {
                return (
                    <>
                        {renderCourseImage(CourseCardImage, imageProps)}
                        <PersonalPlanBadge />
                    </>
                );
            }

            return renderCourseImage(CourseCardImage, imageProps);
        };

        const localRenderTitle = () => {
            const url = course.is_in_user_subscription ? course.learn_url : course.url;
            const titleContent = (
                <>
                    {course.title}
                    <CourseCardSeoInfo course={course} />
                </>
            );

            return renderCourseTitle(CourseCardTitle, {
                className: titleClass,
                children: url ? <a href={url}>{titleContent}</a> : <span>{titleContent}</span>,
            });
        };

        const localRenderBadges = () => {
            if (showCodingExercisesBadge && course.is_coding_exercises_badge_eligible) {
                const CodingExercisesBadgeComponent = getCourseBadgeFromType(
                    COURSE_BADGE_CODING_EXERCISES,
                );
                return (
                    <CourseCardBadges>
                        <CodingExercisesBadgeComponent />
                    </CourseCardBadges>
                );
            }

            return renderCourseBadges(
                CourseCardBadges,
                badgesPropsFrom({course, badges: getCourseBadgeFromBadgesFamily}),
            );
        };

        const isBuyable = !(course.is_in_user_subscription || isUserEnrolled);

        const courseCardLink = (
            <CourseCardWithUBGuard
                {...props}
                badges={isBuyable && showBadges && localRenderBadges()}
                details={renderDetails(CourseCardDetails, detailsPropsFrom({course}))}
                headline={course.headline}
                image={localRenderImage()}
                instructors={renderInstructorContent(
                    CourseCardInstructors,
                    instructorsPropsFrom({course}),
                )}
                onClick={this.trackClick}
                onContextMenu={this.trackClick}
                ratings={renderRatings(
                    CourseCardRatings,
                    ratingsPropsFrom({course, numReviewsText}),
                )}
                price={
                    isBuyable &&
                    renderPriceText(
                        StaticPriceText,
                        pricePropsFromWithTracking({course, priceTextProps: priceProps}),
                    )
                }
                title={localRenderTitle()}
            >
                {children}
            </CourseCardWithUBGuard>
        );

        if (!trackingContext.trackImpressionFunc) {
            return courseCardLink;
        }
        return <TrackImpression trackFunc={this.trackImpression}>{courseCardLink}</TrackImpression>;
    }
}
