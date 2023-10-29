export const MAIN_CONTENT = Object.freeze({
    CURRICULUM_ITEM: 'curriculum_item',
    LOCKED_SCREEN: 'locked_screen',
    END_SCREEN: 'end_screen',
    REVIEW_PROMPT: 'review_prompt',
    LABS_PROMPT: 'labs_prompt',
});

export const ITEM_TYPES = Object.freeze({
    LECTURE: 'lecture',
    QUIZ: 'quiz',
    PRACTICE: 'practice',
    CHAPTER: 'chapter',
    LAB: 'lab',
    ASSESSMENT: 'assessment',
});

export const ITEM_EVENT_TYPES = Object.freeze({
    LECTURE: 'lecture',
    SIMPLE_QUIZ: 'simple-quiz',
    PRACTICE_TEST: 'practice-test',
    CODING_EXERCISE: 'coding-exercise',
});

export const PROGRESS_INFO_CURRICULUM_TYPE_MAP = {
    // progress API groups items under following keys
    completed_lecture_ids: ITEM_TYPES.LECTURE,
    completed_quiz_ids: ITEM_TYPES.QUIZ,
    completed_assignment_ids: ITEM_TYPES.PRACTICE,
};

export const QUIZ_TYPES = Object.freeze({
    CODING_EXERCISE: 'coding-exercise',
    PRACTICE_TEST: 'practice-test',
    SIMPLE_QUIZ: 'simple-quiz',
});

export const PRACTICE_CURRICULUM_TYPE = 'assignment';

export const LECTURE_START_PARAM = 'start';

// Action names carried over from CTv4, but obviously should be updated to be curriculum item type-agnostic.
export const TRACKING_ACTIONS = Object.freeze({
    NEXT: 'next_lecture',
    PREVIOUS: 'previous_lecture',
});
