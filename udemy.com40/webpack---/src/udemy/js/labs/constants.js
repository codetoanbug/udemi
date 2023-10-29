import BarChartIcon from '@udemy/icons/dist/bar-chart.ud-icon';
import CloudIcon from '@udemy/icons/dist/cloud.ud-icon';
import CodeIcon from '@udemy/icons/dist/code.ud-icon';
import SecurityIcon from '@udemy/icons/dist/security.ud-icon';
import ServerIcon from '@udemy/icons/dist/server.ud-icon';

import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';
import {UI_REGION} from 'browse/ui-regions';
import {LabTaskReviewRequested} from 'labs/events/lab-task-review-requested';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import LabActionEvent from './events/lab-action-event';
import {LabCardClickEvent} from './events/lab-card-click-event';
import {LabCompleted} from './events/lab-completed';
import {LabExited} from './events/lab-exited';
import LabHeartbeatEvent from './events/lab-heartbeat-event';
import {LabInCoursePromptActionEvent} from './events/lab-in-course-prompt-action-event';
import LabOverviewVisitEvent from './events/lab-overview-visit-event';
import {LabResumed} from './events/lab-resumed';
import {LabSelected} from './events/lab-selected';
import {LabStarted} from './events/lab-started';
import {LabTaskCompleted} from './events/lab-task-completed';
import {LabWorkspaceLaunched} from './events/lab-workspace-launched';
import {LabsHeaderClickEvent} from './events/labs-header-click-event';
import {LabsResumeBannerDismissClickEvent} from './events/labs-resume-banner-dismiss-click-event';
import {LabsResumeBannerEndLabClickEvent} from './events/labs-resume-banner-end-lab-click-event';
import {LabsResumeBannerViewEvent} from './events/labs-resume-banner-view-event';
import {LabsSearchEvent} from './events/labs-search-event';

export const STATUS_CHECK_TIMEOUT = 2000;

const SOCKET_CONNECT = 'connect';
const SOCKET_CONNECT_ERROR = 'connect_error';
const SOCKET_ERROR = 'error';
const SOCKET_DISCONNECT = 'disconnect';
const SOCKET_RECONNECT = 'reconnect';
const SOCKET_RECONNECT_ATTEMPT = 'reconnect_attempt';
const SOCKET_UNAUTHORIZED = ' unauthorized';
const READ_DIR = 'read-source-dir';
const READ_SOURCE_CODE = 'read-source-code';
const READ_SOURCE_CODE_ERROR = `${READ_SOURCE_CODE}:error`;
const WRITE_SOURCE_CODE = 'write-source-code';
const WRITE_SOURCE_CODE_SUCCESS = `${WRITE_SOURCE_CODE}:success`;
const WRITE_SOURCE_CODE_ERROR = `${WRITE_SOURCE_CODE}:error`;
const DELETE_FILE = 'delete-file';
const DELETE_FOLDER = 'delete-folder';
const RENAME = 'rename';
const DELETE_FILE_ERROR = `${DELETE_FILE}:error`;
const DELETE_FOLDER_ERROR = `${DELETE_FOLDER}:error`;
const DELETE_FILE_SUCCESS = `${DELETE_FILE}:success`;
const DELETE_FOLDER_SUCCESS = `${DELETE_FOLDER}:success`;
const RENAME_ERROR = `${RENAME}:error`;
const RENAME_SUCCESS = `${RENAME}:success`;
const CREATE_FOLDER = 'create-folder';
const CREATE_FILE = 'create-file';
const CREATE_FOLDER_ERROR = `${CREATE_FOLDER}:error`;
const CREATE_FILE_ERROR = `${CREATE_FILE}:error`;
const CREATE_FILE_SUCCESS = `${CREATE_FILE}:success`;
const CREATE_FOLDER_SUCCESS = `${CREATE_FOLDER}:success`;
const UPLOAD_FILE = 'upload-file';
const UPLOAD_FILE_SUCCESS = `${UPLOAD_FILE}:success`;
const UPLOAD_FILE_ERROR = `${UPLOAD_FILE}:error`;
export const EXPORT_SOURCE_CODE = 'export-source-code';
const EXPORT_SOURCE_CODE_SUCCESS = `${EXPORT_SOURCE_CODE}:success`;
const EXPORT_SOURCE_CODE_ERROR = `${EXPORT_SOURCE_CODE}:error`;

const TERMINAL_INPUT = 'terminal:input';
const TERMINAL_GEOMETRY = 'terminal:geometry';
const TERMINAL_OUTPUT = 'terminal:output';
const TERMINAL_SET_OPTIONS = 'terminal:set-options';
const TERMINAL_RESIZE = 'terminal:resize';
const TERMINAL_ERROR = 'terminal:error';
const SSH_ERROR = 'ssherror';
const LAB_READY = 'lab-ready';
const LOG_TAIL = 'log-tail';
const LOG_TAIL_LOG_INFO = 'log-tail:log-info';
const LOG_TAIL_IS_PAUSED = 'log-tail:is-paused';
const SUPPORTED_FEATURES = 'supported-features';

export const FEATURE_PREVIEW_WINDOW_LOADING = 'preview_window_loading';
export const SEARCH_PAGE = 'search';

export const MS_IN_DAY = 24 * 3600 * 1000;

export const EVENTS = Object.freeze({
    SOCKET_CONNECT,
    SOCKET_CONNECT_ERROR,
    SOCKET_ERROR,
    SOCKET_DISCONNECT,
    SOCKET_RECONNECT,
    SOCKET_RECONNECT_ATTEMPT,
    SOCKET_UNAUTHORIZED,
    READ_DIR,
    READ_SOURCE_CODE,
    READ_SOURCE_CODE_ERROR,
    RENAME,
    RENAME_ERROR,
    RENAME_SUCCESS,
    DELETE_FILE,
    DELETE_FOLDER,
    DELETE_FILE_ERROR,
    DELETE_FILE_SUCCESS,
    DELETE_FOLDER_ERROR,
    DELETE_FOLDER_SUCCESS,
    CREATE_FILE,
    CREATE_FOLDER,
    CREATE_FILE_ERROR,
    CREATE_FOLDER_ERROR,
    CREATE_FILE_SUCCESS,
    CREATE_FOLDER_SUCCESS,
    WRITE_SOURCE_CODE,
    WRITE_SOURCE_CODE_ERROR,
    WRITE_SOURCE_CODE_SUCCESS,
    UPLOAD_FILE,
    UPLOAD_FILE_SUCCESS,
    UPLOAD_FILE_ERROR,
    TERMINAL_INPUT,
    TERMINAL_OUTPUT,
    TERMINAL_SET_OPTIONS,
    TERMINAL_RESIZE,
    TERMINAL_ERROR,
    TERMINAL_GEOMETRY,
    SSH_ERROR,
    LAB_READY,
    LOG_TAIL,
    LOG_TAIL_LOG_INFO,
    LOG_TAIL_IS_PAUSED,
    SUPPORTED_FEATURES,
    EXPORT_SOURCE_CODE,
    EXPORT_SOURCE_CODE_SUCCESS,
    EXPORT_SOURCE_CODE_ERROR,
});

export const LAB_PROVIDER = Object.freeze({
    vocareum: 'vocareum',
    udemy: 'udemy',
});

export const LAB_VERTICAL = Object.freeze({
    aws: {
        key: 'aws',
        get label() {
            return gettext('AWS');
        },
        glyph: 'cloud',
        iconComponent: CloudIcon,
    },
    azure: {
        key: 'azure',
        get label() {
            return gettext('Azure');
        },
        glyph: 'cloud',
        iconComponent: CloudIcon,
    },
    gcp: {
        key: 'gcp',
        get label() {
            return gettext('Google Cloud Provider');
        },
        glyph: 'cloud',
        iconComponent: CloudIcon,
    },
    web: {
        key: 'web',
        get label() {
            return gettext('Web');
        },
        glyph: 'code',
        iconComponent: CodeIcon,
    },
    data_science: {
        key: 'data_science',
        get label() {
            return gettext('Data Science');
        },
        glyph: 'bar-chart',
        iconComponent: BarChartIcon,
    },
    devops: {
        key: 'devops',
        get label() {
            return gettext('DevOps');
        },
        glyph: 'server',
        iconComponent: ServerIcon,
    },
    security: {
        key: 'security',
        get label() {
            return gettext('Security');
        },
        glyph: 'security',
        iconComponent: SecurityIcon,
    },
});

export const TOPIC_TO_LAB_VERTICAL_MAP = Object.freeze({
    4452: 'aws',
    6716: 'azure',
    8322: 'web',
    5336: 'data_science',
    5404: 'devops',
    5988: 'gcp',
    5316: 'security',
});

export const LAB_VERTICAL_TO_TOPIC_MAP = Object.freeze({
    aws: {
        id: 4452,
        get title() {
            return gettext('Amazon AWS');
        },
        is_vertical_topic: true,
    },
    azure: {
        id: 6716,
        get title() {
            return gettext('Microsoft Azure');
        },
        is_vertical_topic: true,
    },
    gcp: {
        id: 5988,
        get title() {
            return gettext('Google Cloud Platform');
        },
        is_vertical_topic: true,
    },
    web: {
        id: 8322,
        get title() {
            return gettext('Software Development');
        },
        is_vertical_topic: true,
    },
    data_science: {
        id: 5336,
        get title() {
            return gettext('Data Science');
        },
        is_vertical_topic: true,
    },
    devops: {
        id: 5404,
        get title() {
            return gettext('DevOps');
        },
        is_vertical_topic: true,
    },
    security: {
        id: 5316,
        get title() {
            return gettext('Security');
        },
        is_vertical_topic: true,
    },
});

export const POPULAR_TOPICS = Object.freeze({
    gcp: {
        key: 'gcp',
        get label() {
            return gettext('Google Cloud Platform');
        },
    },
    compute_engine: {
        key: 'compute_engine',
        get label() {
            return gettext('Compute Engine');
        },
    },
    azure: {
        key: 'azure',
        get label() {
            return gettext('Azure');
        },
        has_alr: true,
    },
    virtual_machine: {
        key: 'virtual-machine',
        get label() {
            return gettext('Virtual machine');
        },
    },
    storage: {
        key: 'table-storage',
        get label() {
            return gettext('Table storage');
        },
    },
    aws: {
        key: 'aws',
        get label() {
            return gettext('AWS');
        },
        has_alr: true,
    },
    ec2: {
        key: 'ec2',
        get label() {
            return gettext('EC2');
        },
    },
    load_balancer: {
        key: 'load-balancer',
        get label() {
            return gettext('Load Balancer');
        },
    },
    vpc: {
        key: 'vpc',
        get label() {
            return gettext('VPC');
        },
    },
    s3: {
        key: 's3',
        get label() {
            return gettext('S3');
        },
    },
    lambda: {
        key: 'lambda',
        get label() {
            return gettext('Lambda');
        },
    },
    athena: {
        key: 'athena',
        get label() {
            return gettext('Athena');
        },
    },
    cloud_formation: {
        key: 'cloud-formation',
        get label() {
            return gettext('CloudFormation');
        },
    },
    glue: {
        key: 'glue',
        get label() {
            return gettext('Glue');
        },
    },
    java: {
        key: 'java',
        get label() {
            return gettext('Java');
        },
    },
    spring: {
        key: 'spring',
        get label() {
            return gettext('Spring');
        },
    },
    html: {
        key: 'html',
        get label() {
            return gettext('HTML');
        },
    },
    css: {
        key: 'css',
        get label() {
            return gettext('CSS');
        },
    },
    react: {
        key: 'react',
        get label() {
            return gettext('React');
        },
    },
    python: {
        key: 'python',
        get label() {
            return gettext('Python');
        },
        has_alr: true,
    },
    flask: {
        key: 'flask',
        get label() {
            return gettext('Flask');
        },
    },
    mongodb: {
        key: 'mongodb',
        get label() {
            return gettext('MongoDB');
        },
    },
    redux: {
        key: 'redux',
        get label() {
            return gettext('Redux');
        },
    },
    mysql: {
        key: 'mysql',
        get label() {
            return gettext('MySQL');
        },
        has_alr: true,
    },
    typescript: {
        key: 'typescript',
        get label() {
            return gettext('Typescript');
        },
    },
    express: {
        key: 'express',
        get label() {
            return gettext('Express');
        },
    },
    data_science: {
        key: 'data_science',
        get label() {
            return gettext('Data science');
        },
        has_alr: true,
    },
    devops: {
        key: 'devops',
        get label() {
            return gettext('DevOps');
        },
        has_alr: true,
    },
    git: {
        key: 'git',
        get label() {
            return gettext('Git');
        },
    },
    jenkins: {
        key: 'jenkins',
        get label() {
            return gettext('Jenkins');
        },
    },
    ansible: {
        key: 'ansible',
        get label() {
            return gettext('Ansible');
        },
    },
    docker: {
        key: 'docker',
        get label() {
            return gettext('Docker');
        },
    },
    kubernetes: {
        key: 'kubernetes',
        get label() {
            return gettext('Kubernetes');
        },
        has_alr: true,
    },
    security: {
        key: 'security',
        get label() {
            return gettext('Security');
        },
    },
    linux: {
        key: 'linux',
        get label() {
            return gettext('Linux');
        },
    },
});

export const SEARCH_CATEGORIES_FILTER = Object.freeze({
    all: Object.freeze({
        key: 'all',
        get label() {
            return gettext('All');
        },
        verticals: [
            LAB_VERTICAL.aws.key,
            LAB_VERTICAL.azure.key,
            LAB_VERTICAL.gcp.key,
            LAB_VERTICAL.data_science.key,
            LAB_VERTICAL.devops.key,
            LAB_VERTICAL.security.key,
            LAB_VERTICAL.web.key,
        ],
    }),
    cloud: Object.freeze({
        key: 'cloud',
        get label() {
            return gettext('Cloud computing');
        },
        verticals: [LAB_VERTICAL.aws.key, LAB_VERTICAL.azure.key, LAB_VERTICAL.gcp.key],
    }),
    dev: Object.freeze({
        key: 'dev',
        get label() {
            return gettext('Development');
        },
        verticals: [LAB_VERTICAL.web.key, LAB_VERTICAL.devops.key],
    }),
    data_science: Object.freeze({
        key: 'data_science',
        get label() {
            return gettext('Data science');
        },
        verticals: [LAB_VERTICAL.data_science.key],
    }),
    security: Object.freeze({
        key: 'security',
        get label() {
            return gettext('IT Operations');
        },
        verticals: [LAB_VERTICAL.security.key],
    }),
});

// Update this list and CONSUMER_SUBSCRIPTION_ENABLED_VERTICALS whenever a new vertical is
// enabled for Personal Plan subscription
export const SEARCH_CATEGORIES_FILTER_FOR_PERSONAL_PLAN = Object.freeze({
    all: SEARCH_CATEGORIES_FILTER.all,
    dev: SEARCH_CATEGORIES_FILTER.dev,
    data_science: SEARCH_CATEGORIES_FILTER.data_science,
});

export const TOPICS = Object.freeze({
    [SEARCH_CATEGORIES_FILTER.all.key]: Object.keys(POPULAR_TOPICS).map(
        (key) => POPULAR_TOPICS[key],
    ),
    [SEARCH_CATEGORIES_FILTER.cloud.key]: [
        POPULAR_TOPICS.gcp,
        POPULAR_TOPICS.compute_engine,
        POPULAR_TOPICS.azure,
        POPULAR_TOPICS.storage,
        POPULAR_TOPICS.virtual_machine,
        POPULAR_TOPICS.aws,
        POPULAR_TOPICS.athena,
        POPULAR_TOPICS.cloud_formation,
        POPULAR_TOPICS.glue,
        POPULAR_TOPICS.ec2,
        POPULAR_TOPICS.lambda,
        POPULAR_TOPICS.load_balancer,
        POPULAR_TOPICS.s3,
        POPULAR_TOPICS.vpc,
    ],
    [LAB_VERTICAL.gcp.key]: [POPULAR_TOPICS.gcp, POPULAR_TOPICS.compute_engine],
    [LAB_VERTICAL.security.key]: [POPULAR_TOPICS.security, POPULAR_TOPICS.linux],
    [SEARCH_CATEGORIES_FILTER.dev.key]: [
        POPULAR_TOPICS.css,
        POPULAR_TOPICS.express,
        POPULAR_TOPICS.flask,
        POPULAR_TOPICS.html,
        POPULAR_TOPICS.java,
        POPULAR_TOPICS.mongodb,
        POPULAR_TOPICS.mysql,
        POPULAR_TOPICS.python,
        POPULAR_TOPICS.react,
        POPULAR_TOPICS.redux,
        POPULAR_TOPICS.spring,
        POPULAR_TOPICS.typescript,
        POPULAR_TOPICS.devops,
        POPULAR_TOPICS.git,
        POPULAR_TOPICS.ansible,
        POPULAR_TOPICS.jenkins,
        POPULAR_TOPICS.docker,
        POPULAR_TOPICS.kubernetes,
        POPULAR_TOPICS.security,
    ],
    [SEARCH_CATEGORIES_FILTER.data_science.key]: [POPULAR_TOPICS.data_science],
});

export const SUBCATEGORIES = Object.freeze({
    [LAB_VERTICAL.aws.key]: {
        MX: 140,
        UB: 390,
    },
    [LAB_VERTICAL.azure.key]: {
        MX: 140,
        UB: 390,
    },
    [LAB_VERTICAL.gcp.key]: {
        MX: 140,
        UB: 390,
    },
    [LAB_VERTICAL.web.key]: {
        MX: 8,
        UB: 414,
    },
    [LAB_VERTICAL.devops.key]: {
        MX: 362,
        UB: 406,
    },
    [LAB_VERTICAL.data_science.key]: {
        MX: 558,
        UB: 504,
    },
    [LAB_VERTICAL.security.key]: {
        MX: 134,
        UB: 442,
    },
});

export const LAB_INSTANCE_STATUS = {
    starting: 'starting',
    running: 'running',
    queued: 'queued',
    stopping: 'stopping',
    stopped: 'stopped',
    killing: 'killing',
    killed: 'killed',
    admin_killing: 'admin_killing',
    admin_killed: 'admin_killed',
    deactivated: 'deactivated',
    error: 'error',
};

export const LAB_LANDING_PAGE_URL = '/labs/listing/';

export const ERRORS = {
    get RENAME() {
        return gettext('Failed to change the name.');
    },
    get DELETE_FOLDER() {
        return gettext('Failed to delete the folder.');
    },
    get DELETE_FILE() {
        return gettext('Failed to delete the file.');
    },
    get CREATE_FILE() {
        return gettext('Failed to create a file');
    },
    get CREATE_FOLDER() {
        return gettext('Failed to create a folder');
    },
    get UPLOAD_FILE() {
        return gettext('Failed to upload a file');
    },
    get CONNECTION() {
        return gettext('Connection error');
    },
    get WRITE_FILE() {
        return gettext('Failed to save a file');
    },
};

export const LAB_STATUS = {
    pending_create: 'creating',
    draft: 'draft',
    in_review: 'in_review',
    pending_publish: 'publishing',
    published: 'published',
    unpublished: 'unpublished',
    deleted: 'deleted',
};

export const LAB_ACCESS_LEVEL = {
    base: 'base',
    test_creator: 'test-creator',
    edit: 'edit',
    full: 'full',
    admin: 'admin',
    admin_eng: 'admin-eng',
};

export const ADMIN_LAB_ACCESS_LEVELS = [LAB_ACCESS_LEVEL.admin, LAB_ACCESS_LEVEL.admin_eng];

export const FULL_AND_ADMIN_LAB_ACCESS_LEVELS = ADMIN_LAB_ACCESS_LEVELS.concat([
    LAB_ACCESS_LEVEL.full,
]);

export const EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS = FULL_AND_ADMIN_LAB_ACCESS_LEVELS.concat([
    LAB_ACCESS_LEVEL.edit,
]);

export const TEST_CREATOR_EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS = EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS.concat(
    [LAB_ACCESS_LEVEL.test_creator],
);

export const TEST_CREATOR_FULL_AND_ADMIN_LAB_ACCESS_LEVELS = FULL_AND_ADMIN_LAB_ACCESS_LEVELS.concat(
    [LAB_ACCESS_LEVEL.test_creator],
);

export const ALL_INSTRUCTOR_LAB_ACCESS_LEVELS = EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS.concat([
    LAB_ACCESS_LEVEL.base,
]);

export const LAB_MODE = {
    FOLLOW_ALONG: 'follow_along',
    STRUCTURED: 'structured',
    OPEN: 'open',
};

export const LAB_EVENT_MODE = {
    follow_along: 'follow_along',
    structured: 'guided',
    guided: 'guided',
    open: 'open',
};

export const LAB_MODES_WITH_ALR = [LAB_MODE.STRUCTURED];
export const LAB_CLOUD_VERTICALS = [
    LAB_VERTICAL.aws.key,
    LAB_VERTICAL.azure.key,
    LAB_VERTICAL.gcp.key,
];
export const LAB_CONTAINER_VERTICALS = [
    LAB_VERTICAL.web.key,
    LAB_VERTICAL.devops.key,
    LAB_VERTICAL.data_science.key,
    LAB_VERTICAL.security.key,
];

export const LAB_PENDING_STATUSES = [LAB_STATUS.pending_create, LAB_STATUS.pending_publish];
export const LAB_PREVIEWABLE_STATUSES = [LAB_STATUS.draft, LAB_STATUS.published];

export const LAB_BADGE_STATUSES = [LAB_STATUS.draft, LAB_STATUS.in_review, LAB_STATUS.published];
export const LAB_BADGE_STATUS_MAP = {
    [LAB_STATUS.draft]: {
        get label() {
            return gettext('DRAFT');
        },
    },
    [LAB_STATUS.in_review]: {
        get label() {
            return gettext('IN REVIEW');
        },
    },
    [LAB_STATUS.published]: {
        get label() {
            return gettext('LIVE');
        },
    },
};

export const LAB_INSTANCE_STATUS_UI = {
    get starting() {
        return gettext('Provisioning resources');
    },
    get pending() {
        return gettext('Pending');
    },
    get running() {
        return gettext('In use');
    },
    get queued() {
        return gettext('Queued');
    },
    get stopping() {
        return gettext('Pausing...');
    },
    get stopped() {
        return gettext('Paused');
    },
    get killing() {
        return gettext('Ending...');
    },
    get killed() {
        return gettext('Not in use');
    },
    get deactivated() {
        return gettext('Out of resources');
    },
    get not_in_use() {
        return gettext('Not in use');
    },
};

export const LAB_INSTANCE_TRANSITIONAL_STATUS = [
    LAB_INSTANCE_STATUS.starting,
    LAB_INSTANCE_STATUS.queued,
    LAB_INSTANCE_STATUS.stopping,
    LAB_INSTANCE_STATUS.killing,
];

export const LAB_INSTANCE_STOPPING_STATUS = [
    LAB_INSTANCE_STATUS.stopping,
    LAB_INSTANCE_STATUS.killing,
];

// LabInstance can't go to other statuses after reaching final statuses.
export const LAB_INSTANCE_UNSTARTABLE_STATUS = [
    LAB_INSTANCE_STATUS.killed,
    LAB_INSTANCE_STATUS.killing,
    LAB_INSTANCE_STATUS.admin_killing,
    LAB_INSTANCE_STATUS.admin_killed,
    LAB_INSTANCE_STATUS.deactivated,
];

export const LAB_INIT_ERROR = {
    NOT_FOUND: 'not_found',
    UNSTARTABLE: 'unstartable',
    UNKNOWN: 'unknown',
};

export const labLoadingUrl = (labId) => `/labs/${labId}/loading/`;
export const LABS_MODULAR_URL_PATTERN = '/labs/';

export const AWS_LOGOUT_URL =
    'https://signin.aws.amazon.com/oauth?Action=logout&redirect_uri=aws.amazon.com';

export const AZURE_LOGOUT_URL = 'https://login.microsoftonline.com/common/oauth2/logout';
export const GCP_LOGOUT_URL =
    'https://accounts.google.com/Logout?service=cloudconsole&continue=https://console.cloud.google.com/&hl=en_US';

export const LAB_TRACKING_EVENTS = Object.freeze({
    HEARTBEAT: LabHeartbeatEvent,
    LAB_CARD_CLICK: LabCardClickEvent,
    CLICK: LabActionEvent,
    OVERVIEW_PAGE_VISIT: LabOverviewVisitEvent,
    SEARCH: LabsSearchEvent,
    HEADER_CLICK: LabsHeaderClickEvent,
    LAB_IN_COURSE_PROMPT_ACTION: LabInCoursePromptActionEvent,
    RESUME_BANNER_DISMISS_CLICK: LabsResumeBannerDismissClickEvent,
    RESUME_BANNER_END_LAB_CLICK: LabsResumeBannerEndLabClickEvent,
    RESUME_BANNER_VIEW: LabsResumeBannerViewEvent,
    LAB_STARTED: LabStarted,
    LAB_COMPLETED: LabCompleted,
    LAB_EXITED: LabExited,
    LAB_RESUMED: LabResumed,
    LAB_TASK_COMPLETED: LabTaskCompleted,
    LAB_WORKSPACE_LAUNCHED: LabWorkspaceLaunched,
    LAB_TASK_REVIEW_REQUESTED: LabTaskReviewRequested,
    LAB_SELECTED: LabSelected,
});

export const LAB_CLICK_TRACKING_ACTIONS = Object.freeze({
    MODULAR_LAB_CARD_CLICK: 'modular_lab_card_click',
    MODULAR_LAB_START_LAB_CLICK: 'modular_lab_start_lab_click',
    MODULAR_LAB_SEE_YOUR_TASKS_CLICK: 'modular_lab_see_your_tasks_click',
    MODULAR_LAB_SEE_PROJECT_RESOURCES_CLICK: 'modular_lab_see_project_resources_click',
    MODULAR_LAB_NAV_INBOX_CLICK: 'modular_lab_nav_inbox_click',
    MODULAR_LAB_NAV_TASKS_CLICK: 'modular_lab_nav_tasks_click',
    MODULAR_LAB_WORKSPACE_LAUNCH: 'modular_lab_workspace_launch',
    MODULAR_LAB_START_TASK_REVIEW: 'modular_lab_start_task_review',
    MODULAR_LAB_COMPLETE_TASK_CLICK: 'modular_lab_complete_task_click',
    MODULAR_LAB_COMPLETE_LAB_CLICK: 'modular_lab_complete_lab_click',
    MODULAR_LAB_RESOURCES_FOLDER_CLICK: 'modular_lab_resources_folder_click',
    MODULAR_LAB_RESOURCE_CLICK: 'modular_lab_resource_click',
    MODULAR_LAB_RESOURCE_DOWNLOAD: 'modular_lab_resource_download',
    MODULAR_LAB_RESTART_TASK_CLICK: 'modular_lab_restart_task_click',
    MODULAR_LAB_RESTART_LAB_CLICK: 'modular_lab_restart_lab_click',
    MODULAR_LAB_SHOW_API_KEYS_CLICK: 'modular_lab_show_api_keys_click',
    MODULAR_LAB_CLOSE_API_KEYS_CLICK: 'modular_lab_close_api_keys_click',
    MODULAR_LAB_CONTINUE_LAB_CLICK: 'modular_lab_continue_lab_click',
    MODULAR_LAB_RETAKE_LAB_CLICK: 'modular_lab_retake_lab_click',
    MODULAR_LAB_REPORT_TASK_ISSUE_CLICK: 'modular_lab_report_task_issue_click',
    WORKSPACE_LOGIN_ACCORDION_EXPAND: 'workspace_login_accordion_expand',
    WORKSPACE_LOGIN_ACCORDION_COLLAPSE: 'workspace_login_accordion_collapse',
    WORKSPACE_LOGIN_ADVANCED_ACCORDION_EXPAND: 'workspace_login_advanced_accordion_expand',
    WORKSPACE_LOGIN_ADVANCED_ACCORDION_COLLAPSE: 'workspace_login_advanced_accordion_collapse',
    WORKSPACE_LOGIN_OPEN_WORKSPACE_CLICK: 'workspace_login_open_workspace_click',
    WORKSPACE_COPY_USERNAME_CLICK: 'workspace_copy_username_click',
    WORKSPACE_COPY_PASSWORD_CLICK: 'workspace_copy_password_click',
    WORKSPACE_COPY_RESOURCE_GROUP_CLICK: 'workspace_copy_resource_group_click',
    WORKSPACE_LOGIN_MODAL_CLOSE: 'workspace_login_modal_close',
    LAB_TAB_VISIT: 'lab_tab_visit',
    SKIP_LABS_SETUP_CONFIRM: 'skip_labs_setup_confirm',
    SKIP_LABS_SETUP_DISMISS: 'skip_labs_setup_dismiss',
    SW_LAB_FILE_CREATE: 'sw_lab_file_create',
    SW_LAB_FOLDER_CREATE: 'sw_lab_folder_create',
    SW_LAB_FILE_UPLOAD: 'sw_lab_file_upload',
    SW_LAB_EXPORT_SOURCE_CODE: 'sw_lab_export_source_code',
    SW_LAB_AUTOSAVE_TRIGGER: 'sw_lab_autosave_trigger',
    SW_LAB_PANEL_PREVIEW_REFRESH_CLICK: 'sw_lab_panel_preview_refresh_click',
    SW_LAB_PANEL_PREVIEW_NEW_WINDOW_CLICK: 'sw_lab_panel_preview_new_window_click',
    SW_LAB_PANEL_PREVIEW_EXPAND_CLICK: 'sw_lab_panel_preview_expand_click',
    LAUNCH: 'launch',
    CONNECT: 'connect',
    PAUSE: 'pause',
    RESUME: 'resume',
    END: 'end',
    END_CONFIRM: 'end_confirm',
    END_CANCEL: 'end_cancel',
    EDIT: 'edit',
    PUBLISH: 'publish',
    UNPUBLISH: 'unpublish',
    DELETE: 'delete',
    LOGS_MODAL_OPEN: 'logs_modal_open',
    LOGS_MODAL_CLOSE: 'logs_modal_close',
});

export const LAB_TRACKING_LAUNCH_UI_REGION = Object.freeze({
    INBOX: 'inbox',
    HEADER: 'lab_header',
    REVIEW: 'review_toaster',
});

export const LAB_TRACKING_WORKSPACE_LAUNCHED_UI_REGION = Object.freeze({
    LAB_WORKSPACE_LAUNCHER: 'lab_workspace_launcher',
    LAB_TAKING_PAGE: 'lab_taking_page',
    REVIEW_PANEL: 'review_panel',
});

export const LAB_TRACKING_PAUSE_UI_REGION = Object.freeze({
    LEAVE_LAB_MODAL: 'leave_lab_modal',
    LAB_TAKING_PAGE: 'lab_taking_page',
});

export const LAB_TRACKING_RESUME_UI_REGION = Object.freeze({
    WELCOME_BACK_MODAL: 'welcome_back_modal',
    LAB_TAKING_PAGE: 'lab_taking_page',
    LAB_WORKSPACE_LAUNCHER: 'lab_workspace_launcher',
});

export const LAB_TRACKING_SELECTED_UI_REGION = Object.freeze({
    MY_LEARNING_UNIT_LABS_TAB: 'my_learning_unit_labs_tab',
    MY_LEARNING_PAGE_LABS_TAB: 'my_learning_page_labs_tab',
    LABS_LANDING_PAGE_SEARCH_RESULTS: 'labs_landing_page_search_results',
    LABS_IN_COURSE_PROMPT: 'labs_in_course_prompt',
    LABS_IN_SEARCH: 'labs_in_search',
    LABS_UNIT_LIHP: 'labs_unit_lihp',
    LABS_UNIT_TOPIC: 'labs_unit_topic',
    LABS_RELATED_UNIT: 'labs_related_unit',
    LABS_IN_PROGRESS_UNIT: 'labs_in_progress_unit',
    LAB_CARD_QUICK_PREVIEW: 'quick_preview',
    LAB_RECOMMENDATION: 'lab_recommendation',
});

export const LAB_TRACKING_SELECTED_UI_REGION_MAPPING = Object.freeze({
    [LABS_DISCOVER_COMPONENTS.MY_LEARNING_LABS_TAB]:
        LAB_TRACKING_SELECTED_UI_REGION.MY_LEARNING_UNIT_LABS_TAB,
    [LABS_DISCOVER_COMPONENTS.MY_LEARNING_LABS_PAGE]:
        LAB_TRACKING_SELECTED_UI_REGION.MY_LEARNING_PAGE_LABS_TAB,
    [LABS_DISCOVER_COMPONENTS.LABS_LANDING_PAGE]:
        LAB_TRACKING_SELECTED_UI_REGION.LABS_LANDING_PAGE_SEARCH_RESULTS,
    [LABS_DISCOVER_COMPONENTS.LABS_IN_COURSE_PROMPT]:
        LAB_TRACKING_SELECTED_UI_REGION.LABS_IN_COURSE_PROMPT,
    [LABS_DISCOVER_COMPONENTS.LABS_IN_SEARCH]: LAB_TRACKING_SELECTED_UI_REGION.LABS_IN_SEARCH,
    [LABS_DISCOVER_COMPONENTS.LABS_UNIT_LIHP]: LAB_TRACKING_SELECTED_UI_REGION.LABS_UNIT_LIHP,
    [LABS_DISCOVER_COMPONENTS.LABS_UNIT_TOPIC]: LAB_TRACKING_SELECTED_UI_REGION.LABS_UNIT_TOPIC,
    [LABS_DISCOVER_COMPONENTS.LAB_LISTING_PAGE]:
        LAB_TRACKING_SELECTED_UI_REGION.LABS_IN_PROGRESS_UNIT,
    [LABS_DISCOVER_COMPONENTS.LAB_OVERVIEW_PAGE]: LAB_TRACKING_SELECTED_UI_REGION.LABS_RELATED_UNIT,
    [UI_REGION.QUICK_PREVIEW]: LAB_TRACKING_SELECTED_UI_REGION.LAB_CARD_QUICK_PREVIEW,
    [UI_REGION.LAB_RECOMMENDATION]: LAB_TRACKING_SELECTED_UI_REGION.LAB_RECOMMENDATION,
});

export const LAB_CONSUMPTION_SOURCE = Object.freeze({
    MODULAR_LAB_TAKING: 'modular_lab_taking',
    MODULAR_LAB_WORKSPACE_LAUNCHER: 'modular_lab_workspace_launcher',
});

export const LAB_ACTION_TIMEOUT_MS = 1000;

export const PROGRESS_TIMER_INTERVAL_MS = 250;
export const PROGRESS_LOGGING_INTERVAL_MS = 15000;

export const PROGRESS_LOGGING_INTERVAL_LIMIT_MS = 300000;

export const MAX_RUNNING_LABS_CNT = 10;

export const USER_TYPES = Object.freeze({
    INSTRUCTOR: 'Instructor',
    STUDENT: 'Student',
});

export const FILE_SAVE_DEBOUNCE_INTERVAL = 3000;

export const EXTENSION_TO_ACE_TYPE_MAP = Object.freeze({
    js: 'jsx',
    jsx: 'jsx',
    css: 'css',
    py: 'python',
    sql: 'sql',
    sh: 'sh',
    ejs: 'html',
    html: 'html',
    java: 'java',
    json: 'json',
    ts: 'typescript',
    tsx: 'typescript',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    r: 'r',
    R: 'r',
    ipynb: 'json',
});

export const EXTENSION_TO_TEXT_TYPES = ['md', 'txt', 'properties'];

export const MAKEFILE_NAME = 'Makefile';
export const MAGIC_FILENAME_TEXT_TYPES = [MAKEFILE_NAME, 'Dockerfile'];

export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico'];

export const IMAGE_EXTENSION_TO_TYPE = {
    jpg: 'jpeg',
    ico: 'x-icon',
};

export const DEFAULT_ACE_TYPE = 'text';

export const PATH_DELIMITER = '/';

export const FILE_ACTION_RENAME = 'rename';

export const FILE_ACTION_DELETE = 'delete';

export const FILE_ACTION_CREATE_FILE = 'create_file';

export const FILE_ACTION_CREATE_FOLDER = 'create_folder';

export const FILE_ACTION_UPLOAD = 'upload_file';

export const NOTIFICATION_TIMEOUT_MS = 5000;

export const NOTIFICATION_OPTIONS = {
    autoDismiss: true,
    autoDismissTimeout: NOTIFICATION_TIMEOUT_MS,
};

export const ERROR_NOTIFICATION_PROPS = Object.freeze({
    udStyle: 'error',
    get ctaText() {
        return gettext('Close');
    },
    dismissButtonProps: false,
});

export const SUCCESS_NOTIFICATION_PROPS = Object.freeze({
    udStyle: 'success',
    showCta: false,
    dismissButtonProps: false,
});

export const FILE_UPLOAD_LIMIT_MB = 5;

export const FILE_FOLDER_MESSAGES = {
    get FOLDER_DELETE_TEXT() {
        return gettext('Are you sure you want to delete the folder %(name)s');
    },
    get FILE_DELETE_TEXT() {
        return gettext('Are you sure you want to delete the file %(name)s');
    },
    get FILE_UPLOAD_SIZE_NOTIFICATION() {
        return interpolate(
            gettext('File size should be less or equal to %(size)s MB'),
            {size: FILE_UPLOAD_LIMIT_MB},
            true,
        );
    },
};

export const SOCKET_MAX_RECONNECT_ATTEMPTS = 3;

export const SOCKET_RECONNECTION_TIMEOUT_MS = 500;

export const LAB_TYPE = Object.freeze({
    workspace: {
        key: 'workspace',
        get label() {
            return gettext('Workspace');
        },
    },
    modular: {
        key: 'modular',
        get label() {
            return gettext('Modular Lab');
        },
    },
    dev_workspace: {
        // development workspace for instructors, which is used temporarily for testing ideas
        key: 'dev_workspace',
        get label() {
            return gettext('Instructor Development Workspace');
        },
    },
});

export const MODULAR_LAB_TIME_LIMIT_HOURS = 3;

export const LAB_TIME_LIMIT_MINUTES = {
    [LAB_TYPE.workspace.key]: 30,
    [LAB_TYPE.modular.key]: MODULAR_LAB_TIME_LIMIT_HOURS * 60,
    [LAB_TYPE.dev_workspace.key]: 30,
};
export const LAB_TIME_LIMIT_MS = {
    [LAB_TYPE.workspace.key]: LAB_TIME_LIMIT_MINUTES[LAB_TYPE.workspace.key] * 60 * 1000,
    [LAB_TYPE.modular.key]: LAB_TIME_LIMIT_MINUTES[LAB_TYPE.modular.key] * 60 * 1000,
    [LAB_TYPE.dev_workspace.key]: LAB_TIME_LIMIT_MINUTES[LAB_TYPE.dev_workspace.key] * 60 * 1000,
};

export const LAB_EXTENDED_WORKSPACE_TIME_LIMIT_DAYS = 14;

export const LAB_EXTENDED_WORKSPACE_TIME_LIMIT_MINUTES = 14 * 24 * 60;

export const LAB_EXTENDED_WORKSPACE_TIME_LIMIT_MS =
    LAB_EXTENDED_WORKSPACE_TIME_LIMIT_DAYS * 24 * 60 * 60 * 1000;

export const LAB_TIME_INSTRUCTOR_CAN_TERMINATE_AFTER_SEC = 180;
export const WORKSPACE_WARNING_TIME_BEFORE_PAUSE_MINUTES = 1;
export const WORKSPACE_WARNING_TIME_BEFORE_PAUSE_MS =
    WORKSPACE_WARNING_TIME_BEFORE_PAUSE_MINUTES * 60 * 1000;

export const MODULAR_LAB_WARNING_TIME_BEFORE_END_MINUTES = 30;
export const MODULAR_LAB_WARNING_TIME_BEFORE_END_MS =
    MODULAR_LAB_WARNING_TIME_BEFORE_END_MINUTES * 60 * 1000;

export const MODULAR_LAB_TIME_BEFORE_COUNTDOWN_HOURS = 12;

export const MODULAR_LAB_TIME_BEFORE_COUNTDOWN_MS =
    MODULAR_LAB_TIME_BEFORE_COUNTDOWN_HOURS * 60 * 60 * 1000;

export const MODULAR_LAB_IDLE_TIME_MINUTES = 15;

export const MODULAR_LAB_IDLE_PAUSE_TIME_MINUTES = 120;

export const WORKSPACE_AUTO_TERMINATE_WARNING_TIME_DAYS = 3;

export const LAB_LAUNCHER_FEEDBACK = Object.freeze({
    get START_LAB_FEEDBACK() {
        return gettext(
            'There was a problem starting your lab. Please refresh your browser and try again.',
        );
    },
    get STOP_LAB_FEEDBACK() {
        return gettext(
            'There was a problem stopping your lab. Please refresh your browser and try again.',
        );
    },
    get SYNC_LAB_FEEDBACK() {
        return gettext(
            'There was a problem syncing labs for this course. Please refresh your browser.',
        );
    },
    get TERMINATE_LAB_FEEDBACK() {
        return gettext(
            'There was a problem terminating your lab. Please refresh your browser and try again.',
        );
    },
    get MODULAR_LABS_TIME_LIMIT_MESSAGE() {
        return interpolate(
            gettext(
                'In order to conserve resources, your Workspace will be active for a maximum time of %(labTimeLimitHrs)s hours. We will let you know once you have %(warningTimeMin)s minutes left of work. If you manually end your Workspace or automatically reach the time limit, your work will no longer be available.',
            ),
            {
                labTimeLimitHrs: LAB_TIME_LIMIT_MINUTES[LAB_TYPE.modular.key] / 60,
                warningTimeMin: MODULAR_LAB_WARNING_TIME_BEFORE_END_MINUTES,
            },
            true,
        );
    },
});

export const NEW_WORKSPACE_LAUNCH_MODAL_CONTENT = {
    RUNNING_INSTANCES: 'running_instances',
    TERMINATING_EXISTING_INSTANCES: 'terminating_existing_instances',
    TERMINATE_DONE: 'terminate_done',
};

export const RESOURCE_OBJECT_TYPE_ASSET = 'asset';

export const RESOURCE_TYPE_HOW_TO = 'how_to';
export const RESOURCE_TYPE_DOCUMENT = 'documentation';
export const RESOURCE_TYPE_ASSET = 'asset';
export const RESOURCE_TYPE_AZURE_RESOURCE = 'azure_resource';
export const RESOURCE_TYPE_INITIAL_SOURCE_CODE = 'initial_source_code';
export const RESOURCE_TYPE_SOLUTION_SOURCE_CODE = 'solution_source_code';

export const RESOURCE_TYPES_MAP = {
    [RESOURCE_TYPE_HOW_TO]: {
        get label() {
            return gettext('How-to');
        },
    },
    [RESOURCE_TYPE_DOCUMENT]: {
        get label() {
            return gettext('Documentation');
        },
    },
    [RESOURCE_TYPE_ASSET]: {
        get label() {
            return gettext('Assets');
        },
    },
    [RESOURCE_TYPE_AZURE_RESOURCE]: {
        get label() {
            return gettext('Azure resources');
        },
    },
    [RESOURCE_TYPE_INITIAL_SOURCE_CODE]: {
        get label() {
            return gettext('Initial source code');
        },
    },
    [RESOURCE_TYPE_SOLUTION_SOURCE_CODE]: {
        get label() {
            return gettext('Peer solution');
        },
    },
};

export const AWS_PRIVACY_POLICY_URL = 'https://aws.amazon.com/privacy/';
export const AZURE_PRIVACY_POLICY_URL = 'https://privacy.microsoft.com/en-us/privacystatement';
export const DS_PRIVACY_POLICY_URL = 'https://www.vocareum.com/privacy-policy/';
export const GCP_PRIVACY_POLICY_URL = 'https://cloud.google.com/terms/cloud-privacy-notice/';
export const UDEMY_HOSTED_PRIVACY_POLICY_URL = '/terms/upro-terms/';

export const LABS_SUPPORT_ARTICLES = {
    get AWS() {
        return udLink.toSupportLink('labs_aws_support_article', true);
    },
    get AZURE() {
        return udLink.toSupportLink('labs_azure_support_article', true);
    },
    // TODO: Update GCP support article link once it is available
    get GCP() {
        return udLink.toSupportLink('labs_azure_support_article', true);
    },
    get DATA_SCIENCE() {
        return udLink.toSupportLink('labs_data_science_support_article', true);
    },
    get WEB_DEVELOPMENT() {
        const udConfig = getConfigData();
        return udLink.toSupportLink(
            'labs_web_development_support_article',
            udConfig.brand.has_organization,
        );
    },
    get DEVOPS() {
        return udLink.toSupportLink('labs_devops_support_article', true);
    },
    // TODO: Update Security support article link once it is available
    get SECURITY() {
        return udLink.toSupportLink('labs_devops_support_article', true);
    },
    get MODE_SELECT() {
        return udLink.toSupportLink('labs_select_mode_support_article', true);
    },
    get AUTOMATED_LAB_REVIEWS() {
        const udConfig = getConfigData();
        return udLink.toSupportLink('labs_alr_support_article', udConfig.brand.has_organization);
    },
};

export const AZURE_CLI_DOCUMENTATION_LINK =
    'https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli';

export const TASK_REVIEW_MESSAGES = Object.freeze({
    get first() {
        return gettext(
            "Thanks for making an effort on this first task! You can see my solution steps below to check your work under “How-to”. Once you've checked your work, I’ll share the next task. Glad to have you on this project!",
        );
    },
    get second() {
        return gettext(
            'Nice work tackling this task! As before, I’ve provided my solution below for you to check your work on this one. I’ll keep assigning you tasks and offering solutions this way going forward so that you can work at your own pace using the same process.',
        );
    },
    get last() {
        return gettext(
            'Congratulations on solving this complex problem! Make sure you check to see if your final task matches my intended outcome. Great work again! Looking forward to sharing your efforts with the broader team.',
        );
    },
    get pool() {
        return [
            gettext(
                'Another task down! You are making great progress. Keep at it! Don’t forget to compare your work to the solution below.',
            ),
            gettext(
                'Ready to check your work? Take a look at my solution and carry on! Looking forward to seeing how you do with the next one.',
            ),
            gettext(
                'Nice work tackling this task! I’ve provided my solution below for you to ensure you completed the steps correctly. Keep working at your own pace on these tasks! Looking forward to seeing what you can accomplish.',
            ),
            gettext(
                'Great effort on completing this task. This project isn’t easy! You’re doing great work. Hope my solution can help you check your work on this one.',
            ),
            gettext(
                'Loving the progress you’ve made here! Make sure you check your work against my solution. Let’s keep working together on these tasks to make this project a success!',
            ),
            gettext(
                'Looks like our collaborative process is working. Carry on with reviewing your work and I’ll check in after your next task!',
            ),
            gettext(
                'It’s great to see the progress on this project. Let’s stick to our system and check your work against my solution before moving on to the next task.',
            ),
            gettext(
                'How did you feel about this one? Hope you were able to find a solution. Take a look at my steps to review. Really excited to see this project moving forward!',
            ),
            gettext(
                'Think you got this one? Check out my solution to see if you’re on the right track. Regardless, you’re doing a great job making an effort on this project. Keep going!',
            ),
            gettext(
                'Thanks for your work progressing through these tasks. Review my steps to ensure you’ve got it before moving on. Glad to see you’re making progress!',
            ),
        ];
    },
});

export const NEW_TASK_REVIEW_MESSAGES = Object.freeze({
    get first() {
        return gettext(
            "Thanks for making an effort on this first task! You can check your work using the reference materials provided. Once you've checked your work, I'll share the next task. Glad to have you on this project!",
        );
    },
    get second() {
        return gettext(
            "Nice work tackling this task! Please use the reference materials to check your work. I'll keep assigning you tasks this way, so that you can work at your own pace using the same process.",
        );
    },
    get penultimate() {
        return gettext(
            "You've come a long way on this project! Great to see you nearing the end. Looking forward to seeing the finished product.",
        );
    },

    get last() {
        return gettext(
            'Congratulations on solving this complex problem! Make sure you check to see if your final task matches my intended outcome. Great work again! Looking forward to sharing your efforts with the broader team.',
        );
    },
    get pool() {
        return [
            gettext(
                "Another task down! You are making great progress. Keep at it! Don't forget to compare your work to the reference material provided.",
            ),
            gettext(
                'Ready to check your work? Take a look at the reference materials and carry on! Looking forward to seeing how you do with the next one.',
            ),
            gettext(
                "Nice work tackling this task! I've provided reference materials to ensure you completed the steps correctly. Keep working at your own pace on these tasks! Looking forward to seeing what you can accomplish.",
            ),
            gettext(
                "Great effort on completing this task. This project isn't easy! You're doing great work. Hope the reference material can help you check your work on this one.",
            ),
            gettext(
                "Loving the progress you've made here! Make sure you check your work. Let's keep working together on these tasks to make this project a success!",
            ),
            gettext(
                "Looks like our collaborative process is working. Carry on with reviewing your work and I'll check in after your next task!",
            ),
            gettext(
                "It's great to see the progress on this project. Let's stick to our system and check your work against the reference material before moving on to the next task.",
            ),
            gettext(
                'How did you feel about this one? Hope you were able to find a solution. Take a look at the reference material to review. Really excited to see this project moving forward!',
            ),
            gettext(
                "Think you got this one? Check out the reference materials to see if you're on the right track. Regardless, you're doing a great job making an effort on this project. Keep going!",
            ),
            gettext(
                "Thanks for your work progressing through these tasks. Review your work to ensure you've got it before moving on. Glad to see you're making progress!",
            ),
        ];
    },
});

export const HTML_PREVIEW_EVALUATORS = ['liveserver'];
export const CLI_EVALUATORS = ['java11-cli', 'java17-cli', 'python3-cli', 'python38-cli'];
export const JAVA_RUN_TEST_ACTION_EVALUATORS = ['java11-cli', 'java17-cli'];
export const PYTHON_RUN_TEST_ACTION_EVALUATORS = ['python3-cli', 'python38-cli'];

export const LABS_AUTOSAVE_INTERVAL_MS = 500;

export const USER_CHECKED_SAFARI_SETTINGS_COOKIE_KEY = 'user_checked_safari_settings';

export const EXPORT_SOURCE_CODE_FILE_NAME = 'archive.zip';
export const EXPORT_SOURCE_CODE_FILE_TYPE = {type: 'application/zip'};

export const DEFAULT_SERVICE_ACTIONS = {
    'spring-mysql': {run: 'make run', restart: 'make restart'},
    'react-redux': {restart: 'make webpack-restart'},
    'javascript-node16': {restart: 'make webpack-restart'},
    'typescript-node16': {restart: 'make webpack-restart'},
    ansible: {run: 'make lab-run'},
};

export const DEVOPS_EVALUATORS = {
    'jenkins-2-bare': {
        get title() {
            return 'Jenkins';
        },
        get webPortal() {
            return true;
        },
        get logWindowEnabled() {
            return true;
        },
    },
    'jenkins-2-preloaded': {
        get title() {
            return 'Jenkins';
        },
        get webPortal() {
            return true;
        },
        get logWindowEnabled() {
            return true;
        },
    },
    ubuntu: {
        get title() {
            return 'Ubuntu';
        },
        get webPortal() {
            return false;
        },
        get logWindowEnabled() {
            return true;
        },
    },
    git: {
        get title() {
            return 'Gitea';
        },
        get webPortal() {
            return true;
        },
        get logWindowEnabled() {
            return true;
        },
    },
    ansible: {
        get logWindowEnabled() {
            return false;
        },
        get title() {
            return 'Ansible';
        },
        get webPortal() {
            return true;
        },
        get fullScreenTerminal() {
            return false;
        },
    },
    jupyterlab: {
        get title() {
            return 'Jupyterlab';
        },
        get webPortal() {
            return true;
        },
        get codeEditor() {
            return true;
        },
    },
    'jupyterlab-r': {
        get title() {
            return 'Jupyterlab (R)';
        },
        get webPortal() {
            return true;
        },
        get codeEditor() {
            return true;
        },
    },
    'jupyterlab-julia': {
        get title() {
            return 'Jupyterlab (Julia)';
        },
        get webPortal() {
            return true;
        },
        get codeEditor() {
            return true;
        },
    },
    'jupyterlab-lightgbm': {
        get title() {
            return 'Jupyterlab (LightGBM)';
        },
        get webPortal() {
            return true;
        },
        get codeEditor() {
            return true;
        },
    },
    'jupyterlab-tensorflow': {
        get title() {
            return 'Jupyterlab (Tensorflow)';
        },
        get webPortal() {
            return true;
        },
        get codeEditor() {
            return true;
        },
    },
    'jupyterlab-prophet': {
        get title() {
            return 'Jupyterlab (Prophet)';
        },
        get webPortal() {
            return true;
        },
        get codeEditor() {
            return true;
        },
    },
    'jupyterlab-workspace': {
        get title() {
            return 'Jupyterlab (Workspace)';
        },
        get webPortal() {
            return true;
        },
        get codeEditor() {
            return true;
        },
    },
    'jupyterlab-xgboost': {
        get title() {
            return 'Jupyterlab (Xgboost)';
        },
        get webPortal() {
            return true;
        },
        get codeEditor() {
            return true;
        },
    },
    'tomcat-9': {
        get title() {
            return 'Tomcat (9)';
        },
        get webPortal() {
            return true;
        },
        get logWindowEnabled() {
            return true;
        },
    },
    rstudio: {
        get title() {
            return 'R Studio';
        },
        get codeEditor() {
            return true;
        },
    },
    'rstudio-vocareum': {
        get title() {
            return 'R Studio (Migrated)';
        },
        get codeEditor() {
            return true;
        },
    },
    kubernetes: {
        get title() {
            return 'Kubernetes';
        },
        get webPortal() {
            return true;
        },
        get fullScreenTerminal() {
            return true;
        },
        get logWindowEnabled() {
            return false;
        },
    },
    docker: {
        get title() {
            return 'Docker';
        },
        get webPortal() {
            return true;
        },
        get fullScreenTerminal() {
            return true;
        },
        get logWindowEnabled() {
            return false;
        },
    },
    'phpmyadmin-mysql': {
        get title() {
            return 'PhpMyAdmin / MySQL';
        },
        get webPortal() {
            return true;
        },
        get logWindowEnabled() {
            return true;
        },
    },
};

export const SECURITY_EVALUATORS = {
    vyos: {
        get title() {
            return 'VyOS';
        },
        get webPortal() {
            return true;
        },
        get fullScreenTerminal() {
            return true;
        },
        get logWindowEnabled() {
            return false;
        },
    },
    kali: {
        get title() {
            return 'Kali Linux';
        },
        get webPortal() {
            return true;
        },
        get fullScreenTerminal() {
            return true;
        },
        get logWindowEnabled() {
            return false;
        },
    },
};

export const VSCODE_EVALUATORS = {
    'vscode-java17': {
        get title() {
            return 'VSCode w/Java 17';
        },
        get webPortal() {
            return true;
        },
    },
    'vscode-python38': {
        get title() {
            return 'VSCode w/Python 3.8';
        },
        get webPortal() {
            return true;
        },
    },
};

export const LAB_TYPE_WORKSPACE = [LAB_TYPE.workspace.key, LAB_TYPE.dev_workspace.key];

export const DEVOPS_EVALUATORS_WITHOUT_EXPOSED_SERVICES = ['ansible'];

export const DEVOPS_EVALUATORS_TERMINAL_EXPOSED_SERVICES = ['kubernetes', 'docker'];

export const SECURITY_EVALUATORS_TERMINAL_EXPOSED_SERVICES = ['vyos', 'kali'];

export const SERVICE_ALIASES = {
    'jenkins-2-preloaded': 'jenkins',
    'jenkins-2-bare': 'jenkins',
    'headless-spring': 'spring',
    'headless-tomcat': 'tomcat',
};

export const LAB_FEATURES_EVENT_TRACKING = Object.freeze({
    ALR_FILTER: 'alr_filter',
});

export const LAB_UI_REGION = Object.freeze({
    LAUNCHER: 'lab_launcher',
    MODE_SELECTOR: 'lab_mode_selector',
});

export const LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_SET = 'lab_versioning';

export const LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_VARIANT =
    'lab_versioning_enabled_in_lab_manage';

export const LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_DEFAULT = false;

export const AWS_LAB_CREDENTIALS_UPDATE_INTERVAL_MS = 1000 * 60 * 10; // 10 minutes

export const LAB_VERTICALS_WITHOUT_PAUSE_RESUME = [
    LAB_VERTICAL.azure.key,
    LAB_VERTICAL.aws.key,
    LAB_VERTICAL.gcp.key,
];
