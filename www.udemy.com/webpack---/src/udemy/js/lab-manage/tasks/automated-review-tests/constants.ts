export const ALR_UI_MODE = {
    CODE_EDITOR: 'code-editor',
    FILE_UPLOADER: 'file-uploader',
    CODE_EDITOR_WITH_AI_TEST_GENERATOR: 'code-editor-with-ai-test-generator',
} as const;

export const TEST_CODE_SOURCE = {
    AI: 'ai',
    TEMPLATE: 'template',
    FILE_UPLOAD: 'file-upload',
    USER_GENERATED: 'user-generated',
};

export const FILE_EXTENSION_BY_ALR_TARGET: {[alrTarget: string]: string} = {
    'aws-cli': 'sh',
    'azure-cli': 'sh',
    communication: 'sh',
    mysql: 'py',
    jupyterlab: 'py',
};

export const LAB_BASE_TECHNOLOGY_BY_ALR_TARGET: {[alrTarget: string]: string} = {
    'aws-cli': 'aws',
    'azure-cli': 'azure',
    communication: 'kubernetes',
    mysql: 'mysql',
    jupyterlab: 'jupyter',
};

export const AI_AVAILABLE_ALR_TARGETS = [
    'aws-cli',
    'azure-cli',
    'communication',
    'mysql',
    'jupyterlab',
] as const;

export const AI_RESPONSE_STATUS = {
    SUCCESS: 'success',
    FAILURE: 'failure',
    PROCESSING: 'processing',
};

export const RECHECK_AI_RESPONSE_TIMER_INTERVAL_MS = 5000;
