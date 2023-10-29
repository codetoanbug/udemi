import {attachFrontendTrackingIds} from 'browse/tracking';
import udApi from 'utils/ud-api';

export const SUBSCRIPTION_COURSE_ENROLLMENTS_ENDPOINT =
    '/users/me/subscription-course-enrollments/';

/**
 * Loads the Consumer Subscription Courses unit.
 *
 * @param {Object} options. Additional options to pass to the subscribed courses API.
 *
 * @returns {Promise} If the unit is available,
 * resolves to an object with the following shape,
 * else resolves to null.
 *    consumerSubscriptionCourses: List of user consumer subscription courses in the unit.
 */
export default function consumerSubscriptionCoursesUnit(options = {}) {
    const params = {
        'fields[course]':
            '@min,visible_instructors,image_240x135,image_480x270,completion_ratio,last_accessed_time,' +
            'enrollment_time,is_practice_test_course,features,num_collections,published_title,' +
            'buyable_object_type,remaining_time,is_assigned,next_to_watch_item,is_in_user_subscription',
        'fields[user]': '@min',
        ordering: '-access_time,-enrolled',
        ...options,
    };
    if (options.ordering === 'most_recent_activity') {
        params['fields[course]'] += ',most_recent_activity';
    }

    return udApi
        .get(SUBSCRIPTION_COURSE_ENROLLMENTS_ENDPOINT, {params, useCache: true})
        .then((response) => {
            const results = response.status === 204 ? [] : response.data.results || [];
            if (results.length > 0) {
                attachFrontendTrackingIds(results);
                return {consumerSubscriptionCourses: results};
            }
            return null;
        });
}
