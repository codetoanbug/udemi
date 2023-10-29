import videojs from 'video.js';

import Watermark from './watermark';

/**
note to anyone planning on writing a more interesting bandwidth meter:
our most popular type of video will cause a stream of 'progress' events, with network state LOADING for full throttle and IDLE for
throttled. **BUT!** our HLS plugin has a slightly different pattern in throttled mode -- it erroneously triggers a 'stalled' event, and
roughly 10 seconds later you'll see a 'progress' "LOADING" when it wants the next chunk; you won't see "IDLE" state.

none of the above matters for the current implementation.
this is a simple high-watermark tracker; we aren't invested in these stats enough to warrant tracking the entry/exit of throttled views,
nor trapping the beginning of DL attempts. (So a sample might have a very low bytes/time ratio due to being after an intentional dead time,
but since there will always be the initial "DL unthrottled to get ahead" phase, so the _watermark_ will be unaffected.)
 */
const bandwidthWatermark = function bandwidthWatermark() {
    let lastSampleTick = Date.now();
    let hlsBytesReceived = 0;
    const videoPlayer = this;

    const bandwidthWatermarks = {
        bytesSecHighestHLSBandwidth: new Watermark(),
        bytesSecHighestDecoder: new Watermark(),
        millisSecHighestBandwidth: new Watermark(),
    };

    videoPlayer.setInterval(videoPlayerTrackingInterval, 1000);

    videoPlayer.on('hlsfragloaded', (e, stats) => {
        hlsBytesReceived += stats.total;
    });

    function videoPlayerTrackingInterval() {
        const now = Date.now();
        const secsSamplePeriod = (now - lastSampleTick) / 1000;
        lastSampleTick = now;

        bandwidthWatermarks.bytesSecHighestDecoder.add(_getBytes(), secsSamplePeriod);
        const dur = videoPlayer.duration();
        if (dur) {
            bandwidthWatermarks.millisSecHighestBandwidth.add(
                videoPlayer.bufferedPercent() * dur * 1000,
                secsSamplePeriod,
            );
        }

        if (hlsBytesReceived) {
            bandwidthWatermarks.bytesSecHighestHLSBandwidth.add(hlsBytesReceived, secsSamplePeriod);
        }

        videoPlayer.trigger('onbandwidthwatermarkupdate', {bandwidthWatermarks});
    }

    function _getBytes() {
        if (videoPlayer.tech_) {
            const videoEl = videoPlayer.tech_.el();
            return videoEl.webkitAudioDecodedByteCount + videoEl.webkitVideoDecodedByteCount;
        }
    }
};

// register the plugin
videojs.registerPlugin('bandwidthWatermark', bandwidthWatermark);
