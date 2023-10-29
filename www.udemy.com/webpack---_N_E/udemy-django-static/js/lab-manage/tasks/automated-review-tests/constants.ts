export const ALR_UI_MODE = {
    CODE_EDITOR: 'code-editor',
    FILE_UPLOADER: 'file-uploader',
} as const;

export const FILE_EXTENSION_BY_ALR_TARGET: {[name: string]: string} = {
    communication: 'sh',
    'aws-cli': 'sh',
    mysql: 'py',
    jupyterlab: 'py',
};
