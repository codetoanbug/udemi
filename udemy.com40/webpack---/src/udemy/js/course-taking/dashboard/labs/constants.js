export const PAGE_SIZE = 5;

export const DEFAULT_API_PARAMS = {
    'fields[user]': '@min,image_50x50,initials,url',
};

export const COURSE_TAKING_TRACKING_ACTIONS = Object.freeze({
    LAUNCH: 'dashboard.lab-tab.launch-lab',
    CONNECT: 'dashboard.lab-tab.connect-lab',
    STOP: 'dashboard.lab-tab.stop-lab',
    END: 'dashboard.lab-tab.end-lab',
    SKIP_SETUP_DISMISS: 'dashboard.lab-tab.skip-setup-dismiss',
    SKIP_SETUP_TRY: 'dashboard.lab-tab.skip-setup-try',
});

export const AWS_SIGNUP_URL = 'https://portal.aws.amazon.com/billing/signup#/start';
