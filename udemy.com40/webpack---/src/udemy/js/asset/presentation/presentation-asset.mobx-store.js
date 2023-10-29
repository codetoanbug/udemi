import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {fullscreenService} from 'utils/fullscreen';

export default class PresentationAssetStore {
    @observable currentSlideNum = 1;
    @observable isTransitioning = false;
    @observable isFullscreen = false;

    constructor(slideUrls, onSlideChange, onStart, onComplete) {
        this.slideUrls = slideUrls;
        this.onSlideChangeFn = onSlideChange;
        this.onStartFn = onStart;
        this.onCompleteFn = onComplete;
    }

    @autobind
    @action
    toggleFullscreen(targetElement) {
        if (this.isFullscreen && fullscreenService.exitFullscreen() !== false) {
            this.isFullscreen = false;
        } else if (
            !this.isFullscreen &&
            fullscreenService.requestFullscreen(targetElement) !== false
        ) {
            this.isFullscreen = true;
        }
    }

    @autobind
    goToNext() {
        if (!this.isNextDisabled) {
            this.skipTo(this.currentSlideNum + 1);
        }
    }

    @autobind
    goToPrev() {
        if (!this.isPrevDisabled) {
            this.skipTo(this.currentSlideNum - 1);
        }
    }

    @action
    skipTo(slideNum) {
        if (slideNum === this.currentSlideNum || this.isTransitioning) {
            return;
        }
        if (this.currentSlideNum === 1) {
            this.onStartFn();
        }
        this.isTransitioning = true;
        this.currentSlideNum = slideNum;
        this.onSlideChange();
        this.isTransitioning = false;
    }

    onSlideChange() {
        const progressData = {position: this.currentSlideNum, total: this.numSlides};
        this.onSlideChangeFn(progressData);
        if (this.currentSlideNum === this.numSlides) {
            this.onCompleteFn();
        }
    }

    get numSlides() {
        return this.slideUrls.length;
    }

    // The progress bar is partitioned into `numSlides` units of roughly equal width.
    // The last unit might be slightly wider than the others to ensure that widths sum to 100%.
    get progressUnitWidth() {
        return 100 / this.numSlides;
    }

    get progressUnitWidths() {
        const widths = Array(this.numSlides - 1).fill(`${this.progressUnitWidth}%`);
        widths.push(`${100 - (this.numSlides - 1) * this.progressUnitWidth}%`);
        return widths;
    }

    @computed
    get currentProgressWidth() {
        let percent = 100;
        if (this.currentSlideNum < this.numSlides) {
            percent = this.progressUnitWidth * this.currentSlideNum;
        }
        return `${percent}%`;
    }

    @computed
    get isPrevDisabled() {
        return this.currentSlideNum === 1 || this.isTransitioning;
    }

    @computed
    get isNextDisabled() {
        return this.currentSlideNum >= this.numSlides || this.isTransitioning;
    }
}
