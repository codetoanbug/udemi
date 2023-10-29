import {apiHeaders} from './ud-api';

export default {
    signature: {
        endpoint: '/api-2.0/s3-upload-signatures/',
        customHeaders: apiHeaders,
    },
    chunking: {
        enabled: true,
    },
    resume: {
        enabled: true,
    },
    multiple: false,
    retry: {
        enableAuto: true,
    },
};

export const allowedVideoExtensionsList = [
    '.avi',
    '.mpg',
    '.mpeg',
    '.flv',
    '.mov',
    '.m2v',
    '.m4v',
    '.mp4',
    '.rm',
    '.ram',
    '.vob',
    '.ogv',
    '.webm',
    '.wmv',
];

export const allowedAudioExtensionsList = ['.mp3', '.wav'];

// Keep consistent with udemy/upload/constants.py ALLOWED_IMAGE_EXTENSIONS_LIST.
export const allowedImageExtensionsList = ['.gif', '.jpg', '.jpeg', '.png'];

export const allowedScriptsExtensionsList = ['.rb', '.py', '.sh'];

export const allowedPresentationExtensionsList = ['.pdf'];

// Keep consistent with udemy/upload/constants.py DEFAULT_MAX_ALLOWED_S3_FILE_SIZE.
export const defaultMaxFileSize = 4000000000; // 4GB
