export const EXAMPLE_APPROACH = {
    get text() {
        return gettext('Example approach');
    },
};

export const ALR_ACTIONS = {
    GET_REVIEW: 'get_review_click',
    NEW_REVIEW: 'new_review_click',
    REVIEW_FEEDBACK_ACCORDION: 'feedback_accordion_expand',
    EXAMPLE_APPROACH: 'example_approach_click',
    REFERENCE_CODE: 'reference_code_click',
    RESOURCE_ACCORDION: 'resources_accordion_expand',
    DOCUMENTATION_ACCORDION: 'documentation_accordion_expand',
} as const;

export const OUTPUT_MESSAGE_TYPE_TRACKING = {
    SUCCESS: 'success',
    FAIL: 'fail',
    SERVER_ERROR: 'server_error',
    SYNTAX_ERROR: 'syntax_error',
} as const;

export const EVENT_LABEL = {
    [ALR_ACTIONS.GET_REVIEW]: 'AutomatedLabReviewGetReviewClickEvent',
    [ALR_ACTIONS.NEW_REVIEW]: 'AutomatedLabReviewNewReviewClickEvent',
    [ALR_ACTIONS.REVIEW_FEEDBACK_ACCORDION]: 'AutomatedLabReviewFeedbackAccordionExpandEvent',
    [ALR_ACTIONS.EXAMPLE_APPROACH]: 'AutomatedLabReviewExampleApproachClickEvent',
    [ALR_ACTIONS.REFERENCE_CODE]: 'AutomatedLabReviewReferenceCodeClickEvent',
    [ALR_ACTIONS.RESOURCE_ACCORDION]: 'AutomatedLabReviewResourceAccordionExpandEvent',
    [ALR_ACTIONS.DOCUMENTATION_ACCORDION]: 'AutomatedLabReviewDocumentationAccordionExpandEvent',
} as const;
