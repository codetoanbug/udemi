export default Object.freeze({
    'fields[course]':
        '@default,discount,num_published_lectures,headline,instructional_level_simple,' +
        'avg_rating,num_reviews,buyable_object_type,content_info,is_wishlisted,rating,image_100x100,is_recently_published,' +
        'caption_locales,caption_languages,locale,is_in_user_subscription,is_in_premium',
    filter_hq_courses: true,
    ordering: 'lang,-ds_course_feature__revenue_30days',
    page: 1,
    page_size: 4,
});

/* Free course suppression experiment has two variants.
 * (control and free course suppression)
 */
export const FREE_COURSE_SUPPRESSION = {
    default_value: 'disabled',
    variant: 'full_discovery_suppression',
    key: 'free_course_suppression',
};
