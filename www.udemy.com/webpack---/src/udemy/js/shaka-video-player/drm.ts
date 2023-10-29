import axios from 'axios';

import memoize from 'utils/memoize';
import {baseURL} from 'utils/ud-api';
import udPerf from 'utils/ud-performance';

import {
    HLS_TYPE_REGEX,
    DASH_TYPE_REGEX,
    HLS_DRM_CONTENT_ID_REGEX,
    DRM_LICENSE_SERVER_URL_TEMPLATE,
    DRM_LICENSE_CERTIFICATE_URL,
    DRM_TECH_NAME_WIDEVINE,
    DRM_TECH_NAME_PLAYREADY,
    DRM_TECH_NAME_FAIRPLAY,
} from './constants';
import {WIDEVINE_ERROR_BODY, WIDEVINE_ERROR_FOOTER} from './error-display.react-component';

export const FAIRPLAY_KEY_SYSTEM = 'com.apple.fps.1_0';
export const WIDEVINE_KEY_SYSTEM = 'com.widevine.alpha';
export const PLAYREADY_KEY_SYSTEM = 'com.microsoft.playready';

export const HLS_CONFIGS = {
    audioCapabilities: [
        {
            contentType: 'audio/mp4; codecs="mp4a.40.2"',
            robustness: 'SW_SECURE_CRYPTO',
        },
    ],
    videoCapabilities: [
        {
            contentType: 'video/mp4; codecs="avc1.640828"',
            robustness: 'SW_SECURE_CRYPTO',
        },
    ],
};

export const DASH_CONFIGS = {
    audioCapabilities: [
        {
            contentType: 'audio/mp4; codecs="mp4a.40.2"',
            robustness: 'SW_SECURE_CRYPTO',
        },
    ],
    videoCapabilities: [
        {
            contentType: 'video/mp4; codecs="avc1.64001F"',
            robustness: 'SW_SECURE_CRYPTO',
        },
    ],
};

export const PlayerGlobalData = {drmTechUsed: ''};

declare const window: any;

export const supportKeySystem = memoize(async (keySystem: any, requiredConfigs: any) => {
    if (typeof window.navigator.requestMediaKeySystemAccess === 'function') {
        return new Promise((resolve) => {
            window.navigator
                .requestMediaKeySystemAccess(keySystem, [requiredConfigs])
                .then(resolve)
                .catch(() => resolve(false));
        });
    } else if (typeof window.MSMediaKeys === 'function') {
        return window.MSMediaKeys.isTypeSupported(keySystem);
    }

    return false;
});

/**
 * This patch forces the videojs/http-streaming's source handler to play only DRM videos.
 */
export const patchHttpStreamingSourceHandlers = async function (videojs: any) {
    PlayerGlobalData.drmTechUsed = `${gettext('loading')}...`;
    const originalCanPlayType = videojs.HlsSourceHandler.canPlayType;

    const isFairPlaySupported = await supportKeySystem(FAIRPLAY_KEY_SYSTEM, HLS_CONFIGS);
    const isWidevineSupported = await supportKeySystem(WIDEVINE_KEY_SYSTEM, DASH_CONFIGS);
    const isPlayReadySupported = await supportKeySystem(PLAYREADY_KEY_SYSTEM, DASH_CONFIGS);

    // To prevent conflict with the HLS.js plugin this one is allowed to handle only encrypted HLS videos.
    // NOTE: It's important to provide the DASH source first since PlayReady supports both DASH and HLS
    // but we only use the first one. Check `fixSourceOrder()` in `udemy-patches`
    videojs.HlsSourceHandler.canPlayType = function (type: any) {
        if (!originalCanPlayType.call(this, type)) {
            return false;
        }

        if (HLS_TYPE_REGEX.test(type) && isFairPlaySupported) {
            return true;
        }

        if (DASH_TYPE_REGEX.test(type) && (isWidevineSupported || isPlayReadySupported)) {
            return true;
        }

        return false;
    };
};

const isWidevineDrmError = function (error: any) {
    // When the browser's Widevine Content Decryption Module is out of date,
    // the server responds with a 403 error.
    // We will be showing an appropriate error message in that case.
    return error?.response && [403].includes(error.response.status);
};

const getWidevineDrmErrorObj = function () {
    return {
        message: {
            errorBody: WIDEVINE_ERROR_BODY,
            errorFooter: WIDEVINE_ERROR_FOOTER,
        },
    };
};

export const buildLicenseServerURL = function (drmType: any, authToken: any) {
    return DRM_LICENSE_SERVER_URL_TEMPLATE.replace('{drm_type}', drmType)
        .replace('{auth_token}', authToken)
        .replace('{base_url}', baseURL);
};

export const getContentIdForFairPlay = function (emeOptions: any, initData: any) {
    // Converts the data buffer into a string
    const initDataString = String.fromCharCode.apply(null, initData.buffer as []);
    const match = initDataString.match(HLS_DRM_CONTENT_ID_REGEX);

    if (!match) {
        throw new Error('Invalid content ID format');
    }

    return match[1];
};

export const getLicenseForWidevine = function (authToken: any) {
    const requestURL = buildLicenseServerURL('widevine', authToken);

    return async function (emeOptions: any, keyMessage: any, callback: any) {
        try {
            udPerf.start('drmGetLicenseForWidevine');
            PlayerGlobalData.drmTechUsed = DRM_TECH_NAME_WIDEVINE;
            const response = await axios.post(requestURL, keyMessage, {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                headers: {'Content-Type': 'application/octet-stream'},
                responseType: 'arraybuffer',
            });

            if (response.status >= 400 && response.status <= 599) {
                // Pass an empty object as the error to use the default code 5 error message
                callback({});
                return;
            }

            udPerf.end('drmGetLicenseForWidevine');
            callback(null, new Buffer(response.data, 'base64'));
        } catch (error) {
            /*
                videojs-contrib-eme will pass an error Object of type string,
                or the message on an error of type object with a 'message' field,
                down to the player's error handler function, as a 'message' field, alongside error code 5.
                See file videojs-contrib-eme.es.js function emeErrorHandler.
            */
            isWidevineDrmError(error) ? callback(getWidevineDrmErrorObj()) : callback(error);
        }
    };
};

function parsePlayReadyKeyMessage(keyMessage: any) {
    const messageXml = new window.DOMParser().parseFromString(
        String.fromCharCode.apply(null, keyMessage as []),
        'application/xml',
    );

    const headerElement = messageXml.getElementsByTagName('HttpHeaders')[0];
    const headers = [];

    if (headerElement) {
        const headerNames = headerElement.getElementsByTagName('name');
        const headerValues = headerElement.getElementsByTagName('value');

        for (let i = 0; i < headerNames.length; i++) {
            headers[headerNames[i].childNodes[0].nodeValue] =
                headerValues[i].childNodes[0].nodeValue;
        }
    }

    const challengeElement = messageXml.getElementsByTagName('Challenge')[0];
    const challenge = challengeElement
        ? window.atob(challengeElement.childNodes[0].nodeValue)
        : undefined;

    return {
        headers,
        challenge,
    };
}

export const getLicenseForPlayReady = function (authToken: any) {
    const requestURL = buildLicenseServerURL('playready', authToken);

    return async function (emeOptions: any, keyMessage: any, callback: any) {
        const parsedMessage = parsePlayReadyKeyMessage(keyMessage);

        try {
            udPerf.start('drmGetLicenseForPlayReady');
            PlayerGlobalData.drmTechUsed = DRM_TECH_NAME_PLAYREADY;
            const response = await axios.post(requestURL, parsedMessage.challenge, {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                headers: {'Content-Type': 'application/octet-stream'},
                responseType: 'arraybuffer',
            });

            if (response.status >= 400 && response.status <= 599) {
                // Pass an empty object as the error to use the default code 5 error message
                callback({});
                return;
            }

            udPerf.end('drmGetLicenseForPlayReady');
            callback(null, new Buffer(response.data, 'base64'));
        } catch (error) {
            callback(error);
        }
    };
};

export const getLicenseForFairPlay = function (authToken: any) {
    const requestURL = buildLicenseServerURL('fairplay', authToken);

    return async function (emeOptions: any, contentId: any, keyMessage: any, callback: any) {
        const spc = Buffer.from(keyMessage).toString('base64');

        // BuyDRM doesn't support encoded parameters! Shame!
        const requestBody = `spc=${spc}&assetId=${contentId}`;

        try {
            udPerf.start('drmGetLicenseForFairPlay');
            PlayerGlobalData.drmTechUsed = DRM_TECH_NAME_FAIRPLAY;
            const response = await axios.post(requestURL, requestBody, {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            });

            udPerf.end('drmGetLicenseForFairPlay');
            callback(null, new Buffer(response.data, 'base64'));
        } catch (error) {
            callback(error);
        }
    };
};

export const buildKeySystemsConfig = function (authToken: any) {
    return {
        [WIDEVINE_KEY_SYSTEM]: {
            getLicense: getLicenseForWidevine(authToken),
            videoRobustness: 'SW_SECURE_CRYPTO',
            audioRobustness: 'SW_SECURE_CRYPTO',
        },
        [PLAYREADY_KEY_SYSTEM]: {
            getLicense: getLicenseForPlayReady(authToken),
        },
        [FAIRPLAY_KEY_SYSTEM]: {
            certificateUri: DRM_LICENSE_CERTIFICATE_URL,
            getContentId: getContentIdForFairPlay,
            getLicense: getLicenseForFairPlay(authToken),
        },
    };
};

export const trackPlayerDRMPerformance = function (player: any) {
    const playerTech = player.tech(true);

    // Measure the time spent to process the DRM license
    // For more information see the links
    // - https://www.w3.org/TR/encrypted-media/#dom-mediakeystatus
    // - https://github.com/videojs/videojs-contrib-eme#events
    //
    playerTech.on('keysessioncreated', () => {
        udPerf.start('drmLicenseProcessed');
    });

    playerTech.on('keystatuschange', (event: any) => {
        if (event.status === 'usable') {
            udPerf.end('drmLicenseProcessed');
        }
    });
};
