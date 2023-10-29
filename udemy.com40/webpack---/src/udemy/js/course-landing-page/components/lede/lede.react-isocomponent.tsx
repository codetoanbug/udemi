import {getCourseBadgeFromType, COURSE_BADGE_CODING_EXERCISES} from '@udemy/browse-course';
import {useFormatNumber} from '@udemy/i18n';
import LanguageIcon from '@udemy/icons/dist/language.ud-icon';
import NewIcon from '@udemy/icons/dist/new.ud-icon';
import classNames from 'classnames';
import React from 'react';

import CaptionDesktop from 'course-landing-page/components/caption/caption-desktop.react-isocomponent';
import CaptionMobile from 'course-landing-page/components/caption/caption-mobile.react-isocomponent';
import CourseContentLength from 'course-landing-page/components/course-content-length/course-content-length.react-component';
import InstructorLinks from 'course-landing-page/components/instructors/instructor-links.react-isocomponent';
import Rating from 'course-landing-page/components/rating/rating.react-isocomponent';
import UFBCourseContextMenuLazy from 'course-landing-page/components/ufb-course-context-menu/ufb-course-context-menu-lazy.react-component';
import {ClpCourse} from 'course-landing-page/types/clp-course';
import getRequestData from 'utils/get-request-data';
import {isomorphic} from 'utils/isomorphic-rendering';

export interface LedeProps {
    hasDarkBackground: boolean;
    badgesEnabled: boolean;
    course: ClpCourse;
    instructorLinkProps: {
        instructors: Record<string, unknown>[];
        useAbsoluteURLs: boolean;
    };
    showCodingExercisesBadge?: boolean;
}

const getLastUpdatedText = (course: LedeProps['course']) => {
    const date = new Date(
        course.lastUpdateDate ?? course.publishedDate,
    ).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric'});
    return course.lastUpdateDate
        ? interpolate(gettext('Last updated %(date)s'), {date}, true)
        : interpolate(gettext('Published %(date)s'), {date}, true);
};

export const Lede = ({
    hasDarkBackground,
    badgesEnabled,
    course,
    instructorLinkProps,
    showCodingExercisesBadge,
}: LedeProps) => {
    const {formatNumber} = useFormatNumber();
    const isMobile = getRequestData().isMobile;
    const numStudentsText = ninterpolate(
        '%(count)s student',
        '%(count)s students',
        course.numStudents,
        {count: formatNumber(course.numStudents)},
    );
    const Badge = badgesEnabled && course.badgeFamily && getCourseBadgeFromType(course.badgeFamily);
    const CodingExercisesBadgeComponent =
        showCodingExercisesBadge &&
        course.is_coding_exercises_badge_eligible &&
        badgesEnabled &&
        getCourseBadgeFromType(COURSE_BADGE_CODING_EXERCISES);
    const CaptionComponent = isMobile ? CaptionMobile : CaptionDesktop;
    return (
        <div
            className={classNames('course-landing-page__main-content', {
                'dark-background-inner-text-container': hasDarkBackground,
            })}
        >
            <div className="ud-text-sm clp-lead">
                <h1
                    className="ud-heading-xl clp-lead__title clp-lead__title--small"
                    data-purpose="lead-title"
                >
                    {course.title}
                </h1>
                <div className="ud-text-md clp-lead__headline" data-purpose="lead-headline">
                    {course.headline}
                </div>
                <div className="clp-lead__badge-ratings-enrollment">
                    {Badge || CodingExercisesBadgeComponent ? (
                        <div className="clp-lead__element-item">
                            {Badge && <Badge />}
                            {CodingExercisesBadgeComponent && <CodingExercisesBadgeComponent />}
                        </div>
                    ) : null}
                    <div className="clp-lead__element-item clp-lead__element-item--row">
                        <Rating
                            num_reviews={course.numReviews}
                            rating={course.rating}
                            hasDarkBackground={hasDarkBackground}
                            clickableRatingsEnabled={course.isPaid}
                        />
                        <div className="enrollment" data-purpose="enrollment">
                            {numStudentsText}
                        </div>
                        {!course.isPaid && (
                            <CourseContentLength contentLengthVideo={course.contentLengthVideo} />
                        )}
                    </div>
                </div>
                <div className="clp-lead__element-item">
                    <InstructorLinks {...instructorLinkProps} />
                </div>
                <div className="clp-lead__element-meta">
                    {course.isPaid && (
                        <div className="clp-lead__element-item">
                            <div className="last-update-date" data-purpose="last-update-date">
                                <NewIcon
                                    className="last-update-date__icon"
                                    size="xsmall"
                                    color="neutral"
                                    label={false}
                                />
                                <span>{getLastUpdatedText(course)}</span>
                            </div>
                        </div>
                    )}
                    <div
                        className="clp-lead__element-item clp-lead__locale"
                        data-purpose="lead-course-locale"
                    >
                        <LanguageIcon
                            className="icon"
                            size="xsmall"
                            color="neutral"
                            label={false}
                            role="img"
                            aria-label={gettext('Course Language')}
                            aria-hidden={false}
                        />
                        {/* See Locale.simple_english_title in LOCALIZED_MODELS. */}
                        {/* eslint-disable-next-line gettext/no-variable-string */}
                        {gettext(course.localeSimpleEnglishTitle)}
                    </div>
                    <div className="clp-lead__element-item  clp-lead__caption">
                        <CaptionComponent captioned_languages={course.captionedLanguages} />
                    </div>
                </div>
                <UFBCourseContextMenuLazy course={course} />
            </div>
        </div>
    );
};

export default isomorphic(Lede);
