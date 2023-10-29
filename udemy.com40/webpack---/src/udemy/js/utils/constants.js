import {when} from 'mobx';

import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udMe from 'utils/ud-me';

const extractValue = (object, path) =>
    path.reduce(
        (current, property) => (current && current[property] ? current[property] : null),
        object,
    );

const ANALYTICS_PARAMS = {
    course: {
        extract: (data) => {
            const locale = extractValue(data, ['locale', 'locale']);
            return {
                course_id: extractValue(data, ['id']),
                course_title: extractValue(data, ['title']),
                course_topic: extractValue(data, ['context_info', 'label', 'display_name']),
                course_category: extractValue(data, ['primary_category', 'title']),
                course_subcategory: extractValue(data, ['primary_subcategory', 'title']),
                course_avg_rating: extractValue(data, ['avg_rating_recent']),
                course_instructor_name: extractValue(data, [
                    'visible_instructors',
                    0,
                    'display_name',
                ]),
                course_language: locale ? locale.split('_')[0] : null,
                course_locale: locale,
                course_length_minutes: extractValue(data, ['estimated_content_length']),
                course_num_enrollments: extractValue(data, ['num_subscribers']),
            };
        },
        params: {
            'fields[course]':
                'title,context_info,primary_category,primary_subcategory,avg_rating_recent,visible_instructors,locale,estimated_content_length,num_subscribers',
        },
        url: (courseId) => `/courses/${courseId}/`,
    },
    user: {
        extract: async (numCoursesPurchased) => {
            await when(() => !udMe.isLoading);

            if (udMe.id) {
                if (numCoursesPurchased) {
                    return {
                        is_first_paid_purchase:
                            extractValue(udMe, ['number_of_courses_purchased']) ===
                            numCoursesPurchased,
                    };
                }
                return {
                    isMember: true,
                    user_language: extractValue(udMe, ['language']),
                    user_locale: extractValue(udMe, ['locale']),
                    user_location: extractValue(udMe, ['country']),
                    has_made_paid_purchase: udMe.has_made_paid_purchase,
                };
            }

            const locale = extractValue(getRequestData(), ['locale']);
            return {
                isMember: false,
                user_language: locale ? locale.split('_')[0] : null,
                user_locale: locale,
                user_location: extractValue(getConfigData(), ['price_country', 'id']),
                has_made_paid_purchase: false,
            };
        },
    },
};

export default ANALYTICS_PARAMS;
