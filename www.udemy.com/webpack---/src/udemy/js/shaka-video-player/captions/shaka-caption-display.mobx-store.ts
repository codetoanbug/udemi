import shaka from 'shaka-player/dist/shaka-player.ui';

import {CaptionDisplayStore} from './caption-display.mobx-store';

export class ShakaCaptionDisplayStore extends CaptionDisplayStore {
    attachPlayer(player: shaka.Player) {
        player?.setTextTrackVisibility(true);
        this.player = player;
    }
}
