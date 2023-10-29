export const FIRST_REVIEW_PROMPT_DELAY = 12 * 60; // Twelve minutes
export const REVIEW_PROMPT_INTERVAL = 60 * 60; // One hour
export const MIDPOINT_REVIEW_THRESHOLD = 120 * 60; // Two hours

export const REVIEW_PROMPT_STAGES = Object.freeze({
    INITIAL: {key: 'course_taking__initial', urlParam: 'in', id: 'i'},
    INITIAL_PRACTICE: {key: 'course_taking__initial', urlParam: 'in', id: 'ip'},
    MIDDLE: {key: 'course_taking__middle', urlParam: 'mi', id: 'm'},
    FINAL: {key: 'course_taking__final', urlParam: 'fi', id: 'f'},
    FINAL_NEW: {key: 'course_taking__initial--end', urlParam: 'ie', id: 'fn'},
});

export const COURSE_COMPLETION_REVIEW_PROMPT_STAGES = Object.freeze([
    REVIEW_PROMPT_STAGES.FINAL.key,
    REVIEW_PROMPT_STAGES.FINAL_NEW.key,
]);

export const REVIEW_PROMPT_ACTIONS = Object.freeze({
    VIEW_PROMPT: 'view-review-attributes-preprompt',
    CANCEL: 'cancel',
});

export const REVIEW_PROMPT_STAGE_OVERRIDE_QUERY_PARAM = 'review_prompt_id';

export const COURSE_COMPLETION_MSG = gettext('Congrats on finishing the course!');

export const COURSE_LAST_LESSON_COMPLETION_MSG = gettext(
    "You've finished the last lesson in this course!",
);

export const COURSE_PORTION_COMPLETION_MSG = gettext(
    'Congrats on finishing the selected portion of this course',
);
