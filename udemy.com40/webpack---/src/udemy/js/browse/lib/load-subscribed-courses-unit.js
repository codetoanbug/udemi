import {attachFrontendTrackingIds} from 'browse/tracking';
import udApi from 'utils/ud-api';

const PURCHASED_COURSES_ENDPOINT = '/users/me/subscribed-courses/';

/**
 * Loads the Subscribed Courses unit.
 *
 * @param {Object} options. Additional options to pass to the subscribed courses API.
 *
 * @returns {Promise} If the unit is available,
 * resolves to an object with the following shape,
 * else resolves to null.
 *    courses: List of courses in the unit.
 */

const DEFAULT_COURSE_FIELDS =
    '@min,visible_instructors,image_240x135,image_480x270,favorite_time,archive_time,' +
    'completion_ratio,last_accessed_time,enrollment_time,is_practice_test_course,features,num_collections,' +
    'published_title,buyable_object_type,remaining_time,assignment_due_date,is_assigned,' +
    'next_to_watch_item';

export default async function loadSubscribedCoursesUnit(
    options = {},
    courseFields = DEFAULT_COURSE_FIELDS,
) {
    const params = {
        'fields[course]': courseFields,
        'fields[user]': '@min',
        ordering: '-access_time,-enrolled',
        ...options,
    };
    if (options.ordering === 'most_recent_activity') {
        params['fields[course]'] += ',most_recent_activity';
    }

    return udApi.get(PURCHASED_COURSES_ENDPOINT, {params, useCache: true}).then((response) => {
        const results = response.status === 204 ? [] : response.data.results || [];
        if (results.length > 0) {
            attachFrontendTrackingIds(results);
            return {courses: results, next: response.data.next, previous: response.data.previous};
        }
        return null;
    });
}
