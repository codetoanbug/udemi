export const TEST_BUILD_TYPE = 'build';

export const GET_AUTOMATED_FEEDBACK_INTERVAL_MS = 1000; // 1 sec

export const REVIEW_FAILED_FIRST_ATTEMPT_MESSAGE = {
    get text() {
        return gettext(
            "Thanks for making an effort on this first task. Please address the feedback below and submit for review again. I've provided you with an example approach to reference as you keep working.",
        );
    },
};

export const REVIEW_FAILED_SECOND_ATTEMPT_RANDOM_MESSAGES = {
    get text() {
        return [
            gettext(
                "Glad to see you're working through the issues here. There is still feedback to address below. You can use the reference materials provided to try again.",
            ),
            gettext(
                'The team appreciates your effort here. Check out the feedback for you to address and see the example approach if you need help.',
            ),
            gettext(
                'Not quite finished yet! Address the feedback and use the reference materials provided to help you troubleshoot.',
            ),
            gettext(
                "I know this work isn't easy. You have some unresolved feedback items. You can use the reference materials I've provided as you address it.",
            ),
            gettext(
                'Appreciate you sticking with this task! Looks like there is more feedback to tackle - you can use the references provided as you do it.',
            ),
        ];
    },
};

export const REVIEW_SUCCESS_FIRST_ATTEMPT_MESSAGE = {
    get text() {
        return gettext(
            "Well done on this first task! Glad to have you on this project. Take some time to reflect using the reference materials. Once you're ready, mark the task as complete.",
        );
    },
};

export const REVIEW_SUCCESS_SECOND_ATTEMPT_RANDOM_MESSAGES = {
    get text() {
        return [
            gettext('Another task down! You are making great progress. Keep at it!'),
            gettext('Nice work tackling this task! Keep working at your own pace on these tasks!'),
            gettext(
                "Great effort on completing this task. This project isn't easy! You're doing great work.",
            ),
            gettext(
                "Loving the progress you've made here! Let's keep working through these tasks to accomplish our goal!",
            ),
            gettext(
                "You're making great progress! Looking forward to seeing what you can accomplish.",
            ),
        ];
    },
};

export const REVIEW_POPOVER_ALR = {
    get text() {
        return gettext('Check your work throughout the lab for guidance.');
    },
};

export const REVIEW_POPOVER_NON_ALR = {
    get text() {
        return gettext(
            "Attempt the task on your own and click 'Start review' once you're ready to check your work.",
        );
    },
};

export const TOASTER_ERROR_MESSAGE_ALR = {
    get title() {
        return gettext('This lab requires a workspace for review');
    },
    get body() {
        return gettext(
            'In order to review your work on this lab you need to utilize the workspace.',
        );
    },
};

export const TOASTER_ERROR_MESSAGE_NON_ALR = {
    get title() {
        return gettext('Why not try the workspace?');
    },
    get body() {
        return gettext('Complete the lab with the workspace for a better learning experience.');
    },
};
