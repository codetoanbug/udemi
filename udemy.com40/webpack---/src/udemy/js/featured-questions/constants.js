export const QUESTION_TITLE_MAX_LENGTH = 255;
export const LECTURE_CONTENT_TYPE = 'lecture';
export const QUIZ_CONTENT_TYPE = 'quiz';
export const SIMPLE_QUIZ_CONTENT_TYPE = 'simple-quiz';
export const CODING_EXERCISE_CONTENT_TYPE = 'coding-exercise';
export const PRACTICE_TEST_CONTENT_TYPE = 'practice-test';
export const PRACTICE_CONTENT_TYPE = 'practice';
export const LECTURE_CONTENT_TITLE_PREFIX = 'Lecture';
export const QUIZ_CONTENT_TITLE_PREFIX = 'Quiz';
export const PRACTICE_CONTENT_TITLE_PREFIX = 'Assignment';
export const CODING_EXERCISE_TITLE_PREFIX = 'Coding Exercise';
export const PRACTICE_TEST_TITLE_PREFIX = 'Practice Test';
export const LECTURE_TITLE_MAP = {
    [LECTURE_CONTENT_TYPE]: LECTURE_CONTENT_TITLE_PREFIX,
    [PRACTICE_CONTENT_TYPE]: PRACTICE_CONTENT_TITLE_PREFIX,
};
export const QUIZ_TITLE_MAP = {
    [SIMPLE_QUIZ_CONTENT_TYPE]: QUIZ_CONTENT_TITLE_PREFIX,
    [CODING_EXERCISE_CONTENT_TYPE]: CODING_EXERCISE_TITLE_PREFIX,
    [PRACTICE_TEST_CONTENT_TYPE]: PRACTICE_TEST_TITLE_PREFIX,
};

const fetchUrl = (thread) => `courses/${thread.course.id}/discussions/${thread.id}/`;

const fetchParams = {
    'fields[course]': 'id,image_125_H,image_200_H,url,title,features,can_edit',
    'fields[course_discussion]':
        '@default,course,user,related_object,is_following,is_instructor,last_reply,last_instructor_viewed_time,learning_url,num_upvotes,is_upvoted,num_replies',
    'fields[course_discussion_reply]': '@default,user,-course_discussion',
    'fields[course_feature]': 'discussions_replies_create',
    'fields[user]': '@default',
    'fields[lecture]': '@default,url',
};

export const FEATURED = 'is_featured';
export const COURSE = 'course';
export const VALID_FILTERS = [FEATURED, COURSE];
export const FEATURE_QUESTIONS_LIST_API_SETTINGS = Object.freeze({
    VALID_FILTERS,
    apiUrl: 'users/me/taught-courses-discussions/',
    searchableApiUrl: 'users/me/searchable-taught-courses-discussions/',
    fetchUrl,
    apiDetailUrl: (thread) => `courses/${thread.course.id}/discussions/${thread.id}/replies/`,
    detailParams: {
        'fields[course_discussion_reply]': '@default,user,is_upvoted,num_upvotes,is_instructor',
        'fields[user]': '@default',
        page_size: 1000,
    },
    fetchParams,
    listParams: {
        ...fetchParams,
        page_size: 12,
        suppress_counts: true,
        update_last_instructor_viewed_time: false,
    },
    followersUrl: (thread) => `${fetchUrl(thread)}followers/`,
});
export const CURRICULUM_ITEM_FETCH_URL = 1000;
export const CURRICULUM_ITEM_PAGE_SIZE = 1000;
export const CURRICULUM_ITEM_PARAMS = {
    params: {
        curriculum_types: [LECTURE_CONTENT_TYPE, QUIZ_CONTENT_TYPE, PRACTICE_CONTENT_TYPE],
        'fields[lecture]': 'title,object_index',
        'fields[quiz]': 'title,object_index,type',
        'fields[practice]': 'title,object_index',
        page_size: CURRICULUM_ITEM_PAGE_SIZE,
    },
};
export const SEARCH_CURRICULUM_ITEM_MIN_SEARCH_INPUT_LENGTH = 3;
export const SEARCH_CURRICULUM_ITEM_MAX_SUGGESTIONS_COUNT = 10;

export const TAUGHT_COURSES_PARAMS = {
    'fields[course]':
        '@min,image_125_H,image_200_H,permissions,is_published,was_ever_published,is_practice_test_course,rating,primary_subcategory,is_in_any_ufb_content_collection',
    'fields[course_subcategory]': 'avg_rating,avg_rating_recent',
    filter_published_courses: true,
    ordering: 'title',
    page_size: 250,
};

export const RELATED_OBJECT_ID = 'related_object_id';
export const RELATED_OBJECT_TYPE = 'related_object_type';

export const LEARN_MORE_LINK = 'http://teach.udemy.com/organize-with-featured-questions/';

export const DATADOG_METRICS = {
    FEATURED_QUESTION_RENDER: 'featured_questions.instructor.ui.render',
    FEATURED_QUESTION_SUBMIT: 'featured_questions.instructor.ui.submit',
};
