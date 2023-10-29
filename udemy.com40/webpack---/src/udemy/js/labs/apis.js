export const LABS_BASE_API_URL = '/labs/';
export const LABS_AI_API_URL = `${LABS_BASE_API_URL}ai/`;
export const LABS_AI_GENERATE_ALR_TEST_API_URL = `${LABS_AI_API_URL}generate-alr-test/`;
export const LABS_AI_GENERATE_ALR_TEST_RESULT_API_URL = `${LABS_AI_API_URL}generate-alr-test-result/`;

export const labBaseApiUrl = (labId) => {
    return `${LABS_BASE_API_URL}${labId}/`;
};

export const publishLabApiUrl = (labId) => {
    return `${labBaseApiUrl(labId)}publish/`;
};

export const unpublishLabApiUrl = (labId) => {
    return `${labBaseApiUrl(labId)}unpublish/`;
};

export const saveProgressForLabApiUrl = (labId) => {
    return `${labBaseApiUrl(labId)}progress/`;
};

export const labSubmitForReviewUrl = (labId) => {
    return `${labBaseApiUrl(labId)}submit-for-review/`;
};

export const labLinksApiUrl = (labId) => {
    return `${labBaseApiUrl(labId)}links/`;
};

export const labTasksApiUrl = (labId) => {
    return `${labBaseApiUrl(labId)}tasks/`;
};

export const labsForCourseApiUrl = (courseId) => {
    return `/courses/${courseId}/labs/`;
};

export const labInstanceBaseApiUrl = (labId) => {
    return `${labBaseApiUrl(labId)}instance/`;
};

export const labInstanceApiUrl = (labId, labInstanceId) => {
    return `${labInstanceBaseApiUrl(labId)}${labInstanceId}/`;
};

export const stopLabInstanceApiUrl = (labId, labInstanceId) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}stop/`;
};

export const terminateLabInstanceApiUrl = (labId, labInstanceId) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}terminate/`;
};

export const syncLabInstanceApiUrl = (labId, labInstanceId) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}sync/`;
};

export const saveProgressForLabInstanceApiUrl = (labId, labInstanceId) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}save-progress/`;
};

export const resetLabInstanceSessionApiUrl = (labId, labInstanceId) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}reset-session/`;
};

export const jwtForLabInstanceApiUrl = (labId, labInstanceId) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}jwt/`;
};

export const labInstanceRequestLogsApiUrl = (labId, labInstanceId) => {
    return `${labInstanceApiUrl(labId, labInstanceId)}request-logs/`;
};

export const requestAutomatedReviewApiUrl = (labId, labTaskId) => {
    return `${labTasksApiUrl(labId)}${labTaskId}/automated-review-test-run/`;
};

export const pollForAutomatedReviewResultsApiUrl = (labId, labTaskId, testRunUuid) => {
    return `${requestAutomatedReviewApiUrl(labId, labTaskId)}${testRunUuid}/results/`;
};

export const validateLabDataUrl = (labId) => {
    return `${labBaseApiUrl(labId)}validate-lab-data/`;
};

export const instructorsApiUrl = (labId) => {
    return `${labBaseApiUrl(labId)}instructors/`;
};

export const removeInstructorsApiUrl = (labId, instructorHasLabId) => {
    return `${labBaseApiUrl(labId)}instructors/${instructorHasLabId}/`;
};

export const saveInstructorsApiUrl = (labId) => {
    return `${labBaseApiUrl(labId)}instructors/save/`;
};

export const labReportIssueUrl = (labId) => `${labBaseApiUrl(labId)}report-technical-issue/`;

export const LAB_TIME_UNTIL_RUN_LIMIT_RESET_URL = `${LABS_BASE_API_URL}time-until-run-limit-reset/`;

// TODO: CP to delete this
export const LAB_RETRIEVE_ACTIVE_LAB_URL = `${LABS_BASE_API_URL}retrieve-active-lab/`;

export const LABS_FOR_COURSE_API_PARAMS = [
    'id',
    'title',
    'vertical',
    'provider',
    'lab_type',
    'my_latest_instance',
    'setup_start_lecture_id',
    'post_setup_lecture_id',
    'is_launch_disabled',
].join(',');

export const LAB_INSTANCE_API_PARAMS = [
    'id',
    'uuid',
    'status',
    'start_time',
    'session_start_time',
    'uuid',
    'total_spend',
    'allowed_spend',
    'aws_access_key_id',
    'aws_secret_access_key',
    'aws_session_token',
    'workspace_sso_url',
    'workspace_login_url',
    'workspace_username',
    'workspace_password',
    'workspace_resource',
    'lab',
    'expiration_time',
].join(',');

export const LABS_LIST_INSTRUCTOR_API_PARAMS = [
    'id',
    'title',
    'vertical',
    'provider',
    'status',
    'lab_type',
    'my_latest_instance',
    'course',
    'template',
    'spec_name',
    'has_sso',
    'instructor_has_lab',
].join(',');

export const LAB_EDIT_INSTRUCTOR_API_PARAMS = [
    'id',
    'vertical',
    'provider',
    'title',
    'description',
    'template',
    'course',
    'initial_source_code',
    'lab_type',
].join(',');

export const LAB_LINKS_API_PARAMS = {
    page_size: 200,
};
