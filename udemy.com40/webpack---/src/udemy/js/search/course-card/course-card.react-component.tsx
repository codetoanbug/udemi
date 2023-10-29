import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {useDeviceType} from '@udemy/hooks';
import {useFormatNumber} from '@udemy/i18n';
import {
    CourseCardDetailsProps,
    CourseCardInstructorsProps,
    CourseCardRatingsProps,
} from '@udemy/react-card-components';
import {Meter} from '@udemy/react-messaging-components';
import React from 'react';

import AsyncPriceCourseCard from 'browse/components/course-card/async-price-course-card.react-component';
import {CodingExerciseCountImpressionEvent} from 'browse/events';
import {DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
/**
 * TB-7034 : This provider will be moved out from the CLP codebase and will be placed in a common place. Since we
 * want to use for any feature, not only for CLP.
 */
import {useFeature} from 'course-landing-page/feature-context';
import {withExperiment} from 'experiment';
import {MAX_LECTURES_DISPLAYED} from 'search/constants';
import {CourseSearchResult} from 'search/types/course-search-result';

import {LectureTileCarousel} from './lecture-tile-carousel.react-component';
import {LessonTable} from './lesson-table.react-component';

import './course-card.less';

interface DebugProps {
    course: CourseSearchResult;
}

export const Debug = ({course}: DebugProps) => {
    const {
        input_features: inputFeatures,
        relevancy_score: relevancyScore,
        predictive_score: predictiveScore,
        order_in_results: orderInResults,
    } = course;

    if (!inputFeatures) {
        return null;
    }

    return (
        <div styleName="debug">
            <ul>
                <li>
                    <strong>{'Elasticsearch Score: '}</strong>
                    {relevancyScore}
                </li>
                <li>
                    <strong>{'Final Rank Score: '}</strong>
                    {predictiveScore}
                </li>
                <li>
                    <strong>{'Order in Results: '}</strong>
                    {orderInResults}
                </li>
                <li>
                    <strong>{'Input Features to the Ranking Model: '}</strong>
                </li>
            </ul>
            <ul>
                {Object.keys(inputFeatures)
                    .sort()
                    .map((key) => (
                        <li key={key}>
                            {`${key}: `}
                            <i>{JSON.stringify(inputFeatures[key], null, 4)}</i>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export interface CourseCardProps {
    course: CourseSearchResult;
    query: string;
    experiment: {
        cap_reviews_at_1000: boolean;
    };
    isUserEnrolled: boolean;
    completionRatio: number;
    showCodingExercisesBadge: boolean;
    isConsumerSubsSubscriber?: boolean;
    expandLectureResults?: boolean;
    renderCourseImage?: () => void;
}

export const CourseCard = withExperiment({cap_reviews_at_1000: false})(
    ({
        experiment,
        completionRatio,
        expandLectureResults,
        isConsumerSubsSubscriber,
        ...props
    }: CourseCardProps) => {
        const {formatNumber} = useFormatNumber();
        const showCodingExerciseCount = useFeature('showCodingExerciseCount')?.enabled ?? false;
        const deviceType = useDeviceType();
        const {course} = props;
        const {
            curriculum_items: curriculumItems = [],
            num_reviews: numReviews,
            tracking_id: trackingId,
            id: courseId,
            num_coding_exercises: numCodingExercises,
        } = course;
        const numReviewsText =
            experiment.cap_reviews_at_1000 && numReviews > 1000
                ? `${formatNumber(1000)}+`
                : undefined;
        const shouldShowEnrolledLabelInRatings = (isEnrolled?: boolean) => {
            if (!isEnrolled) {
                return false;
            }
            return deviceType !== DEVICE_TYPE_MOBILE;
        };
        const shouldShowEnrolledLabelInDetails = (isEnrolled?: boolean) => {
            if (!isEnrolled) {
                return false;
            }
            return deviceType === DEVICE_TYPE_MOBILE;
        };

        const renderRatings = (
            CourseRatingsComponent: React.ComponentType<CourseCardRatingsProps>,
            ratingsProps: CourseCardRatingsProps,
        ) => {
            const ratingsEnrollmentLabel = !shouldShowEnrolledLabelInRatings(
                props.isUserEnrolled,
            ) ? null : (
                <span
                    styleName="enrolled-label"
                    className="ud-heading-sm"
                    data-purpose="enrolled-label"
                >
                    {gettext('Enrolled')}
                </span>
            );
            return (
                <CourseRatingsComponent {...ratingsProps}>
                    {ratingsEnrollmentLabel}
                </CourseRatingsComponent>
            );
        };

        const getCodingExerciseMetadata = () => {
            const trackFunc = () => {
                Tracker.publishEvent(
                    new CodingExerciseCountImpressionEvent({
                        id: courseId,
                        trackingId,
                        numCodingExercises,
                    }),
                );
            };

            return (
                <TrackImpression trackFunc={trackFunc}>
                    <div>
                        {ninterpolate(
                            '%s coding exercise',
                            '%s coding exercises',
                            numCodingExercises,
                        )}
                    </div>
                </TrackImpression>
            );
        };

        const renderLectureTileCarousel = () => {
            return (
                <LectureTileCarousel
                    lectures={curriculumItems}
                    courseImage={props.course.image_100x100}
                    courseId={courseId}
                    courseUrl={props.course.url}
                    defaultExpanded={expandLectureResults}
                    maxNumLectures={MAX_LECTURES_DISPLAYED}
                />
            );
        };

        const renderCurriculumItems = () => {
            return (
                <LessonTable
                    lessons={curriculumItems}
                    query={props.query}
                    trackingId={trackingId ?? ''}
                    courseId={courseId}
                />
            );
        };

        const renderDetails = (
            CourseDetailsComponent: React.ComponentType<CourseCardDetailsProps>,
            {metadata: propsMetadata, ...rest}: CourseCardDetailsProps,
        ) => {
            const showingEnrolledLabel = shouldShowEnrolledLabelInDetails(props.isUserEnrolled);
            const detailsEnrollmentLabel = !showingEnrolledLabel ? null : (
                <span
                    styleName="enrolled-label-mobile"
                    className="ud-heading-sm"
                    data-purpose="enrolled-label-mobile"
                >
                    {gettext('Enrolled')}
                </span>
            );

            const shouldShowCodingExercises = showCodingExerciseCount && numCodingExercises > 0;

            // If showing enrollment label, then omit the default metadata from card details
            const metadata = showingEnrolledLabel
                ? []
                : [
                      ...(propsMetadata ?? []),
                      ...(shouldShowCodingExercises ? [getCodingExerciseMetadata()] : []),
                  ];

            return (
                <>
                    <CourseDetailsComponent metadata={metadata} {...rest}>
                        {detailsEnrollmentLabel}
                    </CourseDetailsComponent>
                </>
            );
        };

        const renderInstructorContent = (
            InstructorComponent: React.ComponentType<CourseCardInstructorsProps>,
            props: CourseCardInstructorsProps,
        ) => {
            const displayNames = course.instructor_name
                ? [course.instructor_name]
                : props.displayNames;

            return <InstructorComponent displayNames={displayNames} />;
        };

        return (
            <>
                <AsyncPriceCourseCard
                    {...props}
                    size="large"
                    renderInstructorContent={renderInstructorContent}
                    renderRatings={renderRatings}
                    renderDetails={renderDetails}
                    numReviewsText={numReviewsText}
                >
                    {curriculumItems.length > 0 &&
                        !isConsumerSubsSubscriber &&
                        renderCurriculumItems()}
                    {curriculumItems.length > 0 &&
                        isConsumerSubsSubscriber &&
                        deviceType !== DEVICE_TYPE_MOBILE &&
                        renderLectureTileCarousel()}
                    {completionRatio !== null && completionRatio !== undefined && (
                        <Meter
                            value={completionRatio}
                            min={0}
                            max={100}
                            label={gettext('%(percent)s% complete')}
                            styleName="course-progress"
                        />
                    )}
                </AsyncPriceCourseCard>
                {isConsumerSubsSubscriber &&
                    deviceType == DEVICE_TYPE_MOBILE &&
                    renderLectureTileCarousel()}
                <Debug {...props} />
            </>
        );
    },
);
