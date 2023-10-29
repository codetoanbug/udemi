import {action, computed, observable} from 'mobx';

import unescapeHtml from 'utils/escape/unescape-html';

export default class Cue {
    @observable text = '';
    // Used for draft captions.
    @observable isCorrect = false;

    constructor(vttData) {
        // vttData is an instance of VTTCue (https://developer.mozilla.org/en-US/docs/Web/API/VTTCue)
        // which coerces IDs into strings. We'd prefer them to be integers.
        this.id = parseInt(vttData.id, 10);
        this.startTime = vttData.startTime;
        this.endTime = vttData.endTime;
        this.setObservablesFromAPIData(vttData);
    }

    @action
    setObservablesFromAPIData(apiData) {
        this.text = apiData.text;
        this.isCorrect = apiData.isCorrect;
    }

    @action
    setText(text) {
        this.text = text;
    }

    @action
    markCorrect(isCorrect) {
        this.isCorrect = isCorrect;
    }

    @computed
    get displayText() {
        return unescapeHtml(this.text.replace(/<[^>]+>/g, ''));
    }
}

export function convertSecondsToHumanReadable(timeInSeconds, numDecimalPlaces) {
    const ms = (timeInSeconds % 1).toFixed(numDecimalPlaces).substring(2);

    timeInSeconds = Math.trunc(timeInSeconds); // remove remainder, it is stored in 'ms'
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor(timeInSeconds / 60) - hours * 60;
    const seconds = timeInSeconds - (hours * 3600 + minutes * 60);

    function pad(t) {
        const str = `${t}`;
        return '00'.substring(0, 2 - str.length) + str;
    }

    const hms = [pad(minutes), pad(seconds)];
    if (hours > 0) {
        hms.unshift(pad(hours));
    }
    return `${hms.join(':')}${numDecimalPlaces ? `.${ms}` : ''}`;
}
