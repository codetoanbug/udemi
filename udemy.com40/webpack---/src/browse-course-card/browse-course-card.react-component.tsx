import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {createContext, ReactNode, ComponentType, MouseEventHandler} from 'react';

import {BackendSourceOptions, discoveryTracker} from '@udemy/browse-event-tracking';
import {TrackImpression, trackGenericCourseClick} from '@udemy/event-tracking';
import {withFunnelLog} from '@udemy/funnel-tracking';
import {
    badgesPropsFrom,
    APICourseCardPriceProps,
    CourseCardBadges,
    CourseCardBadgesProps,
    CourseCardDetails,
    CourseCardDetailsProps,
    CourseCardImage,
    CourseCardImageProps,
    CourseCardInstructors,
    CourseCardInstructorsProps,
    CourseCardRatings,
    CourseCardRatingsProps,
    CourseCardTitle,
    CourseCardTitleProps,
    detailsPropsFrom,
    imagePropsFrom,
    instructorsPropsFrom,
    ratingsPropsFrom,
} from '@udemy/react-card-components';
import {PlayOverlay} from '@udemy/react-structure-components';

import {COURSE_BADGE_CODING_EXERCISES} from '../course-badges/constants';
import {
    getCourseBadgeFromBadgesFamily,
    getCourseBadgeFromType,
} from '../course-badges/course-badges.react-component';
import {CourseCardSeoInfo} from '../course-card-seo-info/course-card-seo-info.react-component';
import {pricePropsWithTrackingFrom} from '../course-price-events/course-card-price-events';
import {PersonalPlanBadge} from '../personal-plan-badge/personal-plan-badge.react-component';
import {StaticPriceText} from '../price-text/static-price-text.react-component';
import {PriceTextProps} from '../price-text/with-price-text-tracking.react-component';
import {BrowseCourse} from '../types/course';
import styles from './browse-course-card.module.less';
import {trackCourseClickEvent} from './course-card-tracking';
import {CourseCardWithUBGuard} from './course-card-with-ub-guard.react-component';

/**
 * Context to specify an alternate course card component to render in `BrowseCourseCard`.
 *
 * It must support the same prop interface as `@udemy/react-card-components#CourseCard`.
 *
 * Note: remove this context when we are no longer experimenting with an alternate
 * course card design. It is otherwise unnecessary.
 */
export const BrowseCourseCardContext = createContext({cardComponent: CourseCardWithUBGuard});

const defaultSlotRenderFunc: <TProps>(C: ComponentType<TProps>, p: TProps) => ReactNode = (
    Component,
    props,
) => <Component {...props} />;

export interface BrowseCourseCardProps {
    course: BrowseCourse;
    size?: 'small' | 'medium' | 'large';
    width?: 'fixed' | 'flexible';
    className?: string;
    titleClass?: string;
    numReviewsText?: string;
    priceProps?: APICourseCardPriceProps['priceTextProps'];
    showBadges?: boolean;
    showDetails?: boolean;
    url?: string;

    renderCourseImage?: (
        C: ComponentType<CourseCardImageProps>,
        p: CourseCardImageProps,
    ) => ReactNode;
    renderInstructorContent?: (
        C: ComponentType<CourseCardInstructorsProps>,
        p: CourseCardInstructorsProps,
    ) => ReactNode;
    renderPriceText?: (C: ComponentType<PriceTextProps>, p: PriceTextProps) => ReactNode;
    renderCourseTitle?: (
        C: ComponentType<CourseCardTitleProps>,
        p: CourseCardTitleProps,
    ) => ReactNode;
    renderRatings?: (
        C: ComponentType<CourseCardRatingsProps>,
        p: CourseCardRatingsProps,
    ) => ReactNode;
    renderDetails?: (
        C: ComponentType<CourseCardDetailsProps>,
        p: CourseCardDetailsProps,
    ) => ReactNode;
    renderCourseBadges?: (
        C: ComponentType<CourseCardBadgesProps>,
        p: CourseCardBadgesProps,
    ) => ReactNode;

    onClick?: MouseEventHandler;
    isUserEnrolled?: boolean;

    trackingContext?: {
        backendSource: BackendSourceOptions;
        trackImpressionFunc: typeof discoveryTracker.trackDiscoveryImpression;
        index: number;
        relatedSourceId: string | null;
        relatedSourceType: string | null;
        uiRegion?: string;
    };

    trackingClickCallbackFunc?: MouseEventHandler;
    showPersonalPlanBadge?: boolean;
    showCodingExercisesBadge?: boolean;
}

type BrowseCourseCardPropsInternal = Omit<BrowseCourseCardProps, 'trackingContext'> &
    Required<Pick<BrowseCourseCardProps, 'trackingContext'>>;

class InternalBrowseCourseCard extends React.Component<BrowseCourseCardPropsInternal> {
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
            backendSource: PropTypes.string,
            index: PropTypes.number,
            trackImpressionFunc: PropTypes.func,
            relatedSourceId: PropTypes.string,
            relatedSourceType: PropTypes.string,
            uiRegion: PropTypes.string,
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
        renderCourseImage: defaultSlotRenderFunc,
        renderInstructorContent: defaultSlotRenderFunc,
        renderPriceText: defaultSlotRenderFunc,
        renderCourseTitle: defaultSlotRenderFunc,
        renderRatings: defaultSlotRenderFunc,
        renderDetails: defaultSlotRenderFunc,
        renderCourseBadges: defaultSlotRenderFunc,
        url: undefined,
        onClick: undefined,
        isUserEnrolled: undefined,
        trackingClickCallbackFunc: undefined,
        showPersonalPlanBadge: false,
        showCodingExercisesBadge: false,
    };

    static contextType = BrowseCourseCardContext;

    trackImpression = () => {
        const {trackImpressionFunc, relatedSourceId, relatedSourceType, ...trackingContext} =
            this.props.trackingContext;

        trackImpressionFunc({item: this.props.course}, trackingContext, {
            relatedSourceId,
            relatedSourceType,
        });
    };

    trackClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const {trackingClickCallbackFunc, course} = this.props;
        const {index, uiRegion} = this.props.trackingContext;
        trackGenericCourseClick({
            courseId: course.id,
            // Assert that at least *one* of these two tracking IDs will be defined
            courseTrackingId: (course.frontendTrackingId || course.tracking_id) as string,
            componentName: 'courseCard',
        });

        trackCourseClickEvent(course, index, BackendSourceOptions.DISCOVERY, uiRegion);
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            url,
            renderCourseImage,
            renderInstructorContent,
            renderPriceText,
            renderCourseTitle,
            renderRatings,
            renderDetails,
            renderCourseBadges,
            trackingContext,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                        {renderCourseImage?.(CourseCardImage, imageProps)}
                        <div className={styles['opacity-overlay-dark']} />
                        <PlayOverlay className={styles['enrolled-play-overlay-mobile']} />
                    </>
                );
            }
            if (course.is_in_personal_plan_collection && showPersonalPlanBadge) {
                return (
                    <>
                        {renderCourseImage?.(CourseCardImage, imageProps)}
                        <PersonalPlanBadge />
                    </>
                );
            }

            return renderCourseImage?.(CourseCardImage, imageProps);
        };

        const localRenderTitle = () => {
            const url = course.is_in_user_subscription ? course.learn_url : course.url;
            const titleContent = (
                <>
                    {course.title}
                    <CourseCardSeoInfo course={course} />
                </>
            );

            return renderCourseTitle?.(CourseCardTitle, {
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
                        {CodingExercisesBadgeComponent && <CodingExercisesBadgeComponent />}
                    </CourseCardBadges>
                );
            }

            return renderCourseBadges?.(
                CourseCardBadges,
                badgesPropsFrom({course, badges: getCourseBadgeFromBadgesFamily}),
            );
        };

        const isBuyable = !(course.is_in_user_subscription || isUserEnrolled);
        const CourseCard = this.context.cardComponent;

        const courseCardLink = (
            <CourseCard
                {...props}
                badges={isBuyable && showBadges && localRenderBadges()}
                details={renderDetails?.(CourseCardDetails, detailsPropsFrom({course}))}
                headline={course.headline}
                image={localRenderImage()}
                instructors={renderInstructorContent?.(
                    CourseCardInstructors,
                    instructorsPropsFrom({course}),
                )}
                onClick={this.trackClick}
                onContextMenu={this.trackClick}
                ratings={renderRatings?.(
                    CourseCardRatings,
                    ratingsPropsFrom({course, numReviewsText}),
                )}
                price={
                    isBuyable &&
                    renderPriceText?.(
                        StaticPriceText,
                        pricePropsWithTrackingFrom({course, priceTextProps: priceProps}),
                    )
                }
                title={localRenderTitle()}
            >
                {children}
            </CourseCard>
        );

        if (!trackingContext?.trackImpressionFunc) {
            return courseCardLink;
        }
        return <TrackImpression trackFunc={this.trackImpression}>{courseCardLink}</TrackImpression>;
    }
}

/**
 * Browse version of CourseCard wraps the base CourseCard with a course link, and
 * adds tracking for impressions and clicks.
 */
export const BrowseCourseCard = Object.assign(
    withFunnelLog('course')(
        inject(({showPersonalPlanBadge, trackingContext = {}, showCodingExercisesBadge}) => ({
            showPersonalPlanBadge,
            trackingContext,
            showCodingExercisesBadge,
        }))(InternalBrowseCourseCard),
    ),
    {
        defaultCardComponent: CourseCardWithUBGuard,
        displayName: 'BrowseCourseCard',
    },
);
