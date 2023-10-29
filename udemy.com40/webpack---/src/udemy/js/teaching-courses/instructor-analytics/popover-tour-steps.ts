import {Step} from 'instructor/popover-tour/types';

export const ubOnlyInsightsPopoverTourSteps: Step[] = [
    {
        selector: '[data-tour-step="1"]',
        message: gettext(
            'In the Overview page, check out your Udemy Business earnings, enrollments, and ratings over time.',
        ),
        popoverProps: {placement: 'right', detachFromTarget: true},
        redirectUrl: {
            pathname: '/performance/students/',
            search: '?course_id=&data_scope=ub',
        },
    },
    {
        selector: '[data-tour-step="2"]',
        message: gettext(
            "In the Students page, use the new Udemy Business view to see your workplace learners' topic interests," +
                " the languages they speak, and some of the other courses they're taking.",
        ),
        popoverProps: {placement: 'right', detachFromTarget: true},
        redirectUrl: {
            pathname: '/performance/reviews/',
            search: '?course_id=&data_scope=ub',
        },
    },
    {
        selector: '[data-tour-step="3"]',
        message: gettext(
            'In the Reviews page, set the "Source" filter to "Udemy Business" to drill down on reviews from your ' +
                'workplace learners. Choose a specific course to get a breakdown of the course attributes learners are responding to.',
        ),
        popoverProps: {placement: 'right', detachFromTarget: true},
        redirectUrl: {
            pathname: '/performance/engagement/',
            search: '?date_filter=year&course_id=&data_scope=ub',
        },
    },
    {
        selector: '[data-tour-step="4"]',
        message: gettext(
            "In the Course Engagement page, track the way learners are consuming your content to identify what's working " +
                "or what needs improvement. Check out how many learners are engaging, how long they're spending on each course, and which lectures they're loving.",
        ),
        popoverProps: {placement: 'right', detachFromTarget: true},
    },
];
