export const UI_REGION = {
    ALL_COURSES: 'all_courses',
    ASSESSMENT_UNIT_PP_LIHP: 'assessment_unit_pp_lihp',
    ASSESSMENT_UNIT_TOPIC: 'assessment_unit_topic',
    ASSESSMENT_RECOMMENDATION: 'assessment_recommendation',
    BODY: 'body',
    BOTTOM_DRAWER: 'bottom_drawer',
    BOTTOM_DRAWER_COURSE_CARD: 'bottom_drawer.course_card',
    BOTTOM_DRAWER_LECTURE_LIST: 'bottom_drawer.lecture_list',
    BOTTOM_DRAWER_RECOMMENDATION: 'bottom_drawer.recommendation',
    CAREER_TRACKS: 'career_tracks',
    COLLECTIONS: 'collections',
    COURSE_ACTIONS: 'course_actions',
    COURSE_COMPARISON: 'course_comparison',
    COURSE_DIRECTORY: 'course_directory',
    COURSE_LEDE: 'course_lede',
    COURSE_OBJECTIVES: 'course_objectives',
    COURSE_TAKING_HEADER: 'course_taking_header',
    CURATED_FOR_UB: 'curated_for_ub',
    CURRICULUM: 'curriculum',
    LAB_RECOMMENDATION: 'lab_recommendation',
    LEARNING_MAP: 'learning_map',
    LEARNING_MAP_SIDE_NAV: 'learning_map_side_nav',
    LEARNING_MAP_DRAWER_NAV: 'learning_map_drawer_nav',
    LECTURE_STACK: 'lecture_stack',
    LECTURE_DISCOVERY_UNIT_LECTURE_CARD: 'lecture_discovery_unit.lecture_card',
    LECTURE_DISCOVERY_UNIT_VIDEO_CARD: 'lecture_discovery_unit.video_card',
    LECTURE_DISCOVERY_UNIT_VIDEO_CARD_DRAWER: 'lecture_discovery_unit.video_card.bottom_drawer',
    MORE_COURSES_BY_INSTRUCTORS: 'more_courses_by_instructors',
    NOT_AVAILABLE: 'not_available',
    OCCUPATION_GOAL_HEADER: 'occupation_goal_header',
    OLP_ENTRY_BANNER: 'olp_entry_banner',
    OTHER_SUBSCRIPTION_PLANS: 'other_subscription_plans',
    PERSONAL_PLAN_BANNER: 'personal_plan_banner',
    PERSONAL_PLAN_CHECKLIST: 'personal_plan_checklist',
    PERSONAL_PLAN: 'personal_plan',
    PURCHASE_SECTION: 'purchase_section',
    QUICK_PREVIEW: 'quick_preview',
    RECOMMENDATIONS: 'recommendations',
    RETURN_TO_UDEMY: 'return_to_udemy',
    SEARCH: 'search',
    SEARCH_RECOMMENDATION_UNIT: 'search_recommendation_unit',
    SET_CAREER_GOAL_UNIT: 'set_career_goal_unit',
    SIDEBAR: 'sidebar',
    SIMILAR_OCCUPATIONS: 'similar_occupations',
    SLIDER: 'slider',
    STICKY_FOOTER: 'sticky_footer',
    STICKY_HEADER: 'sticky_header',
    SUBS_COLLECTION_SAMPLER: 'subs-collection-sampler',
    SUBSCRIBE_NOTICE: 'subscribe_notice',
    SUBSCRIPTION_EXPRESS_CHECKOUT_SUCCESS: 'subscription_express_checkout_success',
    TESTLET_RESULTS: 'testlet_results',
    UB_ADVERTISEMENT: 'ub_advertisement',
    UDEMY_LOGO: 'udemy_logo',
    UDEMY_PRO_BANNER: 'udemy_pro_banner',
    WISHLIST: 'wishlist',
    SUBSCRIPTION_OPTIONS_CTA: 'subscription_options_cta',
} as const;

export type UIRegionOptions = typeof UI_REGION[keyof typeof UI_REGION];
