import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';

import {TRACK_MODES} from 'video-player/captions/constants';

import {SIDEBAR_CONTENT} from '../../../constants';

export default class TranscriptStore {
    @observable isAutoscrollEnabled = true;

    constructor(courseTakingStore, captionsStore) {
        this.courseTakingStore = courseTakingStore;
        this.captionsStore = captionsStore;
        this.courseLanguage = courseTakingStore.course.locale.locale.slice(0, 2);

        // This could be moved to a wrapper component if we end up with additional sidebar content
        // components.
        reaction(
            () => !!this.transcriptTrack && !this.courseTakingStore.isMobileViewportSize,
            (canShowTranscript) => {
                this.courseTakingStore.setSidebarContentAvailability(
                    SIDEBAR_CONTENT.TRANSCRIPT,
                    canShowTranscript,
                );
            },
            {fireImmediately: true},
        );
    }

    cleanup() {
        this.courseTakingStore.setSidebarContentAvailability(SIDEBAR_CONTENT.TRANSCRIPT, false);
    }

    @autobind
    @action
    disableAutoscroll() {
        this.isAutoscrollEnabled = false;
    }

    @autobind
    @action
    enableAutoscroll() {
        this.isAutoscrollEnabled = true;
    }

    @computed
    get transcriptTrack() {
        // Choose a caption track to display in the transcript panel. Prioritising (where available):
        // - The active (selected) caption,
        // Or based on the caption store's sort order:
        // - The caption with the user's language,
        // - The caption with the course's language,
        // - The first caption in the list.
        if (!this.captionsStore.captions.length) {
            return null;
        }
        let activeTrack;
        this.captionsStore.captions.forEach((caption) => {
            if (caption.mode === TRACK_MODES.ACTIVE) {
                activeTrack = caption;
            }
        });

        if (activeTrack) {
            return activeTrack;
        }

        return this.captionsStore.sortedCaptions[0];
    }

    @computed
    get activeCueId() {
        if (!this.transcriptTrack || !this.transcriptTrack.activeCues.length) {
            return null;
        }
        // Possible for overlapping cues, but again, we don't support that for display.
        return this.transcriptTrack.activeCues[0].id;
    }
}
