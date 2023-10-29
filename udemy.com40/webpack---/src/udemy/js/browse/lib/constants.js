export const funnelTrackingConstants = {
    allCoursesContext: 'all-courses',
    featuredContext: 'featured',
    featuredPageContext: 'feature',
    myCoursesContext: 'my-courses',
    learningContext: 'learning',
    collectionContext: 'collection',
    wishlistContext: 'wishlist',
    searchPage: 'search',
    // for use in subcontext2
    becauseYouEnrolled: 'enroll-recommendation',
    becauseYouSearched: 'search-recommendation',
    becauseYouViewed: 'view-recommendation',
    bestsellers: 'best-seller',
    studentsAreViewing: 'students-are-viewing',
    newAndNoteworthy: 'new-and-noteworthy',
    learningPack: 'learning-pack',
    yourWishlist: 'wishlist',
    frequentlyBought: 'frequentitemsrecommendation',
    tagBasedUnit: 'tag-du',
    topicPage: 'topic',
    topic: 'all-courses',
    onboardingContext: 'onboarding-success',
    channelContextMap: {
        category: 'cat_ch',
        collection: 'coll_ch',
        dynamic_tag_collection: 'cl',
        keyword: 'kw_ch',
        featured: 'ft_ch',
        logged_in_homepage: 'ft_ch',
        logged_out_homepage: 'home_ch',
        personalized_home: 'home_ch',
        home: 'home_ch',
        subcategory: 'scat_ch',
        topic: 'cl',
        landingPageCourse: 'landing-page',
        landingPageFreeCourse: 'clp-free',
    },
};

export const PAGE_TYPE_CATEGORY = 'category';
export const PAGE_TYPE_CART = 'cart';
export const PAGE_TYPE_CART_PURCHASE = 'purchase';
export const PAGE_TYPE_CART_MULTIPLE_PURCHASE = 'multiplePurchase';
export const PAGE_TYPE_CART_PURCHASE_CONFIRMATION = 'purchaseConfirmation';
export const PAGE_TYPE_CART_SUBSCRIBE = 'subscribe';
export const PAGE_TYPE_CART_SUCCESS = 'cartSuccess';
export const PAGE_TYPE_CART_SUCCESS_MODAL = 'cartSuccessModal';
export const PAGE_TYPE_CART_SUCCESS_MODAL_MOBILE = 'cartSuccessModalMobile';
export const PAGE_TYPE_COLLECTION = 'collection_page';
export const PAGE_TYPE_COURSE_LANDING_PAGE_BUNDLE = 'clp-bundle';
export const PAGE_TYPE_COURSE_LANDING_PAGE_COURSE = 'landingPageCourse';
export const PAGE_TYPE_ORG_COURSE_LANDING_PAGE = 'org-course-landing-page';
export const PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_LABEL = 'disabled_course_label';
export const PAGE_TYPE_SEQUENCE_LANDING_PAGE = 'series-landing-page';
export const PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_CATEGORY = 'disabled_course_category';
export const PAGE_TYPE_COURSE_LANDING_PAGE_FREE_COURSE = 'landingPageFreeCourse';
export const PAGE_TYPE_FEATURED_TOPICS = 'featured_topics_page';
export const PAGE_TYPE_FREE_TOPIC = 'free_topic';
export const PAGE_TYPE_LOGGED_IN_HOMEPAGE = 'logged_in_homepage';
export const PAGE_TYPE_LOGGED_OUT_HOMEPAGE = 'logged_out_homepage';
export const PAGE_TYPE_PERSONALIZED_LOGGED_OUT_HOMEPAGE = 'personalized_home';
export const PAGE_TYPE_LOGOUT_PAGE = 'logout_page';
export const PAGE_TYPE_OCCUPATION_LANDING_PAGE = 'occupation_landing_page';
export const PAGE_TYPE_OCCUPATION_RESULT_PAGE = 'occupation_result_page';
export const PAGE_TYPE_ORG_CATEGORY = 'org_category';
export const PAGE_TYPE_ORG_LOGGED_IN_HOMEPAGE = 'org_logged_in_homepage';
export const PAGE_TYPE_ORG_SUBCATEGORY = 'org_subcategory';
export const PAGE_TYPE_SUBS_CATEGORY = 'subs_category';
export const PAGE_TYPE_SUBS_SUBCATEGORY = 'subs_subcategory';
export const PAGE_TYPE_SUBCATEGORY = 'subcategory';
export const PAGE_TYPE_SUBS_LOGGED_IN_HOMEPAGE = 'subs_logged_in_homepage';
export const PAGE_TYPE_SUBS_TOPIC = 'subs_topic';
export const PAGE_TYPE_TOPIC = 'topic';
export const PAGE_TYPE_TOPIC_BUNDLE = 'topic-bundle';
export const PAGE_TYPE_TOPIC_CLP = 'topic-clp';
export const PAGE_TYPE_ORG_TOPIC = 'org_topic';
export const PAGE_TYPE_ORG_MY_COURSES_PAGE = 'org_my_courses_page';
export const PAGE_TYPE_ONBOARDING = 'onboarding';
export const PAGE_TYPE_LLP = 'llp';
export const PAGE_TYPE_GOV_LOGGED_IN_HOMEPAGE = 'gov_logged_in_homepage';
export const AGGREGATION_TYPE_PRICE = 'price';
export const AGGREGATION_TYPE_CATEGORY = PAGE_TYPE_CATEGORY;
export const AGGREGATION_TYPE_SUBCATEGORY = PAGE_TYPE_SUBCATEGORY;
export const AGGREGATION_TYPE_INSTRUCTIONAL_LEVEL = 'instructional_level';
export const AGGREGATION_TYPE_SUBS_FILTER = 'subs_filter_type';
export const PAGE_TYPE_LEARNING_PATH = 'learning_path_page';
export const PAGE_TYPE_SUBS_LANDING_PAGE = 'subs_landing_page';
export const PAGE_TYPE_COURSE_RETIREMENT = 'course_retirement_page';
export const PAGE_TYPE_LECTURE_QUICK_VIEW = 'lecture_quick_view';

export const pageTypes = [
    PAGE_TYPE_CATEGORY,
    PAGE_TYPE_CART,
    PAGE_TYPE_CART_PURCHASE,
    PAGE_TYPE_CART_PURCHASE_CONFIRMATION,
    PAGE_TYPE_CART_SUBSCRIBE,
    PAGE_TYPE_CART_SUCCESS,
    PAGE_TYPE_CART_SUCCESS_MODAL,
    PAGE_TYPE_COLLECTION,
    PAGE_TYPE_COURSE_LANDING_PAGE_COURSE,
    PAGE_TYPE_ORG_COURSE_LANDING_PAGE,
    PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_LABEL,
    PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_CATEGORY,
    PAGE_TYPE_COURSE_LANDING_PAGE_FREE_COURSE,
    PAGE_TYPE_FEATURED_TOPICS,
    PAGE_TYPE_FREE_TOPIC,
    PAGE_TYPE_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_LOGGED_OUT_HOMEPAGE,
    PAGE_TYPE_PERSONALIZED_LOGGED_OUT_HOMEPAGE,
    PAGE_TYPE_LOGOUT_PAGE,
    PAGE_TYPE_OCCUPATION_LANDING_PAGE,
    PAGE_TYPE_OCCUPATION_RESULT_PAGE,
    PAGE_TYPE_ORG_CATEGORY,
    PAGE_TYPE_ORG_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_ORG_SUBCATEGORY,
    PAGE_TYPE_SUBCATEGORY,
    PAGE_TYPE_TOPIC,
    PAGE_TYPE_TOPIC_CLP,
    PAGE_TYPE_ORG_TOPIC,
    PAGE_TYPE_ONBOARDING,
    PAGE_TYPE_LLP,
    PAGE_TYPE_LEARNING_PATH,
    PAGE_TYPE_SUBS_CATEGORY,
    PAGE_TYPE_SUBS_SUBCATEGORY,
    PAGE_TYPE_SUBS_TOPIC,
    PAGE_TYPE_SUBS_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_SUBS_LANDING_PAGE,
    PAGE_TYPE_LECTURE_QUICK_VIEW,
];

export const EXPERIMENT_TYPE_BROWSE = 'brw';
export const EXPERIMENT_TYPE_BROWSE_CATEGORY = 'brwc';
export const EXPERIMENT_TYPE_BROWSE_CATEGORY_AND_TOPIC = 'brwct';
export const EXPERIMENT_TYPE_FREE_TO_PAID = 'f2p';
export const EXPERIMENT_TYPE_BROWSE_FULL_STACK = 'brwfs';
export const EXPERIMENT_TYPE_BROWSE_LOGGED_IN_HOMEPAGE = 'brwli';
export const EXPERIMENT_TYPE_BROWSE_LIST_VIEW_PAGES = 'brwlvps';
export const EXPERIMENT_TYPE_BROWSE_SEE_ALL = 'brwsa';
export const EXPERIMENT_TYPE_BROWSE_TOPIC = 'brwt';
export const EXPERIMENT_TYPE_BROWSE_LOGOUT_AND_LOGGED_OUT_HOMEPAGE = 'blaloh';
export const EXPERIMENT_TYPE_TOPIC_AND_SEARCH = 'topsrp';
export const EXPERIMENT_TYPE_SEARCH_RESULT_PAGE = 'srp';
export const EXPERIMENT_TYPE_SUBSCRIPTION_MANAGEMENT_SERVICE = 'sms';
export const ORG_EXPERIMENT_TYPE_TEAM_PLAN = 'tp';

export const CollectionTypes = {
    MX: 'MX',
    CONSUMERSUBSCRIPTION: 'CONSUMERSUBSCRIPTION',
};

// This is using for the identifying the type of the related source of the seen discovery item.
export const RelatedSourceTypeOptions = {
    COURSE: 'course',
    LAB: 'lab',
    LECTURE: 'lecture',
    ADAPTIVE_ASSESSMENT: 'adaptive_assessment',
    LEARNING_PATH: 'learning_path',
    CATEGORY: 'category',
    SUBCATEGORY: 'subcategory',
    TOPIC: 'topic',
};
