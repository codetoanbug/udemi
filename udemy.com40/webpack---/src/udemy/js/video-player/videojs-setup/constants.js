import getConfigData from 'utils/get-config-data';

const udConfig = getConfigData();

export const HLS_TYPE_REGEX = /^application\/x-mpegURL|application\/vnd\.apple\.mpegurl$/i;
export const DASH_TYPE_REGEX = /^application\/dash\+xml$/i;

export const DRM_LICENSE_CERTIFICATE_URL = `https://${udConfig.drm_fairplay_certificate_cdn_domain}/fp-cert/9e5037892023e3ccab2815a6adf7d05b.der`;

export const DRM_LICENSE_SERVER_URL_TEMPLATE = udConfig.drm_license_server_url_template;
export const HLS_DRM_CONTENT_ID_REGEX = new RegExp('skd://(\\w{32})', 'i');

// TODO: remove this when `MediaError.MEDIA_ERR_ENCRYPTED` became standard
export const MEDIA_ERR_ENCRYPTED = 5;

export const DRM_TECH_NAME_WIDEVINE = 'Widevine';
export const DRM_TECH_NAME_PLAYREADY = 'PlayReady';
export const DRM_TECH_NAME_FAIRPLAY = 'FairPlay';
