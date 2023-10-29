import {action, computed, observable, when} from 'mobx';

import Caption, {createFile} from 'caption/caption.mobx-model';

import {TRACK_MODES} from './constants';
import {VideoCue} from './video-cue.mobx-model';

export class VideoCaption extends Caption {
    private _cuesS: any;
    get cues(): any {
        return this._cuesS;
    }

    set cues(value: any) {
        this._cuesS = value;
    }

    isLoaded: any;
    label: any;
    language: any;
    loadFromSource: any;
    url: any;
    /*
    The base Caption class knows nothing about the video player and can be used in applications that don't
    require the player (e.g. caption management), and the contained data more or less mirrors that of the
    Caption model in Django. For the video player we need to also support the notion of 'mode' (visible
    or not in the video player) and also which of the contained cues are 'active' (span a time range that
    includes the player's current time) - hence, this subclass.
     */
    @observable mode: string = TRACK_MODES.HIDDEN;
    @observable.ref player!: shaka.Player;
    @observable playerTime = 0.0; // In seconds
    textTrack: any = null;

    constructor(apiData: any) {
        super(apiData);
        this.label = apiData.video_label;

        when(() => this.mode === TRACK_MODES.ACTIVE, this.loadFromSource);
    }

    constructCue(cueData: any) {
        return new VideoCue(cueData);
    }

    @action
    setMode(mode: any) {
        this.mode = mode;
    }

    @action
    attachPlayer(player: shaka.Player, useNativeTextTracks: any) {
        this.player = player;

        // TODO tsmigrate check if shaka video player has timeupdate event
        this.player?.getMediaElement()?.addEventListener(
            'timeupdate',
            action(() => {
                this.playerTime = this.player.getMediaElement()?.currentTime ?? 0.0;
            }),
        );

        if (useNativeTextTracks) {
            // THIS IS COMMENTED FOR POSSIBLE REFERENCE WHILE WE FIND A FIX FOR CAPTIONS ON WEB iOS
            // this.loadFromSource();
            // when(() => this.isLoaded, this.addTrackToPlayer);
            this.player?.addTextTrackAsync(this.url, this.language, 'captions', 'text/vtt');
        }
    }

    // addTrackToPlayer = () => {
    // THIS IS COMMENTED FOR POSSIBLE REFERENCE WHILE WE FIND A FIX FOR CAPTIONS ON WEB iOS
    //     if (this.mode === TRACK_MODES.INACTIVE) {
    //         return;
    //     }

    //     const trackElement = this.player?.addTextTrackAsync(
    //         // Safari incorrectly uses the CORS policy for data URLs, so using blob URLs instead.
    //         this.asObjectURL,
    //         this.language,
    //         'captions',
    //         this.label,
    //     );

    //     // TODO TSmigrate track is not defined in trackElement
    //     // Can't set this directly on the track element.
    //     // trackElement.track.mode = this.mode;
    //     this.textTrack = trackElement;

    //     // TODO: tsmigrate confirm the below cues is used from base class 'caption'
    //     // Allow cues to sync their changes to the natively displayed cues.
    //     this.cues.forEach((cue: any) => {
    //         cue.attachTrack(trackElement);
    //     });

    //     autorun(() => {
    //         // Keep the player TextTrack object in sync with observables.
    //         this.textTrack.mode = this.mode;
    //     });
    // };

    @computed
    get activeCues() {
        return this.cues.filter((cue: any) => {
            return cue.startTime <= this.playerTime && cue.endTime > this.playerTime;
        });
    }

    @computed
    get asObjectURL() {
        return URL.createObjectURL(createFile(this));
    }
}
