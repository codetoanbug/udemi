import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

import {getCDNFromUrl} from '../helpers';
import {MUX_ID_DEV, MUX_ID_PROD} from './constants';

const udConfig = getConfigData();

export function getMuxConfig(metadata: any, mediaSources: any, isEncrypted: any, force = false) {
    if (!metadata) {
        return {};
    }

    // Mux does not allow custom metadata so we repurpose some fields.
    // If repurposed fields change please update the wiki page.
    // https://udemywiki.atlassian.net/wiki/spaces/ENG/pages/897482814/Mux+Schema

    const {assetId, courseId, duration, playerName, isPaid} = metadata;
    const orgId = udConfig.brand.organization?.encrypted_id || 0;

    const cdnProvider = mediaSources?.length ? getCDNFromUrl(mediaSources[0].src) : undefined;

    const config = {
        plugins: {
            mux: {
                respectDoNotTrack: false,
                data: {
                    env_key: MUX_ID_PROD,
                    player_name: playerName,
                    player_init_time: Date.now(),
                    viewer_user_id: udMe.encrypted_id || 0,
                    video_id: assetId,
                    video_cdn: cdnProvider,
                    video_title: assetId,
                    video_duration: duration,
                    video_series: courseId,
                    video_stream_type: isPaid ? 'paid' : 'free',
                    video_encoding_variant: isEncrypted ? 'encrypted' : 'plain',
                    sub_property_id: orgId,
                },
            },
        },
    };

    if (udConfig.env === 'DEV' && [39170530, 39280020].includes(assetId)) {
        // Above asset ids are from domain-tester-panel.react-component.js
        // @ts-expect-error TS(2339) FIXME: Property 'debug' does not exist on type '{ respect... Remove this comment to see the full error message
        config.plugins.mux.debug = true;
        config.plugins.mux.data.env_key = MUX_ID_DEV;
        config.plugins.mux.data.player_name = 'Video JS Test Player';
        return config;
    }

    const isActiveSample = orgId || Math.random() <= 0.33;

    // We send 100% of UfB requests and sample 33% of requests for the regular Marketplace on Web
    // to reduce number of Mux calls for cost reasons.
    if ((udConfig.env === 'PROD' && isActiveSample) || force) {
        return config;
    }

    return {};
}

export function getShakaMuxConfig(
    metadata: any,
    mediaSources: any,
    isEncrypted: any,
    force = false,
) {
    if (!metadata) {
        return {};
    }

    // Mux does not allow custom metadata so we repurpose some fields.
    // If repurposed fields change please update the wiki page.
    // https://udemywiki.atlassian.net/wiki/spaces/ENG/pages/897482814/Mux+Schema

    const {assetId, courseId, duration, playerName, isPaid} = metadata;
    const orgId = udConfig.brand.organization?.encrypted_id || 0;

    const cdnProvider = mediaSources?.length ? getCDNFromUrl(mediaSources[0].src) : undefined;

    const shakaMuxConfig = {
        debug: false,
        disableCookies: false,
        respectDoNotTrack: false,
        data: {
            env_key: MUX_ID_PROD,
            player_name: playerName,
            player_init_time: Date.now(),
            viewer_user_id: udMe.encrypted_id || 0,
            video_id: assetId,
            video_cdn: cdnProvider,
            video_title: assetId,
            video_duration: duration,
            video_series: courseId,
            video_stream_type: isPaid ? 'paid' : 'free',
            video_encoding_variant: isEncrypted ? 'encrypted' : 'plain',
            sub_property_id: orgId,
        },
    };

    if (udConfig.env === 'DEV') {
        shakaMuxConfig.debug = true;
        shakaMuxConfig.data.env_key = MUX_ID_DEV;
        return shakaMuxConfig;
    }

    const isActiveSample = orgId || Math.random() <= 0.33;

    // We send 100% of UfB requests and sample 33% of requests for the regular Marketplace on Web
    // to reduce number of Mux calls for cost reasons.
    if ((udConfig.env === 'PROD' && isActiveSample) || force) {
        return shakaMuxConfig;
    }

    return {};
}
