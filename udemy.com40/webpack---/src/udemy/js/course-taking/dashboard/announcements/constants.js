export const PREVIEW_ANNOUNCEMENT = Object.freeze({
    HAS_PREVIEW_ANNOUNCEMENT_QUERY_PARAMS: 'preview_announcement',
    TITLE: 'preview_announcement_title',
    CONTENT: 'preview_announcement_content',
});

export const PAGE_SIZE = 5;

export const DEFAULT_API_PARAMS = {
    is_promotional: false,
    // NOTE Update test_num_queries_announcements_course_dashboard if changing fields!
    'fields[course_announcement]': '@default,comment_thread',
    'fields[announcement_group]': '@default,user',
    'fields[comment_thread]': '@min,num_comments',
    'fields[user]': '@min,image_50x50,initials,url',
};
