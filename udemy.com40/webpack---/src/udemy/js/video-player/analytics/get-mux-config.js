import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

import {getCDNFromUrl} from '../helpers';
import {MUX_ID_DEV, MUX_ID_PROD} from './constants';

const udConfig = getConfigData();

export default function getMuxConfig(metadata, mediaSources, isEncrypted, force = false) {
    if (!metadata) {
        return {};
    }

    // Mux does not allow custom metadata so we repurpose some fields.
    // If repurposed fields change please update the wiki page.
    // https://udemywiki.atlassian.net/wiki/spaces/ENG/pages/897482814/Mux+Schema

    const {assetId, courseId, duration, playerName, isPaid} = metadata;
    const orgId = (udConfig.brand.organization && udConfig.brand.organization.encrypted_id) || 0;

    const cdnProvider = mediaSources?.length ? getCDNFromUrl(mediaSources[0].src) : undefined;

    const isProd = udConfig.env === 'PROD';

    const config = {
        plugins: {
            mux: {
                respectDoNotTrack: false,
                data: {
                    env_key: isProd ? MUX_ID_PROD : MUX_ID_DEV,
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

    // Uncomment for testing.
    // config.plugins.mux.debug = true;
    // config.plugins.mux.env_key = '8iioa2q7br3ci17v962kflt1c';
    // return config;

    const isActiveSample = orgId || Math.random() <= 0.33;

    // We send 100% of UfB requests and sample 33% of requests for the regular Marketplace on Web
    // to reduce number of Mux calls for cost reasons.
    if ((isProd && isActiveSample) || force) {
        return config;
    }

    return {};
}
