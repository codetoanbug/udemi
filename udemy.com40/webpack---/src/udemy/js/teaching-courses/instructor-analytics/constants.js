import {observable} from 'mobx';
import React from 'react';

import {GRAPH_TYPES} from './instructor-performance-chart-config-generator';
import './tab-chart.less';

export * from './date-constants';

const enrollmentInstuctorTooltip = (
    <p className="ud-text-sm">
        {gettext(
            'This is the total number of enrollments across your published ' +
                'and unpublished courses. For example, if a student is enrolled in two ' +
                'of your courses, that student counts for two enrollments.',
        )}
    </p>
);
const enrollmentCourseTooltip = (
    <p className="ud-text-sm">
        {gettext('This is the total number of enrollments in your course.')}
    </p>
);
const ratingTooltip = (
    <p className="ud-text-sm">
        {gettext(
            'Ratings are calculated from individual ' +
                "students' ratings and a variety of other signals, " +
                'like age of rating and reliability, to ensure that ' +
                'they reflect course quality fairly and accurately.',
        )}
    </p>
);

export const visitorTooltip = (daysMissing) => (
    <div className="ud-text-sm">
        <p>
            {gettext(
                'This is the number of people who visited your course landing page ' +
                    '(over the selected date range). If the same person visits your landing page ' +
                    'more than once, they’re counted as one visitor.',
            )}
        </p>
        <p>
            {ninterpolate(
                'Previous day not yet processed.',
                'Previous %s days not yet processed.',
                daysMissing,
            )}
        </p>
    </div>
);

export const conversionTooltip = (daysMissing) => (
    <div className="ud-text-sm">
        <p>
            {gettext(
                'This is the number of enrollments from your course landing page ' +
                    'divided by the total number of visits (over the selected date range). ' +
                    'Use this percentage to gauge your landing page’s effectiveness at ' +
                    'getting people to enroll in your course.',
            )}
        </p>
        <p>
            {ninterpolate(
                'Previous day not yet processed.',
                'Previous %s days not yet processed.',
                daysMissing,
            )}
        </p>
    </div>
);

const BASE_URL = '/instructor';

// Let's convert these to observables now. Some of the code does object equality checks with these
// values, and those checks will fail between a non-observable and an observable version of these
// values. This became an issue in MobX 3 since MobX no longer mutates objects in place when you
// make them observable, but rather creates a new copy.
export const METRIC_SETTINGS = observable({
    REVENUE: {
        label: gettext('Total revenue'),
        path: 'revenue',
        link: '/revenue-report/',
        linkLabel: gettext('Revenue Report'),
        graph: GRAPH_TYPES.REVENUE,
        hasTooltip: false,
        thisMonthText: (revenue) => interpolate(gettext('%s this month'), [revenue]),
    },
    ENROLLMENT: {
        label: gettext('Total enrollments'),
        path: 'enrollment',
        inAppLink: true,
        link: '/students/',
        linkLabel: gettext('Learn about your students'),
        graph: GRAPH_TYPES.STUDENTS,
        hasTooltip: true,
        instructorTooltipText: enrollmentInstuctorTooltip,
        courseTooltipText: enrollmentCourseTooltip,
        thisMonthText: (enrollments) => interpolate(gettext('%s this month'), [enrollments]),
    },
    RATING: {
        instructorLabel: gettext('Instructor rating'),
        courseLabel: gettext('Course rating'),
        path: 'rating',
        link: `${BASE_URL}/reviews/`,
        linkLabel: gettext('Rating Report'),
        graph: GRAPH_TYPES.RATING,
        hasTooltip: true,
        instructorTooltipText: ratingTooltip,
        thisMonthText: (ratings) =>
            ninterpolate('%s rating this month', '%s ratings this month', ratings),
    },
    VISITORS: {
        label: gettext('Landing page visitors'),
        path: 'visitors',
        graph: GRAPH_TYPES.VISITORS,
        hasTooltip: true,
        tooltipFunc: visitorTooltip,
    },
    CONVERSION: {
        label: gettext('Conversion rate'),
        path: 'conversion',
        graph: GRAPH_TYPES.CONVERSION,
        hasTooltip: true,
        tooltipFunc: conversionTooltip,
    },
});

export const DEFAULT_DECIMAL_PLACES = 2;

export const MKINSIGHTS_URL = `${BASE_URL}/marketplace-insights/`;

export const DEFAULT_NUM_METRICS_PER_PAGE = 5;

export const COURSE_CARD_FIELDS = [
    'badges',
    'buyable_object_type',
    'content_info',
    'discount',
    'headline',
    'image_100x100',
    'image_240x135',
    'image_480x270',
    'image_50x50',
    'instructional_level_simple',
    'num_published_lectures',
    'num_reviews',
    'price',
    'price_detail',
    'price_serve_tracking_id',
    'rating',
    'title',
    'tracking_id',
    'url',
    'visible_instructors',
];

export const STUDENT_CARD_FIELDS = [
    'country',
    'course',
    'display_name',
    'enrollment_date',
    'image_75x75',
    'initials',
    'title',
    'url',
];

export const REVENUE_TYPE = 'revenue_type';

export const REVENUE_CHANNELS = ['marketplace', 'ufb', 'other', 'partner'];

export const TRAFFIC_AND_CONVERSION_CHANNELS = {
    ALL: 'all',
    DISCOVERY: 'discovery',
    SEARCH: 'search',
    PAID: 'paid',
    INSTRUCTOR: 'instructor',
    OUTSIDE: 'external organic',
    UNKNOWN: 'unknown',
};

export const CHANNEL_LABELS = {
    discovery: gettext('Udemy discovery'),
    search: gettext('Udemy search'),
    'external organic': gettext('Outside sources'),
    instructor: gettext('Instructor promo'),
    paid: gettext('Udemy ads and affiliates'),
    all: gettext('All Channels'),
    unknown: gettext('Unknown'),
};

export const getStudentListUrl = (courseId) => {
    return `/course/${courseId}/manage/students/`;
};

export const ALL_COURSE_OPTION = 'All Courses';

export const DATA_SCOPE_LABELS = {
    all: gettext('All'),
    ub: gettext('UB'),
};

export const DATA_SCOPE_FILTERS = {
    ALL: 'all',
    UB: 'ub',
};

export const DEFAULT_DATA_SCOPE_FILTER = DATA_SCOPE_FILTERS.ALL;

export const COURSE_ENGAGEMENT_HEADER_TEXT_STATEMENTS = {
    lectureCourses: {
        minutesTaught: gettext(
            'of lectures students have collectively viewed over the specified time period.',
        ),
        activeStudents: gettext("who've started a lecture over the selected time period."),
    },
    practiceTestOnlyCourse: {
        minutesTaught: gettext(
            'of practice tests students have collectively consumed over the specified time period.',
        ),
        activeStudents: gettext("who've started a practice test over the selected time period."),
    },
};

export const missingPermissionMessagePerformance = gettext(
    'Contact the primary instructor and ask for Performance permissions to gain access.',
);

export const missingPermissionMessageReviews = gettext(
    'Contact the primary instructor and ask for Reviews permissions to gain access.',
);
