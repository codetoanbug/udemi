import {getVariantValue} from 'utils/get-experiment-data';
import udMe from 'utils/ud-me';

import {HLS_MIME_TYPE} from './constants';

export function getCDNFromUrl(urlString: any) {
    const url = new URL(urlString);

    // For the dynamic generated HLS manifests we get the provider from the query string
    if (/(\.udemy\.(com|cn)|\.dev-ud\.com)$/.test(url.hostname)) {
        return url.searchParams.get('provider') ?? 'none';
    }

    if (/^h1010\./.test(url.hostname)) {
        return 'media_package';
    }

    if (/^\w+-a\./.test(url.hostname)) {
        return 'verizon';
    }

    if (/^\w+-b\./.test(url.hostname)) {
        return 'cdn77';
    }

    if (/^\w+-c\./.test(url.hostname)) {
        return 'cloudfront';
    }

    return 'none';
}

export function getExperimentName(isEncrypted: any) {
    let experimentName = null;

    // Experiment for DRM encrypted videos
    if (isEncrypted && getVariantValue('sw', 'useEncryptedVideos', false)) {
        experimentName = 'encrypted_videos';
    }

    return experimentName;
}

function bandwidthWatermarksEventData(bandwidthWatermarks: any) {
    return Object.keys(bandwidthWatermarks).reduce((bandwidthWatermarksEventData, statname) => {
        const val = bandwidthWatermarks[statname].highest;
        if (val) {
            // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            bandwidthWatermarksEventData[statname] = Math.round(val);
        }
        return bandwidthWatermarksEventData;
    }, {});
}

function adaptiveStreamingEventData(videoPlayerStore: any) {
    const adaptiveStreamingEventData = {
        isAdaptive: videoPlayerStore.isAdaptive,
        resolution: '',
    };

    if (!adaptiveStreamingEventData.isAdaptive) {
        return adaptiveStreamingEventData;
    }

    // TODO TSmigrate review all shaka fields below
    if (videoPlayerStore._videoPlayer.getManifest()?.imageStreams[0]?.mimeType === HLS_MIME_TYPE) {
        // Override the resolution data (which is "auto") with the quality level selected by hls.js
        // Note that Avro expects a string value for the resolution field
        adaptiveStreamingEventData.resolution = videoPlayerStore.hlsResolution.toString();
    }

    return adaptiveStreamingEventData;
}

function videoElementEventData(videoElement: any) {
    return {
        width: videoElement.clientWidth,
        height: videoElement.clientHeight,
    };
}

export function videoPlayerEventData(videoPlayerStore: any) {
    const videoPlayerEventData = Object.assign(
        {
            assetId: videoPlayerStore.assetId,
            playerSessionId: videoPlayerStore.sessionId,
            cdnProvider: getCDNFromUrl(videoPlayerStore._videoPlayer.getAssetUri()),
            // TODO TSmigrate select streams from the list not the first stream.
            // TODO TSmigrate review all shaka fields below
            sourceType:
                videoPlayerStore._videoPlayer?.getManifest()?.variants[0]?.video.mimeType ??
                'video/mp4',
            resolution: videoPlayerStore.activeResolution.label,
            currentTime: videoPlayerStore._videoPlayer.getMediaElement()?.currentTime,
            isEncrypted: !!videoPlayerStore.mediaLicenseToken,
            playerVersion: `videojs ${videoPlayerStore._videoPlayer.videojsVersion}`,
            videoElement: {width: 1080, height: 720},
            bandwidthWatermarks: {},
            experimentName: '',
        },
        adaptiveStreamingEventData(videoPlayerStore),
    );

    if (videoPlayerStore.videoElement) {
        videoPlayerEventData.videoElement = videoElementEventData(videoPlayerStore.videoElement);
    }

    if (Object.keys(videoPlayerStore.bandwidthWatermarks).length > 0) {
        videoPlayerEventData.bandwidthWatermarks = bandwidthWatermarksEventData(
            videoPlayerStore.bandwidthWatermarks,
        );
    }

    const experimentName = getExperimentName(videoPlayerEventData.isEncrypted);
    if (experimentName) {
        videoPlayerEventData.experimentName = experimentName;
    }

    return videoPlayerEventData;
}

function getResolution(videoPlayerStore: any) {
    if (
        !videoPlayerStore.isAdaptive ||
        !(videoPlayerStore._videoPlayer.currentType() === HLS_MIME_TYPE)
    ) {
        return videoPlayerStore.activeResolution.label;
    }

    // If the resolution is set to Auto and the source is hls use hlsResolution
    return videoPlayerStore.hlsResolution?.toString();
}

function getResponsePath(url: any) {
    if (url) {
        const parsedResponseURL = new URL(url);
        return parsedResponseURL.pathname;
    }
}

export function videoPlayerErrorData(videoPlayerStore: any, error: any) {
    return {
        assetId: videoPlayerStore.assetId,
        userModulo: udMe.id % 100,
        retries: videoPlayerStore.numErrors,
        errorCode: error.code,
        errorMessage: error.message,
        responseStatus: error.responseStatus,
        responseURL: error.responseURL,
        responsePath: getResponsePath(error.responseURL),
        responseContentType: error.responseContentType,
        resolution: getResolution(videoPlayerStore),
        isAdaptive: videoPlayerStore.isAdaptive,
        isEncrypted: !!videoPlayerStore.mediaLicenseToken,
        trackingTag: videoPlayerStore.trackingTag,
        readyState: videoPlayerStore._videoPlayer.readyState(),
        networkState: videoPlayerStore._videoPlayer.networkState(),
        cdn: getCDNFromUrl(videoPlayerStore._videoPlayer.currentSrc()),
        srcType: videoPlayerStore._videoPlayer.currentType(),
    };
}
