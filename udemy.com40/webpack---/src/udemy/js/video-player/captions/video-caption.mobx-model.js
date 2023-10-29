import autobind from 'autobind-decorator';
import {action, autorun, computed, observable, when} from 'mobx';

import Caption, {createFile} from 'caption/caption.mobx-model';

import {TRACK_MODES} from './constants';
import VideoCue from './video-cue.mobx-model';

export default class VideoCaption extends Caption {
    /*
    The base Caption class knows nothing about the video player and can be used in applications that don't
    require the player (e.g. caption management), and the contained data more or less mirrors that of the
    Caption model in Django. For the video player we need to also support the notion of 'mode' (visible
    or not in the video player) and also which of the contained cues are 'active' (span a time range that
    includes the player's current time) - hence, this subclass.
     */
    @observable mode = TRACK_MODES.HIDDEN;
    @observable.ref player = null;
    @observable playerTime = 0.0; // In seconds
    textTrack = null;

    constructor(apiData) {
        super(apiData);
        this.label = apiData.video_label;

        when(() => this.mode === TRACK_MODES.ACTIVE, this.loadFromSource);
    }

    constructCue(cueData) {
        return new VideoCue(cueData);
    }

    @action
    setMode(mode) {
        this.mode = mode;
    }

    @action
    attachPlayer(player, useNativeTextTracks) {
        this.player = player;

        this.player.on(
            'timeupdate',
            action(() => {
                this.playerTime = this.player.currentTime();
            }),
        );

        if (useNativeTextTracks) {
            // When using mobile tracks, we need to load them from source so we can add them to the player
            // using an object URL
            this.loadFromSource();
            when(() => this.isLoaded, this.addTrackToPlayer);
        }
    }

    @autobind
    addTrackToPlayer() {
        if (this.mode === TRACK_MODES.INACTIVE) {
            return;
        }
        const trackElement = this.player.addRemoteTextTrack(
            {
                kind: 'captions',
                // Safari incorrectly uses the CORS policy for data URLs, so using blob URLs instead.
                src: this.asObjectURL,
                srclang: this.language,
                label: this.label,
            },
            true,
        );

        // Can't set this directly on the track element.
        trackElement.track.mode = this.mode;
        this.textTrack = trackElement.track;

        // Allow cues to sync their changes to the natively displayed cues.
        this.cues.forEach((cue) => {
            cue.attachTrack(trackElement);
        });

        autorun(() => {
            // Keep the player TextTrack object in sync with observables.
            this.textTrack.mode = this.mode;
        });
    }

    @computed
    get activeCues() {
        return this.cues.filter((cue) => {
            return cue.startTime <= this.playerTime && cue.endTime > this.playerTime;
        });
    }

    @computed
    get asObjectURL() {
        return URL.createObjectURL(createFile(this));
    }
}
