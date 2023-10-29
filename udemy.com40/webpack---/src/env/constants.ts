import {when} from 'mobx';

import {getConfigData} from '../data/get-config-data';
import {getRequestData} from '../data/get-request-data';
import {udMe} from './ud-me';

const extractValue = (object: Record<string, unknown>, path: (string | number)[]) =>
    path.reduce(
        // eslint-disable-next-line
        // @ts-ignore:next-line
        (current, property) => (current && current[property] ? current[property] : null),
        object,
    );

export const ANALYTICS_PARAMS = {
    course: {
        extract: (data: Record<string, unknown>) => {
            const locale = extractValue(data, ['locale', 'locale']) as string;
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
        url: (courseId: number) => `/courses/${courseId}/`,
    },
    user: {
        extract: async (numCoursesPurchased?: number) => {
            const me = udMe();

            await when(() => !me?.isLoading);

            if (me?.id) {
                if (numCoursesPurchased) {
                    return {
                        is_first_paid_purchase:
                            extractValue(me, ['number_of_courses_purchased']) ===
                            numCoursesPurchased,
                    };
                }
                return {
                    isMember: true,
                    user_language: extractValue(me, ['language']),
                    user_locale: extractValue(me, ['locale']),
                    user_location: extractValue(me, ['country']),
                    has_made_paid_purchase: me.has_made_paid_purchase,
                };
            }

            const locale = extractValue(getRequestData(), ['locale']) as string;
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
