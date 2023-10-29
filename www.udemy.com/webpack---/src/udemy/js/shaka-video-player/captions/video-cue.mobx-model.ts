import {autorun} from 'mobx';

import Cue from 'caption/cue.mobx-model';

export class VideoCue extends Cue {
    id: any;
    text: any;
    attachTrack(trackElement: any) {
        trackElement.addEventListener('load', () => {
            autorun(() => {
                // Update TextTrackCue on changes to text.
                trackElement.track.cues.getCueById(this.id).text = this.text;
            });
        });
    }
}
