export const maxNumOfAssessments = 250; // See BaseQuiz.MAX_NUM_OF_ASSESSMENTS on backend.

export const maxWarningNumOfAssessments = 100;

export const maxLengthOfAnnouncementTitle = 64;

export const minLengthOfApplyDraftDescription = 2;

export const loadingState = Object.freeze({
    initial: 'initial',
    loading: 'loading',
    loaded: 'loaded',
});

export const courseFilterParams = Object.freeze([
    'can_toggle_curriculum_published_state',
    'has_sufficient_preview_length',
    'is_paid',
    'is_practice_test_course',
    'max_num_of_non_section_items',
    'max_num_of_practice_tests',
    'practice_test_only_min_num_of_practice_tests',
    'organization_id',
    'published_time',
    'published_title',
    'url',
    'locale',
]);

export const chapterFilterParamsWithGTAssignments = Object.freeze([
    'title',
    'description',
    'object_index',
    'gt_assignments_v2',
]);

export const chapterFilterParams = Object.freeze(['title', 'description', 'object_index']);

export const lectureFilterParams = Object.freeze([
    'asset',
    'title',
    'is_published',
    'description',
    'is_downloadable',
    'is_free',
    'object_index',
    'supplementary_assets',
]);

// These fields are needed to set/refresh the main asset of a lecture.
// We need is_downloadable because its initial value is derived from whether the main asset
// is_downloadable_by_default, and so it can change if the main asset type changes
// (i.e. if we click "Replace With Video").
export const lectureMainAssetFilterParams = Object.freeze(['asset', 'is_downloadable']);

// These fields are needed when we edit/refresh a quiz.
export const quizEditorFilterParams = Object.freeze([
    'description',
    'duration',
    'title',
    'type',
    'is_published',
    'object_index',
    'pass_percent',
    'is_draft',
    'requires_draft',
    'is_randomized',
]);

// These fields are needed when we fetch the curriculum, but not needed when we edit/refresh a quiz.
export const quizFilterParams = Object.freeze(quizEditorFilterParams.concat(['num_assessments']));

export const quizDraftFilterParams = Object.freeze(['is_draft', 'requires_draft']);

export const assessmentFilterParams = Object.freeze([
    'assessment_type',
    'prompt',
    'correct_response',
    'section',
]);

export const assignmentFilterParams = Object.freeze(['title', 'is_published', 'object_index']);

export const assetFilterParams = Object.freeze([
    'created',
    'asset_type',
    'content_summary',
    'time_estimation',
    'status',
    'source_url',
    'thumbnail_url',
    'title',
    'processing_errors',
    'delayed_asset_message',
    'body',
]);

export const videoMashupAssetFilterParams = Object.freeze(
    assetFilterParams.concat(
        'captions',
        'media_license_token',
        'media_sources',
        'time_estimation',
        'length',
        'slides',
        'slide_urls',
        'thumbnail_sprite',
    ),
);

// These correspond to the `type` field of quiz objects (see Django Quiz model).
export const quizTypes = Object.freeze({
    codingExercise: 'coding-exercise',
    practiceTest: 'practice-test',
    simpleQuiz: 'simple-quiz',
});

// These correspond to the `assessment_type` field of assessment objects (see Django Assessment model).
export const assessmentTypes = Object.freeze({
    fitb: 'fill-in-the-blanks',
    multipleChoice: 'multiple-choice',
    multipleSelect: 'multi-select',
});

export const assessmentCreationTypes = Object.freeze({
    single: 'single',
    batch: 'batch',
});

export const assessmentLabels = Object.freeze({
    [assessmentTypes.fitb]: gettext('Fill in the Blanks'),
    [assessmentTypes.multipleChoice]: gettext('Multiple Choice'),
    [assessmentTypes.multipleSelect]: gettext('Multiple Selection'),
});

export const trackingCategories = Object.freeze({
    [quizTypes.codingExercise]: 'coding-exercises',
    [quizTypes.practiceTest]: 'practice-tests',
    [quizTypes.simpleQuiz]: 'simple-quizzes',
});

// These correspond to the `_class` field of curriculum item objects
// (see Django models which inherit from CurriculumItemMixin).
export const curriculumItemTypes = Object.freeze({
    section: 'chapter',
    lecture: 'lecture',
    quiz: 'quiz',

    // Frontend refers to "practice" curriculum items as assignments to avoid naming conflict
    // with practice test quizzes.
    assignment: 'practice',
});

// These respond to delete alert copy
export const curriculumItemSuccessDeleteCopy = Object.freeze({
    [curriculumItemTypes.assignment]: gettext(
        "This assignment is being deleted. We'll let you know when the process is complete.",
    ),
    [curriculumItemTypes.lecture]: gettext(
        "This lecture is being deleted. We'll let you know when the process is complete.",
    ),
});

export const quizCurriculumItemSuccessDeleteCopy = Object.freeze({
    [quizTypes.codingExercise]: gettext(
        "This coding exercise is being deleted. We'll let you know when the process is complete.",
    ),
    [quizTypes.practiceTest]: gettext(
        "This practice test is being deleted. We'll let you know when the process is complete.",
    ),
    [quizTypes.simpleQuiz]: gettext(
        "This quiz is being deleted. We'll let you know when the process is complete.",
    ),
});

export const assessmentSuccessDeleteCopy = gettext(
    "This assessment is being deleted. We'll let you know when the process is complete.",
);

// These correspond to the `keyClass` property on CurriculumItemModel.
export const curriculumItemKeyClasses = (() => {
    const keyClasses = {
        ...curriculumItemTypes,
        ...quizTypes,
    };
    delete keyClasses[curriculumItemTypes.quiz];
    return Object.freeze(keyClasses);
})();
