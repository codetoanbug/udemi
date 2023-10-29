export const UFB_ROUTES = {
    home: '/organization/home/',
    invite: '/organization-manage/users/invite/',
    orgManageBillingPayment: '/organization-manage/settings/billing/payment/',
};

// Events names for trial
export const CONTENT_LOCKED_EVENT = 'limitedConsumptionTrial:contentLocked';
export const LECTURES_VIEWED_EVENT = 'limitedConsumptionTrial:lecturedViewed';
export const LEFT_COURSE_TAKING_PAGE_EVENT = 'limitedConsumptionTrial:leftCourseTakingPage';
export const CLICK_LECTURE_ON_CLP_EVENT = 'limitedConsumptionTrial:clickedLectureOnClp';

// Clicking "Download our list of course" from the PreOnboardingTrialBanner
export const DOWNLOAD_COURSE_LIST_EVENT = 'limitedConsumptionTrialV2:bannerCourseListDownload';
// Clicking "Invite them now" from the PreOnboardingTrialBanner
export const INVITE_THEM_NOW_EVENT = 'limitedConsumptionTrialV2:inviteThemNowClick';

// Events captured by trial MobX store
export const NOTIFICATION_EVENTS = [
    CONTENT_LOCKED_EVENT,
    LECTURES_VIEWED_EVENT,
    LEFT_COURSE_TAKING_PAGE_EVENT,
];

// Events which don't require a status update
// TODO Consider adding more events here to reduce /status API calls and increase performance
export const NO_REFRESH_EVENTS = [LEFT_COURSE_TAKING_PAGE_EVENT];

// Routes for API to call from the trial APP
export const API_ROUTES = {
    status: '/organization-trial/status/',
    nudgeOwner: '/organization-trial/nudge-owner/',
};

// Routes for Links to navigate
export const LINK_ROUTES = {
    buy: UFB_ROUTES.orgManageBillingPayment,
    invite: UFB_ROUTES.invite,
};

// Possible statuses of lecture tokens
export const STATUS = {
    USED: 'used',
    AVAILABLE: 'available',
};

// Current LIMITS for teamplan trial
// TODO: Consider retireving those from Backend
export const LIMITS = {
    minLectures: 5,
    maxLectures: 5,
    maxUsers: 5,
};

export const ALLOWED_ASSET_TYPES = ['Video', 'VideoMashup'];

export const INITIAL_FREE_LECTURES_AVAILABLE = 5;
export const MAX_FREE_LECTURES_AVAILABLE = 5;
