import {autorun} from 'mobx';

import Cue from 'caption/cue.mobx-model';

export default class VideoCue extends Cue {
    attachTrack(trackElement) {
        trackElement.addEventListener('load', () => {
            autorun(() => {
                // Update TextTrackCue on changes to text.
                trackElement.track.cues.getCueById(this.id).text = this.text;
            });
        });
    }
}
