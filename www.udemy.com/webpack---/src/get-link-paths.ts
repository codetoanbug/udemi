import qs from 'qs';

import {DATE_RANGE, DEFAULT_DATE_FILTER} from './dates';

interface QueryParams {
    course_id?: number;
    date_filter?: string;
    star?: string;
    ordering?: string;
    unresponded?: boolean;
    commented?: boolean;
}

export function getLinkPaths(queryParams: QueryParams = {}) {
    const courseId =
        queryParams.course_id && !isNaN(queryParams.course_id) ? queryParams.course_id : null;
    const overviewQueryParams = {
        date_filter: queryParams.date_filter ?? DATE_RANGE.YEAR,
        course_id: courseId,
    };
    const overviewPath = `/overview/revenue/?${qs.stringify(overviewQueryParams)}`;

    const studentsQueryParams = {
        course_id: courseId,
    };

    const reviewsQueryParams = {
        course_id: courseId,
        star: queryParams.star,
        ordering: queryParams.ordering,
        unresponded: queryParams.unresponded,
        commented: queryParams.commented,
    };

    const studentsPath = `/students/?${qs.stringify(studentsQueryParams)}`;

    const engagementPath = `/engagement/?${qs.stringify(overviewQueryParams)}`;

    const practiceInsightsPath = `/practice-insights/?${qs.stringify(overviewQueryParams)}`;

    const conversionQueryParams = {
        // we do not support 'all time' date range for conversion & traffic tab
        date_filter:
            queryParams.date_filter === DATE_RANGE.ALL_TIME || !queryParams.date_filter
                ? DEFAULT_DATE_FILTER
                : queryParams.date_filter,
        course_id: courseId,
    };

    const conversionPath = `/conversion/visitors?${qs.stringify(conversionQueryParams)}`;

    const reviewsPath = `/reviews/?${qs.stringify(reviewsQueryParams)}`;

    return {
        overviewPath,
        reviewsPath,
        studentsPath,
        engagementPath,
        practiceInsightsPath,
        conversionPath,
    };
}
